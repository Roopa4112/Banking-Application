// define([
//     'ojs/ojcore',
//     'knockout',
//     'jquery',
//     'ojs/ojselectcombobox',
//      'ojs/ojselectsingle',
//     'ojs/ojinputnumber',
//     'ojs/ojformlayout',
//     'ojs/ojbutton',
//     'ojs/ojinputtext',
//     'ojs/ojvalidationgroup',
//     'ojs/ojarraydataprovider'
// ], function(oj, ko, $, ArrayDataProvider) {
//     function LoanViewModel() {
//         var self = this;

//         // Observables for form fields
//         self.accountId = ko.observable();
//         self.accounts = ko.observableArray([]);
//         self.loanType = ko.observable();

//           // 👇 FIX: reference ArrayDataProvider correctly
//         var ArrayDataProvider = ArrayDataProviderModule.ArrayDataProvider;
        
//          self.loanTypes = new ArrayDataProvider([
//             { value: 'home', label: 'Home' },
//             { value: 'personal', label: 'Personal' },
//             { value: 'education', label: 'Education' },
//             { value: 'vehicle', label: 'Vehicle' }
//         ], { keyAttributes: 'value' });
//         self.amount = ko.observable();
//         self.interestRate = ko.observable();
//         self.termMonths = ko.observable();

//         // Fetch accounts from backend
//         self.fetchAccounts = function() {
//             $.ajax({
//                 url: 'http://localhost:8080/account-service/accounts', // Adjust endpoint as needed
//                 type: 'GET',
//                 success: function(data) {
//                     // Assuming data is an array of accounts with id and name
//                     var mapped = data.map(function(acc) {
//                         return {value: acc.id, label: acc.name};
//                     });
//                     self.accounts(mapped);
//                 },
//                 error: function(err) {
//                     console.error('Failed to fetch accounts', err);
//                 }
//             });
//         };

//         // Call fetch on load
//         self.fetchAccounts();

//         // Submit handler
//         self.submitLoanApplication = function() {
//             var valid = document.getElementById('loanForm').validity.valid;
//             if (!valid) return;

//             var payload = {
//                 loanType: self.loanType(),
//                 amount: self.amount(),
//                 interestRate: self.interestRate(),
//                 termMonths: self.termMonths()
//             };

//             $.ajax({
//                 url: 'http://localhost:8080/account-service/loans/apply/' + self.accountId(),
//                 type: 'POST',
//                 contentType: 'application/json',
//                 data: JSON.stringify(payload),
//                 success: function(response) {
//                     alert('Loan application submitted successfully!');
//                 },
//                 error: function(err) {
//                     alert('Failed to submit loan application.');
//                 }
//             });
//         };
//     }

//     return new LoanViewModel;
// });


define([
    'ojs/ojcore',
    'knockout',
    'jquery',
    'ojs/ojselectsingle',
    'ojs/ojinputnumber',
    'ojs/ojformlayout',
    'ojs/ojbutton',
    'ojs/ojvalidationgroup',
    'ojs/ojarraydataprovider'
], function (oj, ko, $, ojSelectSingle, ojInputNumber, ojFormLayout, ojButton, ojValidationGroup, ArrayDataProvider) {

    function LoanViewModel() {
        var self = this;

        // Logged-in userId from localStorage
        self.userId = ko.observable(localStorage.getItem('userId') || '');
        console.log("Fetched userId from localStorage:", self.userId());

        // Form observables
        self.accountId = ko.observable(null);
        self.loanType = ko.observable();
        self.amount = ko.observable();
        self.interestRate = ko.observable();
        self.termMonths = ko.observable();

        // ✅ Define accounts as observableArray
        self.accounts = ko.observableArray([]);

        // ✅ Bind ArrayDataProvider ONCE
        self.accountsDataProvider = new ArrayDataProvider(self.accounts, { keyAttributes: 'value' });

        // Loan types
        self.loanTypes = new ArrayDataProvider([
            { value: 'HOME', label: 'Home' },
            { value: 'PERSONAL', label: 'Personal' },
            { value: 'EDUCATION', label: 'Education' },
            { value: 'VEHICLE', label: 'Vehicle' }
        ], { keyAttributes: 'value' });

        // Fetch accounts for logged-in user
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

                    if (!data || data.length === 0) {
                        console.warn("No accounts found for user:", self.userId());
                        return;
                    }

                    // Map accounts to {value, label}
                    var mapped = data.map(function (acc) {
                        return {
                            value: acc.id,
                            label: acc.id 
                        };
                    });

                    console.log("Mapped accounts for dropdown:", mapped);

                    // ✅ Update observableArray → dropdown auto refreshes
                    self.accounts(mapped);

                    // Optional: auto-select first account
                    // self.accountId(mapped[0].value);
                },
                error: function (err) {
                    console.error("Failed to fetch accounts", err);
                }
            });
        };

        // Fetch accounts on load
        self.fetchAccounts();

        // Submit loan application
        self.submitLoanApplication = function () {
            var tracker = document.getElementById('loanForm');
            if (tracker.valid !== "valid") {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
                return;
            }

            if (!self.accountId()) {
                alert("Please select an account before applying for a loan.");
                return;
            }

            var payload = {
                account: { id: self.accountId() },
                loanType: self.loanType(),
                amount: self.amount(),
                interestRate: self.interestRate(),
                term_month: self.termMonths()
            };

            console.log("Submitting loan application payload:", payload);

            $.ajax({
                url: 'http://localhost:8080/account-service/loans/apply',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function () {
                    alert("Loan application submitted successfully!");
                },
                error: function (err) {
                    console.error("Loan apply failed", err);
                    alert("Failed to submit loan application.");
                }
            });
        };
    }

    return new LoanViewModel();
});
