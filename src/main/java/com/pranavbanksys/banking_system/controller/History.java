package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.TransactionDB;
import com.pranavbanksys.banking_system.repo.TransactionDetails;
import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class History {

//    Accessing the functions of these files
    private final TransactionDB transactionDB;
    private final UserDB userDB;

//    Shows the transaction history of the current user
    @GetMapping("/history")
    public String transactionHistory(HttpSession session){

//        Initializing the currentUser
        Object sessionObj=session.getAttribute("currentUser");

//        If object is null return not logged in
        if(sessionObj==null) return"Not logged in";

//        Else set the userDetails to user
        UserDetails user = (UserDetails) sessionObj;

//        Get the list all the tranactionDetails
        List<TransactionDetails> history=transactionDB.findByFromUser(user.getUEmail());

//        The returning string which will return the result
        StringBuilder stringBuilder = new StringBuilder();

//        Shows the name of the user
        stringBuilder.append("Transaction History of: ").append(user.getUName()).append("\n\n");

//        If the list is empty, return
        if(history.isEmpty()) return "No transactions found";

//        Loop over each transaction from the list
        for(TransactionDetails transactionDetails:history){

//            For each iteration of the loop initialize the receiverDetails
            UserDetails receiverDetails = userDB.findByuEmail(transactionDetails.getToUser());

//            If receiverDetails are null write name as unknown or their name
            String receiverName=(receiverDetails!=null)?receiverDetails.getUName():"Unknown User";

//            Gives the history in string format
            stringBuilder.append("Transaction ID: ").append(transactionDetails.getTransactionID()).append("\n")
                    .append("Sent to: ").append(receiverName).append("\n")
                    .append("Amount: ₹").append(transactionDetails.getAmount()).append("\n")
                    .append("------------------------------------------------------------\n");
        }
//        Return the stringBuilder as string
        return stringBuilder.toString();
    }
}
