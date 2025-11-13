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

        public static void main(String[] args) {

                SessionFactory sessionFactory = null;
                Session session = null;
                Random rand = new Random();

                try {
                        // 1. Khởi tạo Hibernate SessionFactory
                        Configuration config = new Configuration();
                        config.configure("Hibernate.cfg.xml"); // Đảm bảo file này nằm trong classpath

                        // Thêm TẤT CẢ các lớp POJO của bạn
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

                        // 2. Bắt đầu một Transaction
                        session.beginTransaction();

                        System.out.println("Bắt đầu thêm dữ liệu mẫu...");

                        // --- CẤP 0: Các thực thể độc lập ---

                        System.out.println("Tạo 4 Trung tâm dịch vụ (ServiceCenter)...");
                        List<ServiceCenter> serviceCenters = new ArrayList<>();
                        serviceCenters.add(
                                        new ServiceCenter(null, "Trung tâm Ủy quyền Thăng Long",
                                                        "123 Giải Phóng, Hà Nội", "Authorized"));
                        serviceCenters
                                        .add(new ServiceCenter(null, "Trung tâm Dịch vụ Bến Thành", "456 Lê Lợi, TPHCM",
                                                        "Authorized"));
                        serviceCenters
                                        .add(new ServiceCenter(null, "Trung tâm Dịch vụ Đà Nẵng",
                                                        "789 Hùng Vương, Đà Nẵng", "Authorized"));
                        serviceCenters.add(
                                        new ServiceCenter(null, "Trung tâm Dịch vụ Hải Phòng", "101 Cầu Đất, Hải Phòng",
                                                        "Service Only"));
                        for (ServiceCenter sc : serviceCenters) {
                                session.persist(sc);
                        }

                        System.out.println("Tạo 10 Khách hàng (Customer)...");
                        List<Customer> customers = new ArrayList<>();
                        String[] firstNames = { "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Võ", "Đặng", "Bùi",
                                        "Đỗ" };
                        String[] lastNames = { "Văn An", "Thị Bình", "Văn Cường", "Thị Dung", "Minh Tuấn", "Thị Lan",
                                        "Văn Long",
                                        "Minh Đức", "Thị Hoa", "Văn Hải" };
                        for (int i = 0; i < 10; i++) {
                                String name = firstNames[i] + " " + lastNames[i];
                                String email = "customer" + (i + 1) + "@example.com";
                                String phone = "0901234" + String.format("%03d", i);
                                String address = (i % 2 == 0) ? "Hà Nội" : "TPHCM";
                                Customer c = new Customer(null, name, email, phone, address);
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

                        System.out.println("Tạo 5 Dịch vụ Bảo hành (WarrantyService)...");
                        List<WarrantyService> warrantyServices = new ArrayList<>();
                        warrantyServices.add(new WarrantyService(null, "Thay thế Pin", "Thay thế mô-đun pin bị lỗi",
                                        "8 năm / 160,000 km", "Dung lượng pin dưới 70%", 0.0));
                        warrantyServices.add(new WarrantyService(null, "Sửa chữa Động cơ",
                                        "Sửa chữa hoặc thay thế động cơ điện",
                                        "5 năm", "Lỗi từ nhà sản xuất", 0.0));
                        warrantyServices.add(new WarrantyService(null, "Kiểm tra hệ thống",
                                        "Kiểm tra tổng quát hệ thống điện",
                                        "1 lần", "Miễn phí lần đầu", 0.0));
                        warrantyServices.add(new WarrantyService(null, "Cập nhật phần mềm BMS",
                                        "Flash firmware mới cho hệ thống quản lý pin", "Trọn đời", "Khi có bản vá",
                                        0.0));
                        warrantyServices.add(new WarrantyService(null, "Thay thế má phanh",
                                        "Thay thế má phanh bị mòn sớm", "1 năm",
                                        "Mòn không đều", 0.0));
                        for (WarrantyService ws : warrantyServices) {
                                session.persist(ws);
                        }

                        // --- CẤP 1: Các thực thể phụ thuộc (phụ thuộc Cấp 0) ---

                        System.out.println("Tạo 29 Người dùng (User)...");
                        List<EVMStaff> evmStaffs = new ArrayList<>();
                        List<SCStaff> scStaffs = new ArrayList<>();
                        List<SCTechnician> technicians = new ArrayList<>();

                        // 1 Admin
                        Admin admin1 = new Admin("admin_sys", "pass123", "Quản trị hệ thống", "admin@evm.com",
                                        "090123456");
                        session.persist(admin1);

                        // 3 EVM Staff
                        for (int i = 0; i < 3; i++) {
                                EVMStaff s = new EVMStaff("evm_staff_" + (i + 1), "pass123",
                                                "Nhân Viên Hãng 0" + (i + 1),
                                                "evm" + (i + 1) + "@evm.com", "09011122" + i);
                                evmStaffs.add(s);
                                session.persist(s);
                        }

                        // 10 SC Staff
                        for (int i = 0; i < 10; i++) {
                                SCStaff s = new SCStaff("sc_staff_" + (i + 1), "pass123", "NV Trung tâm 0" + (i + 1),
                                                "sc_staff" + (i + 1) + "@sc.com", "09022233" + i);
                                s.setServiceCenter(serviceCenters.get(i % serviceCenters.size())); // Chia đều cho các
                                                                                                   // SC
                                scStaffs.add(s);
                                session.persist(s);
                        }

                        // 15 SC Technicians
                        for (int i = 0; i < 15; i++) {
                                SCTechnician t = new SCTechnician("tech_" + (i + 1), "pass123",
                                                "Kỹ thuật viên 0" + (i + 1),
                                                "tech" + (i + 1) + "@sc.com", "09033344" + i);
                                t.setServiceCenter(serviceCenters.get(i % serviceCenters.size())); // Chia đều cho các
                                                                                                   // SC
                                technicians.add(t);
                                session.persist(t);
                        }

                        System.out.println("Tạo 15 Xe (Vehicle)...");
                        List<Vehicle> vehicles = new ArrayList<>();
                        String[] models = { "Model S", "Model 3", "Model X", "Model Y" };
                        for (int i = 0; i < 15; i++) {
                                String vin = "VIN" + String.format("%014d", i);
                                Customer owner = customers.get(i % customers.size());
                                String model = models[i % models.length];
                                Integer year = 2022 + rand.nextInt(3); // 2022-2024
                                String warranty = "8 năm / 160,000 km";
                                String status = "Active";
                                Vehicle v = new Vehicle(vin, owner, model, year, warranty, status);
                                vehicles.add(v);
                                session.persist(v);
                        }

                        System.out.println("Tạo 40 bản ghi Kho (Inventory)...");
                        for (ServiceCenter sc : serviceCenters) {
                                for (Part p : parts) {
                                        int stock = 10 + rand.nextInt(191); // Stock từ 10 đến 200
                                        Inventory inv = new Inventory(null, p, sc, stock);
                                        session.persist(inv);
                                }
                        }

                        System.out.println("Tạo 3 Chiến dịch triệu hồi (RecallCampaign)...");
                        List<RecallCampaign> recallCampaigns = new ArrayList<>();
                        RecallCampaign rc1 = new RecallCampaign(null, evmStaffs.get(0),
                                        "Triệu hồi kiểm tra lỗi pin LFP", "Active",
                                        new Date(), "Lỗi cell pin.");
                        RecallCampaign rc2 = new RecallCampaign(null, evmStaffs.get(1), "Cập nhật phần mềm ECU",
                                        "Pending",
                                        new Date(), "Lỗi phanh khẩn cấp.");
                        RecallCampaign rc3 = new RecallCampaign(null, evmStaffs.get(0), "Kiểm tra lỗi túi khí",
                                        "Completed",
                                        new Date(System.currentTimeMillis() - 1000L * 60 * 60 * 24 * 30),
                                        "Túi khí không nổ."); // 30 ngày
                                                              // trước
                        recallCampaigns.add(rc1);
                        recallCampaigns.add(rc2);
                        recallCampaigns.add(rc3);
                        session.persist(rc1);
                        session.persist(rc2);
                        session.persist(rc3);

                        // --- CẤP 2: Các thực thể phụ thuộc (phụ thuộc Cấp 1) ---

                        System.out.println("Tạo 45 bản ghi Phụ tùng trên xe (VehiclePart)...");
                        List<VehiclePart> vehicleParts = new ArrayList<>();
                        Part pin = parts.get(0);
                        Part dongCo = parts.get(1);
                        Part locGio = parts.get(2);
                        for (Vehicle v : vehicles) {
                                // Mỗi xe đều có 3 bộ phận cơ bản này
                                vehicleParts.add(new VehiclePart(null, pin, v, "SN-BAT-" + v.getVIN(), new Date(), null,
                                                technicians.get(0), "Active"));
                                vehicleParts.add(new VehiclePart(null, dongCo, v, "SN-MOT-" + v.getVIN(), new Date(),
                                                null,
                                                technicians.get(0), "Active"));
                                vehicleParts.add(new VehiclePart(null, locGio, v, "SN-FIL-" + v.getVIN(), new Date(),
                                                null,
                                                technicians.get(0), "Active"));
                        }
                        for (VehiclePart vp : vehicleParts) {
                                session.persist(vp);
                        }

                        System.out.println("Tạo 10 bản ghi Xe trong chiến dịch (RecallVehicle)...");
                        session.persist(new RecallVehicle(null, rc1, vehicles.get(0), null, "Pending"));
                        session.persist(new RecallVehicle(null, rc1, vehicles.get(2), null, "Pending"));
                        session.persist(new RecallVehicle(null, rc1, vehicles.get(4), null, "Pending"));
                        session.persist(new RecallVehicle(null, rc2, vehicles.get(1), null, "Pending"));
                        session.persist(new RecallVehicle(null, rc2, vehicles.get(3), null, "Pending"));
                        session.persist(new RecallVehicle(null, rc3, vehicles.get(5), new Date(), "Completed")); // Đã
                                                                                                                 // hoàn
                                                                                                                 // thành
                        session.persist(new RecallVehicle(null, rc3, vehicles.get(6), new Date(), "Completed"));

                        // SỬA LẠI: Dùng constructor 5 tham số + hàm setter
                        System.out.println("Tạo 5 Lịch hẹn (Schedule)...");

                        Schedule sch1 = new Schedule(null, rc1, customers.get(0), new Date(),
                                        "Khách hẹn mang xe đến kiểm tra pin.");
                        sch1.setCreatedByStaff(scStaffs.get(0)); // Gán staff riêng
                        session.persist(sch1);

                        Schedule sch2 = new Schedule(null, rc1, customers.get(2), new Date(), "Kiểm tra pin.");
                        sch2.setCreatedByStaff(scStaffs.get(1)); // Gán staff riêng
                        session.persist(sch2);

                        Schedule sch3 = new Schedule(null, rc2, customers.get(1), new Date(), "Cập nhật ECU.");
                        sch3.setCreatedByStaff(scStaffs.get(2)); // Gán staff riêng
                        session.persist(sch3);
                        System.out.println("Tạo 10 Thông báo (Notification)...");
                        session.persist(new Notification(null, "Cập nhật kho",
                                        "Linh kiện [Lọc gió cabin HEPA] sắp hết hàng.",
                                        scStaffs.get(0)));
                        session.persist(new Notification(null, "Chiến dịch triệu hồi mới",
                                        "Bạn có 1 chiến dịch triệu hồi mới: Triệu hồi kiểm tra lỗi pin LFP",
                                        evmStaffs.get(0)));
                        session.persist(new Notification(null, "Yêu cầu bảo hành mới",
                                        "Bạn có 1 yêu cầu bảo hành mới cho xe VIN123456789ABC", scStaffs.get(0)));
                        session.persist(new Notification(null, "Công việc mới",
                                        "Bạn được gán công việc cho Yêu cầu #1001",
                                        technicians.get(0)));
                        for (int i = 0; i < 5; i++) {
                                session.persist(new Notification(null, "Thông báo hệ thống",
                                                "Hệ thống sẽ bảo trì vào 2h sáng.",
                                                technicians.get(i)));
                        }

                        // --- CẤP 3: Dữ liệu Bảo hành (phụ thuộc Cấp 2) ---

                        System.out.println("Tạo 5 Yêu cầu Bảo hành (WarrantyClaim)...");
                        List<WarrantyClaim> claims = new ArrayList<>();
                        // Claim 1: Lỗi pin xe 1
                        claims.add(new WarrantyClaim(1001, vehicleParts.get(0), scStaffs.get(0),
                                        "Pin sụt dung lượng nhanh",
                                        "Pending", new Date(), "path/to/image.png"));
                        // Claim 2: Lỗi động cơ xe 2
                        claims.add(new WarrantyClaim(1002, vehicleParts.get(4), scStaffs.get(2), "Động cơ kêu to",
                                        "Approved",
                                        new Date(), "path/to/video.mp4"));
                        // Claim 3: Lỗi lọc gió xe 3
                        claims.add(new WarrantyClaim(1003, vehicleParts.get(8), scStaffs.get(4), "Lọc gió bẩn nhanh",
                                        "Rejected",
                                        new Date(), null));
                        // Claim 4: Lỗi pin xe 4
                        claims.add(new WarrantyClaim(1004, vehicleParts.get(9), scStaffs.get(1), "Xe sạc không vào pin",
                                        "In Progress", new Date(), null));
                        // Claim 5: Lỗi màn hình xe 5 (Chưa có part trong VehiclePart, ta dùng tạm)
                        claims.add(new WarrantyClaim(1005, vehicleParts.get(12), scStaffs.get(3),
                                        "Màn hình trung tâm bị sọc",
                                        "Pending", new Date(), "path/to/image2.png"));

                        for (WarrantyClaim claim : claims) {
                                // Đặt xe cho claim
                                claim.setVehicle(claim.getVehiclePart().getVehicle());
                                session.persist(claim);
                        }

                        // --- CẤP 4: Dữ liệu Lịch sử & Dịch vụ (phụ thuộc Cấp 3) ---

                        System.out.println("Tạo 10 bản ghi Lịch sử Bảo hành (WarrantyHistory)...");
                        // 2 bản ghi cho mỗi claim
                        session.persist(new WarrantyHistory(null, claims.get(0), new Date(),
                                        "Yêu cầu đã được tạo. Chờ duyệt."));
                        session.persist(new WarrantyHistory(null, claims.get(0), new Date(), "Admin đã xem yêu cầu."));

                        session.persist(new WarrantyHistory(null, claims.get(1), new Date(), "Yêu cầu đã được tạo."));
                        session.persist(new WarrantyHistory(null, claims.get(1), new Date(),
                                        "Yêu cầu được EVM Staff duyệt."));

                        session.persist(new WarrantyHistory(null, claims.get(2), new Date(), "Yêu cầu đã được tạo."));
                        session.persist(
                                        new WarrantyHistory(null, claims.get(2), new Date(),
                                                        "Yêu cầu bị từ chối. Lỗi do người dùng."));

                        session.persist(new WarrantyHistory(null, claims.get(3), new Date(), "Yêu cầu đã được tạo."));
                        session.persist(new WarrantyHistory(null, claims.get(3), new Date(),
                                        "KTV đã nhận. Đang tiến hành sửa chữa."));

                        session.persist(new WarrantyHistory(null, claims.get(4), new Date(),
                                        "Yêu cầu đã được tạo. Chờ duyệt."));
                        session.persist(new WarrantyHistory(null, claims.get(4), new Date(),
                                        "Yêu cầu bổ sung hình ảnh."));

                        System.out.println("Tạo 5 bản ghi Dịch vụ cho Yêu cầu (ClaimService)...");
                        // Mỗi claim 1 service (trừ claim bị reject)
                        session.persist(new ClaimService(null, claims.get(0), warrantyServices.get(0),
                                        technicians.get(0),
                                        "Đang chờ phụ tùng", "Pin dự kiến về trong 3 ngày"));
                        session.persist(new ClaimService(null, claims.get(1), warrantyServices.get(1),
                                        technicians.get(3),
                                        "Hoàn thành", "Đã thay động cơ mới."));
                        session.persist(new ClaimService(null, claims.get(3), warrantyServices.get(3),
                                        technicians.get(1),
                                        "Đang thực hiện", "Đang cập nhật phần mềm BMS."));
                        session.persist(new ClaimService(null, claims.get(4), warrantyServices.get(2),
                                        technicians.get(5), "Chờ duyệt",
                                        "Chờ duyệt thay màn hình."));

                        // --- CẤP 5: Dữ liệu Cấp phát Phụ tùng (AllocatePartHistory) ---

                        System.out.println("Tạo 5 bản ghi Lịch sử Cấp phát (AllocatePartHistory)...");

                        try {
                                // Lấy các đối tượng đã được tạo ở các bước trước
                                Part partPin = parts.get(0); 
                                Part partDongCo = parts.get(1);

                                ServiceCenter scThangLong = serviceCenters.get(0);
                                ServiceCenter scBenThanh = serviceCenters.get(1);
                                ServiceCenter scDaNang = serviceCenters.get(2);

                                // --- ĐÃ SỬA: Truy vấn trực tiếp Inventory từ session thay vì dùng
                                // part.getInventoryRecords() ---

                                System.out.println("Đang truy vấn Inventory để tạo AllocatePartHistory...");

                                // Lấy kho của "Pin"
                                Inventory fromInv_Pin = session.createQuery(
                                                "FROM Inventory WHERE Part = :part AND ServiceCenter = :sc",
                                                Inventory.class)
                                                .setParameter("part", partPin)
                                                .setParameter("sc", scThangLong)
                                                .uniqueResult();

                                Inventory toInv_Pin_SC1 = session.createQuery(
                                                "FROM Inventory WHERE Part = :part AND ServiceCenter = :sc",
                                                Inventory.class)
                                                .setParameter("part", partPin)
                                                .setParameter("sc", scBenThanh)
                                                .uniqueResult();

                                // Lấy kho của "Động cơ"
                                Inventory fromInv_DongCo = session.createQuery(
                                                "FROM Inventory WHERE Part = :part AND ServiceCenter = :sc",
                                                Inventory.class)
                                                .setParameter("part", partDongCo)
                                                .setParameter("sc", scThangLong)
                                                .uniqueResult();

                                Inventory toInv_DongCo_SC2 = session.createQuery(
                                                "FROM Inventory WHERE Part = :part AND ServiceCenter = :sc",
                                                Inventory.class)
                                                .setParameter("part", partDongCo)
                                                .setParameter("sc", scDaNang)
                                                .uniqueResult();

                                // Lấy nhân viên
                                EVMStaff evmStaff = evmStaffs.get(0);
                                SCStaff scStaff_SC2 = scStaffs.get(2); // Giả sử staff này thuộc SC Đà Nẵng

                                if (fromInv_Pin != null && toInv_Pin_SC1 != null && fromInv_DongCo != null
                                                && toInv_DongCo_SC2 != null) {

                                        System.out.println("Đã tìm thấy Inventory, đang tạo AllocatePartHistory...");

                                        // 1. Yêu cầu "Pending" (Đang chờ duyệt)
                                        AllocatePartHistory history1 = new AllocatePartHistory();
                                        history1.setFromInventory(fromInv_Pin);
                                        history1.setToInventory(toInv_Pin_SC1);
                                        history1.setPart(partPin);
                                        history1.setQuantity(10); // Cấp 10 bộ pin
                                        history1.setCreatedByEVMStaff(evmStaff);
                                        history1.setStatus("Pending");
                                        history1.setAllocationDate(new Date());
                                        session.persist(history1);

                                        // 2. Yêu cầu "Completed" (Đã hoàn tất)
                                        AllocatePartHistory history2 = new AllocatePartHistory();
                                        history2.setFromInventory(fromInv_DongCo);
                                        history2.setToInventory(toInv_DongCo_SC2);
                                        history2.setPart(partDongCo);
                                        history2.setQuantity(5); // Cấp 5 động cơ
                                        history2.setCreatedByEVMStaff(evmStaff);
                                        history2.setStatus("Completed");
                                        history2.setAllocationDate(new Date(
                                                        System.currentTimeMillis() - 1000L * 60 * 60 * 24 * 2)); // 2
                                                                                                                 // ngày
                                                                                                                 // trước
                                        history2.setApprovedBySCStaff(scStaff_SC2); // Duyệt bởi staff SC 2
                                        history2.setApprovalDate(new Date());
                                        session.persist(history2);

                                        // 3. Yêu cầu "Failed" (Thất bại - Giả sử)
                                        AllocatePartHistory history3 = new AllocatePartHistory();
                                        history3.setFromInventory(fromInv_Pin);
                                        history3.setToInventory(toInv_Pin_SC1);
                                        history3.setPart(partPin);
                                        history3.setQuantity(9999); // Số lượng quá lớn
                                        history3.setCreatedByEVMStaff(evmStaff);
                                        history3.setStatus("Failed (Out of Stock)");
                                        history3.setAllocationDate(new Date());
                                        session.persist(history3);

                                } else {
                                        System.err.println(
                                                        "--- KHÔNG THỂ THÊM AllocatePartHistory: Không tìm thấy các bản ghi Inventory (qua HQL). ---");
                                        if (fromInv_Pin == null)
                                                System.err.println("Debug: fromInv_Pin (Pin @ ThangLong) is null.");
                                        if (toInv_Pin_SC1 == null)
                                                System.err.println("Debug: toInv_Pin_SC1 (Pin @ BenThanh) is null.");
                                        if (fromInv_DongCo == null)
                                                System.err.println(
                                                                "Debug: fromInv_DongCo (DongCo @ ThangLong) is null.");
                                        if (toInv_DongCo_SC2 == null)
                                                System.err.println(
                                                                "Debug: toInv_DongCo_SC2 (DongCo @ DaNang) is null.");
                                }

                        } catch (Exception e) {
                                System.err.println("Lỗi nghiêm trọng khi thêm dữ liệu AllocatePartHistory:");
                                e.printStackTrace();
                        }
                        // 3. Commit Transaction
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
                        // 4. Đóng Session và SessionFactory
                        if (session != null) {
                                session.close();
                        }
                        if (sessionFactory != null) {
                                sessionFactory.close();
                        }
                }
                UserRepository repo = new UserRepository();
                List<User> users = repo.getAllUsers(1, 30);
                users.forEach(System.out::println);

        }
}