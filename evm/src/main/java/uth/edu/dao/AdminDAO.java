package edu.vn.ev_wms.dao;

import edu.vn.ev_wms.pojo.Admin;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.List;

public class AdminDAO {

    private static EntityManagerFactory entityManagerFactory;
    private static EntityManager entityManager;

    public AdminDAO(String persistenceName) {
        entityManagerFactory = Persistence.createEntityManagerFactory(persistenceName);
    }

    public boolean save(Admin admin) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            entityManager.persist(admin);
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

    public boolean update(Admin admin) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            entityManager.merge(admin);
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

    public boolean delete(int adminID) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            Admin admin = entityManager.find(Admin.class, adminID);
            if (admin != null) {
                entityManager.remove(admin);
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

    public Admin findById(int adminID) {
        Admin admin = null;
        try {
            entityManager = entityManagerFactory.createEntityManager();
            admin = entityManager.find(Admin.class, adminID);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
        return admin;
    }

    public List<Admin> findAll() {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            return entityManager.createQuery("FROM Admin", Admin.class).getResultList();
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
