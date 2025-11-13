package uth.edu.controllers;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.AllocatePartHistory;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.Inventory;
import uth.edu.pojo.ServiceCenter;
import uth.edu.pojo.User;
import uth.edu.service.InventoryService;

@RestController
@RequestMapping("/api/evm_staff/allocate_parts")
public class AllocatePartsController {

    private final InventoryService inventoryService;
    private final DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Autowired
    public AllocatePartsController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * API: Lấy danh sách phụ tùng tại kho tổng EVM
     */
    @GetMapping("/parts")
    public ResponseEntity<List<Map<String, Object>>> getPartsInEVMStock(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) String search, // <-- THÊM DÒNG NÀY
            @RequestParam(required = false) String type    // <-- THÊM DÒNG NÀY
            ) {
        
        try {
            // SỬA HÀM GỌI: Truyền tham số search và type xuống Service
            List<Inventory> stockList = inventoryService.getEVMWarehouseStock(page, pageSize, search, type);

            List<Map<String, Object>> result = stockList.stream().map(inventory -> {
                // ... (phần code còn lại của hàm này giữ nguyên)
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("partId", inventory.getPart().getPartID());
                map.put("partCode", "PT-" + String.format("%03d", inventory.getPart().getPartID()));
                map.put("partName", inventory.getPart().getName());
                map.put("partType", inventory.getPart().getType());
                map.put("quantity", inventory.getCurrentStock());
                map.put("location", inventory.getServiceCenter().getName()); 
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * API: Lấy lịch sử phân bổ gần đây (cho bảng dưới)
     */
    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getRecentHistory(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int pageSize) {
        
        try {
            List<AllocatePartHistory> historyList = inventoryService.getRecentAllocations(page, pageSize);

            List<Map<String, Object>> result = historyList.stream().map(history -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("allocationCode", "ALLOC-" + history.getAllocationID());
                map.put("date", history.getAllocationDate().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate().format(dtf));
                map.put("toCenter", history.getToInventory().getServiceCenter().getName());
                map.put("quantity", history.getQuantity());
                map.put("createdBy", history.getCreatedByEVMStaff().getName());
                map.put("status", history.getStatus());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * API: Lấy danh sách các Trung tâm Dịch vụ (để điền vào modal)
     */
    @GetMapping("/service-centers")
    public ResponseEntity<List<Map<String, Object>>> getTargetServiceCenters() {
        try {
            // Giả sử có hàm getTargetServiceCenters (lọc bỏ kho EVM)
            List<ServiceCenter> centers = inventoryService.getTargetServiceCenters();
            
            List<Map<String, Object>> result = centers.stream().map(sc -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("scId", sc.getSCID());
                map.put("name", sc.getName());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * API: Tạo một yêu cầu phân bổ mới
     */
    @PostMapping("/create")
    public ResponseEntity<?> createAllocation(
            @RequestBody Map<String, Object> payload,
            HttpSession session) {
        
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).body(Map.of("message", "Không có quyền"));
        }

        try {
            Integer partId = Integer.parseInt(payload.get("partId").toString());
            Integer toScId = Integer.parseInt(payload.get("toScId").toString());
            Integer quantity = Integer.parseInt(payload.get("quantity").toString());
            Integer evmStaffId = loggedInUser.getUserID();

            if (partId <= 0 || toScId <= 0 || quantity <= 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Dữ liệu không hợp lệ"));
            }

            boolean success = inventoryService.AllocatePartsToSC(evmStaffId, partId, quantity, toScId);

            if (success) {
                return ResponseEntity.ok(Map.of("message", "Đã tạo yêu cầu phân bổ thành công."));
            } else {
                return ResponseEntity.status(500).body(Map.of("message", "Tạo yêu cầu thất bại (có thể do hết hàng hoặc lỗi service)"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi server: " + e.getMessage()));
        }
    }
}