package uth.edu.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import uth.edu.pojo.SCStaff;

public class SCStaffDAO {

    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public SCStaffDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addSCStaff(SCStaff staff) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(staff);
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

    public void updateSCStaff(SCStaff staff) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(staff);
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

    public void deleteSCStaff(SCStaff staff) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(staff);
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

    public SCStaff getSCStaffById(int id) {
        Session session = null;
        SCStaff staff = null;
        try {
            session = sessionFactory.openSession();
            staff = session.get(SCStaff.class, id);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return staff;
    }

    public List<SCStaff> getAllSCStaffs(int page, int pageSize) {
        Session session = null;
        List<SCStaff> staffList = null;
        try {
            session = sessionFactory.openSession();
            staffList = session.createQuery("FROM SCStaff", SCStaff.class)
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
        return staffList;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
