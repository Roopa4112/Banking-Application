// define([
//     'ojs/ojcore',
//     'knockout',
//     'jquery',
//     'ojs/ojarraydataprovider',
//     'ojs/ojinputtext',
//     'ojs/ojtable',
//     'ojs/ojbutton'
// ], function(oj, ko, $, ArrayDataProvider) {
//     function AllTransactionViewModel() {
//         var self = this;

//         // Observables
//         self.transactions = ko.observableArray([]);
//         self.accountId = ko.observable('');

//         // DataProvider for oj-table (key = id from DB)
//         self.transactionDataProvider = ko.computed(function() {
//             return new ArrayDataProvider(self.transactions, { keyAttributes: 'id' });
//         });

//         // Fetch all transactions
//         self.fetchAllTransactions = function() {
//             $.ajax({
//                 url: 'http://localhost:8080/account-service/transactions',
//                 type: 'GET',
//                 success: function(data) {
//                     self.transactions(data);
//                 },
//                 error: function(err) {
//                     self.transactions([]);
//                     console.error('Error fetching transactions', err);
//                 }
//             });
//         };

//         // Search transactions by Account ID
//         self.searchTransactions = function() {
//             var id = self.accountId();
//             if (!id) {
//                 self.fetchAllTransactions();
//                 return;
//             }
//             $.ajax({
//                 url: 'http://localhost:8080/account-service/transactions/' + encodeURIComponent(id),
//                 type: 'GET',
//                 success: function(data) {
//                     self.transactions(Array.isArray(data) ? data : [data]);
//                 },
//                 error: function(err) {
//                     self.transactions([]);
//                     console.error('Error fetching transactions by account_id', err);
//                 }
//             });
//         };

//         // Initial fetch
//         self.fetchAllTransactions();
//     }

//     return AllTransactionViewModel;
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
    function AllTransactionViewModel() {
        var self = this;

        // Observables
        self.transactions = ko.observableArray([]);
        self.accountId = ko.observable('');
        self.message = ko.observable(''); // ✅ To show login/logout messages

        // DataProvider for oj-table (key = id from DB)
        self.transactionDataProvider = ko.computed(function() {
            return new ArrayDataProvider(self.transactions, { keyAttributes: 'id' });
        });

        // Fetch all transactions
        self.fetchAllTransactions = function() {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                self.transactions([]); // clear table
                self.message("❌ You have logged out. Please login again.");
                return;
            }

            $.ajax({
                url: 'http://localhost:8080/account-service/transactions',
                type: 'GET',
                success: function(data) {
                    self.transactions(data);
                    self.message(""); // clear any old messages
                },
                error: function(err) {
                    self.transactions([]);
                    self.message("⚠️ Error fetching transactions.");
                    console.error('Error fetching transactions', err);
                }
            });
        };

        // Search transactions by Account ID
        self.searchTransactions = function() {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                self.transactions([]);
                self.message("❌ You have logged out. Please login again.");
                return;
            }

            var id = self.accountId();
            if (!id) {
                self.fetchAllTransactions();
                return;
            }
            $.ajax({
                url: 'http://localhost:8080/account-service/transactions/account/' + encodeURIComponent(id),
                type: 'GET',
                success: function(data) {
                    self.transactions(Array.isArray(data) ? data : [data]);
                    self.message("");
                },
                error: function(err) {
                    self.transactions([]);
                    self.message("⚠️ Error fetching transactions by account_id.");
                    console.error('Error fetching transactions by account_id', err);
                }
            });
        };

        // Initial fetch
        self.fetchAllTransactions();
    }

    return AllTransactionViewModel;
});
