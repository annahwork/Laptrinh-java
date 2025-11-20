package uth.edu.controllers;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.ClaimService;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.User;
import uth.edu.pojo.WarrantyClaim;
import uth.edu.pojo.WarrantyHistory;
import uth.edu.pojo.WarrantyService;
import uth.edu.service.WarrantyClaimService;

@RestController
@RequestMapping("/api/evm_staff/claims")
public class WarrantyClaimController {

    private final WarrantyClaimService warrantyClaimService;
    private final SimpleDateFormat dtf = new SimpleDateFormat("dd/MM/yyyy");

    @Autowired
    public WarrantyClaimController(WarrantyClaimService warrantyClaimService) {
        this.warrantyClaimService = warrantyClaimService;
    }


    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingClaims(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }
        
        List<WarrantyClaim> claims = warrantyClaimService.GetClaimsForApproval(loggedInUser.getUserID(), 1, 100);
        return ResponseEntity.ok(formatClaimsList(claims));
    }



    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllClaims(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }

        List<WarrantyClaim> claims = warrantyClaimService.GetClaims(loggedInUser.getUserID(), 1, 100);
        return ResponseEntity.ok(formatClaimsList(claims));
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<?> getClaimHistory(@PathVariable Integer id, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }

        List<WarrantyHistory> history = warrantyClaimService.TrackClaimStatus(id, 1, 100);

        List<Map<String, Object>> result = history.stream().map(h -> {
            Map<String, Object> map = new java.util.HashMap<>();
            String note = h.getNote();
            String status = "Cập nhật";
            String user = "Hệ thống";

            if (note.contains("->")) {
                status = note.substring(note.indexOf("-> '") + 4, note.lastIndexOf("'"));
            } else if (note.contains("Yêu cầu bảo hành được tạo")) {
                status = "Tạo mới";
            }
            
            if (note.contains("(Bởi: ")) {
                user = note.substring(note.indexOf("(Bởi: ") + 6, note.lastIndexOf(")"));
            }

            map.put("step", h.getWarrantyHistoryID());
            map.put("user", user);
            map.put("date", dtf.format(h.getDate()));
            map.put("status", status);
            map.put("note", note); // Gửi note đầy đủ
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }


    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveClaim(@PathVariable Integer id, @RequestBody Map<String, String> payload, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }

        String note = payload.getOrDefault("note", "Đã được duyệt.");
        boolean success = warrantyClaimService.ApproveClaim(loggedInUser.getUserID(), id, note);

        if (success) {
            return ResponseEntity.ok(Map.of("message", "Duyệt thành công"));
        } else {
            return ResponseEntity.status(400).body(Map.of("message", "Duyệt thất bại (có thể đã được xử lý)"));
        }
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectClaim(@PathVariable Integer id, @RequestBody Map<String, String> payload, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }

        String note = payload.getOrDefault("note", "Bị từ chối.");
        if (note.isEmpty()) note = "Bị từ chối.";

        boolean success = warrantyClaimService.RejectClaim(loggedInUser.getUserID(), id, note);

        if (success) {
            return ResponseEntity.ok(Map.of("message", "Từ chối thành công"));
        } else {
            return ResponseEntity.status(400).body(Map.of("message", "Từ chối thất bại (có thể đã được xử lý)"));
        }
    }
    @GetMapping("/cost/list")
    public ResponseEntity<Map<String, Object>> getWarrantyCosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            HttpSession session) {
        
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }

        try {
            List<WarrantyClaim> claims = warrantyClaimService.getClaimsWithCost(page, pageSize);
            
            int totalItems = warrantyClaimService.countAllClaims();
            
            double grandTotal = 0.0;
            List<Map<String, Object>> resultData = new ArrayList<>();

            for (WarrantyClaim claim : claims) {
                double totalCost = 0.0;
                if (claim.getClaimServices() != null) {
                    totalCost = claim.getClaimServices().stream()
                        .map(ClaimService::getWarrantyService)
                        .filter(ws -> ws != null && ws.getCost() != null)
                        .mapToDouble(WarrantyService::getCost)
                        .sum();
                }
                
                grandTotal += totalCost; 

                Map<String, Object> map = new HashMap<>();
                map.put("claimId", "CR-" + claim.getClaimID());
                map.put("claimIdRaw", claim.getClaimID());
                map.put("vin", claim.getVehicle() != null ? claim.getVehicle().getVIN() : "N/A");
                map.put("requester", claim.getCreatedByStaff() != null ? claim.getCreatedByStaff().getName() : "N/A");
                map.put("date", claim.getDate() != null ? dtf.format(claim.getDate()) : "N/A");
                map.put("totalCost", totalCost);
                
                resultData.add(map);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("data", resultData);
            response.put("page", page);
            response.put("totalItems", totalItems);
            response.put("totalPages", (int) Math.ceil((double) totalItems / pageSize));
            response.put("grandTotal", grandTotal);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400)
                                 .body(Map.of("message", "Lỗi server: " + e.getMessage()));
        }
    }

    
    @GetMapping("/cost/details/{id}")
    public ResponseEntity<?> getCostDetails(@PathVariable Integer id, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }

        try {
            WarrantyClaim claim = warrantyClaimService.GetClaimDetails(id);
            if (claim == null || claim.getClaimServices() == null) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            List<Map<String, Object>> details = claim.getClaimServices().stream()
                .map(cs -> {
                    WarrantyService ws = cs.getWarrantyService();
                    double cost = (ws != null && ws.getCost() != null) ? ws.getCost() : 0.0;
                    
                    Map<String, Object> map = new HashMap<>();
                    map.put("serviceName", ws != null ? ws.getName() : "Dịch vụ không xác định");
                    map.put("quantity", 1); 
                    map.put("unitPrice", cost);
                    map.put("totalPrice", cost);
                    return map;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(details);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400)
                                 .body(Map.of("message", "Lỗi server: " + e.getMessage()));
        }
    }

    private List<Map<String, Object>> formatClaimsList(List<WarrantyClaim> claims) {
        if (claims == null) {
            return new ArrayList<>();
        }
        return claims.stream().map(claim -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("claimId", "CR-" + claim.getClaimID());
            map.put("vin", claim.getVehicle() != null ? claim.getVehicle().getVIN() : "N/A");
            map.put("requester", claim.getCreatedByStaff() != null ? claim.getCreatedByStaff().getName() : "N/A");
            map.put("date", claim.getDate() != null ? dtf.format(claim.getDate()) : "N/A");
            map.put("status", claim.getStatus());
            return map;
        }).collect(Collectors.toList());
    }
}