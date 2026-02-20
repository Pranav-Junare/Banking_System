package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDetails;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
public class Dashboard {

//    User Dashboard, show name and account balance
    @GetMapping("/dashboard")

//    Return string, takes HTTP session as parameter
    public ResponseEntity<?> dashBoard(HttpSession session){

//        Creating the session obj
        Object sessionObj=session.getAttribute("currentUser");

//        If null return not logged in
        if(sessionObj==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Not logged in"));

//        Else display name and balance
        else {
            UserDetails user = (UserDetails) sessionObj;
            return ResponseEntity.ok(Map.of("name", user.getUName(),"balance",user.getAccountBalance()));
        }
    }

}
