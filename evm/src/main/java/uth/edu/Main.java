package uth.edu;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import uth.edu.pojo.Admin;
import uth.edu.pojo.AllocatePartHistory;
import uth.edu.pojo.ClaimService;
import uth.edu.pojo.Customer;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.Inventory;
import uth.edu.pojo.Notification;
import uth.edu.pojo.Part;
import uth.edu.pojo.RecallCampaign;
import uth.edu.pojo.RecallVehicle;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.Schedule;
import uth.edu.pojo.ServiceCenter;
import uth.edu.pojo.User;
import uth.edu.pojo.Vehicle;
import uth.edu.pojo.VehiclePart;
import uth.edu.pojo.WarrantyClaim;
import uth.edu.pojo.WarrantyHistory;
import uth.edu.pojo.WarrantyService;
import uth.edu.repositories.UserRepository;

public class Main {

        private static final String ST_CHO_DUYET = "Chờ duyệt";
        private static final String ST_DANG_CHAY = "Đang chạy";
        private static final String ST_HOAN_THANH = "Hoàn thành";
        private static final String ST_TU_CHOI = "Từ chối";

        public static void main(String[] args) {

                SessionFactory sessionFactory = null;
                Session session = null;
                Random rand = new Random();

                try {

                        Configuration config = new Configuration();
                        config.configure("Hibernate.cfg.xml");

                        config.addAnnotatedClass(User.class);
                        config.addAnnotatedClass(Admin.class);
                        config.addAnnotatedClass(EVMStaff.class);
                        config.addAnnotatedClass(SCStaff.class);
                        config.addAnnotatedClass(SCTechnician.class);
                        config.addAnnotatedClass(ServiceCenter.class);
                        config.addAnnotatedClass(Part.class);
                        config.addAnnotatedClass(Inventory.class);
                        config.addAnnotatedClass(RecallCampaign.class);
                        config.addAnnotatedClass(Notification.class);
                        config.addAnnotatedClass(WarrantyService.class);
                        config.addAnnotatedClass(WarrantyClaim.class);
                        config.addAnnotatedClass(WarrantyHistory.class);
                        config.addAnnotatedClass(ClaimService.class);
                        config.addAnnotatedClass(Customer.class);
                        config.addAnnotatedClass(Vehicle.class);
                        config.addAnnotatedClass(VehiclePart.class);
                        config.addAnnotatedClass(RecallVehicle.class);
                        config.addAnnotatedClass(Schedule.class);
                        config.addAnnotatedClass(AllocatePartHistory.class);
                        sessionFactory = config.buildSessionFactory();
                        session = sessionFactory.openSession();

                        session.beginTransaction();

                        System.out.println("Bắt đầu thêm dữ liệu mẫu...");

                        // --- CẤP 0: Các thực thể độc lập ---

                        System.out.println("Tạo Trung tâm dịch vụ (ServiceCenter)...");
                        List<ServiceCenter> serviceCenters = new ArrayList<>();
                        serviceCenters.add(new ServiceCenter(null, "Trung tâm Ủy quyền Thăng Long",
                                        "123 Giải Phóng, Hà Nội", "Authorized"));
                        serviceCenters.add(new ServiceCenter(null, "Trung tâm Dịch vụ Bến Thành", "456 Lê Lợi, TPHCM",
                                        "Authorized"));
                        serviceCenters.add(new ServiceCenter(null, "Trung tâm Dịch vụ Đà Nẵng",
                                        "789 Hùng Vương, Đà Nẵng", "Authorized"));
                        serviceCenters.add(new ServiceCenter(null, "Trung tâm Dịch vụ Hải Phòng",
                                        "101 Cầu Đất, Hải Phòng", "Service Only"));
                        serviceCenters.add(new ServiceCenter(null, "Trung tâm Dịch vụ Cần Thơ",
                                        "202 Ninh Kiều, Cần Thơ", "Authorized"));
                        for (ServiceCenter sc : serviceCenters)
                                session.persist(sc);

                        System.out.println("-> Tạo 50 Customer...");
                        List<Customer> customers = new ArrayList<>();
                        String[] ho = { "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng" };
                        String[] dem = { "Văn", "Thị", "Minh", "Đức", "Thành", "Ngọc", "Hữu", "Quang", "Thanh",
                                        "Mạnh" };
                        String[] ten = { "An", "Bình", "Cường", "Dung", "Giang", "Hùng", "Khanh", "Lan", "Minh", "Nam",
                                        "Oanh", "Phúc" };

                        for (int i = 0; i < 50; i++) {
                                String fullName = ho[rand.nextInt(ho.length)] + " " + dem[rand.nextInt(dem.length)]
                                                + " " + ten[rand.nextInt(ten.length)];
                                Customer c = new Customer(null, fullName, "khach" + (i + 1) + "@mail.com",
                                                "090" + (1000000 + i), (i % 2 == 0 ? "Hà Nội" : "TPHCM"));
                                customers.add(c);
                                session.persist(c);
                        }

                        System.out.println("Tạo 10 Phụ tùng (Part)...");
                        List<Part> parts = new ArrayList<>();
                        parts.add(new Part(null, "Bộ pin 75kWh", "Battery", "8 năm", "CATL"));
                        parts.add(new Part(null, "Động cơ điện 200kW", "Motor", "5 năm", "Bosch"));
                        parts.add(new Part(null, "Lọc gió cabin HEPA", "Filter", "1 năm", "VinFast"));
                        parts.add(new Part(null, "Má phanh (trước)", "Brake", "2 năm", "Brembo"));
                        parts.add(new Part(null, "Đèn pha LED Matrix", "Light", "3 năm", "Hella"));
                        parts.add(new Part(null, "Bộ điều khiển ECU", "ECU", "5 năm", "Nvidia"));
                        parts.add(new Part(null, "Cần gạt nước", "Wiper", "1 năm", "Bosch"));
                        parts.add(new Part(null, "Màn hình trung tâm 15 inch", "Display", "3 năm", "LG"));
                        parts.add(new Part(null, "Lốp xe (Michelin Pilot Sport)", "Tire", "1 năm", "Michelin"));
                        parts.add(new Part(null, "Gương chiếu hậu (tự động)", "Mirror", "3 năm", "Generic"));
                        for (Part p : parts) {
                                session.persist(p);
                        }

                        System.out.println("-> Tạo 5 WarrantyService...");
                        List<WarrantyService> wServices = new ArrayList<>();
                        wServices.add(new WarrantyService(null, "Thay thế Pin", "Thay pin lỗi", "8 năm", "Sụt nguồn",
                                        15000000.0));
                        wServices.add(new WarrantyService(null, "Sửa Động cơ", "Sửa động cơ điện", "5 năm", "Kêu to",
                                        7000000.0));
                        wServices.add(new WarrantyService(null, "Bảo dưỡng định kỳ", "Kiểm tra tổng quát", "1 năm",
                                        "N/A", 500000.0));
                        wServices.add(new WarrantyService(null, "Cập nhật phần mềm", "Update OTA", "Trọn đời",
                                        "Lỗi phần mềm", 200000.0));
                        wServices.add(new WarrantyService(null, "Thay thế phụ kiện", "Thay gạt mưa, lốp", "1 năm",
                                        "Hao mòn", 1000000.0));
                        for (WarrantyService ws : wServices)
                                session.persist(ws);

                        // --- CẤP 1: Các thực thể phụ thuộc (phụ thuộc Cấp 0) ---

                        System.out.println("Tạo Người dùng (User)...");
                        List<EVMStaff> evmStaffs = new ArrayList<>();
                        List<SCStaff> scStaffs = new ArrayList<>();
                        List<SCTechnician> technicians = new ArrayList<>();

                        // 1 Admin
                        Admin admin1 = new Admin("admin_sys", "pass123", "Quản trị hệ thống", "admin@evm.com",
                                        "090123456");
                        session.persist(admin1);

                        // 5 EVM Staff
                        for (int i = 0; i < 5; i++) {
                                EVMStaff s = new EVMStaff("evm_staff_" + (i + 1), "pass123",
                                                "Nhân Viên Hãng 0" + (i + 1),
                                                "evm" + (i + 1) + "@evm.com", "09011122" + i);
                                evmStaffs.add(s);
                                session.persist(s);
                        }

                        // 15 SC Staff
                        for (int i = 0; i < 15; i++) {
                                SCStaff s = new SCStaff("sc_staff_" + (i + 1), "pass123", "NV Trung tâm 0" + (i + 1),
                                                "sc_staff" + (i + 1) + "@sc.com", "09022233" + i);
                                s.setServiceCenter(serviceCenters.get(i % serviceCenters.size()));

                                scStaffs.add(s);
                                session.persist(s);
                        }

                        // 30 SC Technicians
                        for (int i = 0; i < 30; i++) {
                                SCTechnician t = new SCTechnician("tech_" + (i + 1), "pass123",
                                                "Kỹ thuật viên 0" + (i + 1),
                                                "tech" + (i + 1) + "@sc.com", "09033344" + i);
                                t.setServiceCenter(serviceCenters.get(i % serviceCenters.size()));

                                technicians.add(t);
                                session.persist(t);
                        }

                        System.out.println("-> Tạo 100 Vehicles...");
                        List<Vehicle> vehicles = new ArrayList<>();
                        String[] models = { "Model S", "Model 3", "Model X", "Model Y", "VF 8", "VF 9", "VF e34" };
                        for (int i = 0; i < 100; i++) {
                                Customer owner = customers.get(rand.nextInt(customers.size()));
                                String model = models[rand.nextInt(models.length)];
                                Vehicle v = new Vehicle("VIN" + String.format("%014d", i), owner, model,
                                                2021 + rand.nextInt(4), "10 năm", ST_DANG_CHAY);
                                vehicles.add(v);
                                session.persist(v);
                        }

                        System.out.println("-> Tạo Inventory cho tất cả SC...");
                        List<Inventory> allInventory = new ArrayList<>();
                        for (ServiceCenter sc : serviceCenters) {
                                for (Part p : parts) {
                                        Inventory inv = new Inventory(null, p, sc, rand.nextInt(100));
                                        allInventory.add(inv);
                                        session.persist(inv);
                                }
                        }

                        System.out.println("-> Tạo 5 RecallCampaign...");
                        List<RecallCampaign> campaigns = new ArrayList<>();
                        for (int i = 0; i < 5; i++) {
                                EVMStaff creator = evmStaffs.get(0);
                                RecallCampaign rc = new RecallCampaign(null, creator, "Chiến dịch " + i, ST_DANG_CHAY,
                                                new Date(), "Mô tả lỗi " + i);
                                campaigns.add(rc);
                                session.persist(rc);

                                for (SCStaff scStaff : scStaffs) {
                                        Notification noti = new Notification(null,
                                                        "Triệu hồi mới: " + rc.getName(),
                                                        "Hãng vừa ban hành lệnh triệu hồi. Vui lòng kiểm tra hệ thống.",
                                                        scStaff);
                                        session.persist(noti);
                                }
                        }
                        // --- CẤP 2: Các thực thể phụ thuộc (phụ thuộc Cấp 1) ---

                        System.out.println("-> Tạo VehicleParts cho 100 xe...");
                        List<VehiclePart> vehicleParts = new ArrayList<>();
                        for (Vehicle v : vehicles) {
                                for (int k = 0; k < 3; k++) {
                                        Part p = parts.get(rand.nextInt(parts.size()));
                                        VehiclePart vp = new VehiclePart(null, p, v, "SN-" + v.getVIN() + "-" + k,
                                                        new Date(), null,
                                                        technicians.get(rand.nextInt(technicians.size())),
                                                        ST_DANG_CHAY);
                                        vehicleParts.add(vp);
                                        session.persist(vp);
                                }
                        }

                        System.out.println("-> Tạo RecallVehicle (30% xe bị triệu hồi)...");
                        for (Vehicle v : vehicles) {
                                if (rand.nextInt(10) < 3) {
                                        RecallCampaign rc = campaigns.get(rand.nextInt(campaigns.size()));
                                        String status = rand.nextBoolean() ? ST_CHO_DUYET : ST_HOAN_THANH;
                                        session.persist(new RecallVehicle(null, rc, v,
                                                        (status.equals(ST_HOAN_THANH) ? new Date() : null), status));
                                }
                        }

                        System.out.println("-> Tạo 50 Schedule...");
                        for (int i = 0; i < 30; i++) {
                                RecallCampaign rc = campaigns.get(rand.nextInt(campaigns.size()));
                                Customer cu = customers.get(rand.nextInt(customers.size()));
                                SCStaff creator = scStaffs.get(rand.nextInt(scStaffs.size()));

                                Schedule sch = new Schedule(null, rc, cu, new Date(), "Đặt lịch kiểm tra");
                                sch.setCreatedByStaff(creator);

                                session.persist(sch);
                        }

                        System.out.println("-> Tạo Notifications...");
                        String[] notiTitles = { "Cảnh báo tồn kho", "Yêu cầu mới", "Tin nhắn hệ thống",
                                        "Nhắc nhở lịch hẹn" };
                        for (int i = 0; i < 50; i++) {
                                User u = technicians.get(rand.nextInt(technicians.size())); // Gửi ngẫu nhiên cho tech
                                session.persist(new Notification(null, notiTitles[rand.nextInt(notiTitles.length)],
                                                "Nội dung thông báo mẫu số " + i, u));
                        }

                        // --- CẤP 3: Dữ liệu Bảo hành (phụ thuộc Cấp 2) ---

                        System.out.println("-> Tạo WarrantyClaim, ClaimService và Notifications tương ứng...");
                        String[] statuses = { ST_CHO_DUYET, ST_DANG_CHAY, ST_HOAN_THANH, ST_TU_CHOI };

                        for (int i = 0; i < 50; i++) {
                                VehiclePart vp = vehicleParts.get(rand.nextInt(vehicleParts.size()));
                                SCStaff staff = scStaffs.get(rand.nextInt(scStaffs.size()));
                                String st = statuses[rand.nextInt(statuses.length)];

                                WarrantyClaim wc = new WarrantyClaim(null, vp, staff, "Hỏng hóc " + i, st, new Date(),
                                                "img.jpg");
                                wc.setVehicle(vp.getVehicle());
                                session.persist(wc);

                                session.persist(new WarrantyHistory(null, wc, new Date(), "Khởi tạo: " + st));

                                if (st.equals(ST_DANG_CHAY) || st.equals(ST_HOAN_THANH)) {
                                        WarrantyService ws = wServices.get(rand.nextInt(wServices.size()));
                                        SCTechnician tech = technicians.get(rand.nextInt(technicians.size()));

                                        session.persist(new ClaimService(null, wc, ws, tech, st, "Xử lý kỹ thuật"));

                                        session.persist(new Notification(null,
                                                        "Giao việc mới: Claim #" + wc.getClaimID(),
                                                        "Bạn được phân công xử lý xe " + vp.getVehicle().getVIN(),
                                                        tech)); 

                                        if (st.equals(ST_HOAN_THANH)) {
                                                session.persist(new Notification(null,
                                                                "Công việc hoàn thành: Claim #" + wc.getClaimID(),
                                                                "KTV " + tech.getName() + " đã hoàn tất sửa chữa.",
                                                                staff));
                                        }
                                }
                        }

                        // --- CẤP 4: Dữ liệu Cấp phát Phụ tùng (AllocatePartHistory) ---

                        System.out.println("-> Tạo 20 AllocatePartHistory (Chuyển kho)...");
                        int countAlloc = 0;
                        int maxAlloc = 20;

                        while (countAlloc < maxAlloc) {
                                Inventory invFrom = allInventory.get(rand.nextInt(allInventory.size()));
                                Inventory invTo = allInventory.get(rand.nextInt(allInventory.size()));

                                if (invFrom.getPart().getPartID().equals(invTo.getPart().getPartID()) &&
                                                !invFrom.getServiceCenter().getSCID()
                                                                .equals(invTo.getServiceCenter().getSCID())
                                                &&
                                                invFrom.getCurrentStock() > 0) {

                                        AllocatePartHistory alloc = new AllocatePartHistory();
                                        alloc.setFromInventory(invFrom);
                                        alloc.setToInventory(invTo);
                                        alloc.setPart(invFrom.getPart());
                                        alloc.setQuantity(rand.nextInt(5) + 1);
                                        alloc.setCreatedByEVMStaff(evmStaffs.get(rand.nextInt(evmStaffs.size())));
                                        alloc.setAllocationDate(new Date());

                                        // Random status
                                        String st = rand.nextBoolean() ? ST_HOAN_THANH : ST_CHO_DUYET;
                                        alloc.setStatus(st);

                                        if (st.equals(ST_HOAN_THANH)) {
                                                alloc.setApprovedBySCStaff(scStaffs.get(rand.nextInt(scStaffs.size())));
                                                alloc.setApprovalDate(new Date());
                                        }

                                        session.persist(alloc);
                                        countAlloc++;
                                }
                        }
                        session.getTransaction().commit();
                        System.out.println("\n--- THÊM DỮ LIỆU MẪU THÀNH CÔNG! ---");

                } catch (Exception e) {
                        // Rollback nếu có lỗi
                        if (session != null && session.getTransaction().isActive()) {
                                session.getTransaction().rollback();
                                System.err.println("--- GIAO DỊCH BỊ ROLLBACK DO LỖI! ---");
                        }
                        e.printStackTrace();
                } finally {
                        if (session != null)
                                session.close();
                        if (sessionFactory != null)
                                sessionFactory.close();
                }
                UserRepository repo = new UserRepository();
                List<User> users = repo.getAllUsers(1, 10);
                System.out.println("Sample Users in DB:");
                users.forEach(u -> System.out.println(u.getUserName() + " - " + u.getEmail()));

        }
}