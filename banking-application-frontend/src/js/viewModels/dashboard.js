// // /**
// //  * @license
// //  * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
// //  * Licensed under The Universal Permissive License (UPL), Version 1.0
// //  * as shown at https://oss.oracle.com/licenses/upl/
// //  * @ignore
// //  */
// // /*
// //  * Your dashboard ViewModel code goes here
// //  */
// // define(['../accUtils'],
// //  function(accUtils) {
// //     function DashboardViewModel() {
// //       // Below are a set of the ViewModel methods invoked by the oj-module component.
// //       // Please reference the oj-module jsDoc for additional information.

// //       /**
// //        * Optional ViewModel method invoked after the View is inserted into the
// //        * document DOM.  The application can put logic that requires the DOM being
// //        * attached here.
// //        * This method might be called multiple times - after the View is created
// //        * and inserted into the DOM and after the View is reconnected
// //        * after being disconnected.
// //        */
// //       this.connected = () => {
// //         accUtils.announce('Dashboard page loaded.', 'assertive');
// //         document.title = "Dashboard";
// //         // Implement further logic if needed
// //       };

// //       /**
// //        * Optional ViewModel method invoked after the View is disconnected from the DOM.
// //        */
// //       this.disconnected = () => {
// //         // Implement if needed
// //       };

// //       /**
// //        * Optional ViewModel method invoked after transition to the new View is complete.
// //        * That includes any possible animation between the old and the new View.
// //        */
// //       this.transitionCompleted = () => {
// //         // Implement if needed
// //       };
// //     }

// //     /*
// //      * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
// //      * return a constructor for the ViewModel so that the ViewModel is constructed
// //      * each time the view is displayed.
// //      */
// //     return DashboardViewModel;
// //   }
// // );

// // // define([
// // //   'ojs/ojcore',
// // //   'knockout',
// // //   'ojs/ojarraydataprovider'
// // // ], function(oj, ko, ArrayDataProvider) {
// // //   function DashboardViewModel() {
// // //     var self = this;

// // //     // Example observable for welcome message
// // //     self.welcomeMessage = ko.observable('Welcome to your Banking Dashboard!');

// // //     // Example data for accounts
// // //     self.accounts = ko.observableArray([
// // //       { accountNumber: '123456789', type: 'Checking', balance: 2500.00 },
// // //       { accountNumber: '987654321', type: 'Savings', balance: 5000.00 }
// // //     ]);

// // //     // DataProvider for use with JET components (like oj-table)
// // //     self.accountsDataProvider = new ArrayDataProvider(self.accounts, { keyAttributes: 'accountNumber' });

// // //     // Example method
// // //     self.refreshAccounts = function() {
// // //       // Logic to refresh account data from backend API
// // //       // For now, just log to console
// // //       console.log('Refreshing accounts...');
// // //     };
// // //   }

// // //   return new DashboardViewModel();
// // // });


// /**
//  * @license
//  * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
//  * Licensed under The Universal Permissive License (UPL), Version 1.0
//  * @ignore
//  */
// /**
//  * @license
//  * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
//  * Licensed under The Universal Permissive License (UPL), Version 1.0
//  * @ignore
//  */
// define([
//   'knockout',
//   'ojs/ojarraydataprovider',
//   'ojs/ojchart',
//   'ojs/ojfilmstrip',   // ✅ include filmstrip
//   '../accUtils',
//   'ojs/ojbutton'
// ], function (ko, ArrayDataProvider, ojChart, ojFilmStrip, accUtils)  {
  
//   class DashboardViewModel {
//     constructor() {
//       // Announce when page loads
//       this.connected = () => {
//         accUtils.announce('Dashboard page loaded.', 'assertive');
//         document.title = "Dashboard";
//       };

//       // 📊 Stats
//       this.totalUsers = ko.observable(12000);
//       this.loansApplied = ko.observable(3200);
//       this.loansApproved = ko.observable(2800);

//       this.navigateToLogin = navigateToLogin;

//       // 📈 Growth chart data
//       this.growthGroups = [
//         "2013", "2014", "2015", "2016", "2017",
//         "2018", "2019", "2020", "2021", "2022", "2023"
//       ];

