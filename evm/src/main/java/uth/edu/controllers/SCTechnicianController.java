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


    /*
    @GetMapping("/details/{id}")
    public ResponseEntity<RecallCampaign> getCampaignById(@PathVariable Integer id) {
        try {
            RecallCampaign campaign = campaignService.GetCampaignDetails(id);
            if (campaign == null)
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok(campaign);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    
    @PostMapping("/add")
    public ResponseEntity<?> addCampaign(@RequestBody Map<String, String> formData) {
        try {
            // Service của bạn yêu cầu một EVMStaffID, chúng ta phải lấy nó từ form.
            // Giả định frontend gửi kèm "evmStaffId" (sẽ cần cập nhật JS sau)
            Integer evmStaffId;
            try {
                // TODO: Cập nhật JS để gửi ID của nhân viên đang đăng nhập
                evmStaffId = Integer.parseInt(formData.getOrDefault("evmStaffId", "1")); 
            } catch (NumberFormatException | NullPointerException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Trường 'evmStaffId' là bắt buộc"));
            }

            RecallCampaign newCampaign = new RecallCampaign();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            newCampaign.setCampaignCode(formData.get("code")); // JS: campaign_code
            newCampaign.setName(formData.get("name")); // JS: campaign_name
            newCampaign.setStatus(formData.get("status")); // JS: campaign_status
            newCampaign.setDescription(formData.get("desc")); // JS: campaign_desc

            String startDateStr = formData.get("start"); // JS: campaign_start
            if (startDateStr != null && !startDateStr.isEmpty()) {
                newCampaign.setStartDate(sdf.parse(startDateStr));
            }

            String endDateStr = formData.get("end"); // JS: campaign_end
            if (endDateStr != null && !endDateStr.isEmpty()) {
                newCampaign.setEndDate(sdf.parse(endDateStr));
            }

            boolean success = campaignService.CreateRecallCampaign(evmStaffId, newCampaign);

            if (success) {
                return ResponseEntity.ok(Map.of("message", "Chiến dịch đã được tạo", "data", newCampaign));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Không thể tạo chiến dịch. ID nhân viên không hợp lệ?"));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi tạo chiến dịch: " + e.getMessage()));
        }
    }   */ 
}