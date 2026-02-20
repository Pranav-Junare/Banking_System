package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.*;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TransactionHistoryAdmin {

    private final TransactionDB transactionDB;
    private final UserDB userDB;

    @GetMapping("/transactionHistoryAdmin")
    public String Ahistroy(HttpSession session){
        Object sessionObj=session.getAttribute("currentAdmin");
        AdminDetails admin=(AdminDetails) sessionObj;

        List<TransactionDetails> history=transactionDB.findAll();
        StringBuilder stringBuilder=new StringBuilder();

        stringBuilder.append("Showing transaction history of all the users: \n\n");

        for(TransactionDetails transactionDetails:history){

            UserDetails sender=userDB.findByuEmail(transactionDetails.getFromUser());
            String senderName= sender.getUName();
            UserDetails receiver=userDB.findByuEmail(transactionDetails.getToUser());
            String receiverName=receiver.getUName();

            stringBuilder.append("Transaction ID: ").append(transactionDetails.getTransactionID()).append("\n")
                    .append("From: ").append(receiverName).append("\n")
                    .append("Email: ").append(transactionDetails.getFromUser()).append("\n")
                    .append("Sent to: ").append(senderName).append("\n")
                    .append("Email: ").append(transactionDetails.getToUser()).append("\n")
                    .append("Amount: ₹").append(transactionDetails.getAmount()).append("\n")
                    .append("------------------------------------------------------------\n");
        }
        return stringBuilder.toString();
    }
}
