package uth.edu.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import uth.edu.pojo.RecallVehicle;

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
    public List<RecallVehicle> getRecallVehiclesByVIN(String vin, int page, int pageSize) {
        Session session = null;
        List<RecallVehicle> recallVehicles = null;
        try {
            session = sessionFactory.openSession();
            recallVehicles = session.createQuery("FROM RecallVehicle rv WHERE rv.vehicle.VIN = :vin", RecallVehicle.class)
                    .setParameter("vin", vin)
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
        return recallVehicles;
    }
    public List<RecallVehicle> getRecallVehiclesByCampaignID(Integer campaignID, int page, int pageSize) {
        Session session = null;
        List<RecallVehicle> recallVehicles = null;
        try {
            session = sessionFactory.openSession();
            recallVehicles = session.createQuery("FROM RecallVehicle rv WHERE rv.RecallCampaign.CampaignID = :campaignID", RecallVehicle.class)
                    .setParameter("campaignID", campaignID)
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
        return recallVehicles;
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

    public List<RecallVehicle> getAllRecallVehicles(int userID, int page, int pageSize) {
        Session session = null;
        List<RecallVehicle> recallVehicles = null;
        try {
            session = sessionFactory.openSession();
            String hql = "SELECT rv FROM RecallVehicle rv JOIN FETCH rv.RecallCampaign c JOIN FETCH c.CreatedByStaff cbs JOIN FETCH rv.vehicle v JOIN FETCH v.customer cust";
            
            recallVehicles = session.createQuery(hql, RecallVehicle.class)
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
        return recallVehicles;
    }

    public List<RecallVehicle> getRecall(int userID, int page, int pageSize) {
        Session session = null;
        List<RecallVehicle> vehicles = new ArrayList<>(); 

        try {
            session = sessionFactory.openSession();
            String hql = "SELECT rv FROM RecallVehicle rv JOIN FETCH rv.RecallCampaign c JOIN FETCH c.CreatedByStaff cbs JOIN FETCH rv.vehicle v JOIN FETCH v.customer cust WHERE cbs.UserID = :userID";

            vehicles = session.createQuery(hql, RecallVehicle.class)
                            .setParameter("userID", userID) 
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
        return vehicles;
    }

    public List<Object[]> getCampaignReportData(Integer userID, int page, int pageSize) {
        Session session = null;
        List<Object[]> reportData = new ArrayList<>();
        try {
            session = sessionFactory.openSession();
            String hql = "SELECT c.CampaignID, c.Name, c.Date, COUNT(rv.RecallVehicleID), SUM(CASE WHEN rv.Status = 'Completed' THEN 1 ELSE 0 END), SUM(CASE WHEN rv.Status = 'Đang xử lý' THEN 1 ELSE 0 END) FROM RecallVehicle rv JOIN rv.RecallCampaign c GROUP BY c.CampaignID, c.Name, c.Date";
            reportData = session.createQuery(hql, Object[].class)
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
        return reportData;
    }
    
    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
