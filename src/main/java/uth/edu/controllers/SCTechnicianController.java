package uth.edu.controllers;

import uth.edu.pojo.RecallCampaign;
import uth.edu.pojo.RecallVehicle;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.User;
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

import uth.edu.service.NotificationService;

@RestController
@RequestMapping("/api") 
public class SCTechnicianController {

    private final CampaignService campaignService;
    private final NotificationService notificationService;
    private final ScheduleService scheduleService;

    @Autowired
    public SCTechnicianController(CampaignService campaignService, NotificationService notificationService, ScheduleService scheduleService) {
        this.campaignService = campaignService;
        this.notificationService = notificationService;
        this.scheduleService = scheduleService;
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

    @GetMapping("/recall")
    public ResponseEntity<?> getAllRecall(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof SCTechnician)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            List<RecallVehicle> recallVehicles = campaignService.GetRecall(loggedInUser.getUserID());
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
            List<Object[]> scheduleVehicles = scheduleService.getScheduleVehicleInfo(loggedInUser.getUserID());
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

}