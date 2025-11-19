package uth.edu.controllers;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.User;
import uth.edu.pojo.WarrantyClaim;
import uth.edu.pojo.WarrantyHistory;
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