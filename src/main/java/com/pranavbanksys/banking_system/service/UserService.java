package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
//    Used to access the user database
    private final UserDB userDB;

//    Registers and saves the data of the user in DB only if there is no same email
//    Takes Name, Email, Password, Phone Number
    public void registerUser(UserDetails userDetails){

//        In the user DB checks if the same email exists or not, if 'yes' throw error
        if(userDB.existsByuEmail(userDetails.getUEmail())){
            throw new IllegalStateException("Email Already taken, login");
        }

//        If no then this executes, where since it's a new account, the account balance is set to 'NULL'
        if(userDetails.getAccountBalance()==null){
            userDetails.setAccountBalance(0L);
        }

//        Save the data to the database
        userDB.save(userDetails);
    }

//    Used to check if the user already exists or not and if yes, then the password is right or wrong
    public UserDetails loginUser(String email, String password){

//        New UserDetails object, cuz have to find the email of a user
//        Value is null if email not found, if found give all the values of the user
        UserDetails user = userDB.findByuEmail(email);

//        If user=null, then not found in the DB
        if(user==null) throw new IllegalStateException("No user notfound");

//        If password does not match the entered password, then throw wrong password
        if(!user.getUPassword().equals(password)) throw new IllegalStateException("Wrong Password");

//        Return the user cause it exists by mail and the password is true
        return user;
    }
}
