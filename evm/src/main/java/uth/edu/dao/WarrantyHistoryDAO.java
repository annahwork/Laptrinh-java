package edu.vn.ev_wms.dao;

import edu.vn.ev_wms.pojo.WarrantyHistory;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.List;

public class WarrantyHistoryDAO {

    private static EntityManagerFactory entityManagerFactory;
    private static EntityManager entityManager;

    public WarrantyHistoryDAO(String persistenceName) {
        entityManagerFactory = Persistence.createEntityManagerFactory(persistenceName);
    }

    public boolean save(WarrantyHistory history) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            entityManager.persist(history);
            entityManager.getTransaction().commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            if (entityManager != null && entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
        return false;
    }

    public boolean update(WarrantyHistory history) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            entityManager.merge(history);
            entityManager.getTransaction().commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            if (entityManager != null && entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
        return false;
    }

    public boolean delete(int warrantyHistoryID) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            WarrantyHistory history = entityManager.find(WarrantyHistory.class, warrantyHistoryID);
            if (history != null) {
                entityManager.remove(history);
                entityManager.getTransaction().commit();
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            if (entityManager != null && entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
        return false;
    }

    public WarrantyHistory findById(int warrantyHistoryID) {
        WarrantyHistory history = null;
        try {
            entityManager = entityManagerFactory.createEntityManager();
            history = entityManager.find(WarrantyHistory.class, warrantyHistoryID);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
        return history;
    }

    public List<WarrantyHistory> findAll() {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            return entityManager.createQuery("FROM WarrantyHistory", WarrantyHistory.class).getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
    }

    public List<WarrantyHistory> findByClaimID(int claimID) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            return entityManager
                    .createQuery("FROM WarrantyHistory w WHERE w.ClaimID = :claimID", WarrantyHistory.class)
                    .setParameter("claimID", claimID)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
    }

    public void close() {
        if (entityManagerFactory != null) {
            entityManagerFactory.close();
        }
    }
}
