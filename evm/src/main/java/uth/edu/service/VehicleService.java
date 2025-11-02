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

    /**
     * Đăng ký xe mới cho khách hàng
     * @param SCStaffID ID của SC Staff thực hiện đăng ký
     * @param VehicleData Thông tin xe cần đăng ký
     * @param CustomerData Thông tin khách hàng
     * @return true nếu đăng ký thành công, false nếu thất bại
     */
    public boolean RegisterVehicle(Integer SCStaffID, Vehicle VehicleData, Customer CustomerData) {
        try {
            // Kiểm tra SCStaff có tồn tại không
            SCStaff staff = scStaffDAO.getSCStaffById(SCStaffID);
            if (staff == null) {
                System.out.println("SCStaff không tồn tại hoặc không có quyền thực hiện thao tác này.");
                return false;
            }

            if (VehicleData == null || CustomerData == null) {
                System.out.println("Dữ liệu Vehicle hoặc Customer không hợp lệ.");
                return false;
            }

            // Kiểm tra VIN đã tồn tại chưa
            Vehicle existingVehicle = vehicleRepository.getVehicleByVin(VehicleData.getVIN());
            if (existingVehicle != null) {
                System.out.println("VIN đã tồn tại trong hệ thống.");
                return false;
            }

            // Kiểm tra Customer đã tồn tại chưa (dựa vào CustomerID hoặc Email)
            Customer existingCustomer = null;
            if (CustomerData.getCustomerID() != null && CustomerData.getCustomerID() > 0) {
                existingCustomer = customerRepository.getCustomerById(CustomerData.getCustomerID());
            }

            // Nếu Customer chưa tồn tại, tạo mới
            if (existingCustomer == null) {
                customerRepository.addCustomer(CustomerData);
                // Lấy lại Customer vừa tạo để có CustomerID
                // Cần query lại hoặc sử dụng getCustomerByEmail/Phone
                existingCustomer = CustomerData;
            } else {
                // Cập nhật thông tin Customer nếu cần
                existingCustomer.setName(CustomerData.getName());
                existingCustomer.setEmail(CustomerData.getEmail());
                existingCustomer.setPhone(CustomerData.getPhone());
                existingCustomer.setAddress(CustomerData.getAddress());
                customerRepository.updateCustomer(existingCustomer);
            }

            // Gán Customer cho Vehicle
            VehicleData.setCustomer(existingCustomer);

            // Đăng ký Vehicle
            vehicleRepository.addVehicle(VehicleData);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Gán linh kiện cho xe
     * @param SCStaffID ID của SC Staff thực hiện gán
     * @param VIN Số VIN của xe
     * @param PartId ID của linh kiện
     * @param SerialNumber Số serial của linh kiện
     * @param InstallDate Ngày lắp đặt
     * @param SCTechnicianID ID của SCTechnician thực hiện lắp đặt
     * @return true nếu gán thành công, false nếu thất bại
     */
    public boolean AssignPartToVehicle(Integer SCStaffID, String VIN, Integer PartId, 
                                       String SerialNumber, Date InstallDate, Integer SCTechnicianID) {
        Session session = null;
        try {
            // Kiểm tra SCStaff có tồn tại không
            SCStaff staff = scStaffDAO.getSCStaffById(SCStaffID);
            if (staff == null) {
                System.out.println("SCStaff không tồn tại hoặc không có quyền thực hiện thao tác này.");
                return false;
            }

            // Lấy Vehicle theo VIN
            Vehicle vehicle = vehicleRepository.getVehicleByVin(VIN);
            if (vehicle == null) {
                System.out.println("Không tìm thấy xe với VIN: " + VIN);
                return false;
            }

            // Lấy Part theo PartId
            Part part = partRepository.getPartById(PartId);
            if (part == null) {
                System.out.println("Không tìm thấy linh kiện với PartId: " + PartId);
                return false;
            }

            // Lấy SCTechnician (User) theo SCTechnicianID
            User technician = userDAO.getUserById(SCTechnicianID);
            if (technician == null || !(technician instanceof SCTechnician)) {
                System.out.println("SCTechnician không tồn tại với ID: " + SCTechnicianID);
                return false;
            }

            // Tạo VehiclePart mới sử dụng constructor
            VehiclePart vehiclePart = new VehiclePart(
                null,  // VehiclePartID sẽ được tự động generate
                part,
                vehicle,
                SerialNumber,
                InstallDate,
                null,  // RemoveDate - chưa có
                technician,
                "Installed"  // Status
            );

            // Lưu VehiclePart
            vehiclePartRepository.addVehiclePart(vehiclePart);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    /**
     * Lấy danh sách tất cả các xe
     * @return Danh sách các xe
     */
    public List<Vehicle> GetVehicles() {
        try {
            // Lấy tất cả vehicles (trang đầu, 1000 records)
            return vehicleRepository.getAllVehicles(1, 1000);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * Lấy chi tiết xe theo VIN, bao gồm danh sách VehicleParts
     * @param VIN Số VIN của xe
     * @return Vehicle với danh sách VehicleParts đã được load (nếu có getter trong Vehicle class)
     */
    public Vehicle GetVehicleDetails(String VIN) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            
            // Lấy Vehicle với VehicleParts bằng JOIN FETCH
            // HQL sẽ sử dụng field name "VehicleParts" trực tiếp
            // Lưu ý: Vehicle class cần có getter getVehicleParts() để truy cập collection sau khi trả về
            Vehicle vehicle = session.createQuery(
                "SELECT DISTINCT v FROM Vehicle v LEFT JOIN FETCH v.VehicleParts WHERE v.VIN = :vin", 
                Vehicle.class)
                .setParameter("vin", VIN)
                .uniqueResult();
            
            // Nếu không tìm thấy, trả về null
            if (vehicle == null) {
                return null;
            }
            
            // Query VehicleParts riêng để đảm bảo chúng được load
            // Collection trong Vehicle sẽ được populate tự động bởi Hibernate
            List<VehiclePart> parts = session.createQuery(
                "SELECT vp FROM VehiclePart vp WHERE vp.Vehicle.VIN = :vin",
                VehiclePart.class)
                .setParameter("vin", VIN)
                .getResultList();
            
            // Đảm bảo các VehiclePart được load với đầy đủ thông tin
            // Sử dụng getter của VehiclePart để verify dữ liệu đã load
            for (VehiclePart vp : parts) {
                // Sử dụng getter để trigger lazy loading nếu cần
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
            // Fallback: lấy vehicle thông thường (không có VehicleParts được load)
            return vehicleRepository.getVehicleByVin(VIN);
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    /**
     * Lấy lịch sử bảo hành của xe
     * @param VIN Số VIN của xe
     * @return Danh sách WarrantyHistory liên quan đến xe
     */
    public List<WarrantyHistory> GetVehicleHistory(String VIN) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            
            // Lấy tất cả WarrantyHistory thông qua VehiclePart và WarrantyClaim
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
            if (session != null) {
                session.close();
            }
        }
    }

    /**
     * Lấy danh sách xe của khách hàng
     * @param CustomerId ID của khách hàng
     * @return Danh sách các xe của khách hàng
     */
    public List<Vehicle> GetCustomerVehicles(Integer CustomerId) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            
            // Query vehicles theo CustomerID
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
            if (session != null) {
                session.close();
            }
        }
    }

    /**
     * Đóng tất cả session factories và giải phóng tài nguyên
     */
    public void closeResources() {
        try {
            if (sessionFactory != null) {
                sessionFactory.close();
            }
            scStaffDAO.closeSessionFactory();
            userDAO.closeSessionFactory();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

