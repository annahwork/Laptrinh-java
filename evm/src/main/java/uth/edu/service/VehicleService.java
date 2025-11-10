package uth.edu.service;

import uth.edu.pojo.VehiclePart;
import uth.edu.pojo.WarrantyHistory;
import uth.edu.pojo.Vehicle;
import uth.edu.pojo.Customer;
import uth.edu.pojo.Part;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.User;
import uth.edu.repositories.VehiclePartRepository;
import uth.edu.repositories.VehicleRepository;
import uth.edu.repositories.CustomerRepository;
import uth.edu.repositories.PartRepository;
import uth.edu.repositories.SCStaffRepository;
import uth.edu.repositories.UserRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class VehicleService {

    private VehicleRepository vehicleRepository;
    private CustomerRepository customerRepository;
    private VehiclePartRepository vehiclePartRepository;
    private PartRepository partRepository;
    private SCStaffRepository scStaffRepository;
    private UserRepository userRepository;

    public VehicleService() {
        vehicleRepository = new VehicleRepository();
        customerRepository = new CustomerRepository();
        vehiclePartRepository = new VehiclePartRepository();
        partRepository = new PartRepository();
        scStaffRepository = new SCStaffRepository();
        userRepository = new UserRepository();
    }

    public boolean RegisterVehicle(Integer SCStaffID, Vehicle VehicleData, Customer CustomerData) {
        try {
            SCStaff staff = scStaffRepository.getSCStaffById(SCStaffID);
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
        try {
            SCStaff staff = scStaffRepository.getSCStaffById(SCStaffID);
            if (staff == null) 
                return false;

            Vehicle vehicle = vehicleRepository.getVehicleByVin(VIN);
            if (vehicle == null) 
                return false;

            Part part = partRepository.getPartById(PartId);
            if (part == null) 
                return false;

            User technician = userRepository.getUserById(SCTechnicianID);
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
        }
    }

    public List<Vehicle> GetVehicles() {
        try {
            return vehicleRepository.getAllVehicles(1, 20);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public Vehicle GetVehicleDetails(String VIN) {
        try {
            return vehicleRepository.getVehicleByVin(VIN);
        } catch (Exception e) {
            e.printStackTrace();
            return vehicleRepository.getVehicleByVin(VIN);
        }
    }

    public List<WarrantyHistory> GetVehicleHistory(String VIN) {
        try {
            return new ArrayList<>();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<Vehicle> GetCustomerVehicles(Integer CustomerId) {
        try {
            return new ArrayList<>();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public int countAllVehicles() {
        try {
            return vehicleRepository.countAllVehicles();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    
}
