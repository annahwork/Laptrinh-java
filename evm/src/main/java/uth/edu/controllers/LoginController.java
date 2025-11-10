package uth.edu.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.User;
import uth.edu.service.UserService;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final UserService userService;

    @Autowired
    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            String userType = credentials.get("userType"); 

            if (username == null || password == null || userType == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đầy đủ thông tin."));
            }

            User user = userService.Login(username, password);

            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Tên đăng nhập hoặc mật khẩu không chính xác."));
            }

            String userRole = user.getUser_Role();

            boolean isValidRoleForType = false;
            if ("hang".equals(userType) && ("ADMIN".equals(userRole) || "EVM_STAFF".equals(userRole))) {
                isValidRoleForType = true;
            } else if ("trungtam".equals(userType) && ("SC_STAFF".equals(userRole) || "SC_TECHNICIAN".equals(userRole))) {
                isValidRoleForType = true;
            }

            if (!isValidRoleForType) {
                return ResponseEntity.status(401).body(Map.of("message", "Bạn đã chọn sai loại tài khoản. Vui lòng kiểm tra lại."));
            }

            HttpSession session = request.getSession(true); 
            session.setAttribute("loggedInUser", user);
            session.setMaxInactiveInterval(60 * 60 * 8);

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi máy chủ nội bộ: " + e.getMessage()));
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            return ResponseEntity.ok(Map.of("message", "Đăng xuất thành công."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi khi đăng xuất."));
        }
    }
}