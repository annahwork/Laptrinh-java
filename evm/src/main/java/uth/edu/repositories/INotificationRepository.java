package uth.edu.repositories;

public interface INotificationRepository {
    public void addNotification(uth.edu.pojo.Notification Notification);
    public void updateNotification(uth.edu.pojo.Notification Notification);
    public void deleteNotification(uth.edu.pojo.Notification Notification);
    public uth.edu.pojo.Notification getNotificationById(int id);
    public java.util.List<uth.edu.pojo.Notification> getAllNotifications(int page, int pageSize);
}