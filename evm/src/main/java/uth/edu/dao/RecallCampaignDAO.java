package uth.edu.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import uth.edu.pojo.RecallCampaign;

import java.util.List;

public class RecallCampaignDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public RecallCampaignDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addRecallCampaign(RecallCampaign recallCampaign) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(recallCampaign);
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

    public void updateRecallCampaign(RecallCampaign recallCampaign) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(recallCampaign);
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

    public void deleteRecallCampaign(RecallCampaign recallCampaign) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(recallCampaign);
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

    public RecallCampaign getRecallCampaignById(int id) {
        Session session = null;
        RecallCampaign recallCampaign = null;
        try {
            session = sessionFactory.openSession();
            recallCampaign = session.get(RecallCampaign.class, id);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return recallCampaign;
    }

    public List<RecallCampaign> getAllRecallCampaigns(int page, int pageSize) {
        Session session = null;
        List<RecallCampaign> recallCampaigns = null;
        try {
            session = sessionFactory.openSession();
            recallCampaigns = session.createQuery("FROM RecallCampaign", RecallCampaign.class)
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
        return recallCampaigns;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
