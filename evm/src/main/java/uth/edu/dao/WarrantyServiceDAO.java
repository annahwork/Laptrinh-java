package edu.vn.ev_wms.dao;

import edu.vn.ev_wms.pojo.WarrantyService;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.List;

public class WarrantyServiceDAO {

    private static EntityManagerFactory entityManagerFactory;
    private static EntityManager entityManager;

    public WarrantyServiceDAO(String persistenceName) {
        entityManagerFactory = Persistence.createEntityManagerFactory(persistenceName);
    }

    public boolean save(WarrantyService service) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            entityManager.persist(service);
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

    public boolean update(WarrantyService service) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            entityManager.merge(service);
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

    public boolean delete(int serviceID) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            WarrantyService service = entityManager.find(WarrantyService.class, serviceID);
            if (service != null) {
                entityManager.remove(service);
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

    public WarrantyService findById(int serviceID) {
        WarrantyService service = null;
        try {
            entityManager = entityManagerFactory.createEntityManager();
            service = entityManager.find(WarrantyService.class, serviceID);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
        return service;
    }

    public List<WarrantyService> findAll() {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            return entityManager.createQuery("FROM WarrantyService", WarrantyService.class).getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
    }

    public List<WarrantyService> findByName(String name) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            return entityManager
                    .createQuery("FROM WarrantyService w WHERE w.Name = :name", WarrantyService.class)
                    .setParameter("name", name)
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
