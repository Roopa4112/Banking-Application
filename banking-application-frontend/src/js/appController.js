// /**
//  * @license
//  * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
//  * Licensed under The Universal Permissive License (UPL), Version 1.0
//  * as shown at https://oss.oracle.com/licenses/upl/
//  * @ignore
//  */
// /*
//  * Your application specific code will go here
//  */
// define(['knockout', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
//         'ojs/ojdrawerpopup', 'ojs/ojmodule-element', 'ojs/ojknockout'],
//   function(ko, Context, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider) {

//      function ControllerViewModel() {

//       this.KnockoutTemplateUtils = KnockoutTemplateUtils;

//       // Handle announcements sent when pages change, for Accessibility.
//       this.manner = ko.observable('polite');
//       this.message = ko.observable();
//       announcementHandler = (event) => {
//           this.message(event.detail.message);
//           this.manner(event.detail.manner);
//       };

//       document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);


//       // Media queries for responsive layouts
//       const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
//       this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
//       const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
//       this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

//       let navData = [
//         { path: '', redirect: 'dashboard' },
//         { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart' } },       
//         { path: 'incidents', detail: { label: 'Incidents', iconClass: 'oj-ux-ico-fire' } },
//         { path: 'customers', detail: { label: 'Customers', iconClass: 'oj-ux-ico-contact-group' } },
//         { path: 'about', detail: { label: 'About', iconClass: 'oj-ux-ico-information-s' } },
//          { path: 'login', detail: { label: 'Login', iconClass: 'oj-ux-ico-lock' } },
//          { path: 'signup', detail: { label: 'Signup', iconClass: 'oj-ux-ico-lock' } }
//       ];

//       // Router setup
//       let router = new CoreRouter(navData, {
//         urlAdapter: new UrlParamAdapter()
//       });
//       router.sync();

//       this.moduleAdapter = new ModuleRouterAdapter(router);

//       this.selection = new KnockoutRouterAdapter(router);

//       // Setup the navDataProvider with the routes, excluding the first redirected
//       // route.
//       this.navDataProvider = new ArrayDataProvider(navData.slice(1,-2), {keyAttributes: "path"});

//       // Drawer
//       self.sideDrawerOn = ko.observable(false);

//       // Close drawer on medium and larger screens
//       this.mdScreen.subscribe(() => { self.sideDrawerOn(false) });

//       // Called by navigation drawer toggle button and after selection of nav drawer item
//       this.toggleDrawer = () => {
//         self.sideDrawerOn(!self.sideDrawerOn());
//       }

//       // Header
//       // Application Name used in Branding Area
//       this.appName = ko.observable("App Name");
//       // User Info used in Global Navigation area
//       this.userLogin = ko.observable("john.hancock@oracle.com");

//       // Footer
//       this.footerLinks = [
//         {name: 'About Oracle', linkId: 'aboutOracle', linkTarget:'http://www.oracle.com/us/corporate/index.html#menu-about'},
//         { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
//         { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
//         { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
//         { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
//       ];
//      }
//      // release the application bootstrap busy state
//      Context.getPageContext().getBusyContext().applicationBootstrapComplete();

//      return new ControllerViewModel();
//   }
// );



/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */

