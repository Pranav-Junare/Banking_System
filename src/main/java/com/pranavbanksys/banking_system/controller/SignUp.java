package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

//Handles sign up

@RestController
@RequiredArgsConstructor
public class SignUp {

//  Used to get reference to the service layer, to use the registerUser method
    private final UserService userService;

 @PostMapping("/signup")

//    Returns either success if there is no same email in the DB, returns success and saves it
    public String signUp(@ModelAttribute UserDetails userDetails){

//        Runs the registerUser from userService
        try{userService.registerUser(userDetails);
        return "Success";
        }

//      If there is an email already in the DB, return a string
        catch(IllegalStateException e) {
            return e.getMessage();
        }
    }
}
