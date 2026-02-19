package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

@Service
@RequiredArgsConstructor
public class SendMoneyService {

    private final UserDB userDB;

    public UserDetails doesExists(String email){
        UserDetails user=userDB.findByuEmail(email);
        if(user.getUEmail()==null) throw new IllegalStateException("No user found");
        return user;
    }
    @Transactional
    public void processTransaction(UserDetails sender, UserDetails receiver, int sendAmount ){
        if(sender.getAccountBalance()<sendAmount) throw new IllegalStateException( "Insufficient Funds");

        sender.setAccountBalance(sender.getAccountBalance()-sendAmount);
        receiver.setAccountBalance(receiver.getAccountBalance()+sendAmount);

        userDB.save(sender);
        userDB.save(receiver);
    }
}
