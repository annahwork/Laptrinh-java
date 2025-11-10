package uth.edu.pojo;

import jakarta.persistence.*;

@Entity
@Table(name = "Notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NotificationID")
    private Integer NotificationID;

    @Column(name = "Title", length = 200)
    private String Title;

    @Column(name = "Message", length = 1000)
    private String Message;

    @Column(name = "IsRead")
    private boolean IsRead = false; // Mặc định là chưa đọc

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

    public void createNotification(String Title, String Message, User Receiver) {}
    public void updateNotification(String Title, String Message) {}
    public void deleteNotification() {}
    public void markAsRead() { this.IsRead = true; }

}