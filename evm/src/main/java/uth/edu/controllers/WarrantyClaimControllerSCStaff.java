package uth.edu.controllers;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.User;
import uth.edu.pojo.Vehicle;
import uth.edu.pojo.VehiclePart;
import uth.edu.pojo.WarrantyClaim;
import uth.edu.pojo.WarrantyService;
import uth.edu.repositories.VehiclePartRepository;
import uth.edu.repositories.VehicleRepository;
import uth.edu.service.RepairService;
import uth.edu.service.WarrantyClaimService;

@RestController
@RequestMapping("/api/warranty-claims")
public class WarrantyClaimControllerSCStaff {

    private final WarrantyClaimService warrantyClaimService;
    private final ObjectMapper objectMapper;
    private final SimpleDateFormat dtf = new SimpleDateFormat("dd/MM/yyyy");

    private final VehicleRepository vehicleRepository;
    private final VehiclePartRepository vehiclePartRepository;
    private final RepairService repairService;

    @Autowired
    public WarrantyClaimControllerSCStaff(WarrantyClaimService warrantyClaimService,
            ObjectMapper objectMapper,
            VehicleRepository vehicleRepository,
            VehiclePartRepository vehiclePartRepository, 
            RepairService repairService) {
        this.warrantyClaimService = warrantyClaimService;
        this.objectMapper = objectMapper;
        this.vehicleRepository = vehicleRepository;
        this.vehiclePartRepository = vehiclePartRepository;
        this.repairService = repairService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createWarrantyClaim(HttpSession session, @RequestBody Map<String, Object> payload) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || ( !(loggedInUser instanceof EVMStaff) && !(loggedInUser instanceof SCStaff ))) {
            return ResponseEntity.status(401).build();
        }
        try {
            Integer scStaffId = (Integer) payload.get("scStaffId");
            Integer vehiclePartId = (Integer) payload.get("vehiclePartId");
            String vin = (String) payload.get("vin");
            String description = (String) payload.get("description");
            String status = (String) payload.get("status");
            String attachmentUrl = (String) payload.get("attachmentUrl");
            Vehicle vehicle = vehicleRepository.getVehicleByVin(vin);
            if (vehicle == null) {
                return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy xe (Vehicle) với VIN: " + vin);
            }

            VehiclePart vehiclePart = vehiclePartRepository.getVehiclePartById(vehiclePartId);
            if (vehiclePart == null) {
                return ResponseEntity.badRequest()
                        .body("Lỗi: Invalid VehiclePart ID! (Không tìm thấy ID: " + vehiclePartId + ")");
            }

            WarrantyClaim claimData = new WarrantyClaim();
            claimData.setVehicle(vehicle);
            claimData.setVehiclePart(vehiclePart);
            claimData.setDescription(description);
            claimData.setStatus(status);

            System.out.println("Creating warranty claim with data:");
            System.out.println("scStaffId: " + scStaffId);
            System.out.println("vin: " + vin);
            System.out.println("vehiclePartId: " + vehiclePartId);
            System.out.println("description: " + description);
            System.out.println("status: " + status);
            System.out.println("attachmentUrl: " + attachmentUrl);

            boolean success = warrantyClaimService.CreateWarrantyClaim(
                    scStaffId,
                    claimData,
                    attachmentUrl);

            System.out.println("CreateWarrantyClaim result: " + success);

            if (success) {
                return ResponseEntity.ok("Tạo yêu cầu bảo hành thành công!");
            } else {
                return ResponseEntity.badRequest().body("Tạo yêu cầu thất bại (Check Service).");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server (POST): " + e.getMessage());
        }
    }

    private List<Map<String, Object>> formatClaimsList(List<WarrantyClaim> claims) {
        if (claims == null) {
            return new ArrayList<>();
        }
        return claims.stream().map(claim -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("claimId", claim.getClaimID());
            map.put("vin", claim.getVehicle() != null ? claim.getVehicle().getVIN() : "N/A");
            map.put("requester", claim.getCreatedByStaff() != null ? claim.getCreatedByStaff().getName() : "N/A");
            map.put("date", claim.getDate() != null ? dtf.format(claim.getDate()) : "N/A");
            map.put("status", claim.getStatus());
            map.put("description", claim.getDescription());
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllClaims(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff )) {
            return ResponseEntity.status(401).build();
        }

        List<WarrantyClaim> claims = warrantyClaimService.GetClaims(loggedInUser.getUserID(), 1, 100);
        return ResponseEntity.ok(formatClaimsList(claims));
    }

