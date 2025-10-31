package uth.edu.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import uth.edu.pojo.SCTechnician;

import java.util.List;

public class SCTechnicianDAO {

    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public SCTechnicianDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile); 
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addTechnician(SCTechnician technician) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(technician);
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

    public void updateTechnician(SCTechnician technician) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(technician);
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

    public void deleteTechnician(SCTechnician technician) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(technician);
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

    public SCTechnician getTechnicianById(int id) {
        Session session = null;
        SCTechnician technician = null;
        try {
            session = sessionFactory.openSession();
            technician = session.get(SCTechnician.class, id);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return technician;
    }

    public List<SCTechnician> getAllTechnicians(int page, int pageSize) {
        Session session = null;
        List<SCTechnician> technicians = null;
        try {
            session = sessionFactory.openSession();
            technicians = session.createQuery("FROM SCTechnician", SCTechnician.class)
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
        return technicians;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
