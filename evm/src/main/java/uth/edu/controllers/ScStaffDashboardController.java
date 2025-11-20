package uth.edu.controllers;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import uth.edu.pojo.Customer;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.Notification;
import uth.edu.pojo.RecallCampaign;
import uth.edu.pojo.RecallVehicle;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.Schedule;
import uth.edu.pojo.User;
import uth.edu.pojo.Vehicle;
import uth.edu.service.CampaignService;
import uth.edu.service.NotificationService;
import uth.edu.service.ScheduleService;
import uth.edu.service.UserService;

@RestController
@RequestMapping("/api/sc-staff/dashboard")
public class ScStaffDashboardController {

    @Autowired
    private CampaignService campaignService;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    private Integer resolveUserId(HttpSession session, Integer paramUserId) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Người dùng không có quyền");
        }

        if (paramUserId != null)
            return paramUserId;

        Object obj = session.getAttribute("user");
        if (obj instanceof User u)
            return u.getUserID();

        return 1;
    }

    @GetMapping("/summary")
    public Map<String, Long> getSummary(HttpSession session,
            @RequestParam(name = "userId", required = false) Integer userId) {

        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Người dùng không có quyền");
        }
        Integer uid = resolveUserId(session, userId);

        Map<String, Long> result = new HashMap<>();

        List<RecallVehicle> recallVehicles = campaignService.GetRecallVehicles(uid);
        List<RecallCampaign> campaigns = campaignService.GetCampaigns(uid);
        List<Schedule> schedules = scheduleService.GetScheduleForSC(uid);
        List<Notification> notifications = notificationService.GetNotifications(uid);

        long totalVehicles = recallVehicles.stream()
                .map(RecallVehicle::getVehicle)
                .filter(Objects::nonNull)
                .map(Vehicle::getVIN)
                .filter(Objects::nonNull)
                .distinct()
                .count();

        long totalCustomers = (long) userService.countAllCustomers();
        long totalWarranty = recallVehicles.size();
        long totalCampaigns = campaigns.size();

        result.put("totalVehicles", totalVehicles);
        result.put("totalCustomers", totalCustomers);
        result.put("totalWarranty", totalWarranty);
        result.put("totalCampaigns", totalCampaigns);

        return result;
    }

    @GetMapping("/campaigns")
    public List<RecallCampaign> getCampaigns(HttpSession session,
            @RequestParam(name = "userId", required = false) Integer userId) {

        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Người dùng không có quyền");

        }

        Integer uid = resolveUserId(session, userId);
        return campaignService.GetCampaigns(uid);
    }

    @GetMapping("/schedule-today")
    public List<Schedule> getScheduleToday(HttpSession session,
            @RequestParam(name = "userId", required = false) Integer userId) {

        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Người dùng không có quyền");
        }

        Integer uid = resolveUserId(session, userId);
        LocalDate today = LocalDate.now(ZoneId.systemDefault());

        return scheduleService.GetScheduleForSC(uid).stream()
                .filter(s -> s.getDate() != null)
                .filter(s -> {
                    LocalDate d = s.getDate().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();
                    return d.isEqual(today);
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/notifications")
    public List<Notification> getNotifications(HttpSession session,
            @RequestParam(name = "userId", required = false) Integer userId) {

        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Người dùng không có quyền");
        }

        Integer uid = resolveUserId(session, userId);
        return notificationService.GetNotifications(uid);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getCustomers(HttpSession session,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "pageSize", required = false, defaultValue = "20") int pageSize) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }

        List<Customer> customers = userService.getAllCustomers(page, pageSize);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/customer/count")
    public ResponseEntity<Integer> countCustomers(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }

        int count = userService.countAllCustomers();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/customer/get/{id}")
    public ResponseEntity<Customer> getCustomer(HttpSession session, @PathVariable("id") int id) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof SCStaff)) {
            return ResponseEntity.status(401).build();
        }
        Customer customer = userService.getCustomerById(id);
        if (customer == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(customer);
    }

    @PostMapping("/customer/create")
    public ResponseEntity<?> addCustomer(HttpSession session, @RequestBody Customer customer) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }
        try {
            userService.addCustomer(customer);
            return ResponseEntity.ok("Tạo khách hàng thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Tạo khách hàng thất bại!");
        }
    }

    @PutMapping("/customer/update/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable("id") int id, @RequestBody Customer updateData) {
        Customer existing = userService.getCustomerById(id);
        if (existing == null)
            return ResponseEntity.notFound().build();

        existing.setName(updateData.getName());
        existing.setEmail(updateData.getEmail());
        existing.setPhone(updateData.getPhone());
        existing.setAddress(updateData.getAddress());

        userService.updateCustomer(existing);
        return ResponseEntity.ok("Cập nhật khách hàng thành công!");
    }

    @DeleteMapping("/customer/delete/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable("id") int id) {
        Customer customer = userService.getCustomerById(id);
        if (customer == null)
            return ResponseEntity.notFound().build();

        userService.deleteCustomer(customer);
        return ResponseEntity.ok("Xóa khách hàng thành công!");
    }
}
