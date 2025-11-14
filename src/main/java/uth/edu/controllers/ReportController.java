package uth.edu.controllers;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.User;
import uth.edu.service.ReportService;

@RestController
@RequestMapping("/api/evm_staff/reports")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }
    
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummaryReport(
            // BỎ COMMENT 2 DÒNG NÀY
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String type,
            HttpSession session) {

        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).body(Map.of("error", "Không có quyền"));
        }
        
        try {
            // Bây giờ 'month' và 'type' đã hợp lệ
            Map<String, Object> summaryReport = reportService.GenerateSummaryReport(loggedInUser.getUserID(), month, type);
            return ResponseEntity.ok(summaryReport);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi Server khi tạo báo cáo tổng hợp."));
        }
    }
}