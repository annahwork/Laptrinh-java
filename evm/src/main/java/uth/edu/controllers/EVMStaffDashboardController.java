package uth.edu.controllers;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.AllocatePartHistory;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.Notification;
import uth.edu.pojo.User;
import uth.edu.service.CampaignService;
import uth.edu.service.InventoryService;
import uth.edu.service.NotificationService;
import uth.edu.service.WarrantyClaimService;


@RestController
@RequestMapping("/api/evm_staff/dashboard")
public class EVMStaffDashboardController {

    private final InventoryService inventoryService;
    private final WarrantyClaimService warrantyClaimService;
    private final CampaignService campaignService;
    private final NotificationService notificationService;

    @Autowired 
    public EVMStaffDashboardController( InventoryService inventoryService, WarrantyClaimService warrantyClaimService, CampaignService campaignService, NotificationService notificationService ) {
        this.inventoryService = inventoryService;
        this.warrantyClaimService = warrantyClaimService;
        this.campaignService = campaignService;
        this.notificationService = notificationService;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverviewStats(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }

        try {
            int totalParts = inventoryService.getTotalPartsInStock();
            List<String> activeStatus = List.of("Pending", "In Progress", "Đã gửi");
            int activeRequests = warrantyClaimService.countClaimsByStatus(activeStatus);
            int activeCampaigns = campaignService.countCampaignsByStatus("Active");
            int lowStock = inventoryService.countLowStockItems();

            Map<String, Object> stats = Map.of(
                "totalParts", totalParts,
                "activeRequests", activeRequests,
                "activeCampaigns", activeCampaigns,
                "lowStock", lowStock
            );

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/recent-allocations")
    public ResponseEntity<List<Map<String, Object>>> getRecentAllocations(HttpSession session) {
        
        try {
            List<AllocatePartHistory> historyList = inventoryService.getRecentAllocations(1, 5);
            if (historyList == null) {
                historyList = new ArrayList<>();
            }

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            List<Map<String, Object>> allocations = historyList.stream().map(history -> {
                String status = history.getStatus();
                String statusClass = "";

                switch (status.toLowerCase()) {
                    case "completed":
                        statusClass = "status-tag--success";
                        break;
                    case "pending":
                        statusClass = "status-tag--pending";
                        break;
                    case "failed (out of stock)":
                    case "rejected":
                        statusClass = "status-tag--danger";
                        break;
                    default:
                        statusClass = "status-tag--info";
                }
                
                String formattedDate = "N/A";
                if (history.getAllocationDate() != null) {
                    formattedDate = history.getAllocationDate().toInstant()
                                    .atZone(java.time.ZoneId.systemDefault())
                                    .toLocalDate()
                                    .format(dtf);
                }

                Map<String, Object> map = new java.util.HashMap<>();
                map.put("requestCode", "REQ-" + history.getAllocationID());
                map.put("partName", history.getPart() != null ? history.getPart().getName() : "N/A");
                map.put("quantity", history.getQuantity());
                map.put("date", formattedDate);
                map.put("status", status);
                map.put("statusClass", statusClass);
                return map;
                
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(allocations);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }

   @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
             return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        
        try {
            List<Notification> notifs = notificationService.GetUnreadNotifications(loggedInUser.getUserID(), 1, 5);
            
            List<Map<String, Object>> result = notifs.stream()
                .map(n -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("message", "🔹 " + n.getTitle() + ": " + n.getMessage());
                    return map;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}