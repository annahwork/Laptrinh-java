package edu.vn.ev_wms;

public class Customer {
    
    String CustomerID;
    String Name;
    String Phone;
    String Address;
    String Email;

    public Customer(){}

    public Customer(String CustomerID, String Name, String Phone, String Address, String Email)
    {
        this.CustomerID = CustomerID;
        this.Name = Name;
        this.Phone = Phone;
        this.Address = Address;
        this.Email = Email;
    }

    public String getCustomerID(){
        return this.CustomerID;
    }

    public String getName(){
        return this.Name;
    }

    public String getPhone(){
        return this.Phone;
    }

    public String getAddress(){
        return this.Address;
    }

    public String getEmail(){
        return this.Email;
    }

    public void setCustomerID(String CustomerID){
        this.CustomerID = CustomerID;
    }

    public void setName(String Name){
        this.Name = Name;
    }

    public void setPhone(String Phone){
        this.Phone = Phone;
    }

    public void setAddress(String Address){
        this.Address = Address;
    }

    public void setEmail(String Email){
        this.Email = Email;
    }
    
    public void subbmitWarrantyClaim(){
    }
}
