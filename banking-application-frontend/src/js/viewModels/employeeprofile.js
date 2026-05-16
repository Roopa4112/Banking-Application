define(['ojs/ojcore', 'knockout', 'jquery'], function(oj, ko, $) {
  function EmployeeProfileViewModel() {
    var self = this;

    // Fetch employee info from localStorage
    self.employeeId = ko.observable(localStorage.getItem('userId'));
    self.employeeName = ko.observable("");
    self.employeeEmail = ko.observable("");
    self.employeeRole = ko.observable("");

    // Static mapping of roles -> responsibilities
   const roleResponsibilities = {
    'EMPLOYEE': [
        'Perform assigned daily tasks',
        'Attend team meetings',
        'Follow organizational policies',
        'Manage loan processing',
        'Handle account management',
        'Oversee transaction management',
        'Assist in account and loan approval processes'
    ]
};

    // Observable to hold employee profile
    self.employee = ko.observable();
    
    self.connected = () => {
      console.log('Employee Profile Loaded:', self.employee());

      // Fetch user data from the API
      $.getJSON("http://localhost:8080/user-service/users/" + self.employeeId(), function (user) {
        console.log("Fetched user:", user);
        self.employeeName(user.name);
        self.employeeEmail(user.email);
        self.employeeRole(user.role);
        
        // Now populate the employee observable with the fetched data
        self.employee({
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
          responsibilities: roleResponsibilities[user.role] || ['No responsibilities defined']
        });
      });
    };
  }

  return EmployeeProfileViewModel;
});