/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define([
  'knockout',
  'ojs/ojcontext',
  'ojs/ojmodule-element-utils',
  'ojs/ojknockouttemplateutils',
  'ojs/ojcorerouter',
  'ojs/ojmodulerouter-adapter',
  'ojs/ojknockoutrouteradapter',
  'ojs/ojurlparamadapter',
  'ojs/ojresponsiveutils',
  'ojs/ojresponsiveknockoututils',
  'ojs/ojarraydataprovider',
  'ojs/ojdrawerpopup',
  'ojs/ojmodule-element',
  'ojs/ojknockout',
  'ojs/ojdialog',
  'ojs/ojrouter'
], function (
  ko,
  Context,
  moduleUtils,
  KnockoutTemplateUtils,
  CoreRouter,
  ModuleRouterAdapter,
  KnockoutRouterAdapter,
  UrlParamAdapter,
  ResponsiveUtils,
  ResponsiveKnockoutUtils,
  ArrayDataProvider
) {
  function ControllerViewModel() {
    this.KnockoutTemplateUtils = KnockoutTemplateUtils;

    // A11y and Announcements
    let self = this;
    self.manner = ko.observable('polite');
    self.message = ko.observable();
    let announcementHandler = (event) => {
      self.message(event.detail.message);
      self.manner(event.detail.manner);
    };
    document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

    // Responsive utilities
    const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
    this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
    const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
    this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

    // Get user role from localStorage or default to 'guest'
    const role = window.localStorage.getItem('role') || 'guest';
    self.userLogin=localStorage.getItem('userEmail') || 'guest';

    console.log("User role from localStorage:", role);

    // 1. Define ALL possible routes for the entire application
    const allRoutes = [
        { path: '', redirect: 'login' }, // Default redirect
        { path: 'login', detail: { label: 'Login', iconClass: 'oj-ux-ico-lock' } },
        { path: 'signup', detail: { label: 'Signup', iconClass: 'oj-ux-ico-lock' } },
        { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart' } },
        { path: 'about', detail: { label: 'About', iconClass: 'oj-ux-ico-information-s' } },
        { path: 'account', detail: { label: 'Account', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'deposit', detail: { label: 'Deposit', iconClass: 'oj-ux-ico-fire' } },
        { path: 'withdraw', detail: { label: 'Withdraw', iconClass: 'oj-ux-ico-fire' } },
        { path: 'transfer', detail: { label: 'Transfer', iconClass: 'oj-ux-ico-fire' } },
        { path: 'loan', detail: { label: 'Loan', iconClass: 'oj-ux-ico-lock' } },
        { path: 'accountapproved', detail: { label: 'Account Approved', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'alltransaction', detail: { label: 'Manage Transaction', iconClass: 'oj-ux-ico-fire' } },
        { path: 'allaccount', detail: { label: 'Manage Account', iconClass: 'oj-ux-ico-fire' } },
        { path: 'allloan', detail: { label: 'Manage Loan', iconClass: 'oj-ux-ico-fire' } },
        { path: 'profile', detail: { label: 'Profile', iconClass: 'oj-ux-ico-information-s' } },
        { path: 'employeeprofile', detail: { label: 'Employee Profile', iconClass: 'oj-ux-ico-information-s' } },
        { path: 'loanapproved', detail: { label: 'Loan Approved', iconClass: 'oj-ux-ico-lock' } }
    ];

    // 2. Define the navigation data based on the user's role
    let navData;
    if (role === 'customer') {
        navData = [
            { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart' } },
            { path: 'about', detail: { label: 'About', iconClass: 'oj-ux-ico-information-s' } },
            { path: 'account', detail: { label: 'Account', iconClass: 'oj-ux-ico-contact-group' } },
            { path: 'deposit', detail: { label: 'Deposit', iconClass: 'oj-ux-ico-fire' } },
            { path: 'withdraw', detail: { label: 'Withdraw', iconClass: 'oj-ux-ico-fire' } },
            { path: 'transfer', detail: { label: 'Transfer', iconClass: 'oj-ux-ico-fire' } },
            { path: 'loan', detail: { label: 'Loan', iconClass: 'oj-ux-ico-lock' } },
        ];
    } else if (role === 'employee') {
        navData = [
            { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart' } },
            { path: 'about', detail: { label: 'About', iconClass: 'oj-ux-ico-information-s' } },
            { path: 'allaccount', detail: { label: 'Manage Account', iconClass: 'oj-ux-ico-fire' } },
            { path: 'alltransaction', detail: { label: 'Manage Transaction', iconClass: 'oj-ux-ico-fire' } },
            { path: 'allloan', detail: { label: 'Manage Loan', iconClass: 'oj-ux-ico-fire' } }
        ];
    } else { // 'guest' or any other state
        navData = [
            { path: 'login', detail: { label: 'Login', iconClass: 'oj-ux-ico-lock' } },
            { path: 'signup', detail: { label: 'Signup', iconClass: 'oj-ux-ico-lock' } }
        ];
    }

    // 3. Initialize the router with ALL possible routes
    let router = new CoreRouter(allRoutes, {
        urlAdapter: new UrlParamAdapter()
    });

    // 4. Set up the `navDataProvider` based on the role-specific `navData`
    this.navDataProvider = new ArrayDataProvider(navData, { keyAttributes: "path" });

    // 5. Sync the router last, after it's fully configured
    router.sync();

    this.moduleAdapter = new ModuleRouterAdapter(router);
    this.selection = new KnockoutRouterAdapter(router);


    self.confirmLogout = function () {
          console.log("User confirmed logout");
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('role');
          localStorage.removeItem('userId'); // clear stored userId
          localStorage.removeItem('userData'); // clear stored user info
          localStorage.clear();
         //router.go({ path: 'login' });

        window.location.href = '?ojr=login';
          
        }
    //logout dialog
    
       self.cancelLogout = function () {
         console.log("Logout canceled");
         // Router.rootInstance.go("dashboard");
       };

       self.openLogoutDialog = function () {
         console.log("Opening logout dialog...");
         const dialog = document.getElementById("logoutGlobalDialog");
         if (dialog) {
           setTimeout(() => {
             dialog.open();
           }, 0); // Delay execution to allow upgrade
         } else {
           console.warn("logoutDialog not found in DOM.");
         }
       };
this.handleUserMenuAction = (event) => {
  const action = event.detail.selectedValue;
  console.log("User menu action:", action);

  if (action === "out") {
    self.openLogoutDialog();
  } else if (action === "pref") {
    const role = localStorage.getItem("role"); // "customer", "employee", etc.

    if (role) {
      const lowerRole = role.toLowerCase();

      if (lowerRole === "customer") {
        // Navigate to customer profile via router
window.location.href="?ojr=profile"
        console.log("Preferences -> Profile opened for customer");
      } else if (lowerRole === "employee") {
        // Navigate to employee profile via router
window.location.href="?ojr=employeeprofile"
        console.log("Preferences -> Employee Profile opened for employee");
      } else {
        alert("Profile page is only available for customers and employees.");
        console.log("Access denied: non-customer/employee tried to open profile");
      }
    } else {
      alert("User role not found. Please login again.");
      console.log("User role missing in localStorage");
    }
  }
};


    //    this.handleUserMenuAction = (event) => {
    //      const action = event.detail.selectedValue;
    //      console.log("User menu action:", action);
    //      if (action === "out") {
    //        self.openLogoutDialog();
    //      } else if (action === "pref") {

    //         // Get the user role from localStorage (set this during login)
    // const role = localStorage.getItem("role"); // e.g., "customer", "admin"

    // if (role && role.toLowerCase() === "customer") {
    //   // Only customers can see profile
    //   window.location.href = "?ojr=profile";
    //   console.log("Preferences -> Profile opened for customer");
    // } else {
    //   // Block others from accessing profile
    //   alert("Profile page is only available for customers.");
    //   console.log("Access denied: non-customer tried to open profile");
    // }
    //       //  // Handle Preferences action
    //       //  window.location.href = '?ojr=profile';
    //       //  console.log("Preferences clicked");
    //      }
    //    };

    // Drawer, Header, Footer
    self.sideDrawerOn = ko.observable(false);
    this.mdScreen.subscribe(() => { self.sideDrawerOn(false) });
    this.toggleDrawer = () => { self.sideDrawerOn(!self.sideDrawerOn()) };
    this.appName = ko.observable("Valora Bank");
    this.footerLinks = [
      { name: 'About Oracle', linkId: 'aboutOracle', linkTarget: 'http://www.oracle.com/us/corporate/index.html#menu-about' },
      { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
      { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
      { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
      { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
    ];
  }

  Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  return new ControllerViewModel();
});