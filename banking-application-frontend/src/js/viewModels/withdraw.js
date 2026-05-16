define([
    'knockout',
    'ojs/ojarraydataprovider',
    'ojs/ojselectsingle',
    'ojs/ojinputnumber',
    'ojs/ojbutton',
    'ojs/ojformlayout',
    'ojs/ojvalidationgroup'
], function(ko, ArrayDataProvider) {
    function WithdrawViewModel() {
        var self = this;

        // --- Observables ---
        self.userId = ko.observable(localStorage.getItem('userId') || '');
        console.log("Fetched userId from localStorage:", self.userId());

        self.selectedAccountId = ko.observable();
        self.withdrawAmount = ko.observable();
        self.accounts = ko.observableArray([]);

        // --- Success panel ---
        self.withdrawSuccess = ko.observable(false);
        self.withdrawResponse = ko.observable({});

        // DataProvider for accounts dropdown
        self.accountsProvider = new ArrayDataProvider(self.accounts, { keyAttributes: 'value' });

        // --- Fetch accounts ---
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

        // --- Withdraw API ---
        self.withdraw = function() {
            const accountId = self.selectedAccountId();
            const amount = self.withdrawAmount();
            if (!accountId || !amount) {
                alert("Please select an account and enter amount");
                return;
            }

            fetch('http://localhost:8080/account-service/transactions/withdraw', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ accountId, amount })
            })
            .then(response => {
                if (!response.ok) throw new Error("Withdraw failed");
                return response.json();
            })
            .then(data => {
                console.log("Withdraw response:", data);
                self.withdrawResponse(data);    // save backend response
                self.withdrawSuccess(true);     // show success panel
            })
            .catch(err => {
                console.error("Withdraw failed:", err);
                alert("Withdraw failed!");
            });
        };

        // --- Reset form for another withdraw ---
        self.makeAnotherWithdraw = function() {
            self.withdrawSuccess(false);       // hide success panel
            self.withdrawAmount(null);         // reset amount
            self.selectedAccountId(null);      // reset dropdown
        };

        // --- Date formatter ---
        self.formatDate = function(dateStr) {
            if (!dateStr) return '';
            return new Date(dateStr).toLocaleString();
        };

        // --- Expose properties & functions to HTML ---
        return {
            selectedAccountId: self.selectedAccountId,
            withdrawAmount: self.withdrawAmount,
            accountsProvider: self.accountsProvider,
            withdraw: self.withdraw,

            // Success panel
            withdrawSuccess: self.withdrawSuccess,
            withdrawResponse: self.withdrawResponse,
            formatDate: self.formatDate,
            makeAnotherWithdraw: self.makeAnotherWithdraw
        };
    }

    return WithdrawViewModel;
});
