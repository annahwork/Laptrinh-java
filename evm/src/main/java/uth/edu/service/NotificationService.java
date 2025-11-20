package uth.edu.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uth.edu.pojo.Notification;
import uth.edu.pojo.User;
import uth.edu.repositories.NotificationRepository;
import uth.edu.repositories.UserRepository;

@Service
public class NotificationService {

    private NotificationRepository notificationRepository;
    private UserRepository userRepository;

    private static final int DEFAULT_PAGE = 1;
    private static final int DEFAULT_PAGE_SIZE = 10;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public boolean CreateNotification(Integer UserID, String Title, String Message) {
        try {
            User receiver = userRepository.getUserById(UserID);
            if (receiver == null) {
                return false;
            }

            Notification notification = new Notification(null, Title, Message, receiver);

            notificationRepository.addNotification(notification);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Notification> GetUnreadNotifications(Integer UserID, int page, int pageSize) {
        try {
            if (page <= 0)
                page = DEFAULT_PAGE;
            if (pageSize <= 0)
                pageSize = DEFAULT_PAGE_SIZE;

            return notificationRepository.getUnreadNotificationsByUserID(UserID, page, pageSize);

        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public boolean MarkNotificationAsRead(Integer NotificationID) {
        try {
            Notification notification = notificationRepository.getNotificationById(NotificationID);
            if (notification == null) {
                return false;
            }
            notification.markAsRead();
            notificationRepository.updateNotification(notification);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean MarkAllNotificationsAsRead(Integer userID) {
        try {
            return notificationRepository.MarkAllNotificationsAsRead(userID);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteNotification(Integer notificationID) {
        Notification notification = getNotificationById(notificationID);
        if (notification != null) {
            notificationRepository.deleteNotification(notification);
            return true;
        }
        return false;
    }

    public Notification getNotificationById(Integer notificationID) {
        return notificationRepository.getNotificationById(notificationID);
    }

    public List<Notification> GetNotifications(Integer userID) {
        try {
            return notificationRepository.getAllNotifications(userID, 1, 9999);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public Notification getLatestNotification(Integer userID) {
        try {
            return notificationRepository.getLatestNotification(userID);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean updateNotification(Integer notificationID, String title, String message) {
        try {
            Notification notification = notificationRepository.getNotificationById(notificationID);
            if (notification == null) {
                return false;
            }

            notification.setTitle(title);
            notification.setMessage(message);
            notificationRepository.updateNotification(notification);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void closeResources() {
        try {
            notificationRepository.closeResources();
            userRepository.closeResources();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // thêm hàm updateNotification ở đây
    public boolean updateNotification(Integer notificationID, String title, String message) {
        try {
            // 1. Tìm thông báo cũ
            Notification notification = notificationRepository.getNotificationById(notificationID);
            if (notification == null) {
                return false; // Không tìm thấy
            }

            // 2. Đập data mới vào
            notification.setTitle(title);
            notification.setMessage(message);
            // (M có thể set IsRead = false nếu muốn)

            // 3. Gọi Repo (M phải tự thêm hàm này bên DAO)
            notificationRepository.updateNotification(notification);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}