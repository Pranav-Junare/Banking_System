package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

//Handles sign up

@RestController
@RequiredArgsConstructor
public class SignUp {

//  Used to get reference to the service layer, to use the registerUser method
    private final UserService userService;

 @PostMapping("/signup")

//    Returns either success if there is no same email in the DB, returns success and saves it
    public  ResponseEntity<?> signUp(@ModelAttribute UserDetails userDetails){

//        Runs the registerUser from userService
        try{userService.registerUser(userDetails);
        return  ResponseEntity.ok(Map.of("message", "Signed Up successfully"));
        }

//      If there is an email already in the DB, return a string
        catch(IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error",e.getMessage()));
        }
    }
}
