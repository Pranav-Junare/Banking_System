package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.SendMoneyService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SendMoney {

    private final SendMoneyService sendMoneyService;

    //    receiverDetails needs email to send them the money, to get their details
    @PostMapping("/sendMoney")
    public String moneyTransfer(@ModelAttribute UserDetails receiverDetails,int sendAmount, HttpSession session){
        try{

//            Using the session we created with the user, taki wahi jho login kiya hai uski details mile
            Object ses=session.getAttribute("currentUser");
            UserDetails sender=(UserDetails) ses;

//            If user is null just return this string, matlab log in nai kiya
            if(sender==null)throw new IllegalStateException("Not logged in");

//            Receiver user complete info, jayega sendMonyService k doesExists() methid mai, aur check karega if the user exists or not, if not tho error throw karega, if yes tho vo user ke every detail automatically aayegi from UserDetails parameter and UserDB
            UserDetails receiver=sendMoneyService.doesExists(receiverDetails.getUEmail());

//            Ye SendMoneyService.java file mai jayega aur transaction execute karega
            sendMoneyService.processTransaction(sender, receiver, sendAmount);

//            Ye bas show karega ke the transaction has worked and kita balance hai vo show karega
            return "Amount of ₹"+sendAmount+" sent successfully from "+sender.getUName()+" to "+receiver.getUName()+", current "+sender.getUName()+" has a balance of "+sender.getAccountBalance()+" and "+receiver.getUName()+" has a balance of "+receiver.getAccountBalance();

        }

//        If error aata hai on 32,
        catch(IllegalStateException e){
            return e.getMessage();
        }
    }
}
