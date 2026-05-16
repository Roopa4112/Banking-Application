define([
    'knockout',
    'ojs/ojarraydataprovider',
    'ojs/ojselectsingle',
    'ojs/ojinputnumber',
    'ojs/ojformlayout',
    'ojs/ojbutton'
], function (ko, ArrayDataProvider) {
    function TransferViewModel() {
        var self = this;

        // ----- User ID -----
        let storedUser = localStorage.getItem('userId');
        self.userId = ko.observable(storedUser ? storedUser : '');
        console.log("Fetched userId from localStorage:", self.userId());

        // ----- Observables -----
        self.userAccounts = ko.observableArray([]);
        self.allAccounts = ko.observableArray([]);
        self.fromAccount = ko.observable();
        self.toAccount = ko.observable();
        self.amount = ko.observable();
        self.transferMessage = ko.observable('');

        // ----- Success Panel -----
        self.transferSuccess = ko.observable(false);
        self.transferResponse = ko.observable({});

        // ----- DataProviders -----
        self.userAccountsDP = new ArrayDataProvider(self.userAccounts, { keyAttributes: 'value' });
        self.allAccountsDP = new ArrayDataProvider(self.allAccounts, { keyAttributes: 'value' });

        // ----- Fetch User Accounts -----
        self.fetchUserAccounts = function () {
            if (!self.userId()) {
                console.error("No userId found in localStorage.");
                return;
            }

            return fetch(`http://localhost:8080/account-service/accounts/user/${self.userId()}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Fetched raw user accounts:", data);
                    const mappedAccounts = data.map(acc => {
                        return {
                            value: acc.id,
                            label: `${acc.id}`
                        };
                    });
                    self.userAccounts(mappedAccounts);
                })
                .catch(err => console.error('Error fetching user accounts:', err));
        };

        // ----- Fetch All Accounts -----
        self.fetchAllAccounts = function () {
            fetch('http://localhost:8080/account-service/accounts')
                .then(response => response.json())
                .then(data => {
                    console.log("Fetched raw all accounts:", data);

                    // Exclude the logged-in user's accounts from ToAccount list
                    const userAccountIds = self.userAccounts().map(acc => acc.value);
                    const filteredAccounts = data.filter(acc => !userAccountIds.includes(acc.id));

                    const mappedAccounts = filteredAccounts.map(acc => {
                        return {
                            value: acc.id,
                            label: `${acc.id}`
                        };
                    });
                    self.allAccounts(mappedAccounts);
                })
                .catch(err => console.error('Error fetching all accounts:', err));
        };

        // ----- Transfer Amount -----
        self.transferAmount = function () {
            if (!self.fromAccount() || !self.toAccount() || !self.amount()) {
                console.error("Transfer details incomplete");
                self.transferMessage("Please fill out all fields.");
                return;
            }

            const payload = {
                fromAccountId: self.fromAccount(),
                toAccountId: self.toAccount(),
                amount: self.amount()
            };
            console.log("Transfer payload:", payload);

            fetch('http://localhost:8080/account-service/transactions/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Transfer failed");
                    }
                    return response.json();
                }).then(data => {
    console.log("Raw Transfer response from server:", data);

    // Ensure it's an array
    if (Array.isArray(data)) {
        // Pick TRANSFER_OUT transaction
        let debitTx = data.find(tx => tx.transactionType === "TRANSFER_OUT");
        self.transferResponse(debitTx || data[0]); // fallback
    } else {
        self.transferResponse(data);
    }

    self.transferSuccess(true);
})

    //             .then(data => {
    //                 // This is where the magic happens. We're logging the raw data
    //                 // to help you confirm the property names.
    //                 console.log("Raw Transfer response from server:", data);
                    

    //                 // pick TRANSFER_OUT transaction
    // let debitTx = data.find(tx => tx.transactionType === "TRANSFER_OUT");


    //                 self.transferResponse(data);
    //                 self.transferSuccess(true);
    //             })
                .catch(err => {
                    console.error("Error during transfer:", err);
                    self.transferMessage("❌ Transfer failed. Please try again.");
                });
        };

        // ----- Panel Actions -----
        self.makeAnotherTransfer = function () {
            self.transferSuccess(false);
            self.amount(null);
            self.fromAccount(null);
            self.toAccount(null);
            self.transferMessage('');
        };

        // self.goToAccounts = function () {
        //     window.location.href = "?ojr=account";
        // };

        // ----- Init -----
        self.fetchUserAccounts().then(() => {
            // fetch all accounts only after user accounts are fetched
            self.fetchAllAccounts();
        });

        // ----- Expose -----
        return {
            fromAccount: self.fromAccount,
            toAccount: self.toAccount,
            amount: self.amount,
            userAccountsDP: self.userAccountsDP,
            allAccountsDP: self.allAccountsDP,
            transferAmount: self.transferAmount,
            transferMessage: self.transferMessage,

            // success panel
            transferSuccess: self.transferSuccess,
            transferResponse: self.transferResponse,
            makeAnotherTransfer: self.makeAnotherTransfer,
            goToAccounts: self.goToAccounts
        };
    }

    return TransferViewModel;
});
