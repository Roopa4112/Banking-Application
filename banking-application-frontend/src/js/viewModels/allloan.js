define([
    'ojs/ojcore',
    'knockout',
    'jquery',
    'ojs/ojarraydataprovider',
    'ojs/ojinputtext',
    'ojs/ojtable',
    'ojs/ojbutton'
], function(oj, ko, $, ArrayDataProvider) {
    function AllLoanViewModel() {
        var self = this;

        self.loans = ko.observableArray([]);
        self.searchAccountId = ko.observable('');
        self.dataProvider = ko.computed(function() {
            return new ArrayDataProvider(self.loans, { keyAttributes: 'loanId' });
        });

        self.fetchAllLoans = function() {
            $.getJSON('http://localhost:8080/account-service/loans/all')
                .done(function(data) {
                    self.loans(data.map(function(loan) {
                return {
                    id: loan.id,
                    accountId: loan.account ? loan.account.id : null,
                    amount: loan.amount,
                    appliedDate: loan.appliedDate,
                    approvedDate: loan.approvedDate,
                    approvedByEmployeeId: loan.approvedByEmployeeId,
                    interestRate: loan.interestRate,
                    loanType: loan.loanType,
                    status: loan.status,
                    totalAmountToPay: loan.totalAmountToPay,
                    term_month: loan.term_month
                };
            }));
        })
                .fail(function() {
                    self.loans([]);
                });
        };

        self.searchLoansByAccount = function(event, data) {
            var accountId = self.searchAccountId();
            if (!accountId) {
                self.fetchAllLoans();
                return;
            }
            $.getJSON('http://localhost:8080/account-service/loans/account/' + encodeURIComponent(accountId))
                .done(function(data) {
                    self.loans(Array.isArray(data) ? data : [data]);
                })
                .fail(function() {
                    self.loans([]);
                });
        };

        self.navigateToLoanApprove = function() {
            window.location.href = '?ojr=loanapproved';
        };


        // Initial fetch
        self.fetchAllLoans();
    }

    return new AllLoanViewModel();
});
