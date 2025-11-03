package uth.edu.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import uth.edu.pojo.WarrantyClaim;
import uth.edu.pojo.WarrantyHistory;
public class WarrantyClaimDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public WarrantyClaimDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public boolean addWarrantyClaim(WarrantyClaim claim, WarrantyHistory history) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(claim);
            session.flush();
            history.setWarrantyClaim(claim);
            session.persist(history);
            session.getTransaction().commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()) {
                session.getTransaction().rollback();
                return false;
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return true;
    }

    public boolean updateWarrantyClaim(WarrantyClaim claim, WarrantyHistory history) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(claim);
            history.setWarrantyClaim(claim);
            session.persist(history);
            session.getTransaction().commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()) {
                session.getTransaction().rollback();
                return false;
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return true;
    }

    public boolean deleteWarrantyClaim(WarrantyClaim claim) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(claim);
            session.getTransaction().commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()) {
                session.getTransaction().rollback();
                return false;  
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return true;
    }

    public WarrantyClaim getWarrantyClaimById(int claimID) {
        Session session = null;
        WarrantyClaim claim = null;
        try {
            session = sessionFactory.openSession();
            claim = session.get(WarrantyClaim.class, claimID);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return claim;
    }

    public List<WarrantyClaim> getAllWarrantyClaims(int page, int pageSize) {
        Session session = null;
        List<WarrantyClaim> claims = null;
        try {
            session = sessionFactory.openSession();
            claims = session.createQuery("FROM WarrantyClaim", WarrantyClaim.class)
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
        return claims;
    }
    public List<WarrantyClaim> getClaimsByStatus(String status, int page, int pageSize) {
        Session session = null;
        List<WarrantyClaim> claims = null;
        try {
            session = sessionFactory.openSession();

            claims = session.createQuery("FROM WarrantyClaim wc WHERE wc.Status = :status ORDER BY wc.Date ASC", WarrantyClaim.class)
                    .setParameter("status", status)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return claims;
    }

    public List<WarrantyClaim> getClaimsByUserID(Integer userID, int page, int pageSize) {
        Session session = null;
        List<WarrantyClaim> claims = null;
        try {
            session = sessionFactory.openSession();
            claims = session.createQuery("FROM WarrantyClaim wc WHERE wc.CreatedByStaff.UserID = :userId ORDER BY wc.Date DESC", WarrantyClaim.class)
                    .setParameter("userId", userID)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return claims;
    }

    public List<WarrantyHistory> getHistoryByClaimId(Integer claimId, int page, int pageSize) {
        Session session = null;
        List<WarrantyHistory> historyList = null;
        try {
            session = sessionFactory.openSession();
            historyList = session.createQuery(
                            "SELECT wh FROM WarrantyHistory wh WHERE wh.WarrantyClaim.ClaimID = :claimId ORDER BY wh.date ASC", WarrantyHistory.class)
                    .setParameter("claimId", claimId)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return historyList;
    }

    public WarrantyClaim getClaimDetailsById(Integer claimId) {
        Session session = null;
        WarrantyClaim claim = null;
        try {
            session = sessionFactory.openSession();
            claim = session.createQuery(
                            "SELECT DISTINCT wc FROM WarrantyClaim wc LEFT JOIN FETCH wc.ClaimServices cs LEFT JOIN FETCH cs.warrantyService LEFT JOIN FETCH cs.technician WHERE wc.ClaimID = :claimId", WarrantyClaim.class)
                    .setParameter("claimId", claimId)
                    .uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return claim;
    }
    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
