package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SendMoneyAdmin {

    private final UserDB userDB;

    @PostMapping("/addMoney")
    public ResponseEntity<?> addMoney(@RequestBody Map<String,String> reqBody, HttpSession session){
        try{Object ses=session.getAttribute("currentAdmin");
        if(ses==null) throw new IllegalStateException("Not logged in");
        String receiverEmail=reqBody.get("uEmail");
        long amountToAdd = Long.parseLong(reqBody.get("amount"));

        UserDetails targetUser=userDB.findByuEmail(receiverEmail);
        if(targetUser==null) throw new IllegalStateException("Account not found");

        targetUser.setAccountBalance(targetUser.getAccountBalance()+amountToAdd);
        userDB.save(targetUser);

        return ResponseEntity.ok(Map.of("amount",amountToAdd,
                                        "user",targetUser.getUName()));

        }
        catch(IllegalStateException e){return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error",e.getMessage()));
        }
    }
}
