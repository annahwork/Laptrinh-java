import javax.persistence.*;

@Entity
@Table(name = "Notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NotificationID")
    private Integer notificationID;

    @Column(name = "Title", length = 200)
    private String title;

    @Column(name = "Message", length = 1000)
    private String message;

    @Column(name = "IsRead")
    private boolean isRead = false; // Mặc định là chưa đọc

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User receiver;

    public Notification() {}

    public Notification(Integer notificationID, String title, String message, User receiver) {
        this.notificationID = notificationID;
        this.title = title;
        this.message = message;
        this.isRead = false;
        this.receiver = receiver;
    }

    public void createNotification(String title, String message, User receiver) {}
    public void updateNotification(String title, String message) {}
    public void deleteNotification() {}
    public void markAsRead() { this.isRead = true; }

}