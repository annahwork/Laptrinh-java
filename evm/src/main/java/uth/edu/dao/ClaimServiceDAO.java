package uth.edu.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.query.Query;

import uth.edu.pojo.ClaimService;

import java.util.ArrayList;
import java.util.List;

public class ClaimServiceDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public ClaimServiceDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addClaimService(ClaimService claimService) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(claimService);
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

    public void updateClaimService(ClaimService claimService) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(claimService);
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

    public void deleteClaimService(ClaimService claimService) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(claimService);
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

    public ClaimService getClaimServiceById(int id) {
        Session session = null;
        ClaimService claimService = null;
        try {
            session = sessionFactory.openSession();
            claimService = session.get(ClaimService.class, id);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return claimService;
    }

    public List<ClaimService> getAllClaimServices(int page, int pageSize) {
        Session session = null;
        List<ClaimService> claimServices = null;
        try {
            session = sessionFactory.openSession();
            claimServices = session.createQuery("FROM ClaimService", ClaimService.class)
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
        return claimServices;
    }

    public List<ClaimService> getAllClaimServices(int userID, int page, int pageSize) {
        Session session = null;
        List<ClaimService> claimServices = null;
        try {
            session = sessionFactory.openSession();
            claimServices = session.createQuery("SELECT cs FROM ClaimService cs JOIN FETCH cs.CreatedByStaff cbs WHERE cbs.UserID = :userId", ClaimService.class) 
                    .setParameter("userId", userID)
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
        return claimServices;
    }

    public String getFirstActiveTaskNote(int technicianId) {
        Session session = null;
        String note = null;
        try {
            session = sessionFactory.openSession();
            String hql = "SELECT cs.Note FROM ClaimService cs " + "WHERE cs.technician.UserID = :techId " ;
            
            note = session.createQuery(hql, String.class)
                          .setParameter("techId", technicianId)
                          .setMaxResults(1)
                          .uniqueResult();
                          
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return (note != null) ? note : "Sẵn sàng";
    }

    public String getFirstActiveTaskNoteForSCT(int userID) {
        Session session = null;
        String note = null;
        try {
            session = sessionFactory.openSession();
            Query<String> query = session.createQuery(
                "SELECT cs.Note FROM ClaimService cs WHERE cs.technician.UserID = :userId AND cs.Status = :activeStatus ORDER BY cs.Id ASC", String.class);
            
            note = query.setParameter("userId", userID)
                        .setParameter("activeStatus", "Active") 
                        .setMaxResults(1)
                        .uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return (note != null) ? note : "Sẵn sàng";
    }

    public List<Object[]> getClaimServiceDetails(int userID, int page, int pageSize) {
        Session session = null;
        List<Object[]> results = null;
        String hql = "SELECT cs.ClaimServID, v.VIN, c.Name, cs.Result, cs.Note FROM ClaimService cs JOIN cs.WarrantyClaim wc JOIN wc.vehicle v JOIN v.customer c JOIN cs.technician t WHERE t.UserID = :userID ORDER BY cs.ClaimServID DESC";

        try {
            session = sessionFactory.openSession();
            
            results = session.createQuery(hql, Object[].class)
                    .setParameter("userID", userID)
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
        return results;
    }

    public Long[] getPerformanceMetrics(int technicianId) {
        Session session = null;
        Long totalClaims = 0L;
        Long completedClaims = 0L;
        try {
            session = sessionFactory.openSession();
            String hqlTotal = "SELECT COUNT(cs.ClaimServID) FROM ClaimService cs WHERE cs.technician.UserID = :techId";
            
            totalClaims = session.createQuery(hqlTotal, Long.class)
                                .setParameter("techId", technicianId)
                                .uniqueResult();
            String hqlCompleted = "SELECT COUNT(cs.ClaimServID) FROM ClaimService cs WHERE cs.technician.UserID = :techId AND ((cs.Result IS NOT NULL AND cs.Result != '') OR LOWER(cs.Result) = 'hoàn thành')"; 

            completedClaims = session.createQuery(hqlCompleted, Long.class)
                                    .setParameter("techId", technicianId)
                                    .uniqueResult();                 
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        if (totalClaims == null) 
            totalClaims = 0L;
        if (completedClaims == null) 
            completedClaims = 0L;

        return new Long[]{totalClaims, completedClaims};
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
