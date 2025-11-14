package uth.edu.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NotificationID")
    private Integer NotificationID;

    @Column(name = "Title", length = 200, columnDefinition = "NVARCHAR(200)")
    private String Title;

    @Column(name = "Message", length = 1000, columnDefinition = "NVARCHAR(1000)")
    private String Message;

    @Column(name = "IsRead")
    private boolean IsRead = false; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User Receiver;

    public Notification() {}

    public Notification(Integer NotificationID, String Title, String Message, User Receiver) {
        this.NotificationID = NotificationID;
        this.Title = Title;
        this.Message = Message;
        this.IsRead = false;
        this.Receiver = Receiver;
    }

    public Integer getNotificationID() {
        return NotificationID;
    }

    public void setNotificationID(Integer notificationID) {
        NotificationID = notificationID;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String title) {
        Title = title;
    }

    public String getMessage() {
        return Message;
    }

    public void setMessage(String message) {
        Message = message;
    }

    public boolean isIsRead() {
        return IsRead;
    }

    public void setIsRead(boolean isRead) {
        IsRead = isRead;
    }

    @JsonIgnore 
    public User getReceiver() {
        return Receiver;
    }

    public void setReceiver(User receiver) {
        Receiver = receiver;
    }

    public void markAsRead() { 
        this.IsRead = true; 
    }
    
}