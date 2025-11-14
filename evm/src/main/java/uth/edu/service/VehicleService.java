package uth.edu.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uth.edu.pojo.Customer;
import uth.edu.pojo.Part;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.User;
import uth.edu.pojo.Vehicle;
import uth.edu.pojo.VehiclePart;
import uth.edu.pojo.WarrantyHistory;
import uth.edu.repositories.CustomerRepository;
import uth.edu.repositories.PartRepository;
import uth.edu.repositories.SCStaffRepository;
import uth.edu.repositories.UserRepository;
import uth.edu.repositories.VehiclePartRepository;
import uth.edu.repositories.VehicleRepository;

@Service
public class VehicleService {

    private VehicleRepository vehicleRepository;
    private CustomerRepository customerRepository;
    private VehiclePartRepository vehiclePartRepository;
    private PartRepository partRepository;
    private SCStaffRepository scStaffRepository;
    private UserRepository userRepository;

    @Autowired
    public VehicleService(VehicleRepository vehicleRepository, CustomerRepository customerRepository, VehiclePartRepository vehiclePartRepository, PartRepository partRepository, SCStaffRepository scStaffRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
        this.vehiclePartRepository = vehiclePartRepository;
        this.partRepository = partRepository;
        this.scStaffRepository = scStaffRepository;
        this.userRepository = userRepository;
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

    public List<VehiclePart> getVehicleParts(String query, int page, int pageSize) {
        try {
            if (query != null && !query.trim().isEmpty()) {
                return vehiclePartRepository.searchVehicleParts(query, page, pageSize);
            } else {
                return vehiclePartRepository.getAllVehicleParts(page, pageSize);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<User> getInstallers() {
        try {
            List<User> installers = new ArrayList<>();
            installers.addAll(userRepository.getUsersByRole("SC_TECHNICIAN"));
            installers.addAll(userRepository.getUsersByRole("EVM_STAFF"));
            return installers;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<Part> getAllParts() {
        try {
            return partRepository.getAllParts(1, 1000); 
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

    public List<VehiclePart> getWarrantyPartsForTechnician(int userID){
        try {
            return vehiclePartRepository.getWarrantyPartsForTechnician(userID, 1 , 9999);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
}
