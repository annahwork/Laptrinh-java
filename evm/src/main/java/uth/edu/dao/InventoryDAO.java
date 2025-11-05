package uth.edu.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import uth.edu.pojo.Inventory;

public class InventoryDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public InventoryDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addInventory(Inventory inventory) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(inventory);
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

    public void updateInventory(Inventory inventory) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(inventory);
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

    public void deleteInventory(Inventory inventory) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(inventory);
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

    public Inventory getInventoryById(int id) {
        Session session = null;
        Inventory inventory = null;
        try {
            session = sessionFactory.openSession();
            inventory = session.get(Inventory.class, id);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return inventory;
    }

    public List<Inventory> getAllInventories(int page, int pageSize) {
        Session session = null;
        List<Inventory> inventories = null;
        try {
            session = sessionFactory.openSession();
            inventories = session.createQuery("FROM Inventory", Inventory.class)
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
        return inventories;
    }
    
    public Inventory getInventoryByPartAndSC(Integer partId, Integer scId) {
        Session session = null;
        Inventory inventory = null;
        try {
            session = sessionFactory.openSession();
            inventory = session.createQuery(
                "FROM Inventory i WHERE i.Part.PartID = :partId AND i.ServiceCenter.SCID = :scId", 
                Inventory.class)
                .setParameter("partId", partId)
                .setParameter("scId", scId)
                .uniqueResult(); 
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return inventory;
    }
    public List<Inventory> getInventoriesByPartID(Integer partId, int page, int pageSize) {
        Session session = null;
        List<Inventory> inventories = null;
        try {
            session = sessionFactory.openSession();
            inventories = session.createQuery("FROM Inventory i WHERE i.Part.PartID = :partId", Inventory.class)
                    .setParameter("partId", partId)
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
        return inventories;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
