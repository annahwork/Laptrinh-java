package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.dao.NotificationDAO;
import uth.edu.pojo.Notification;

@Repository
public class NotificationRepository implements INotificationRepository {

    private NotificationDAO NotificationDAO = null;

    public NotificationRepository() {
        NotificationDAO = new NotificationDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addNotification(Notification Notification) {
        NotificationDAO.addNotification(Notification);
    }

    @Override
    public void updateNotification(Notification Notification) {
        NotificationDAO.updateNotification(Notification);
    }

    @Override
    public void deleteNotification(Notification Notification) {
        NotificationDAO.deleteNotification(Notification);
    }

    @Override
    public Notification getNotificationById(int id) {
        return NotificationDAO.getNotificationById(id);
    }

    @Override
    public List<Notification> getAllNotifications(int page, int pageSize) {
        return NotificationDAO.getAllNotifications(page, pageSize);
    }
    @Override
    public List<Notification> getUnreadNotificationsByUserID(int userID, int page, int pageSize) {
        return NotificationDAO.getUnreadNotificationsByUserID(userID, page, pageSize);
    }
    @Override
    public List<Notification> getAllNotifications(Integer userID, int page, int pageSize) {
        return NotificationDAO.getAllNotifications(userID, page, pageSize);
    }
    @Override
    public boolean MarkAllNotificationsAsRead(Integer userID) {
        return NotificationDAO.markAllNotificationsAsRead(userID);
    }
    @Override
    public Notification getLatestNotification(int userID){
        return NotificationDAO.getLatestNotification(userID);
    }
    @Override
    public void closeResources() {
        NotificationDAO.closeSessionFactory();
    }
}
