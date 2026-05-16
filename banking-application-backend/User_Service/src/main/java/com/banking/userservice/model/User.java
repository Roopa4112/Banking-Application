package com.banking.userservice.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="user")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Unique ID (used by other microservices)

    private String name;


    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    // Role: CUSTOMER or EMPLOYEE
    private String role;

}
