package uth.edu.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import uth.edu.pojo.RecallVehicle;

import java.util.List;

public class RecallVehicleDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public RecallVehicleDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addRecallVehicle(RecallVehicle recallVehicle) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(recallVehicle);
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

    public void updateRecallVehicle(RecallVehicle recallVehicle) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(recallVehicle);
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

    public void deleteRecallVehicle(RecallVehicle recallVehicle) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(recallVehicle);
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

    public RecallVehicle getRecallVehicleById(int id) {
        Session session = null;
        RecallVehicle recallVehicle = null;
        try {
            session = sessionFactory.openSession();
            recallVehicle = session.get(RecallVehicle.class, id);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return recallVehicle;
    }

    public List<RecallVehicle> getAllRecallVehicles(int page, int pageSize) {
        Session session = null;
        List<RecallVehicle> recallVehicles = null;
        try {
            session = sessionFactory.openSession();
            recallVehicles = session.createQuery("FROM RecallVehicle", RecallVehicle.class)
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
        return recallVehicles;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
