package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.TransactionDetails;
import com.pranavbanksys.banking_system.repo.UserDetails;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
public class Dashboard {

//    User Dashboard, show name and account balance
    @GetMapping("/dashboard")

//    Return string, takes HTTP session as parameter
    public String dashBoard(HttpSession session){

//        Creating the session obj
        Object sessionObj=session.getAttribute("currentUser");

//        If null return not logged in
        if(sessionObj==null) return "Not logged in";

//        Else display name and balance
        else {
            UserDetails user = (UserDetails) sessionObj;
            return "Welcome "+user.getUName()+"\n"+"Account balance is ₹"+user.getAccountBalance();
        }
    }

}
