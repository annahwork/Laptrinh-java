package uth.edu.pojo;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerID")
    private Integer CustomerID;

    @Column(name = "Name", nullable = false, length = 100, columnDefinition = "NVARCHAR(100)")
    private String Name;

    @Column(name = "Email", length = 100, columnDefinition = "NVARCHAR(100)")
    private String Email;

    @Column(name = "Phone", length = 20, columnDefinition = "NVARCHAR(20)")
    private String Phone;

    @Column(name = "Address", length = 200, columnDefinition = "NVARCHAR(200)")
    private String Address;

    @OneToMany(
            mappedBy = "customer",
            cascade = CascadeType.ALL, 
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<Vehicle> Vehicles = new ArrayList<>();

    @OneToMany(
            mappedBy = "Customer",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL
    )
    @JsonIgnore
    private List<Schedule> Schedules = new ArrayList<>();

    public Customer() {}

    public Customer(Integer CustomerID, String Name, String Email, String Phone, String Address) {
        this.CustomerID = CustomerID;
        this.Name = Name;
        this.Email = Email;
        this.Phone = Phone;
        this.Address = Address;
    }

    public Integer getCustomerID() {
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

    public void setCustomerID(Integer CustomerID) {
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

}
