package uth.edu.dao;

import java.util.ArrayList;
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
            String hql = "FROM WarrantyClaim wc " +
                         "JOIN FETCH wc.vehicle v " +
                         "JOIN FETCH wc.VehiclePart vp " +
                         "JOIN FETCH vp.Part " +
                         "JOIN FETCH wc.CreatedByStaff " +
                         "WHERE wc.ClaimID = :claimId";
            claim = session.createQuery(hql, WarrantyClaim.class)
                           .setParameter("claimId", claimID)
                           .uniqueResult();
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
            String hql = "FROM WarrantyClaim wc " +
                         "JOIN FETCH wc.vehicle v " +
                         "LEFT JOIN FETCH wc.CreatedByStaff " +
                         "ORDER BY wc.Date DESC";
            claims = session.createQuery(hql, WarrantyClaim.class)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>(); // Trả về list rỗng
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
            // SỬA: Thêm JOIN FETCH
            String hql = "FROM WarrantyClaim wc " +
                         "JOIN FETCH wc.vehicle v " +
                         "JOIN FETCH wc.CreatedByStaff " +
                         "WHERE wc.Status = :status " +
                         "ORDER BY wc.Date ASC";
            claims = session.createQuery(hql, WarrantyClaim.class)
                    .setParameter("status", status)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>(); // Trả về list rỗng
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
            // SỬA: Thêm JOIN FETCH
            String hql = "FROM WarrantyClaim wc " +
                         "JOIN FETCH wc.vehicle v " +
                         "JOIN FETCH wc.CreatedByStaff s " +
                         "WHERE s.UserID = :userId " +
                         "ORDER BY wc.Date DESC";
            claims = session.createQuery(hql, WarrantyClaim.class)
                    .setParameter("userId", userID)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>(); // Trả về list rỗng
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
            String hql = "FROM WarrantyHistory wh " +
                         "JOIN FETCH wh.WarrantyClaim " +
                         "WHERE wh.WarrantyClaim.ClaimID = :claimId " +
                         "ORDER BY wh.Date ASC";
            historyList = session.createQuery(hql, WarrantyHistory.class)
                    .setParameter("claimId", claimId)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>(); // Trả về list rỗng
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
            String hql = "SELECT DISTINCT wc FROM WarrantyClaim wc " +
                         "JOIN FETCH wc.vehicle " +
                         "JOIN FETCH wc.CreatedByStaff " +
                         "LEFT JOIN FETCH wc.ClaimServices cs " +
                         "LEFT JOIN FETCH cs.warrantyService " +
                         "LEFT JOIN FETCH cs.technician " +
                         "WHERE wc.ClaimID = :claimId";
            claim = session.createQuery(hql, WarrantyClaim.class)
                    .setParameter("claimId", claimId)
                    .uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return claim;
    }

    public int countAllWarrantyClaims() {
        int total = 0;
        try (Session session = sessionFactory.openSession()) {
            Long count = (Long) session.createQuery("SELECT COUNT(wc) FROM WarrantyClaim wc").uniqueResult();
            total = count.intValue();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return total;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
