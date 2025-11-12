package uth.edu.controllers;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.Notification;
import uth.edu.pojo.User;
import uth.edu.service.CampaignService;
import uth.edu.service.InventoryService;
import uth.edu.service.NotificationService;
import uth.edu.service.WarrantyClaimService;

/**
 * Controller này cung cấp dữ liệu API cho trang Dashboard của EVM Staff.
 */
@RestController
@RequestMapping("/api/evm_staff/dashboard") // Khớp với API_BASE trong file JS
public class EVMStaffDashboardController {

    // Khởi tạo các service theo cách thủ công (giống trong file UserController của bạn)
    private final InventoryService inventoryService;
    private final WarrantyClaimService warrantyClaimService;
    private final CampaignService campaignService;
    private final NotificationService notificationService;

    public EVMStaffDashboardController() {
        this.inventoryService = new InventoryService();
        this.warrantyClaimService = new WarrantyClaimService();
        this.campaignService = new CampaignService();
        this.notificationService = new NotificationService();
    }

    /**
     * Cung cấp dữ liệu cho 4 thẻ thống kê trên cùng.
     */
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverviewStats(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }

        try {
            // Gọi các hàm service mới đã thêm
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

    /**
     * Cung cấp dữ liệu cho bảng "Cấp phát phụ tùng gần đây".
     */
    @GetMapping("/recent-allocations")
    public ResponseEntity<List<Map<String, Object>>> getRecentAllocations(HttpSession session) {
        // TODO: Bạn cần một bảng/repository (ví dụ: AllocationHistory) để lưu
        // lịch sử cấp phát. Hiện tại, service "AllocatePartsToSC" chỉ trừ kho
        // chứ không ghi lại lịch sử.
        
        // --- TẠM THỜI DÙNG DỮ LIỆU GIẢ (MOCK DATA) ĐỂ TEST GIAO DIỆN ---
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        List<Map<String, Object>> allocations = List.of(
            Map.of(
                "requestCode", "REQ-2301",
                "partName", "Bộ lọc dầu",
                "quantity", 5,
                "date", LocalDate.now().minusDays(1).format(dtf),
                "status", "Hoàn tất",
                "statusClass", "status-tag--success"
            ),
            Map.of(
                "requestCode", "REQ-2302",
                "partName", "Bình ắc quy",
                "quantity", 2,
                "date", LocalDate.now().format(dtf),
                "status", "Đang xử lý",
                "statusClass", "status-tag--pending"
            )
        );
        
        return ResponseEntity.ok(allocations);
    }

   @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
             return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        
        try {
            // Lấy 5 thông báo chưa đọc mới nhất
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