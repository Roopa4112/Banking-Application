define([
    'knockout',
    'ojs/ojarraydataprovider',
    'ojs/ojselectsingle',
    'ojs/ojinputnumber',
    'ojs/ojbutton',
    'ojs/ojformlayout',
    'ojs/ojvalidationgroup'
], function(ko, ArrayDataProvider) {
    function DepositViewModel() {
        var self = this;

        self.userId = ko.observable(localStorage.getItem('userId') || '');
        console.log("Fetched userId from localStorage:", self.userId());
        self.userid = self.userId();

        self.selectedAccountId = ko.observable();
        self.depositAmount = ko.observable();
        self.accounts = ko.observableArray([]);

          // For success panel
        self.depositSuccess = ko.observable(false);
        self.depositResponse = ko.observable({});

                // DataProvider for accounts dropdown
        self.depositDataProvider = new ArrayDataProvider(self.accounts, { keyAttributes: 'value' });

                // --- Fetch accounts for this user ---
        self.fetchAccounts = function () {
            if (!self.userId()) {
                console.error("No userId in localStorage");
                return;
            }

            $.ajax({
                url: `http://localhost:8080/account-service/accounts/user/${self.userId()}`,
                type: 'GET',
                success: function (data) {
                    console.log("Accounts fetched from backend:", data);
                    var mapped = data.map(function (acc) {
                        return { value: acc.id, label: acc.id };
                    });
                    self.accounts(mapped);
                },
                error: function (err) {
                    console.error("Failed to fetch accounts", err);
                }
            });
        };

        self.fetchAccounts();

                // --- Deposit API call ---
        self.deposit = function() {
            const accountId = self.selectedAccountId();
            const amount = self.depositAmount();
            if (!accountId || !amount) {
                alert("Please select an account and enter amount");
                return;
            }

            fetch('http://localhost:8080/account-service/transactions/deposit', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({accountId, amount})
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Deposit failed");
                }
                return response.json();
            })
            .then(data => {
                console.log("Deposit response:", data);
                self.depositResponse(data);   // save backend response
                self.depositSuccess(true);    // show success panel
            })
            .catch(err => {
                console.error("Deposit failed:", err);
                alert("Deposit failed!");
            });
        };

        
        // --- Success panel helpers ---
        self.makeAnotherDeposit = function() {
            self.depositSuccess(false);   // hide success panel
            self.depositAmount(null);     // reset amount
            self.selectedAccountId(null); // reset dropdown
        };

       
        // --- Date formatter ---
        self.formatDate = function(dateStr) {
            if (!dateStr) return '';
            return new Date(dateStr).toLocaleString();
        };

        // 👇 Expose properties & functions to HTML
       
        // Expose properties to HTML
        return {
            selectedAccountId: self.selectedAccountId,
            depositAmount: self.depositAmount,
            depositDataProvider: self.depositDataProvider,
            deposit: self.deposit,

            // success panel
            depositSuccess: self.depositSuccess,
            depositResponse: self.depositResponse,
            formatDate: self.formatDate,
            makeAnotherDeposit: self.makeAnotherDeposit,
            goToAccounts: self.goToAccounts
        };
    }

    return DepositViewModel;
});
