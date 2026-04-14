package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

//Handles sign up

@RestController
@RequiredArgsConstructor
@Slf4j //
public class SignUp {

//  Used to get reference to the service layer, to use the registerUser method
    private final UserService userService;

 @PostMapping("/signup")

//    Returns either success if there is no same email in the DB, returns success and saves it
    public ResponseEntity<?> signUp(@RequestBody UserDetails userDetails) {

//        Runs the registerUser from userService
        try {
            userService.registerUser(userDetails);
            return ResponseEntity.ok(Map.of("message", "Signed Up successfully"));
        }
//      If there is an email already in the DB, return a string
        catch(IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
        catch(Exception e) {
            log.error("Error during signup: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An error occurred during signup. Please check your input and try again."));
        }
    }
}
