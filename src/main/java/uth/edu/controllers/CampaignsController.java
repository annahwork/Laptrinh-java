package uth.edu.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.RecallCampaign;
import uth.edu.pojo.User;
import uth.edu.service.CampaignService;

@RestController
@RequestMapping("/api/evm_staff/campaigns")
public class CampaignsController {

    private final CampaignService campaignService;

    @Autowired
    public CampaignsController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getCampaigns(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            HttpSession session) {
        
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }

        try {
            List<RecallCampaign> campaigns = campaignService.GetCampaigns(page, pageSize);
            
            // Chuyển đổi an toàn sang JSON
            List<Map<String, Object>> result = campaigns.stream().map(c -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("campaignId", c.getCampaignID());
                map.put("name", c.getName());
                map.put("status", c.getStatus());
                map.put("startDate", formatDate(c.getDate()));
                map.put("createdBy", c.getCreatedByStaffName());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }


    @GetMapping("/details/{id}")
    public ResponseEntity<RecallCampaign> getCampaignDetails(@PathVariable int id, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }
        
        RecallCampaign campaign = campaignService.GetCampaignDetails(id);
        if (campaign == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(campaign);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCampaign(@RequestBody Map<String, String> payload, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền"));
        }
        
        try {
            RecallCampaign campaign = new RecallCampaign();
            campaign.setName(payload.get("name"));
            campaign.setDescription(payload.get("description"));
            campaign.setDate(parseDate(payload.get("startDate")));
            // Trạng thái mặc định khi tạo
            campaign.setStatus("Pending"); 

            boolean success = campaignService.CreateRecallCampaign(loggedInUser.getUserID(), campaign);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Tạo chiến dịch thành công"));
            } else {
                return ResponseEntity.status(400).body(Map.of("message", "Tạo chiến dịch thất bại"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi server: " + e.getMessage()));
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCampaign(@PathVariable int id, @RequestBody Map<String, String> payload, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền"));
        }

        try {
            RecallCampaign campaignData = new RecallCampaign();
            campaignData.setName(payload.get("name"));
            campaignData.setDescription(payload.get("description"));
            campaignData.setDate(parseDate(payload.get("startDate")));

            boolean success = campaignService.updateCampaign(loggedInUser.getUserID(), id, campaignData);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Cập nhật thành công"));
            } else {
                return ResponseEntity.status(400).body(Map.of("message", "Cập nhật thất bại"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi server: " + e.getMessage()));
        }
    }


    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveCampaign(@PathVariable int id, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền"));
        }

        boolean success = campaignService.approveCampaign(loggedInUser.getUserID(), id);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Duyệt chiến dịch thành công"));
        } else {
            return ResponseEntity.status(400).body(Map.of("message", "Duyệt thất bại"));
        }
    }


    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectCampaign(@PathVariable int id, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền"));
        }

        boolean success = campaignService.rejectCampaign(loggedInUser.getUserID(), id);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Từ chối chiến dịch thành công"));
        } else {
            return ResponseEntity.status(400).body(Map.of("message", "Từ chối thất bại"));
        }
    }

    private String formatDate(Date date) {
        if (date == null) return "N/A";
        return new SimpleDateFormat("dd/MM/yyyy").format(date);
    }
    
    private Date parseDate(String dateString) {
        try {
            if (dateString == null || dateString.isEmpty()) return new Date(); // Mặc định là hôm nay
            return new SimpleDateFormat("yyyy-MM-dd").parse(dateString);
        } catch (Exception e) {
            return new Date();
        }
    }
}