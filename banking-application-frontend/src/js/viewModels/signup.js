define([
    'ojs/ojcore',
    'knockout',
    'ojs/ojformlayout',
    'ojs/ojinputtext',
    'ojs/ojselectsingle',
    'ojs/ojbutton',
    'ojs/ojarraydataprovider'
], function(oj, ko, ojFormLayout, ojInputText, ojSelectSingle, ojButton, ArrayDataProvider) {

    function SignupViewModel() {
        var self = this;

        self.name = ko.observable('');
        self.email = ko.observable('');
        self.password = ko.observable('');
        self.role = ko.observable('');

        self.roleOptionsArray = [
            { value: 'customer', label: 'Customer' },
            { value: 'employee', label: 'Employee' }
        ];

        self.roleOptions = new ArrayDataProvider(self.roleOptionsArray, { keyAttributes: 'value' });

        // Computed observable to enable/disable Sign Up button
        self.isFormValid = ko.computed(function() {
            return self.name() && self.email() && self.password() && self.role();
        });

        self.signup = function() {
            if (!self.isFormValid()) {
                alert('Please fill all fields!');
                return;
            }

            var payload = {
                name: self.name(),
                email: self.email(),
                password: self.password(),
                role: self.role()
            };

            fetch('http://localhost:8080/user-service/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    alert('Signup successful! Redirecting to login...');
                    window.location.href = '?ojr=login';
                } else if (response.status === 409) {
                    alert('User with this email already exists!');
                } else {
                    return response.json().then(err => { throw err; });
                }
            })
            .catch(error => {
                console.error('Registration failed:', error);
                alert('Signup failed. Check console for details.');
            });
        };
    }

    return SignupViewModel;
});
