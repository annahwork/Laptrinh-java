package uth.edu.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction; 
import org.hibernate.cfg.Configuration;

import uth.edu.pojo.ServiceCenter; 

public class ServiceCenterDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public ServiceCenterDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addServiceCenter(ServiceCenter serviceCenter) {
        Session session = null;
        Transaction tx = null;
        try {
            session = sessionFactory.openSession();
            tx = session.beginTransaction();
            session.persist(serviceCenter);
            tx.commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (tx != null) tx.rollback();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public void updateServiceCenter(ServiceCenter serviceCenter) {
        Session session = null;
        Transaction tx = null;
        try {
            session = sessionFactory.openSession();
            tx = session.beginTransaction();
            session.merge(serviceCenter);
            tx.commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (tx != null) tx.rollback();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }


    public void deleteServiceCenter(ServiceCenter serviceCenter) {
        Session session = null;
        Transaction tx = null;
        try {
            session = sessionFactory.openSession();
            tx = session.beginTransaction();
            session.remove(serviceCenter);
            tx.commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (tx != null) tx.rollback();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public ServiceCenter getServiceCenterById(int id) {
        Session session = null;
        ServiceCenter serviceCenter = null;
        try {
            session = sessionFactory.openSession();
            serviceCenter = session.get(ServiceCenter.class, id);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return serviceCenter;
    }

    public List<ServiceCenter> getAllServiceCenters(int page, int pageSize) {
        Session session = null;
        List<ServiceCenter> serviceCenters = null;
        try {
            session = sessionFactory.openSession();
            serviceCenters = session.createQuery("FROM ServiceCenter", ServiceCenter.class)
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
        return serviceCenters;
    }
    public ServiceCenter getServiceCenterByType(String type) {
        Session session = null;
        ServiceCenter serviceCenter = null;
        try {
            session = sessionFactory.openSession();
            serviceCenter = session.createQuery("FROM ServiceCenter sc WHERE sc.Type = :type", ServiceCenter.class)
                    .setParameter("type", type)
                    .setMaxResults(1) 
                    .uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return serviceCenter;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}