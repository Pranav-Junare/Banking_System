package com.pranavbanksys.banking_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class Home {
//    Home page, will be changed later, but currently just set to this for trail purpose
    @GetMapping("/")
    public ResponseEntity<?> homePage(){
        return ResponseEntity.ok(Map.of("home", "This is the main page and will be only used to  show project details and other stuff"));
    }
}
