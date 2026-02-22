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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class Login {

//    Connection/Access to the User Service to use the "loginUser" method
    private final UserService userService;

//    Return responseEntity. Request used is a map of string, string and used @RequestBody instead of ModelAttribute so it can read json
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpSession session){
        try{
//            Name sent by react
            String email=credentials.get("email");
            String password=credentials.get("password");

//            Performs the necessary check annd logs in user
            UserDetails user=userService.loginUser(email, password);

//            Set the session
            session.setAttribute("currentUser",user);

//            Return the name to react, used to show welcome name
            return ResponseEntity.ok(Map.of("name",user.getUName()));
        }
        catch(IllegalStateException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error",e.getMessage()));
        }
    }
}
