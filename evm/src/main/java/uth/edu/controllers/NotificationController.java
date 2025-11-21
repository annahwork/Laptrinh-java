package uth.edu.controllers;

import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.Notification;
import uth.edu.pojo.User;
import uth.edu.service.NotificationService;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createNotification(
            @RequestParam Integer userID,
            @RequestParam String title,
            @RequestParam String message) {
        boolean success = notificationService.CreateNotification(userID, title, message);
        if (success) return ResponseEntity.ok("Tạo thông báo thành công!");
        else return ResponseEntity.badRequest().body("Tạo thông báo thất bại (User không tồn tại?).");
    }

    @GetMapping("/user")
    public ResponseEntity<List<Notification>> getAllUserNotifications(HttpSession session, @RequestParam Integer userID) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }
        List<Notification> notifs = notificationService.GetNotifications(userID);
        return ResponseEntity.ok(notifs);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(HttpSession session, @PathVariable Integer id) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }
        Notification notif = notificationService.getNotificationById(id);
        if (notif != null) return ResponseEntity.ok(notif);
        else return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<String> updateNotification(HttpSession session, @PathVariable Integer id, @RequestParam String title, @RequestParam String message) {

        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }
        boolean success = notificationService.updateNotification(id, title, message);
        if (success) return ResponseEntity.ok("Cập nhật thành công!");
        else return ResponseEntity.status(404).body("Không tìm thấy thông báo để sửa.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(HttpSession session, @PathVariable Integer id) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }
        boolean success = notificationService.deleteNotification(id);
        if (success) return ResponseEntity.ok("Xóa thành công!");
        else return ResponseEntity.status(404).body("Không tìm thấy thông báo.");
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(HttpSession session, @PathVariable Integer id) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }
        boolean success = notificationService.MarkNotificationAsRead(id);
        if (success) return ResponseEntity.ok("Đánh dấu đã đọc!");
        else return ResponseEntity.status(404).body("Không tìm thấy thông báo.");
    }

    @PutMapping("/user/{userId}/readall")
    public ResponseEntity<String> markAllAsRead(HttpSession session, @PathVariable Integer userId) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }
        boolean success = notificationService.MarkAllNotificationsAsRead(userId);
        if (success) return ResponseEntity.ok("Đã đánh dấu tất cả!");
        else return ResponseEntity.badRequest().body("Lỗi.");
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(HttpSession session, @PathVariable Integer userId) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }
        List<Notification> notifs = notificationService.GetUnreadNotifications(userId, 1, 9999);
        return ResponseEntity.ok(notifs);
    }

}