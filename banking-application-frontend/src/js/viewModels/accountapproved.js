define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'ojs/ojarraydataprovider',
  'ojs/ojselectsingle',
  'ojs/ojformlayout',
  'ojs/ojbutton'
], function (oj, ko, $, ArrayDataProvider) {
  'use strict';

  function AccountApproveViewModel() {
    var self = this;

    // Observables
    self.accountList = ko.observableArray([]);
    self.selectedAccountId = ko.observable();
    self.employeeId = ko.observable(localStorage.getItem('userId') || '');

    // Success panel observables
    self.accountApproveSuccess = ko.observable(false);
    self.accountApproveResponse = ko.observable({});

    // DataProvider
    self.accountDataProvider = new ArrayDataProvider(self.accountList, { keyAttributes: 'value' });

    // Fetch accounts
    self.fetchAccounts = function () {
      fetch('http://localhost:8080/account-service/accounts')
        .then(response => response.json())
        .then(data => {
          const pendingAccounts = data.filter(acc => acc.status === 'PENDING');
          const mapped = pendingAccounts.map(acc => ({
            value: acc.id,
            label: `Account ${acc.id}`
          }));
          self.accountList(mapped);
        })
        .catch(err => console.error('❌ Error fetching accounts:', err));
    };

    // Approve account
    self.approveAccount = function () {
      if (!self.selectedAccountId()) {
        alert('Please select an account to approve.');
        return;
      }

      const payload = {
        accountId: self.selectedAccountId(),
        employeeId: self.employeeId()
      };

      fetch('http://localhost:8080/account-service/accounts/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) throw new Error('Approval failed');
        return response.json();
      })
      .then(data => {
        console.log('✅ Account approved:', data);
        self.accountApproveResponse(data);
        self.accountApproveSuccess(true); // show success panel
        self.selectedAccountId(null);
      })
      .catch(err => console.error('❌ Error approving account:', err));
    };

    // Approve another account
    self.approveAnotherAccount = function() {
      self.accountApproveSuccess(false);
      self.selectedAccountId(null);
      self.fetchAccounts();
    };

    self.connected = function () {
      self.fetchAccounts();
    };
  }

  return new AccountApproveViewModel();
});
