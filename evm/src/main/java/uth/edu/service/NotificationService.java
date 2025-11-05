package uth.edu.service;

import java.util.ArrayList;
import java.util.List;

import uth.edu.pojo.Notification;
import uth.edu.pojo.User;
import uth.edu.repositories.NotificationRepository;
import uth.edu.repositories.UserRepository;

public class NotificationService {

    private NotificationRepository notificationRepository;
    private UserRepository userRepository; 

    private static final int DEFAULT_PAGE = 1;
    private static final int DEFAULT_PAGE_SIZE = 10;

    public NotificationService() {
        notificationRepository = new NotificationRepository();
        userRepository = new UserRepository();
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
            if (page <= 0) page = DEFAULT_PAGE;
            if (pageSize <= 0) pageSize = DEFAULT_PAGE_SIZE;

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

    public void closeResources() {
        try {
            notificationRepository.closeResources();
            userRepository.closeResources();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}