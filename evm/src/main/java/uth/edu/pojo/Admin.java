package edu.vn.ev_wms;

import javax.persistence.*;

@Entity
@Table(name = "Admin")
@Inheritance(strategy = InheritanceType.JOINED)
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