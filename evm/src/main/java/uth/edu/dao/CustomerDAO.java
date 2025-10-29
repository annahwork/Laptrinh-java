package edu.vn.ev_wms.dao;

import edu.vn.ev_wms.pojo.Customer;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.List;

public class CustomerDAO {

    private static EntityManagerFactory entityManagerFactory;
    private static EntityManager entityManager;

    public CustomerDAO(String persistenceName) {
        entityManagerFactory = Persistence.createEntityManagerFactory(persistenceName);
    }

    public boolean save(Customer customer) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            entityManager.persist(customer);
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

    public boolean update(Customer customer) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            entityManager.merge(customer);
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

    public boolean delete(String customerID) {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            entityManager.getTransaction().begin();
            Customer customer = entityManager.find(Customer.class, customerID);
            if (customer != null) {
                entityManager.remove(customer);
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

    public Customer findById(String customerID) {
        Customer customer = null;
        try {
            entityManager = entityManagerFactory.createEntityManager();
            customer = entityManager.find(Customer.class, customerID);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
        return customer;
    }

    public List<Customer> findAll() {
        try {
            entityManager = entityManagerFactory.createEntityManager();
            return entityManager.createQuery("FROM Customer", Customer.class).getResultList();
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
