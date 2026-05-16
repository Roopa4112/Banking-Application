// define([
//     'ojs/ojcore',
//     'knockout',
//     'jquery',
//     'ojs/ojchart',
//     'ojs/ojarraydataprovider'
// ], function(oj, ko, $) {
//     function ProfileViewModel() {
//         var self = this;

//         // Observables for user, account, transaction, and loan info
//         self.userId = ko.observable(localStorage.getItem('userid'));
//         self.username = ko.observable('');
//         self.accountInfo = ko.observable({});
//         self.transactionData = ko.observableArray([]);
//         self.loanInfo = ko.observable({});

//         // Bar chart data
//         self.transactionBarData = ko.observableArray([]);
//         self.transactionBarDataProvider = ko.computed(function() {
//             return new oj.ArrayDataProvider(self.transactionBarData(), {keyAttributes: 'date'});
//         });

//         // Fetch username
//         self.fetchUsername = function() {
//             $.getJSON(`http://localhost:8080/user-service/users/${self.userId()}`)
//                 .done(function(data) {
//                     self.username(data.username);
//                 });
//         };

//         // Fetch account info
//         self.fetchAccountInfo = function() {
//             $.getJSON(`http://localhost:8080/account-service/accounts/user/${self.userId()}`)
//                 .done(function(data) {
//                     self.accountInfo(data);
//                     self.fetchTransactionInfo(data.accountid);
//                     self.fetchLoanInfo(data.accountid);
//                 });
//         };

//         // Fetch transaction info
//         self.fetchTransactionInfo = function(accountId) {
//             $.getJSON(`http://localhost:8080/account-service/transactions/${accountId}`)
//                 .done(function(data) {
//                     self.transactionData(data);
//                     // Prepare bar chart data: group by date and count transactions
//                     var grouped = {};
//                     data.forEach(function(txn) {
//                         var date = txn.date.split('T')[0]; // Assuming ISO date
//                         grouped[date] = (grouped[date] || 0) + 1;
//                     });
//                     var chartData = Object.keys(grouped).map(function(date) {
//                         return {date: date, count: grouped[date]};
//                     });
//                     self.transactionBarData(chartData);
//                 });
//         };

//         // Fetch loan info
//         self.fetchLoanInfo = function(accountId) {
//             $.getJSON(`http://localhost:8080/account-service/loans/account/${accountId}`)
//                 .done(function(data) {
//                     self.loanInfo(data);
//                 });
//         };

//         // Initial fetch
//         if (self.userId()) {
//             self.fetchUsername();
//             self.fetchAccountInfo();
//         }

//         // Template bindings
//         self.userDetails = ko.computed(function() {
//             return {
//                 userid: self.userId(),
//                 username: self.username()
//             };
//         });

//         self.accountDetails = ko.computed(function() {
//             var acc = self.accountInfo();
//             return {
//                 accountid: acc.accountid,
//                 accounttype: acc.accounttype,
//                 accountnumber: acc.accountnumber,
//                 balance: acc.balance
//             };
//         });

//         self.loanDetails = ko.computed(function() {
//             var loan = self.loanInfo();
//             return {
//                 loanid: loan.loanid,
//                 type: loan.type,
//                 interest_rate: loan.interest_rate,
//                 term_month: loan.term_month,
//                 total_amount: loan.total_amount
//             };
//         });
//     }

//     return new ProfileViewModel();
// });



define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'ojs/ojarraydataprovider',
  'ojs/ojchart'
], function (oj, ko, $, ArrayDataProvider) {
  function ProfileViewModel() {
    var self = this;

    self.userId = ko.observable(localStorage.getItem("userId"));
    self.userName = ko.observable("");
    self.userEmail = ko.observable("");
    self.userRole = ko.observable("");

    // Observable array to hold all accounts
    self.accounts = ko.observableArray([]);
    
    // Observable for the currently selected account
    self.selectedAccount = ko.observable(null);

    // Observables for transactions and loans
    self.transactions = ko.observableArray([]);
    self.loans = ko.observableArray([]);

    // Chart data
    self.chartData = ko.observableArray([]);
    self.chartDataProvider = new ArrayDataProvider(self.chartData, { keyAttributes: 'name' });
    
    // A function to handle account selection
    self.selectAccount = function(account) {
        self.selectedAccount(account);
    };

    /* A subscription to fetch transactions and loans whenever the selected account changes */
    self.selectedAccount.subscribe(function(newAccount) {
      if (newAccount) {
        // Step 3: Fetch Transactions for the newly selected account
        $.getJSON("http://localhost:8080/account-service/transactions/account/" + newAccount.id, function (txns) {
          console.log("Fetched transactions for account " + newAccount.id + ":", txns);
          self.transactions(txns);

          // Prepare Chart Data
          let creditItems = [];
          let debitItems = [];

          txns.forEach(txn => {
            const item = {
              id: txn.id, 
              value: txn.amount,
              group: txn.date
            };
            if (txn.transactionType === "CREDIT") {
              creditItems.push(item);
            } else if (txn.transactionType === "DEBIT") {
              debitItems.push(item);
            }
          });

          const fullChartData = [
            { name: "CREDIT", items: creditItems },
            { name: "DEBIT", items: debitItems }
          ];
          self.chartData(fullChartData);
        });

        // Step 4: Fetch Loans for the newly selected account
        $.getJSON("http://localhost:8080/account-service/loans/account/" + newAccount.id, function (loans) {
          console.log("Fetched loans for account " + newAccount.id + ":", loans);
          self.loans(loans);
        });
      }
    });

    /* Init */
    self.connected = () => {
      console.log("Profile connected. UserId:", self.userId());

      if (!self.userId()) {
        alert("No logged-in user found. Please log in first.");
        return;
      }

      // Step 1: Fetch User
      $.getJSON("http://localhost:8080/user-service/users/" + self.userId(), function (user) {
        console.log("Fetched user:", user);
        self.userName(user.name);
        self.userEmail(user.email);
        self.userRole(user.role);

        // Step 2: Fetch ALL Accounts for this user
        $.getJSON("http://localhost:8080/account-service/accounts/user/" + self.userId(), function (accounts) {
          console.log("Fetched accounts:", accounts);
          if (accounts && accounts.length > 0) {
            // Set the entire accounts array
            self.accounts(accounts);
            // Select the first account by default
            self.selectAccount(accounts[0]);
          }
        });
      });
    };
  }
  return ProfileViewModel;
});
