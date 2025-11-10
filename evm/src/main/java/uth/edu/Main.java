package uth.edu;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import uth.edu.dao.UserDAO;
import uth.edu.pojo.*;
import uth.edu.repositories.AdminRepository;
import uth.edu.repositories.SCTechnicianRepository;
import uth.edu.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;

import uth.edu.service.UserService;

public class Main {

    public static void main(String[] args) {
        SessionFactory sessionFactory = null;
        Session session = null;
        Transaction tx = null;
        /* 
        try {
            // Nạp cấu hình Hibernate
            Configuration config = new Configuration();
            config.configure("Hibernate.cfg.xml");

            // Khởi tạo SessionFactory
            System.out.println("Đang khởi tạo SessionFactory và kết nối đến CSDL...");
            sessionFactory = config.buildSessionFactory();

            // Mở session và bắt đầu transaction
            session = sessionFactory.openSession();
            tx = session.beginTransaction();

            System.out.println("Đang thêm dữ liệu mẫu vào CSDL...");

            // Tạo danh sách người dùng mẫu
            List<User> users = new ArrayList<>();

            // --- Admin (2 người) ---
            users.add(new Admin("admin_master", "123456", "Super Admin"));
            users.add(new Admin("admin_support", "123456", "Support Admin"));

            // --- EVM Staff (5 người) ---
            users.add(new EVMStaff("evm_admin", "123456", "Nguyễn Văn A"));
            users.add(new EVMStaff("evm_staff2", "123456", "Trần Thị B"));
            users.add(new EVMStaff("evm_staff3", "123456", "Lê Văn C"));
            users.add(new EVMStaff("evm_staff4", "123456", "Phạm Hoàng D"));
            users.add(new EVMStaff("evm_staff5", "123456", "Ngô Minh E"));

            // --- SC Staff (7 người) ---
            users.add(new SCStaff("sc_staff1", "123456", "Manufacturer01", "Trần Thị F", "sc.f@example.com"));
            users.add(new SCStaff("sc_staff2", "123456", "Manufacturer02", "Lê Văn G", "sc.g@example.com"));
            users.add(new SCStaff("sc_staff3", "123456", "Manufacturer03", "Nguyễn Hữu H", "sc.h@example.com"));
            users.add(new SCStaff("sc_staff4", "123456", "Manufacturer04", "Phan Minh I", "sc.i@example.com"));
            users.add(new SCStaff("sc_staff5", "123456", "Manufacturer05", "Trịnh Văn J", "sc.j@example.com"));
            users.add(new SCStaff("sc_staff6", "123456", "Manufacturer06", "Võ Thị K", "sc.k@example.com"));
            users.add(new SCStaff("sc_staff7", "123456", "Manufacturer07", "Đặng Quang L", "sc.l@example.com"));

            // --- SC Technician (6 người) ---
            users.add(new SCTechnician("tech01", "123456", "Nguyễn Thanh N"));
            users.add(new SCTechnician("tech02", "123456", "Phan Anh O"));
            users.add(new SCTechnician("tech03", "123456", "Trần Văn P"));
            users.add(new SCTechnician("tech04", "123456", "Lê Minh Q"));
            users.add(new SCTechnician("tech05", "123456", "Ngô Quốc R"));
            users.add(new SCTechnician("tech06", "123456", "Phạm Mỹ S"));

            // Gán email + phone tự động
            int counter = 1;
            for (User u : users) {
                u.setEmail("user" + counter + "@example.com");
                u.setPhone("090" + String.format("%07d", counter));
                counter++;
                session.persist(u);
            }

            // Commit giao dịch
            tx.commit();

            System.out.println("-------------------------------------------------");
            System.out.println("THÀNH CÔNG!");
            System.out.println("Đã thêm " + users.size() + " người dùng mẫu (bao gồm Admin).");
            System.out.println("-------------------------------------------------");

        } catch (Exception e) {
            System.err.println("!!! LỖI: Không thể khởi tạo hoặc thêm dữ liệu !!!");
            e.printStackTrace();
            if (tx != null) tx.rollback();
        } finally {
            // Đóng kết nối
            if (session != null) session.close();
            if (sessionFactory != null) {
                sessionFactory.close();
                System.out.println("SessionFactory đã đóng.");
            }
        }
        */
        try {
            Configuration config = new Configuration();
            config.configure("Hibernate.cfg.xml");
            sessionFactory = config.buildSessionFactory();
            session = sessionFactory.openSession();
            tx = session.beginTransaction();

            System.out.println("Đang thêm dữ liệu mẫu cho bảng Vehicle...");

            List<Customer> customers = new ArrayList<>();
            List<Vehicle> vehicles = new ArrayList<>();

            // 1️⃣ Tạo khách hàng mẫu (5 khách)
            for (int i = 1; i <= 5; i++) {
                Customer c = new Customer();
                c.setName("Customer " + i);
                c.setEmail("customer" + i + "@example.com");
                c.setPhone("091" + String.format("%07d", i));
                c.setAddress("Address " + i);
                session.persist(c);
                customers.add(c);
            }

            // Tạo 25 xe mẫu, gán cho khách hàng ngẫu nhiên
            String[] models = {"Tesla Model S", "Nissan Leaf", "BMW i3", "Hyundai Kona", "Audi e-tron"};
            String[] statusArr = {"Active", "Charging", "Maintenance", "Inactive"};

            for (int i = 1; i <= 25; i++) {
                Customer assignedCustomer = customers.get(i % customers.size());
                String vin = "VIN" + String.format("%05d", i);

                Vehicle v = new Vehicle();
                v.setVIN(vin);
                v.setCustomer(assignedCustomer);
                v.setModel(models[i % models.length]);
                v.setYear_Of_Manufacture(2020 + (i % 4));
                v.setWarranty_Time("3 years");
                v.setStatus(statusArr[i % statusArr.length]);

                session.persist(v);
                vehicles.add(v);
            }

            tx.commit();
            System.out.println("-------------------------------------------------");
            System.out.println("THÀNH CÔNG!");
            System.out.println("Đã thêm " + vehicles.size() + " xe mẫu.");
            System.out.println("-------------------------------------------------");

        } catch (Exception e) {
            e.printStackTrace();
            if (tx != null) tx.rollback();
        } finally {
            if (session != null) session.close();
            if (sessionFactory != null) sessionFactory.close();
        }
    }

}
