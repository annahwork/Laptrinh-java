package uth.edu.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import uth.edu.pojo.AllocatePartHistory;

public class AllocatePartHistoryDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public AllocatePartHistoryDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addAllocatePartHistory(AllocatePartHistory history) {
        Session session = null;
        Transaction tx = null;
        try {
            session = sessionFactory.openSession();
            tx = session.beginTransaction();
            session.persist(history);
            tx.commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (tx != null) tx.rollback();
        } finally {
            if (session != null) session.close();
        }
    }

    public void updateAllocatePartHistory(AllocatePartHistory history) {
        Session session = null;
        Transaction tx = null;
        try {
            session = sessionFactory.openSession();
            tx = session.beginTransaction();
            session.merge(history);
            tx.commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (tx != null) tx.rollback();
        } finally {
            if (session != null) session.close();
        }
    }

    public AllocatePartHistory getAllocatePartHistoryById(int id) {
        Session session = null;
        AllocatePartHistory history = null;
        try {
            session = sessionFactory.openSession();
            history = session.get(AllocatePartHistory.class, id);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return history;
    }

    public List<AllocatePartHistory> getAllAllocatePartHistories(int page, int pageSize) {
        Session session = null;
        List<AllocatePartHistory> histories = null;
        try {
            session = sessionFactory.openSession();
            histories = session.createQuery("FROM AllocatePartHistory ORDER BY allocationDate DESC", AllocatePartHistory.class)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        } finally {
            if (session != null) session.close();
        }
        return histories;
    }
    
    public List<AllocatePartHistory> getPendingAllocationsBySC(int scId, int page, int pageSize) {
        Session session = null;
        List<AllocatePartHistory> histories = null;
        try {
            session = sessionFactory.openSession();
            histories = session.createQuery(
                "FROM AllocatePartHistory a WHERE a.toInventory.ServiceCenter.SCID = :scId AND a.status = 'Pending'", 
                AllocatePartHistory.class)
                .setParameter("scId", scId)
                .setFirstResult((page - 1) * pageSize)
                .setMaxResults(pageSize)
                .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        } finally {
            if (session != null) session.close();
        }
        return histories;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}