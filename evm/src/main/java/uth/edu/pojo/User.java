package uth.edu.pojo;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.Expose;

@Entity
@Table(name = "User_Table")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "User_Role", discriminatorType = DiscriminatorType.STRING)
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Integer UserID;

    @Column(name = "UserName", nullable = false, unique = true, length = 50)
    private String userName;

    @Column(name = "Password", nullable = false, length = 100)
    private String password;

    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Column(name = "Email", length = 100)
    private String email;

    @Column(name = "Phone", length = 20)
    private String phone;
    
    @Expose
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SCID") 
    private ServiceCenter serviceCenter;

    @Expose
    @OneToMany(mappedBy = "Receiver", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Notification> notifications = new ArrayList<>();

    public User() {
    }

    public User(String UserName, String Password, String Name, String Email, String Phone) {
        this.userName = UserName;
        this.password = Password;
        this.name = Name;
        this.email = Email;
        this.phone = Phone;
    }

    public Integer getUserID() {
        return this.UserID;
    }

    public String getUserName() {
        return this.userName;
    }

    public String getPassword() {
        return this.password;
    }

    public String getName() {
        return this.name;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPhone() {
        return this.phone;
    }

    @JsonIgnore 
    public ServiceCenter getServiceCenter() {
        return serviceCenter;
    }

    @JsonIgnore
    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setUserID(Integer UserID) {
        this.UserID = UserID;
    }

    public void setUserName(String UserName) {
        this.userName = UserName;
    }

    public void setPassword(String Password) {
        this.password = Password;
    }

    public void setName(String Name) {
        this.name = Name;
    }

    public void setEmail(String Email) {
        this.email = Email;
    }

    public void setPhone(String Phone) {
        this.phone = Phone;
    }
    public void setServiceCenter(ServiceCenter serviceCenter) {
        this.serviceCenter = serviceCenter;
    }
    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    @Transient
    @JsonProperty("User_Role")
    public String getUser_Role() {
        if (this instanceof Admin) return "ADMIN";
        if (this instanceof SCStaff) return "SC_STAFF";
        if (this instanceof SCTechnician) return "SC_TECHNICIAN";
        if (this instanceof EVMStaff) return "EVM_STAFF";
        return "UNKNOWN";
    }

    @Override
    public String toString() {
        return "User{" +
                "UserID=" + UserID +
                ", UserName='" + userName + '\'' +
                ", Password='" + password + '\'' +
                ", Name='" + name + '\'' +
                ", Email='" + email + '\'' +
                ", Phone='" + phone + '\'' +
                '}';
    }
}