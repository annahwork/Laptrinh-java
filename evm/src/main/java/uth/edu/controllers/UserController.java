package uth.edu.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.Admin;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.User;
import uth.edu.service.UserService;
import uth.edu.service.VehicleService;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final VehicleService vehicleService;

    @Autowired
    public UserController(UserService userService, VehicleService vehicleService) {
        this.userService = userService;
        this.vehicleService = vehicleService;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof Admin)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            List<User> users = userService.GetUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    @GetMapping("/technicians")
    public ResponseEntity<?> getAllTechnicians(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof Admin)) {
             return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            List<User> technicians = userService.GetTechnicians();
            return ResponseEntity.ok(technicians);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    @PostMapping("/add-user")
    public ResponseEntity<?> addUser(HttpSession session,@RequestBody Map<String, String> formData) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof Admin)) {
             return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            String userName = formData.get("UserName");
            String password = formData.get("Password");
            String name = formData.get("Name");
            String userRole = formData.get("UserRole");
            String email = formData.get("Email");
            String phone = formData.get("Phone");

            User newUser;
            switch (userRole) {
                case "ADMIN":
                    newUser = new Admin(userName, password, name, email, phone);
                    break;
                case "EVM_STAFF":
                    newUser = new EVMStaff(userName, password, name, email, phone);
                    break;
                case "SC_STAFF":
                    newUser = new SCStaff(userName, password, name, email, phone);
                    break;
                case "SC_TECHNICIAN":
                    newUser = new SCTechnician(userName, password, name, email, phone);
                    break;
                default:
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid role"));
            }

            User savedUser = userService.createUserWithRole(newUser, userRole);
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create user: " + e.getMessage()));
        }
    }

    @GetMapping("/users/filter")
    public ResponseEntity<?> getUsersByRole(HttpSession session, @RequestParam(required = false) String role) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof Admin)) {
             return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        List<User> users = role == null || role.isEmpty() ? userService.GetUsers() : userService.GetUserByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/profile/{id}")
    public ResponseEntity<?> getUserById(HttpSession session, @PathVariable int id) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof Admin)) {
             return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            User user = userService.GetUserProfile(id);
            if (user == null)
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<?> deleteUser(HttpSession session, @PathVariable int id) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof Admin)) {
             return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        boolean deleted = userService.deleteUser(id);
        if (!deleted)
            return ResponseEntity.status(500).body(Map.of("error", "Failed to delete user"));
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @GetMapping("/user/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof Admin)) {
             return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            int totalEmployees = userService.countAllUsers();
            int totalVehicles = vehicleService.countAllVehicles();
            int totalCustomers = userService.countAllCustomer();
            int totalWarrantyClaims = userService.countAllWarrantyClaims();
            int totalAdmins = userService.countUsersByRole("ADMIN");
            int totalSCStaff = userService.countUsersByRole("SC_STAFF");
            int totalSCTech = userService.countUsersByRole("SC_TECHNICIAN");
            int totalEVMStaff = userService.countUsersByRole("EVM_STAFF");

            Map<String, Object> stats = Map.of(
                    "totalEmployees", totalEmployees,
                    "totalVehicles", totalVehicles,
                    "totalCustomers", totalCustomers,
                    "totalWarrantyClaims", totalWarrantyClaims,
                    "roles", Map.of(
                            "ADMIN", totalAdmins,
                            "SC_STAFF", totalSCStaff,
                            "SC_TECHNICIAN", totalSCTech,
                            "EVM_STAFF", totalEVMStaff));

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/users/update/{id}")
    public ResponseEntity<?> updateUser(HttpSession session, @PathVariable int id, @RequestBody Map<String, String> formData) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null || !(loggedInUser instanceof Admin)) {
             return ResponseEntity.status(401).body(Map.of("message", "Không có quyền truy cập"));
        }
        try {
            User existingUser = userService.GetUserProfile(id);
            if (existingUser == null) {
                return ResponseEntity.status(404)
                        .body(Map.of("error", "User không tồn tại"));
            }

            existingUser.setUserName(formData.getOrDefault("UserName", existingUser.getUserName()));
            String password = formData.get("Password");
            if (password != null && !password.isEmpty()) {
                existingUser.setPassword(password);
            }
            existingUser.setName(formData.getOrDefault("Name", existingUser.getName()));
            existingUser.setEmail(formData.getOrDefault("Email", existingUser.getEmail()));
            existingUser.setPhone(formData.getOrDefault("Phone", existingUser.getPhone()));

            String role = formData.getOrDefault("UserRole", existingUser.getUser_Role());

            User updatedUser = userService.updateUserWithRole(existingUser, role);
            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Lỗi khi cập nhật user: " + e.getMessage()));
        }
    }
}