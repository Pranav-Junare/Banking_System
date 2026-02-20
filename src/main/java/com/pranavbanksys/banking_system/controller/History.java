package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.TransactionDB;
import com.pranavbanksys.banking_system.repo.TransactionDetails;
import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class History {

//    Accessing the functions of these files
    private final TransactionDB transactionDB;
    private final UserDB userDB;

//    Shows the transaction history of the current user
    @GetMapping("/history")
    public ResponseEntity<?> transactionHistory(HttpSession session){

//        Initializing the currentUser
        Object sessionObj=session.getAttribute("currentUser");

//        If object is null return not logged in
        if(sessionObj==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","User not logged in"));

//        Else set the userDetails to user
        UserDetails user = (UserDetails) sessionObj;

//        Get the list all the transactionDetails
        List<TransactionDetails> history=transactionDB.findByFromUser(user.getUEmail());

//        If the list is empty, return
        if(history.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "No transaction history to show"));
        List<Map<String, Object>>reactDataList=new ArrayList<>();

//        Loop over each transaction from the list
        for(TransactionDetails transactionDetails:history){

//            For each iteration of the loop initialize the receiverDetails
            UserDetails receiverDetails = userDB.findByuEmail(transactionDetails.getToUser());

//            If receiverDetails are null write name as unknown or their name
            String receiverName=(receiverDetails!=null)?receiverDetails.getUName():"Unknown User";
            reactDataList.add(Map.of(
                    "transactionId", transactionDetails.getTransactionID(),
                    "receiverName", receiverName,
                    "amount", transactionDetails.getAmount()
            ));

        }
//        Return the stringBuilder as string
        return ResponseEntity.ok(reactDataList);
    }
}
