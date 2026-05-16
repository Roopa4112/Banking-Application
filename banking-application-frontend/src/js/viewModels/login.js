// // define([
// //     'ojs/ojcore',
// //     'knockout',
// //     'ojs/ojrouter',
// //     'ojs/ojbutton',
// //     'ojs/ojinputtext',
// //     'ojs/ojformlayout',
// //     'ojs/ojradioset',
// //     'ojs/ojvalidationgroup'
// // ], function(oj, ko, Router) {
// //     function LoginViewModel() {
// //         var self = this;

// //         self.email = ko.observable('');
// //         self.password = ko.observable('');
// //         self.userType = ko.observableArray([]);
// //         self.loginError = ko.observable('');
// //         self.groupValid = ko.observable();

// //         self.login = function() {
// //             var tracker = document.getElementById('loginForm'); // oj-validation-group
// //             if (tracker && tracker.valid === 'valid') {
// //                 var payload = {
// //                     email: self.email(),
// //                     password: self.password(),
// //                     userType: self.userType()[0] // 'customer' or 'employee'
// //                 };
// //                 fetch('http://localhost:8080/user-service/users/login', {
// //                     method: 'POST',
// //                     headers: { 'Content-Type': 'application/json' },
// //                     body: JSON.stringify(payload)
// //                 })
// //                 .then(response => {
// //                     if (!response.ok) throw new Error('Login failed');
// //                     return response.json();
// //                 })
// //                 .then(data => {
// //                     // ✅ Log success
// //                     console.log("User successfully login:", data);

// //                     // Redirect to dashboard
// //                     window.location.href = '?ojr=dashboard';
// //                 })
// //                 .catch(err => {
// //                     self.loginError('Invalid credentials or server error.');
// //                     console.error(err);
// //                 });
// //             } else if (tracker) {
// //                 tracker.showMessages();
// //                 tracker.focusOn('@firstInvalidShown');
// //             }
// //         };

// //         self.goToRegister = function() {
// //             Router.rootInstance.go('register');
// //         };

// //         // Handle Enter key
// //         self.submit = function(data, event) {
// //             if (event && event.type === 'keydown' && event.keyCode === 13) {
// //                 self.login();
// //                 return false;
// //             }
// //             return true;
// //         };
// //     }

// //     return new LoginViewModel();
// // });


// define([
//     'ojs/ojcore',
//     'knockout',
//     'ojs/ojrouter',
//     'ojs/ojbutton',
//     'ojs/ojinputtext',
//     'ojs/ojformlayout',
//     'ojs/ojradioset',
//     'ojs/ojvalidationgroup'
// ], function(oj, ko, Router) {

//     function LoginViewModel() {
//         var self = this;

//         // --- Observables ---
//         self.email = ko.observable('');
//         self.password = ko.observable('');
//         self.userType = ko.observable('');   // ✅ FIX: was observableArray
//         self.loginError = ko.observable('');
//         self.groupValid = ko.observable();

//         // Track login status
//         self.isLoggedIn = ko.observable(localStorage.getItem('isLoggedIn') === 'true');

//         // --- Methods ---

//         // Login
//         self.login = function() {
//             var tracker = document.getElementById('loginForm');
//             if (tracker && tracker.valid === 'valid') {
//                 var payload = {
//                     email: self.email(),
//                     password: self.password(),
//                     userType: self.userType()   // ✅ FIX: no [0]
//                 };

//                 fetch('http://localhost:8080/user-service/users/login', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(payload)
//                 })
//                 .then(response => {
//                     if (!response.ok) throw new Error('Login failed');
//                     return response.json();
//                 })
//                 .then(data => {
//                     console.log("✅ User successfully logged in:", data);

//                     // Mark as logged in
//                     self.isLoggedIn(true);
//                     localStorage.setItem('isLoggedIn', 'true');

//                     // Redirect both customer & employee
//                     window.location.href = '?ojr=dashboard';
//                 })
//                 .catch(err => {
//                     self.loginError('Invalid credentials or server error.');
//                     console.error("❌ Login error:", err);
//                 });
//             } else if (tracker) {
//                 tracker.showMessages();
//                 tracker.focusOn('@firstInvalidShown');
//             }
//         };

//         // Logout
//         self.logout = function() {
//             localStorage.removeItem('isLoggedIn');
//             self.isLoggedIn(false);
//             Router.rootInstance.go('login'); // back to login page
//         };

//         // Go to Register page
//         self.goToRegister = function() {
//             Router.rootInstance.go('register');
//         };

//         // Handle Enter key for form submit
//         self.submit = function(data, event) {
//             if (event && event.type === 'keydown' && event.keyCode === 13) {
//                 self.login();
//                 return false;
//             }
//             return true;
//         };
//     }

//     return new LoginViewModel();
// });


// login.js
define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojrouter',
  'ojs/ojbutton',
  'ojs/ojinputtext',
  'ojs/ojformlayout',
  'ojs/ojradioset',
  'ojs/ojvalidationgroup'
], function(oj, ko, Router) {

  function LoginViewModel() {
    let self = this;

    // --- Observables ---
    self.email = ko.observable('');
    self.password = ko.observable('');
    self.userType = ko.observable(''); // role
    self.loginError = ko.observable('');
    self.groupValid = ko.observable();
    self.isLoggedIn = ko.observable(localStorage.getItem('isLoggedIn') === 'true');

    // --- Methods ---
    self.login = function() {
      let tracker = document.getElementById('loginForm');
      if (tracker && tracker.valid === 'valid') {
        let payload = {
          email: self.email(),
          password: self.password(),
          role: self.userType()  // send role to backend
        };

        fetch('http://localhost:8080/user-service/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(async response => {
          if (!response.ok) {
            // get error message from backend
            const err = await response.json();
            throw new Error(err.error || 'Login failed');
          }
          return response.json();
        })
        .then(data => {
          console.log("✅ User successfully logged in:", data);

          // Store user info in localStorage
          self.isLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('role', self.userType());
          localStorage.setItem('userId', data.id);
          localStorage.setItem('userEmail', data.email || self.email());

          console.log("Stored userId:", data.id);
          console.log("Stored userEmail:", localStorage.getItem('userEmail'));

          // Redirect to dashboard
          window.location.href = '?ojr=dashboard';
        })
        .catch(err => {
          self.loginError(err.message);
          console.error("❌ Login error:", err);
        });

      } else if (tracker) {
        tracker.showMessages();
        tracker.focusOn('@firstInvalidShown');
      }
    };

    // Logout method
    self.logout = function() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      self.isLoggedIn(false);
      console.log("User logged out");
      window.location.href = '?ojr=login';
    };

    // Go to Register page
    self.goToRegister = function() {
      window.location.href = '?ojr=signup';
    //  Router.rootInstance.go('signup');
    };

    // Handle Enter key submit
    self.submit = function(data, event) {
      if (event && event.type === 'keydown' && event.keyCode === 13) {
        self.login();
        return false;
      }
      return true;
    };
  }

  return new LoginViewModel();
});
