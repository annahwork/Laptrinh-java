package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.Notification;

@Repository
public interface INotificationRepository {
    public void addNotification(Notification Notification);
    public void updateNotification(Notification Notification);
    public void deleteNotification(Notification Notification);
    public Notification getNotificationById(int id);
    public List<Notification> getUnreadNotificationsByUserID(int userID, int page, int pageSize);
    public List<Notification> getAllNotifications(int page, int pageSize);
    public List<Notification> getAllNotifications(Integer UserID, int page, int pageSize);
    public boolean MarkAllNotificationsAsRead(Integer UserID);
    public Notification getLatestNotification(int UserID);
    public void closeResources();
}