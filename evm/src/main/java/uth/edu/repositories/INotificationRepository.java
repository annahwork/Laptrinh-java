package uth.edu.repositories;

import java.util.List;

import uth.edu.pojo.Notification;

public interface INotificationRepository {
    public void addNotification(Notification Notification);
    public void updateNotification(Notification Notification);
    public void deleteNotification(Notification Notification);
    public Notification getNotificationById(int id);
    public List<Notification> getUnreadNotificationsByUserID(int userID, int page, int pageSize);
    public java.util.List<Notification> getAllNotifications(int page, int pageSize);
    public void closeResources();
}