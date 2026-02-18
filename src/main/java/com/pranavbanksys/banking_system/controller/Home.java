package com.pranavbanksys.banking_system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Home {
//    Home page, will be changed later, but currently just set to this for trail purpose
    @GetMapping("/")
    public String homePage(){
        return "This is the main page and will be only used to  show project details and other stuff";
    }
}
