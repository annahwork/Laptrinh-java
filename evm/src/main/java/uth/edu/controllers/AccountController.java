package uth.edu.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.User;
import uth.edu.service.UserService; 

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final UserService userService; 

    @Autowired
    public AccountController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user-info")
    public ResponseEntity<Map<String, Object>> getUserInfo(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Người dùng chưa đăng nhập."));
        }

        try {
            Map<String, Object> userInfo = new java.util.HashMap<>();
            userInfo.put("userID", loggedInUser.getUserID());
            userInfo.put("username", loggedInUser.getUserName());
            
            String fullName = loggedInUser.getName() != null ? loggedInUser.getName() : "Người dùng";
            String roleName = loggedInUser.getUser_Role();

            userInfo.put("fullName", fullName);
            userInfo.put("roleName", roleName);

            return ResponseEntity.ok(userInfo);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi server khi lấy thông tin người dùng."));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> data, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");

        if (loggedInUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Người dùng chưa đăng nhập."));
        }

        String oldPassword = data.get("oldPassword");
        String newPassword = data.get("newPassword");
        String confirmPassword = data.get("confirmPassword");

        if (oldPassword == null || newPassword == null || confirmPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đầy đủ thông tin mật khẩu."));
        }

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu mới và xác nhận mật khẩu không khớp."));
        }
        
        if (newPassword.length() < 6) { 
             return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu mới phải có ít nhất 6 ký tự."));
        }

        try {
            if (!userService.verifyPassword(loggedInUser.getUserID(), oldPassword)) {
                 return ResponseEntity.status(401).body(Map.of("message", "Mật khẩu cũ không đúng."));
            }

            boolean success = userService.updatePassword(loggedInUser.getUserID(), newPassword);
            
            if (success) {
                session.invalidate(); 
                return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại."));
            } else {
                return ResponseEntity.status(500).body(Map.of("message", "Không thể cập nhật mật khẩu. Vui lòng thử lại."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi server khi xử lý đổi mật khẩu."));
        }
    }
    @PostMapping("/update-info")
    public ResponseEntity<Map<String, String>> updateUserInfo(@RequestBody Map<String, String> data, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");

        if (loggedInUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Người dùng chưa đăng nhập."));
        }

        String newFullName = data.get("fullName");

        if (newFullName == null || newFullName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Họ và tên không được để trống."));
        }

        try {
            boolean success = userService.updateFullName(loggedInUser.getUserID(), newFullName); 
            
            if (success) {
                // Cập nhật tên trong session
                loggedInUser.setName(newFullName); 
                session.setAttribute("loggedInUser", loggedInUser);
                return ResponseEntity.ok(Map.of("message", "Cập nhật thông tin thành công."));
            } else {
                return ResponseEntity.status(500).body(Map.of("message", "Không thể cập nhật thông tin."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi server khi cập nhật thông tin."));
        }
    }
}