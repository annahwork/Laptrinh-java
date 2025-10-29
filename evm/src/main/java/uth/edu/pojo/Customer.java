package edu.vn.ev_wms;

import javax.persistence.*;

@Entity
@Table(name = "Customer")
public class Customer {

    @Id
    @Column(name = "CustomerID", length = 50)
    private String CustomerID;

    @Column(nullable = false, length = 100)
    private String Name;

    @Column(length = 100)
    private String Email;

    @Column(length = 20)
    private String Phone;

    @Column(length = 200)
    private String Address;

    public Customer() {}

    public Customer(String CustomerID, String Name, String Email, String Phone, String Address) {
        this.CustomerID = CustomerID;
        this.Name = Name;
        this.Email = Email;
        this.Phone = Phone;
        this.Address = Address;
    }

    public String getCustomerID() {
        return this.CustomerID;
    }

    public String getName() {
        return this.Name;
    }

    public String getEmail() {
        return this.Email;
    }

    public String getPhone() {
        return this.Phone;
    }

    public String getAddress() {
        return this.Address;
    }

    public void setCustomerID(String CustomerID) {
        this.CustomerID = CustomerID;
    }

    public void setName(String Name) {
        this.Name = Name;
    }

    public void setEmail(String Email) {
        this.Email = Email;
    }

    public void setPhone(String Phone) {
        this.Phone = Phone;
    }

    public void setAddress(String Address) {
        this.Address = Address;
    }

    public void updateInfo() {

    }

    public void getVehicleList() {

    }

}
