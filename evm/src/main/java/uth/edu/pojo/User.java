package uth.edu.pojo;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

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
    private String UserName;

    @Column(name = "Password", nullable = false, length = 100)
    private String Password;

    @Column(name = "Name", nullable = false, length = 100)
    private String Name;

    @Column(name = "Email", length = 100)
    private String Email;

    @Column(name = "Phone", length = 20)
    private String Phone;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SCID") 
    private ServiceCenter ServiceCenter;

    @OneToMany(mappedBy = "Receiver", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Notification> Notifications = new ArrayList<>();

    public User() {
    }

    public User(String UserName, String Password, String Name) {
        this.UserName = UserName;
        this.Password = Password;
        this.Name = Name;
    }

    public int getUserID() {
        return this.UserID;
    }

    public String getUserName() {
        return this.UserName;
    }

    public String getPassword() {
        return this.Password;
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

    public ServiceCenter getServiceCenter() {
        return ServiceCenter;
    }

    public List<Notification> getNotifications() {
        return Notifications;
    }

    public void setUserID(int UserID) {
        this.UserID = UserID;
    }

    public void setUserName(String UserName) {
        this.UserName = UserName;
    }

    public void setPassword(String Password) {
        this.Password = Password;
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
    public void setServiceCenter(ServiceCenter serviceCenter) {
        this.ServiceCenter = serviceCenter;
    }
    public void setNotifications(List<Notification> notifications) {
        this.Notifications = notifications;
    }

    @Override
    public String toString() {
        return "User{" +
                "UserID=" + UserID +
                ", UserName='" + UserName + '\'' +
                ", Password='" + Password + '\'' +
                ", Name='" + Name + '\'' +
                ", Email='" + Email + '\'' +
                ", Phone='" + Phone + '\'' +
                '}';
    }
}
