package com.banking.accountservice.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_type")
    private String transactionType;

    private Double amount;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "transaction_date")
    private Date date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    @JsonIgnore
    private Account account;

    private String status;
    private Boolean approved;

    @Column(name = "approved_by_employee_id")
    private Long approvedByEmployeeId;

    @Column(name = "counterparty_account_id")
    private Long counterpartyAccountId;

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }

    public Long getApprovedByEmployeeId() { return approvedByEmployeeId; }
    public void setApprovedByEmployeeId(Long approvedByEmployeeId) { this.approvedByEmployeeId = approvedByEmployeeId; }

    public Long getCounterpartyAccountId() { return counterpartyAccountId; }
    public void setCounterpartyAccountId(Long counterpartyAccountId) { this.counterpartyAccountId = counterpartyAccountId; }

    // convenience method to expose accountId
    @Transient
    public Long getAccountId() {
        return account != null ? account.getId() : null;
    }
}
