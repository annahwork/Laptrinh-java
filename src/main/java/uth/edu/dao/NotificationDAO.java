package uth.edu.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import uth.edu.pojo.Notification;

public class NotificationDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public NotificationDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addNotification(Notification notification) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(notification);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()) {
                session.getTransaction().rollback();
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public void updateNotification(Notification notification) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(notification);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()) {
                session.getTransaction().rollback();
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public void deleteNotification(Notification notification) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(notification);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()) {
                session.getTransaction().rollback();
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public Notification getNotificationById(int id) {
        Session session = null;
        Notification notification = null;
        try {
            session = sessionFactory.openSession();
            notification = session.get(Notification.class, id);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return notification;
    }

    public List<Notification> getAllNotifications(int page, int pageSize) {
        Session session = null;
        List<Notification> notifications = null;
        try {
            session = sessionFactory.openSession();
            notifications = session.createQuery("FROM Notification", Notification.class)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return notifications;
    }

    public List<Notification> getAllNotifications(int userID,int page, int pageSize) {
        Session session = null;
        List<Notification> notifications = null;
        try {
            session = sessionFactory.openSession();
            notifications = session.createQuery("FROM Notification", Notification.class)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return notifications;
    }
    
    public List<Notification> getUnreadNotificationsByUserID(int userID, int page, int pageSize) {
        Session session = null;
        List<Notification> notifications = null;
        try {
            session = sessionFactory.openSession();
            notifications = session.createQuery(
                "FROM Notification n WHERE n.Receiver.UserID = :userId AND n.IsRead = false ORDER BY n.NotificationID DESC", 
                Notification.class)
                    .setParameter("userId", userID)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return notifications;
    }

    public boolean markAllNotificationsAsRead(int userID) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            
            int updatedCount = session.createQuery(
                "UPDATE Notification n SET n.isRead = true WHERE n.Receiver.UserID = :userId AND n.isRead = false")
                .setParameter("userId", userID)
                .executeUpdate();

            session.getTransaction().commit();
            return updatedCount > 0;
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()) {
                session.getTransaction().rollback();
            }
            return false;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public Notification getLatestNotification(int userID) {
        Session session = null;
        Notification latestNotification = null; 
        
        try {
            session = sessionFactory.openSession();
            String hql = "FROM Notification n WHERE n.Receiver.UserID = :userID ORDER BY n.NotificationID DESC";
            List<Notification> results = session.createQuery(hql, Notification.class)
                            .setParameter("userID", userID)
                            .setMaxResults(1) 
                            .list();                
            if (results != null && !results.isEmpty()) {
                latestNotification = results.get(0);
            }
        } catch (Exception e) {
            e.printStackTrace(); 
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return latestNotification;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
