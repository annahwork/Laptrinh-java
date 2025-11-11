package uth.edu.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import uth.edu.pojo.ClaimService;
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

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
