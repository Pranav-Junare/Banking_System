package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.TransactionDB;
import com.pranavbanksys.banking_system.repo.TransactionDetails;
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

//    Accessing all the required files
    private final UserDB userDB;
    private final TransactionDB transactionDB;
    private final TransactionIdGen transactionIdGen;

//    Finds if the user even exists or not?
    public UserDetails doesExists(String email){
        UserDetails user=userDB.findByuEmail(email);

//        If email==null error
        if(user.getUEmail()==null) throw new IllegalStateException("No user found");

//        If not return user
        return user;
    }

//    Executes it as 1 block
    @Transactional
//    Receives the sender, receiver details and the amount to send
    public void processTransaction(UserDetails sender, UserDetails receiver, int sendAmount ){

//        If balance is lower than the send amount return error
        if(sender.getAccountBalance()<sendAmount) throw new IllegalStateException( "Insufficient Funds");

//        TransactionDetails object
        TransactionDetails transactionDetails=new TransactionDetails();

//        Setting everything of the transactionDetails
        transactionDetails.setTransactionID(transactionIdGen.createNewTransaction());
        transactionDetails.setFromUser(sender.getUEmail());
        transactionDetails.setToUser(receiver.getUEmail());
        transactionDetails.setAmount((long)sendAmount);

//        Setting the sender and receiver balance
        sender.setAccountBalance(sender.getAccountBalance()-sendAmount);
        receiver.setAccountBalance(receiver.getAccountBalance()+sendAmount);

//        Saving everything to the DB
        userDB.save(sender);
        userDB.save(receiver);

        transactionDB.save(transactionDetails);
    }
}
