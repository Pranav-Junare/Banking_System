package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.TransactionDB;
import com.pranavbanksys.banking_system.repo.TransactionDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class TransactionIdGen {

//    Creating an object of the database to access it in this script
    private final TransactionDB transactionDB;

//    Returns the transactionDetails object where a unique transaction id is generated
    public String createNewTransaction(){
//        String where the randomly generated transactionID will be stored
        String randomID;

//        Generates an unique id
        do{
            randomID=generateID();
        }
//        check if the id is unique or not, if not again the do loop
        while(transactionDB.existsByTransactionID(randomID));


//        Returns the object where it saves the transaction with transactionID
        return randomID;
    }

//    Method to generate the unique transactionID
    private String generateID(){

//        Base string, from this characters will be selected
        String chars="ABCDEFGHIJKLMNOPKQRSTUVWXYZ0123456789";

//        String Builder cuz normal string is immutable
        StringBuilder res=new StringBuilder();

//        Random object to use random
        Random random=new Random();

//        Loops over the base string 15 times
        for(int i = 0; i< 15; i++){

//            Random index selected from 0-36, since alphanumeric values
            int index= random.nextInt(chars.length());

//            Append the characters to the result string
            res.append(chars.charAt(index));
        }
//        returnn the string builder to string
        return res.toString();
    }

}

