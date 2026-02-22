package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.SendMoneyService;
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
public class SendMoney {

    private final SendMoneyService sendMoneyService;

    //    receiverDetails needs email to send them the money, to get their details
    @PostMapping("/sendMoney")
    public ResponseEntity<?> moneyTransfer(@RequestBody Map<String,String> transactionDetails, HttpSession session){
        try{

//            Using the session we created with the user, taki wahi jho login kiya hai uski details mile
            Object ses=session.getAttribute("currentUser");
            UserDetails sender=(UserDetails) ses;

//            If user is null just return this string, matlab log in nai kiya
            if(sender==null)throw new IllegalStateException("Not logged in");

//            Receiver user complete info, jayega sendMonyService k doesExists() method mai, aur check karega if the user exists or not, if not tho error throw karega, if yes tho vo user ke every detail automatically aayegi from UserDetails parameter and UserDB
            String receiverEmail=(transactionDetails.get("uEmail"));
            int sendAmount=Integer.parseInt(transactionDetails.get("amount"));

            if(sender.getUEmail().equalsIgnoreCase(receiverEmail)) throw new IllegalStateException("Can not send money to yourself");

//            Ye SendMoneyService.java file mai jayega aur transaction execute karega
            UserDetails receiver=sendMoneyService.doesExists(receiverEmail);
            sendMoneyService.processTransaction(sender, receiver, sendAmount);

//            Ye bas show karega ke the transaction has worked and kita balance hai vo show karega
            return  ResponseEntity.ok(Map.of(
                    "sendAmount", sendAmount,
                    "receiverName",receiver.getUName()
            ));
        }

//        If error aata hai on 32,
        catch(IllegalStateException e){
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error",e.getMessage()));
        }
    }
}
