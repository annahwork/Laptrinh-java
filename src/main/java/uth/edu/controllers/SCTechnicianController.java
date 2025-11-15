package uth.edu.controllers;

import uth.edu.pojo.RecallCampaign;
import uth.edu.pojo.RecallVehicle;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.User;
import uth.edu.pojo.ClaimService;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.Notification;
import uth.edu.service.CampaignService;
import uth.edu.service.ScheduleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import uth.edu.pojo.VehiclePart;
import uth.edu.service.NotificationService;
import uth.edu.service.VehicleService;
import uth.edu.service.WarrantyClaimService;

@RestController
@RequestMapping("/api") 
public class SCTechnicianController {

    private final CampaignService campaignService;
    private final NotificationService notificationService;
    private final ScheduleService scheduleService;
    private final WarrantyClaimService warrantyClaimService;
    private final VehicleService vehicleService;

    @Autowired
    public SCTechnicianController(CampaignService campaignService, NotificationService notificationService, ScheduleService scheduleService, WarrantyClaimService warrantyClaimService, VehicleService vehicleService) {
        this.campaignService = campaignService;
        this.notificationService = notificationService;
        this.scheduleService = scheduleService;
        this.warrantyClaimService = warrantyClaimService;
        this.vehicleService = vehicleService;
    }

    @GetMapping("/campaigns")
    public ResponseEntity<?> getAllTechnicians(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof SCTechnician)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            List<RecallCampaign> campaigns = campaignService.GetCampaigns(loggedInUser.getUserID());
            return ResponseEntity.ok(campaigns);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }


    @GetMapping("/recallvehicles")
    public ResponseEntity<?> getAllRecallVehicles(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof SCTechnician)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            List<RecallVehicle> recallVehicles = campaignService.GetRecallVehicles(loggedInUser.getUserID());
            return ResponseEntity.ok(recallVehicles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    @GetMapping("/schedulevehicle")
    public ResponseEntity<?> etScheduleVehicleInfo(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof SCTechnician)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            List<Object[]> scheduleVehicles = scheduleService.getScheduleVehicleTodayInfo(loggedInUser.getUserID());
            return ResponseEntity.ok(scheduleVehicles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    @GetMapping("/report")
    public ResponseEntity<?> getAllReportRecallVehicle(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof SCTechnician)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            List<Object[]> reportData = campaignService.GetCampaignReport(loggedInUser.getUserID());
            return ResponseEntity.ok(reportData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getAllNotifications(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof SCTechnician)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            List<Notification> notifications = notificationService.GetUnreadNotifications(loggedInUser.getUserID(),1,20);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    @GetMapping("/latestNotification")
    public ResponseEntity<?> getLatestNotification(HttpSession session){
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof SCTechnician)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            Notification notification = notificationService.getLatestNotification(loggedInUser.getUserID());
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    @GetMapping("/claimServiceDetails")
    public ResponseEntity<?> getclaimServiceDetails(HttpSession session){
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof SCTechnician)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            List<Object[]>  claimService = warrantyClaimService.getClaimServiceDetails(loggedInUser.getUserID());
            return ResponseEntity.ok(claimService);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }
    
    @GetMapping("/warrantyPart")
    public ResponseEntity<?> getWarrantyPartsForTechnician(HttpSession session){
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof SCTechnician)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            List<VehiclePart>  vehicleParts = vehicleService.getWarrantyPartsForTechnician(loggedInUser.getUserID());
            return ResponseEntity.ok(vehicleParts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }


    @GetMapping("/performance")
    public ResponseEntity<?> getPerformanceMetrics(HttpSession session){
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof SCTechnician)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            Long[]  claimdataService = warrantyClaimService.getPerformanceMetrics(loggedInUser.getUserID());
            return ResponseEntity.ok(claimdataService);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    @PostMapping("/markAllRead")
    public ResponseEntity<?> markAllRead(Integer userID) { 
        try {
            boolean success = notificationService.MarkAllNotificationsAsRead(userID);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Đánh dấu tất cả đã đọc thành công."));
            } else {
                return ResponseEntity.ok(Map.of("message", "Không có thông báo nào cần đánh dấu."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi server khi đánh dấu tất cả đã đọc."));
        }
    }

    @PostMapping("/markRead/{id}")
    public ResponseEntity<?> markRead(@PathVariable("id") Integer id) {
        try {
            boolean success = notificationService.MarkNotificationAsRead(id);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Đánh dấu đã đọc thành công."));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Không tìm thấy thông báo hoặc đã được đọc."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi server khi đánh dấu đã đọc."));
        }
    }

    @PostMapping("/updateClaimServiceStatus/{id}")
    public ResponseEntity<?> updateClaimServiceStatus(HttpSession session, @PathVariable("id") Integer claimServID,@RequestBody Map<String, String> requestBody ) 
    {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof SCTechnician)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        
        String newStatus = requestBody.get("status");
        
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Trạng thái mới không được rỗng."));
        }

        try {

            boolean success = warrantyClaimService.updateClaimStatus(loggedInUser.getUserID(), claimServID, newStatus); 

            if (success) {
                return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công."));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body(Map.of("error", "Không tìm thấy Dịch vụ Bảo hành hoặc cập nhật thất bại."));
            }
            
        } catch (Exception e) {
            System.err.println("Lỗi Server khi cập nhật ClaimService ID " + claimServID + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Lỗi server khi cập nhật trạng thái."));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable("id") Integer id) {
        try {
            boolean success = notificationService.deleteNotification(id);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Xóa thông báo thành công."));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Không tìm thấy thông báo."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi server khi xóa thông báo."));
        }
    }   

    @DeleteMapping("/deletewc/{id}")
    public ResponseEntity<?> deleteWarrantyClaim(@PathVariable("id") Integer id) {
        try {
            boolean success = warrantyClaimService.deleteWarrantyClaim(id);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Xóa thông báo thành công."));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Không tìm thấy thông báo."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi server khi xóa thông báo."));
        }
    }   

}   