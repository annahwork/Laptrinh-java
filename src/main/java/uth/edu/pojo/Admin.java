package uth.edu.pojo;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    public Admin() {}

    public Admin(String userName, String password, String name, String email, String phone) {
        super(userName, password, name, email, phone);
    }
    
}