//       this.growthSeries = [
//         {
//           name: "Total Deposits (in Cr.)",
//           items: [1200, 1500, 1800, 2200, 2700, 3200, 3800, 4100, 4600, 5100, 5800]
//         },
//         {
//           name: "Total Loans (in Cr.)",
//           items: [900, 1100, 1400, 1750, 2000, 2500, 3100, 3400, 3800, 4200, 4800]
//         },
//         {
//           name: "Investments (in Cr.)",
//           items: [300, 500, 750, 1000, 1400, 1800, 2300, 2500, 2900, 3400, 3900]
//         },
//         {
//           name: "Customer Base (in Lakhs)",
//           items: [15, 20, 28, 35, 42, 55, 65, 75, 90, 110, 130]
//         }
//       ];

//       // 🎞️ Filmstrip images
//       this.bankImages = ko.observableArray([
//         { src: 'css/images/bank6.png', alt: 'Branch Network' },
//         { src: 'css/images/bank2.png', alt: 'Digital Banking' },
//         { src: 'css/images/bank3.png', alt: 'Customer Support' }
//       ]);


//       function navigateToLogin() {
//         window.location.href = '?ojr=login'; // Adjust the URL as needed
//       }
//     }
    
//   }

//   return DashboardViewModel;
// });


// A single AMD module should have one define() call
define([
  'knockout',
  'jquery',
  'ojs/ojarraydataprovider',
  'ojs/ojchart',
  'ojs/ojfilmstrip',
  'ojs/ojbutton',
  '../accUtils'
], function (ko, $, ArrayDataProvider, ojChart, ojFilmStrip, ojButton, accUtils) {

  class DashboardViewModel {
    constructor() {
      // Announce when page loads
      this.connected = () => {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Dashboard";
        this.loadStats(); // ✅ load stats from backend when page connects
      };

      // 🔹 Observables for dynamic stats
      this.totalUsers = ko.observable(0);
      this.totalAccounts = ko.observable(0);
      this.totalLoans = ko.observable(0);

      // 📊 Chart Data (static for now, you can hook to backend later)
      this.growthGroups = [
        "2013","2014","2015","2016","2017",
        "2018","2019","2020","2021","2022","2023"
      ];

      this.growthSeries = [
        { name: "Total Deposits (in Cr.)", items: [1200,1500,1800,2200,2700,3200,3800,4100,4600,5100,5800] },
        { name: "Total Loans (in Cr.)", items: [900,1100,1400,1750,2000,2500,3100,3400,3800,4200,4800] },
        { name: "Investments (in Cr.)", items: [300,500,750,1000,1400,1800,2300,2500,2900,3400,3900] },
        { name: "Customer Base (in Lakhs)", items: [15,20,28,35,42,55,65,75,90,110,130] }
      ];

      // 🎞️ Filmstrip images
      this.bankImages = ko.observableArray([
        { src: 'css/images/bank6.png', alt: 'Branch Network' },
        { src: 'css/images/bank2.png', alt: 'Digital Banking' },
        { src: 'css/images/bank3.png', alt: 'Customer Support' }
      ]);

      // 🔹 Fetch stats from backend
      this.loadStats = () => {
        // Fetch Users
        $.ajax({
          url: "http://localhost:8080/user-service/users",
          type: "GET",
          success: (data) => {
            this.totalUsers(data.length);
          },
          error: (err) => {
            console.error("Error fetching users:", err);
            this.totalUsers(0);
          }
        });

        // Fetch Accounts
        $.ajax({
          url: "http://localhost:8080/account-service/accounts",
          type: "GET",
          success: (data) => {
            this.totalAccounts(data.length);
          },
          error: (err) => {
            console.error("Error fetching accounts:", err);
            this.totalAccounts(0);
          }
        });

        // Fetch Loans
        $.ajax({
          url: "http://localhost:8080/account-service/loans/all",
          type: "GET",
          success: (data) => {
            this.totalLoans(data.length);
          },
          error: (err) => {
            console.error("Error fetching loans:", err);
            this.totalLoans(0);
          }
        });
      };
    }
  }

  return DashboardViewModel;
});
