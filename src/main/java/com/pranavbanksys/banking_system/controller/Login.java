package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class Login {

//    Connection/Access to the User Service to use the "loginUser" method
    private final UserService userService;

    @PostMapping("/login")
//    For now returns a string, used to create a session also, so that the user need not do anything
    public String login(@ModelAttribute UserDetails userDetails, HttpSession session){
        try{
        UserDetails user=userService.loginUser(userDetails.getUEmail(), userDetails.getUPassword());
        session.setAttribute("currentUser",user);
        return "Success, u are logged in";
        }
        catch(IllegalStateException e){
            return e.getMessage();
        }
    }
}
