package uth.edu.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import uth.edu.pojo.VehiclePart;

public class VehiclePartDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public VehiclePartDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addVehiclePart(VehiclePart vehiclePart) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(vehiclePart);
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

    public void updateVehiclePart(VehiclePart vehiclePart) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(vehiclePart);
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

    public void deleteVehiclePart(VehiclePart vehiclePart) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(vehiclePart);
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

    public VehiclePart getVehiclePartById(int vehiclePartID) {
        Session session = null;
        VehiclePart vehiclePart = null;
        try {
            session = sessionFactory.openSession();
            vehiclePart = session.get(VehiclePart.class, vehiclePartID);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return vehiclePart;
    }

    public List<VehiclePart> getAllVehicleParts(int page, int pageSize) {
        Session session = null;
        List<VehiclePart> parts = null;
        try {
            session = sessionFactory.openSession();
            String hql = "FROM VehiclePart vp " +
                         "JOIN FETCH vp.Part " +
                         "JOIN FETCH vp.vehicle " +
                         "JOIN FETCH vp.InstalledBy " +
                         "ORDER BY vp.InstallDate DESC";

            parts = session.createQuery(hql, VehiclePart.class)
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
        return parts;
    }
    public List<VehiclePart> searchVehicleParts(String query, int page, int pageSize) {
        Session session = null;
        List<VehiclePart> parts = null;
        try {
            session = sessionFactory.openSession();
            String hql = "FROM VehiclePart vp " +
                         "JOIN FETCH vp.Part p " +
                         "JOIN FETCH vp.vehicle v " +
                         "JOIN FETCH vp.InstalledBy u " +
                         "WHERE p.Name LIKE :query OR v.VIN LIKE :query OR vp.SerialNumber LIKE :query " +
                         "ORDER BY vp.InstallDate DESC";
            
            parts = session.createQuery(hql, VehiclePart.class)
                    .setParameter("query", "%" + query + "%")
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        } finally {
            if (session != null) session.close();
        }
        return parts;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
