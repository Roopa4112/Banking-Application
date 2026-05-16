
define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojformlayout',
  'ojs/ojinputtext',
  'ojs/ojinputnumber',
  'ojs/ojselectsingle',
  'ojs/ojbutton',
  'ojs/ojarraydataprovider'
], function (oj, ko, ojFormLayout, ojInputText, ojInputNumber, ojSelectSingle, ojButton, ArrayDataProvider) {

  function AccountViewModel() {
    var self = this;

    // --- Observables ---
    self.userId = ko.observable(localStorage.getItem('userId') || ''); 
    self.accountType = ko.observable('');
    self.initialBalance = ko.observable(0);

    // --- Dropdown options for account type ---
    self.accountTypeOptionsArray = [
      { value: 'SAVINGS', label: 'Savings' },
      { value: 'CURRENT', label: 'Current' },
      { value: 'FIXED_DEPOSIT', label: 'Fixed Deposit' }
    ];
    self.accountTypeOptions = new ArrayDataProvider(self.accountTypeOptionsArray, { keyAttributes: 'value' });

    // --- Success Panel Observables ---
    self.accountSuccess = ko.observable(false);
    self.accountResponse = ko.observable({});

    // --- Methods ---
    self.createAccount = function () {
      if (!self.userId()) {
        oj.Logger.error('User not logged in.');
        return;
      }
      if (!self.accountType() || self.initialBalance() === null) {
        oj.Logger.error('Account type and initial balance are required.');
        return;
      }

      var payload = {
        userId: self.userId(),
        accountType: self.accountType(),
        balance: self.initialBalance()
      };

      fetch('http://localhost:8080/account-service/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (response) {
        if (!response.ok) {
          return response.text().then(function (error) { throw new Error(error); });
        }
        return response.json();
      })
      .then(function (data) {
        console.log('✅ Account created successfully:', data);
        self.accountResponse(data);
        self.accountSuccess(true);  // show success panel
        // Reset form
        self.accountType('');
        self.initialBalance(0);
      })
      .catch(function (err) {
        console.error('❌ Account creation failed:', err);
      });
    };

    // Reset form to create another account
    self.makeAnotherAccount = function() {
      self.accountSuccess(false);
      self.accountType('');
      self.initialBalance(0);
    };

    return self;
  }

  return AccountViewModel;
});

