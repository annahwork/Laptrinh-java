package uth.edu.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import uth.edu.pojo.VehiclePart;

import java.util.List;

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
            parts = session.createQuery("FROM VehiclePart", VehiclePart.class)
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

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
