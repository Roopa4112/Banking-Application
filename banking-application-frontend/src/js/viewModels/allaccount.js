// define([
//     'ojs/ojcore',
//     'knockout',
//     'jquery',
//     'ojs/ojarraydataprovider',
//     'ojs/ojinputtext',
//     'ojs/ojtable',
//     'ojs/ojbutton'
// ], function(oj, ko, $, ArrayDataProvider) {
//     function AllAccountsViewModel() {
//         var self = this;

//         // Observables
//         self.accounts = ko.observableArray([]);
//         self.userid = ko.observable('');
//         self.message = ko.observable('');

//         // DataProvider for oj-table (key = accountId from DB)
//         self.accountDataProvider = ko.computed(function() {
//             return new ArrayDataProvider(self.accounts, { keyAttributes: 'accountId' });
//         });

//         // Fetch all accounts
//         self.fetchAllAccounts = function() {
//             if (localStorage.getItem('isLoggedIn') !== 'true') {
//                 self.accounts([]);
//                 self.message("❌ You have logged out. Please login again.");
//                 return;
//             }

//             $.ajax({
//                 url: 'http://localhost:8080/account-service/accounts',
//                 type: 'GET',
//                 success: function(data) {
//                     self.accounts(data);
//                     self.message("");
//                 },
//                 error: function(err) {
//                     self.accounts([]);
//                     self.message("⚠️ Error fetching accounts.");
//                     console.error('Error fetching accounts', err);
//                 }
//             });
//         };

//         // Search accounts by User ID
//         self.searchAccounts = function() {
//             if (localStorage.getItem('isLoggedIn') !== 'true') {
//                 self.accounts([]);
//                 self.message("❌ You have logged out. Please login again.");
//                 return;
//             }

//             var id = self.userid();
//             if (!id) {
//                 self.fetchAllAccounts();
//                 return;
//             }

//             $.ajax({
//                 url: 'http://localhost:8080/account-service/accounts/user/' + encodeURIComponent(id),
//                 type: 'GET',
//                 success: function(data) {
//                     self.accounts(Array.isArray(data) ? data : [data]);
//                     self.message("");
//                 },
//                 error: function(err) {
//                     self.accounts([]);
//                     self.message("⚠️ Error fetching accounts by userId.");
//                     console.error('Error fetching accounts by userId', err);
//                 }
//             });
//         };

//            self. navigateToAccountApprove=function(page) {
//             window.location.href = '?ojr=accountapproved';
//     }


//         // Initial fetch
//         self.fetchAllAccounts();

// }
//     return AllAccountsViewModel;
// });



define([
    'ojs/ojcore',
    'knockout',
    'jquery',
    'ojs/ojarraydataprovider',
    'ojs/ojinputtext',
    'ojs/ojtable',
    'ojs/ojbutton'
], function(oj, ko, $, ArrayDataProvider) {
    function AllAccountsViewModel() {
        var self = this;

        // Observables
        self.accounts = ko.observableArray([]);
        self.userid = ko.observable('');
        self.message = ko.observable('');

        // DataProvider for oj-table (key must match backend JSON id)
        self.accountDataProvider = ko.computed(function() {
            return new ArrayDataProvider(self.accounts, { keyAttributes: 'id' });
        });

        // Fetch all accounts
        self.fetchAllAccounts = function() {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                self.accounts([]);
                self.message("❌ You have logged out. Please login again.");
                return;
            }

            $.ajax({
                url: 'http://localhost:8080/account-service/accounts',
                type: 'GET',
                success: function(data) {
                    self.accounts(data);
                    self.message("");
                },
                error: function(err) {
                    self.accounts([]);
                    self.message("⚠️ Error fetching accounts.");
                    console.error('Error fetching accounts', err);
                }
            });
        };

        // Search accounts by User ID
        self.searchAccounts = function() {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                self.accounts([]);
                self.message("❌ You have logged out. Please login again.");
                return;
            }

            var id = self.userid();
            if (!id) {
                self.fetchAllAccounts();
                return;
            }

            $.ajax({
                url: 'http://localhost:8080/account-service/accounts/user/' + encodeURIComponent(id),
                type: 'GET',
                success: function(data) {
                    self.accounts(Array.isArray(data) ? data : [data]);
                    self.message("");
                },
                error: function(err) {
                    self.accounts([]);
                    self.message("⚠️ Error fetching accounts by userId.");
                    console.error('Error fetching accounts by userId', err);
                }
            });
        };

        self.navigateToAccountApprove = function() {
            window.location.href = '?ojr=accountapproved';
        };

        // Initial fetch
        self.fetchAllAccounts();
    }

    return new AllAccountsViewModel();
});
