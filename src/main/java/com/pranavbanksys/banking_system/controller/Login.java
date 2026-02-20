package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class Login {

//    Connection/Access to the User Service to use the "loginUser" method
    private final UserService userService;

    @PostMapping("/login")
//    For now returns a string, used to create a session also, so that the user need not do anything
    public ResponseEntity<?> login(@ModelAttribute UserDetails userDetails, HttpSession session){
        try{
        UserDetails user=userService.loginUser(userDetails.getUEmail(), userDetails.getUPassword());
        session.setAttribute("currentUser",user);
        return ResponseEntity.ok(Map.of("success","Logged in successfully"));
        }
        catch(IllegalStateException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error",e.getMessage());
        }
    }
}
