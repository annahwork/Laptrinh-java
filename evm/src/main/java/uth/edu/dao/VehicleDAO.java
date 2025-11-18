package uth.edu.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.mapping.Map;

import uth.edu.pojo.Vehicle;

public class VehicleDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public VehicleDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addVehicle(Vehicle vehicle) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(vehicle);
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

    public void updateVehicle(Vehicle vehicle) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(vehicle);
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

    public void deleteVehicle(Vehicle vehicle) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(vehicle);
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

    public Vehicle getVehicleByVin(String vin) {
    Session session = null;
    Vehicle vehicle = null;
    try {
        session = sessionFactory.openSession();
        
        String hql = "FROM Vehicle v JOIN FETCH v.customer WHERE v.VIN = :vin";
        vehicle = session.createQuery(hql, Vehicle.class)
                .setParameter("vin", vin)
                .uniqueResult();
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        if (session != null) session.close();
    }
    return vehicle;
}

    public List<Vehicle> getVehiclesByModel(String model, int page, int pageSize) {
        Session session = null;
        List<Vehicle> vehicles = null;
        try {
            session = sessionFactory.openSession();
            vehicles = session.createQuery("FROM Vehicle v WHERE v.Model = :model", Vehicle.class)
                    .setParameter("model", model)
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
        return vehicles;
    }

    public List<Map> getAllVehicles(int page, int pageSize) {
        Session session = null;
        List<Map> results = null;
        try {
            session = sessionFactory.openSession();
            
            String hql = "SELECT new map(v as vehicle, c.Name as customerName, c.Phone as customerPhone) FROM Vehicle v JOIN v.customer c ORDER BY v.VIN";           
            results = session.createQuery(hql, Map.class) 
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
        return results;
    }

    public int countAllVehicles() {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            Long count = (Long) session.createQuery("SELECT COUNT(v) FROM Vehicle v").uniqueResult();
            System.out.println("[VehicleDAO] countAllVehicles = " + count);
            return count.intValue();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        } finally {
            if (session != null) session.close();
        }
    }

    public int countVehiclesByStatus(String status) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            Long count = (Long) session.createQuery(
                    "SELECT COUNT(v) FROM Vehicle v WHERE v.Status = :status")
                    .setParameter("status", status)
                    .uniqueResult();
            return count.intValue();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        } finally {
            if (session != null) session.close();
        }
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}