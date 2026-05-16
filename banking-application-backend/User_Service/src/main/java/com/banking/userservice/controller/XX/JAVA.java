package com.banking.userservice.controller.XX;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/try")
public class JAVA {

    @GetMapping
    public String xyz(){
        return "Hello";
    }
}
