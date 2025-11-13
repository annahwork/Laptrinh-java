package uth.edu.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.Part;
import uth.edu.pojo.User;
import uth.edu.pojo.VehiclePart;
import uth.edu.service.UserService;
import uth.edu.service.VehicleService;

@RestController
@RequestMapping("/api/evm_staff/attach_serial")
public class AttachSerialController {

    private final VehicleService vehicleService;
    private final UserService userService;

    @Autowired
    public AttachSerialController(VehicleService vehicleService, UserService userService) {
        this.vehicleService = vehicleService;
        this.userService = userService;
    }

    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getAttachedParts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String query,
            HttpSession session) {

        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }

        try {
            List<VehiclePart> parts = vehicleService.getVehicleParts(query, page, pageSize);
            
            // Chuyển đổi sang JSON an toàn (tránh lỗi Lazy)
            List<Map<String, Object>> result = parts.stream().map(vp -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("vin", vp.getVehicle().getVIN());
                map.put("partName", vp.getPart().getName());
                map.put("serial", vp.getSerialNumber());
                map.put("installDate", new SimpleDateFormat("dd/MM/yyyy").format(vp.getInstallDate()));
                map.put("installerName", vp.getInstalledBy().getName());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/get-parts")
    public ResponseEntity<List<Map<String, Object>>> getAllParts(HttpSession session) {
        try {
            List<Part> parts = vehicleService.getAllParts(); // Dùng hàm mới trong VehicleService
            List<Map<String, Object>> result = parts.stream().map(p -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", p.getPartID());
                map.put("name", p.getName());
                return map;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/get-installers")
    public ResponseEntity<List<Map<String, Object>>> getInstallers(HttpSession session) {
        try {
            List<User> installers = vehicleService.getInstallers(); // Dùng hàm mới
            List<Map<String, Object>> result = installers.stream().map(u -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", u.getUserID());
                map.put("name", u.getName() + " (" + u.getUser_Role() + ")");
                return map;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createVehiclePart(@RequestBody Map<String, String> payload, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền"));
        }

        try {
            String vin = payload.get("vin");
            Integer partId = Integer.parseInt(payload.get("partId"));
            String serialNumber = payload.get("serialNumber");
            Date installDate = new SimpleDateFormat("yyyy-MM-dd").parse(payload.get("installDate"));
            Integer installerId = Integer.parseInt(payload.get("installerId")); // Đây là ID của KTV
            Integer evmStaffId = loggedInUser.getUserID(); // Người tạo (gatekeeper)

            boolean success = vehicleService.AssignPartToVehicle(
                evmStaffId, vin, partId, serialNumber, installDate, installerId
            );

            if (success) {
                return ResponseEntity.ok(Map.of("message", "Gắn serial thành công!"));
            } else {
                return ResponseEntity.status(400).body(Map.of("message", "Gắn serial thất bại. Vui lòng kiểm tra lại thông tin (VIN, PartID, InstallerID)."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi server: " + e.getMessage()));
        }
    }
}