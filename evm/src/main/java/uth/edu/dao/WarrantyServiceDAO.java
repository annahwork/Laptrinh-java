package uth.edu.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import uth.edu.pojo.WarrantyService;
import java.util.List;

public class WarrantyServiceDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public WarrantyServiceDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addWarrantyService(WarrantyService service) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(service);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()){
                session.getTransaction().rollback();
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public void updateWarrantyService(WarrantyService service) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(service);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()){
                session.getTransaction().rollback();
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public void deleteWarrantyService(WarrantyService service) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(service);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()){
                session.getTransaction().rollback();
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public WarrantyService getWarrantyServiceById(int serviceID) {
        Session session = null;
        WarrantyService service = null;
        try {
            session = sessionFactory.openSession();
            service = session.get(WarrantyService.class, serviceID);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return service;
    }

    public List<WarrantyService> getAllWarrantyServices(int page, int pageSize) {
        Session session = null;
        List<WarrantyService> services = null;
        try {
            session = sessionFactory.openSession();
            services = session.createQuery("FROM WarrantyService", WarrantyService.class)
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
        return services;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null){
            sessionFactory.close();
        }
    }
}
