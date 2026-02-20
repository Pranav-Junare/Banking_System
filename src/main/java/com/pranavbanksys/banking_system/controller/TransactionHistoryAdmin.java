package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.*;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TransactionHistoryAdmin {

    private final TransactionDB transactionDB;
    private final UserDB userDB;

    @GetMapping("/transactionHistoryAdmin")
    public ResponseEntity<?> Ahistroy(HttpSession session){
        Object sessionObj=session.getAttribute("currentAdmin");
        AdminDetails admin=(AdminDetails) sessionObj;

        List<TransactionDetails> history=transactionDB.findAll();


        List<Map<String, Object>>reactDataList=new ArrayList<>();

        for(TransactionDetails transactionDetails:history){

            UserDetails sender=userDB.findByuEmail(transactionDetails.getFromUser());
            String senderName= sender.getUName();
            UserDetails receiver=userDB.findByuEmail(transactionDetails.getToUser());
            String receiverName=receiver.getUName();

            reactDataList.add(Map.of(
                    "transactionId", transactionDetails.getTransactionID(),
                    "senderName", senderName,
                    "senderEmail", transactionDetails.getFromUser(),
                    "receiverName", receiverName,
                    "receiverEmail", transactionDetails.getToUser(),
                    "amount", transactionDetails.getAmount()
            ));
        }
        return ResponseEntity.ok(reactDataList);
    }
}
