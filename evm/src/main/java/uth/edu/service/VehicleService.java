package uth.edu.service;

import uth.edu.dao.*;
import uth.edu.pojo.*;
import uth.edu.repositories.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class VehicleService {

    private VehicleRepository vehicleRepository;
    private CustomerRepository customerRepository;
    private VehiclePartRepository vehiclePartRepository;
    private PartRepository partRepository;
    private SCStaffDAO scStaffDAO;
    private UserDAO userDAO;
    private SessionFactory sessionFactory;

    public VehicleService() {
        vehicleRepository = new VehicleRepository();
        customerRepository = new CustomerRepository();
        vehiclePartRepository = new VehiclePartRepository();
        partRepository = new PartRepository();
        scStaffDAO = new SCStaffDAO("Hibernate.cfg.xml");
        userDAO = new UserDAO("Hibernate.cfg.xml");

        Configuration configuration = new Configuration();
        configuration.configure("Hibernate.cfg.xml");
        sessionFactory = configuration.buildSessionFactory();
    }

    public boolean RegisterVehicle(Integer SCStaffID, Vehicle VehicleData, Customer CustomerData) {
        try {
            SCStaff staff = scStaffDAO.getSCStaffById(SCStaffID);
            if (staff == null) 
                return false;

            if (VehicleData == null || CustomerData == null) 
                return false;

            Vehicle existingVehicle = vehicleRepository.getVehicleByVin(VehicleData.getVIN());
            if (existingVehicle != null) 
                return false;

            Customer existingCustomer = null;
            if (CustomerData.getCustomerID() != null && CustomerData.getCustomerID() > 0) {
                existingCustomer = customerRepository.getCustomerById(CustomerData.getCustomerID());
            }

            if (existingCustomer == null) {
                customerRepository.addCustomer(CustomerData);
                existingCustomer = CustomerData;
            } else {
                existingCustomer.setName(CustomerData.getName());
                existingCustomer.setEmail(CustomerData.getEmail());
                existingCustomer.setPhone(CustomerData.getPhone());
                existingCustomer.setAddress(CustomerData.getAddress());
                customerRepository.updateCustomer(existingCustomer);
            }

            VehicleData.setCustomer(existingCustomer);
            vehicleRepository.addVehicle(VehicleData);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean AssignPartToVehicle(Integer SCStaffID, String VIN, Integer PartId,
                                       String SerialNumber, Date InstallDate, Integer SCTechnicianID) {
        Session session = null;
        try {
            SCStaff staff = scStaffDAO.getSCStaffById(SCStaffID);
            if (staff == null) 
                return false;

            Vehicle vehicle = vehicleRepository.getVehicleByVin(VIN);
            if (vehicle == null) 
                return false;

            Part part = partRepository.getPartById(PartId);
            if (part == null) 
                return false;

            User technician = userDAO.getUserById(SCTechnicianID);
            if (technician == null || !(technician instanceof SCTechnician)) 
                return false;

            VehiclePart vehiclePart = new VehiclePart(
                null,
                part,
                vehicle,
                SerialNumber,
                InstallDate,
                null,
                technician,
                "Installed"
            );

            vehiclePartRepository.addVehiclePart(vehiclePart);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            if (session != null) session.close();
        }
    }

    public List<Vehicle> GetVehicles() {
        try {
            return vehicleRepository.getAllVehicles(1, 1000);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public Vehicle GetVehicleDetails(String VIN) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            Vehicle vehicle = session.createQuery(
                "SELECT DISTINCT v FROM Vehicle v LEFT JOIN FETCH v.VehicleParts WHERE v.VIN = :vin",
                Vehicle.class)
                .setParameter("vin", VIN)
                .uniqueResult();

            if (vehicle == null) 
                return null;

            List<VehiclePart> parts = session.createQuery(
                "SELECT vp FROM VehiclePart vp WHERE vp.Vehicle.VIN = :vin",
                VehiclePart.class)
                .setParameter("vin", VIN)
                .getResultList();

            for (VehiclePart vp : parts) {
                vp.getPart();
                vp.getVehicle();
                vp.getSerialNumber();
                vp.getInstallDate();
                vp.getInstalledBy();
                vp.getStatus();
            }

            return vehicle;
        } catch (Exception e) {
            e.printStackTrace();
            return vehicleRepository.getVehicleByVin(VIN);
        } finally {
            if (session != null) session.close();
        }
    }

    public List<WarrantyHistory> GetVehicleHistory(String VIN) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            List<WarrantyHistory> historyList = session.createQuery(
                "SELECT wh FROM WarrantyHistory wh " +
                "JOIN wh.WarrantyClaim wc " +
                "JOIN wc.VehiclePart vp " +
                "JOIN vp.Vehicle v " +
                "WHERE v.VIN = :vin " +
                "ORDER BY wh.Date DESC",
                WarrantyHistory.class)
                .setParameter("vin", VIN)
                .getResultList();

            return historyList;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        } finally {
            if (session != null) session.close();
        }
    }

    public List<Vehicle> GetCustomerVehicles(Integer CustomerId) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            List<Vehicle> vehicles = session.createQuery(
                "SELECT v FROM Vehicle v WHERE v.Customer.CustomerID = :customerId",
                Vehicle.class)
                .setParameter("customerId", CustomerId)
                .getResultList();

            return vehicles;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        } finally {
            if (session != null) session.close();
        }
    }

    public void closeResources() {
        try {
            if (sessionFactory != null) sessionFactory.close();
            scStaffDAO.closeSessionFactory();
            userDAO.closeSessionFactory();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
