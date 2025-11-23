package uth.edu.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uth.edu.pojo.Customer;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.User;
import uth.edu.pojo.Vehicle;
import uth.edu.repositories.CustomerRepository;
import uth.edu.repositories.VehicleRepository;
import uth.edu.service.VehicleService;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/sc-staff/vehicles")
public class ScStaffVehicleApiController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private boolean isScStaff(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        return loggedInUser instanceof SCStaff;
    }

    // ================== LẤY DANH SÁCH XE (SC-STAFF) ==================
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllVehiclesForScStaff(
            HttpSession session,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {

        if (!isScStaff(session)) {
            return ResponseEntity.status(401).build();
        }

        List<?> raw = vehicleService.GetVehicles();
        List<Map<String, Object>> filtered = new ArrayList<>();

        for (Object item : raw) {
            Map row;
            try {
                row = (Map) item; // runtime is a java.util.Map from HQL 'new map'
            } catch (Exception ex) {
                continue;
            }

            Object vobj = row.get("vehicle");
            Vehicle veh = vobj instanceof Vehicle ? (Vehicle) vobj : null;
            String custName = row.get("customerName") != null ? row.get("customerName").toString() : null;
            String custPhone = row.get("customerPhone") != null ? row.get("customerPhone").toString() : null;

            boolean keep = true;
            if (status != null && !status.trim().isEmpty() && !status.trim().equalsIgnoreCase("Tất cả trạng thái")) {
                String vs = veh != null && veh.getStatus() != null ? veh.getStatus() : "";
                if (!vs.equals(status.trim()))
                    keep = false;
            }

            if (keep && search != null && !search.trim().isEmpty()) {
                String q = search.trim().toLowerCase();
                boolean match = false;
                if (veh != null) {
                    if (veh.getVIN() != null && veh.getVIN().toLowerCase().contains(q))
                        match = true;
                    if (!match && veh.getModel() != null && veh.getModel().toLowerCase().contains(q))
                        match = true;
                }
                if (!match && custName != null && custName.toLowerCase().contains(q))
                    match = true;
                if (!match && custPhone != null && custPhone.toLowerCase().contains(q))
                    match = true;
                if (!match)
                    keep = false;
            }

            if (keep)
                filtered.add(row);
        }

        return ResponseEntity.ok(filtered);
    }

    // ================== ĐĂNG KÝ XE ==================
    @PostMapping("/register")
    public ResponseEntity<String> registerVehicleForScStaff(
            HttpSession session,
            @RequestBody Map<String, Object> requestBody,
            @RequestParam Integer staffId) {

        if (!isScStaff(session)) {
            return ResponseEntity.status(401).body("Không có quyền truy cập");
        }

        try {
            Vehicle vehicleData = objectMapper.convertValue(requestBody.get("vehicle"), Vehicle.class);
            Customer customerData = objectMapper.convertValue(requestBody.get("customer"), Customer.class);

            boolean success = vehicleService.RegisterVehicle(staffId, vehicleData, customerData);

            if (success) {
                return ResponseEntity.ok("Đăng ký xe thành công!");
            } else {
                return ResponseEntity.badRequest().body("Đăng ký xe thất bại (VIN trùng?).");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body("Lỗi server (POST /register): " + e.getMessage());
        }
    }

    // ================== CẬP NHẬT XE ==================
    @PutMapping("/update/{vin}")
    public ResponseEntity<String> updateVehicleForScStaff(
            HttpSession session,
            @PathVariable String vin,
            @RequestBody Map<String, Object> requestBody,
            @RequestParam Integer staffId) {

        if (!isScStaff(session)) {
            return ResponseEntity.status(401).body("Không có quyền truy cập");
        }

        try {
            Vehicle existingVehicle = vehicleRepository.getVehicleByVin(vin);
            if (existingVehicle == null) {
                return ResponseEntity.status(404).body("Không tìm thấy xe để sửa.");
            }

            Vehicle vehicleData = objectMapper.convertValue(requestBody.get("vehicle"), Vehicle.class);
            Customer customerData = objectMapper.convertValue(requestBody.get("customer"), Customer.class);

            Customer existingCustomer = existingVehicle.getCustomer();
            if (existingCustomer == null) {
                existingCustomer = new Customer();
                existingCustomer.setPhone(customerData.getPhone());
            }

            existingCustomer.setName(customerData.getName());
            existingCustomer.setPhone(customerData.getPhone());
            existingCustomer.setEmail(customerData.getEmail());
            existingCustomer.setAddress(customerData.getAddress());
            customerRepository.updateCustomer(existingCustomer);

            existingVehicle.setCustomer(existingCustomer);

            if (vehicleData.getVIN() != null && !vehicleData.getVIN().isEmpty()) {
                existingVehicle.setVIN(vehicleData.getVIN());
            }
            existingVehicle.setModel(vehicleData.getModel());
            existingVehicle.setYear_Of_Manufacture(vehicleData.getYear_Of_Manufacture());
            existingVehicle.setWarranty_Time(vehicleData.getWarranty_Time());
            existingVehicle.setStatus(vehicleData.getStatus());

            vehicleRepository.updateVehicle(existingVehicle);

            return ResponseEntity.ok("Cập nhật xe thành công!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body("Lỗi server (PUT /update): " + e.getMessage());
        }
    }

    // ================== XOÁ XE ==================
    @DeleteMapping("/delete/{vin}")
    public ResponseEntity<String> deleteVehicleForScStaff(
            HttpSession session,
            @PathVariable String vin) {

        if (!isScStaff(session)) {
            return ResponseEntity.status(401).body("Không có quyền truy cập");
        }

        try {
            Vehicle existingVehicle = vehicleRepository.getVehicleByVin(vin);
            if (existingVehicle == null) {
                return ResponseEntity.status(404).body("Không tìm thấy xe để xóa.");
            }

            vehicleRepository.deleteVehicle(existingVehicle);
            return ResponseEntity.ok("Xóa xe thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body("Lỗi server (DELETE /delete): Không thể xóa (dính khóa ngoại?).");
        }
    }
}
