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

  function LoanApproveViewModel() {
    var self = this;

    // --- Observables ---
    self.loanList = ko.observableArray([]);
    self.selectedLoanId = ko.observable();
    self.employeeId = ko.observable(localStorage.getItem('userId') || '');

    // Success panel observables
    self.loanApproveSuccess = ko.observable(false);
    self.loanApproveResponse = ko.observable({});

    console.log("👤 Logged-in Employee ID:", self.employeeId());

    // DataProvider for select component
    self.loanDataProvider = new ArrayDataProvider(self.loanList, { keyAttributes: 'value' });

    // --- Fetch all loans ---
    self.fetchLoans = function () {
      fetch('http://localhost:8080/account-service/loans/all')
        .then(response => response.json())
        .then(data => {
          console.log("✅ Loans fetched:", data);

          // Filter only pending loans
          const pendingLoans = data.filter(loan => loan.status === 'PENDING');

          // Map backend loans into { value, label } for select
          const mapped = pendingLoans.map(loan => ({
            value: loan.id,
            label: `Loan ${loan.id} - Account ${loan.account ? loan.account.id : ''} - Amount ${loan.amount}`
          }));

          self.loanList(mapped);
        })
        .catch(err => console.error('❌ Error fetching loans:', err));
    };

    // --- Approve Loan ---
    self.approveLoan = function () {
      if (!self.selectedLoanId()) {
        alert('Please select a loan to approve.');
        return;
      }

      const payload = {
        loanId: self.selectedLoanId(),
        employeeId: self.employeeId()
      };

      console.log("📤 Sending loan approval payload:", payload);

      fetch('http://localhost:8080/account-service/loans/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) throw new Error('Approval failed');
        return response.json();
      })
      .then(data => {
        console.log("✅ Loan approved:", data);
        self.loanApproveResponse(data);  // store response
        self.loanApproveSuccess(true);   // show success panel
      })
      .catch(err => {
        console.error('❌ Error approving loan:', err);
        alert('⚠️ Failed to approve loan!');
      });
    };

    // --- Reset for another approval ---
    self.approveAnotherLoan = function () {
      self.loanApproveSuccess(false);
      self.selectedLoanId(null);
      self.fetchLoans();
    };

    // --- Format date ---
    self.formatDate = function(dateStr) {
      return dateStr ? new Date(dateStr).toLocaleString() : '';
    };

    self.connected = function () {
      self.fetchLoans();
    };
  }

  return new LoanApproveViewModel();
});
