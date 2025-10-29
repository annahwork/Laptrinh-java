package uth.edu.pojo;

import javax.persistence.*;

@Entity
@Table(name = "Admin")
public class Admin extends User {

    public Admin() {}

    public Admin(String UserName, String Password, String Name) {
        super(UserName, Password, Name);
    }

    public void manageUserAccounts() {

    }

    public void configureSystemSettings() {

    }
}