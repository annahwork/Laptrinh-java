package uth.edu.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import uth.edu.pojo.AllocatePartHistory;
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

    public int countInventoriesBySCID(int scId, String search, String type) {
        Session session = null;
        long count = 0;
        try {
            session = sessionFactory.openSession();

            StringBuilder hqlBuilder = new StringBuilder(
                    "SELECT count(i.id) " +
                            "FROM Inventory i " +
                            "JOIN i.Part p " +
                            "JOIN i.ServiceCenter s " +
                            "WHERE s.SCID = :scId");

            if (search != null && !search.trim().isEmpty()) {
                hqlBuilder.append(" AND p.Name LIKE :search");
            }

            if (type != null && !type.trim().isEmpty()) {
                hqlBuilder.append(" AND p.Type = :type");
            }

            org.hibernate.query.Query<Long> query = session.createQuery(hqlBuilder.toString(), Long.class);

            query.setParameter("scId", scId);

            if (search != null && !search.trim().isEmpty()) {
                query.setParameter("search", "%" + search + "%");
            }

            if (type != null && !type.trim().isEmpty()) {
                query.setParameter("type", type);
            }

            count = query.uniqueResult();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return (int) count;
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
            String hql = "FROM Inventory i JOIN FETCH i.Part JOIN FETCH i.ServiceCenter";
            inventories = session.createQuery(hql, Inventory.class)
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
            if (session != null)
                session.close();
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

    public List<Inventory> getAllInventoriesWithDetails(int page, int pageSize) {
        Session session = null;
        List<Inventory> inventories = null;
        try {
            session = sessionFactory.openSession();
            inventories = session.createQuery(
                    "FROM Inventory i JOIN FETCH i.Part JOIN FETCH i.ServiceCenter",
                    Inventory.class)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>(); // Sửa: Trả về list rỗng
        } finally {
            if (session != null)
                session.close();
        }
        return inventories;
    }

    public int countAllInventoriesWithFilters(String search, String type) {
        Session session = null;
        long count = 0;
        try {
            session = sessionFactory.openSession();

            StringBuilder hqlBuilder = new StringBuilder(
                    "SELECT count(i.id) " +
                            "FROM Inventory i " +
                            "JOIN i.Part p " +
                            "JOIN i.ServiceCenter s");

            List<String> conditions = new ArrayList<>();
            if (search != null && !search.trim().isEmpty()) {
                conditions.add("p.Name LIKE :search");
            }
            if (type != null && !type.trim().isEmpty()) {
                conditions.add("p.Type = :type");
            }

            if (!conditions.isEmpty()) {
                hqlBuilder.append(" WHERE ").append(String.join(" AND ", conditions));
            }

            org.hibernate.query.Query<Long> query = session.createQuery(hqlBuilder.toString(), Long.class);

            if (search != null && !search.trim().isEmpty()) {
                query.setParameter("search", "%" + search + "%");
            }
            if (type != null && !type.trim().isEmpty()) {
                query.setParameter("type", type);
            }

            count = query.uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null)
                session.close();
        }
        return (int) count;
    }

    public List<Inventory> getInventoriesBySCID(int scId, int page, int pageSize, String search, String type) {
        Session session = null;
        List<Inventory> inventories = null;
        try {
            session = sessionFactory.openSession();

            StringBuilder hqlBuilder = new StringBuilder(
                    "FROM Inventory i " +
                            "JOIN FETCH i.Part p " +
                            "JOIN FETCH i.ServiceCenter s " +
                            "WHERE s.SCID = :scId");

            if (search != null && !search.trim().isEmpty()) {
                hqlBuilder.append(" AND p.Name LIKE :search");
            }

            if (type != null && !type.trim().isEmpty()) {
                hqlBuilder.append(" AND p.Type = :type");
            }

            hqlBuilder.append(" ORDER BY p.Name ASC");

            org.hibernate.query.Query<Inventory> query = session.createQuery(hqlBuilder.toString(), Inventory.class);

            query.setParameter("scId", scId);

            if (search != null && !search.trim().isEmpty()) {
                query.setParameter("search", "%" + search + "%");
            }

            if (type != null && !type.trim().isEmpty()) {
                query.setParameter("type", type);
            }

            inventories = query.setFirstResult((page - 1) * pageSize)
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

    public List<Inventory> getAllInventoriesWithFilters(int page, int pageSize, String search, String type) {
        Session session = null;
        List<Inventory> inventories = null;
        try {
            session = sessionFactory.openSession();
            StringBuilder hqlBuilder = new StringBuilder(
                    "FROM Inventory i " +
                            "JOIN FETCH i.Part p " +
                            "JOIN FETCH i.ServiceCenter s"); // <--- Không có WHERE SCID

            // Xây dựng mệnh đề WHERE
            List<String> conditions = new ArrayList<>();
            if (search != null && !search.trim().isEmpty()) {
                conditions.add("p.Name LIKE :search");
            }
            if (type != null && !type.trim().isEmpty()) {
                conditions.add("p.Type = :type");
            }

            if (!conditions.isEmpty()) {
                hqlBuilder.append(" WHERE ").append(String.join(" AND ", conditions));
            }

            hqlBuilder.append(" ORDER BY p.Name ASC");

            org.hibernate.query.Query<Inventory> query = session.createQuery(hqlBuilder.toString(), Inventory.class);

            // Set tham số nếu có
            if (search != null && !search.trim().isEmpty()) {
                query.setParameter("search", "%" + search + "%");
            }
            if (type != null && !type.trim().isEmpty()) {
                query.setParameter("type", type);
            }

            inventories = query.setFirstResult((page - 1) * pageSize)
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

    public boolean approveAllocationTransaction(Inventory fromStock, Inventory toStock, AllocatePartHistory history) {
        Session session = null;
        Transaction tx = null;
        try {
            session = sessionFactory.openSession();
            tx = session.beginTransaction();

            session.merge(fromStock);
            session.merge(toStock);
            session.merge(history);

            tx.commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            if (tx != null)
                tx.rollback();
            return false;
        } finally {
            if (session != null)
                session.close();
        }
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