    @GetMapping("/getbyID/{id}")
    public ResponseEntity<WarrantyClaim> getClaimById(HttpSession session, @PathVariable Integer id) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || ( !(loggedInUser instanceof EVMStaff) && !(loggedInUser instanceof SCStaff ))) {
            return ResponseEntity.status(401).build();
        }
        WarrantyClaim claim = warrantyClaimService.GetClaimDetails(id);
        if (claim != null) {
            return ResponseEntity.ok(claim);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/allwc")
    public ResponseEntity<List<Object[]>> getAllClaimSummaryDetails(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }

        List<Object[]> wc = warrantyClaimService.getAllClaimSummaryDetails();
        return ResponseEntity.ok(wc);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateClaim(HttpSession session, @PathVariable Integer id, @RequestBody Map<String, Object> payload) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || ( !(loggedInUser instanceof EVMStaff) && !(loggedInUser instanceof SCStaff ))) {
            return ResponseEntity.status(401).build();
        }
        try {
            WarrantyClaim existingClaim = warrantyClaimService.GetClaimDetails(id);
            if (existingClaim == null) {
                return ResponseEntity.notFound().build();
            }

            if (payload.containsKey("vin")) {
                String vin = (String) payload.get("vin");
                Vehicle vehicle = vehicleRepository.getVehicleByVin(vin);
                if (vehicle == null) {
                    return ResponseEntity.badRequest().body("Không tìm thấy xe với VIN: " + vin);
                }
                existingClaim.setVehicle(vehicle);
            }

            if (payload.containsKey("description")) {
                existingClaim.setDescription((String) payload.get("description"));
            }

            if (payload.containsKey("status")) {
                existingClaim.setStatus((String) payload.get("status"));
            }

            boolean success = warrantyClaimService.UpdateWarrantyClaim(existingClaim);

            if (success) {
                return ResponseEntity.ok("Cập nhật thành công!");
            } else {
                return ResponseEntity.badRequest().body("Cập nhật thất bại (Check Service).");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server (PUT): " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteClaim(HttpSession session, @PathVariable Integer id) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || ( !(loggedInUser instanceof EVMStaff) && !(loggedInUser instanceof SCStaff ))) {
            return ResponseEntity.status(401).build();
        }
        try {
            boolean success = warrantyClaimService.deleteWarrantyClaim(id);

            if (success) {
                return ResponseEntity.ok("Xóa yêu cầu thành công!");
            } else {
                return ResponseEntity.status(404).body("Không tìm thấy yêu cầu.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server (DELETE): Không thể xóa (dính khóa ngoại?).");
        }
    }

    @PostMapping("/assign-task")
    public ResponseEntity<?> assignTaskToTechnician(@RequestBody Map<String, Object> payload, HttpSession session) {
        
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền thực hiện hành động này."));
        }

        try {
            Integer warrantyClaimId = parseInt(payload.get("warrantyClaimId"));
            Integer warrantyServiceId = parseInt(payload.get("warrantyServiceId"));
            Integer technicianId = parseInt(payload.get("technicianId"));
            String jobDescription = (String) payload.get("jobDescription");

            if (warrantyClaimId == null || warrantyServiceId == null || technicianId == null || jobDescription == null || jobDescription.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đầy đủ thông tin."));
            }

            boolean success = repairService.assignTechnicianToClaimService(
                warrantyClaimId, 
                warrantyServiceId, 
                technicianId, 
                jobDescription
            );

            if (success) {
                return ResponseEntity.ok(Map.of("message", "Giao việc cho kỹ thuật viên thành công."));
            } else {
        return ResponseEntity.status(400).body(Map.of("message", "Giao việc thất bại. Vui lòng kiểm tra lại thông tin."));
            }

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Dữ liệu ID không hợp lệ."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi máy chủ: " + e.getMessage()));
        }
    }


    @GetMapping("/warranty-services")
    public ResponseEntity<List<WarrantyService>> getWarrantyServicesForCombobox(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }

        try {
            List<WarrantyService> services = repairService.getWarrantyServices();
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<User>> getTechniciansForCombobox(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }

        try {
            List<User> technicians = repairService.getTechnicians();
            return ResponseEntity.ok(technicians);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    private Integer parseInt(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Integer) return (Integer) obj;
        try {
            return Integer.parseInt(obj.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

}