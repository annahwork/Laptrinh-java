package uth.edu.pojo;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "Customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerID")
    private Integer CustomerID;

    @Column(name = "Name", nullable = false, length = 100)
    private String Name;

    @Column(name = "Email", length = 100)
    private String Email;

    @Column(name = "Phone", length = 20)
    private String Phone;

    @Column(name = "Address", length = 200)
    private String Address;

    @OneToMany(
            mappedBy = "customer",
            cascade = CascadeType.ALL, 
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<Vehicle> Vehicles = new ArrayList<>();

    @OneToMany(
            mappedBy = "Customer",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL
    )
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

    public void updateInfo() {

    }

    public void getVehicleList() {

    }

}
