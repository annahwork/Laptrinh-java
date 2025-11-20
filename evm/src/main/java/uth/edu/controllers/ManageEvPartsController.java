package uth.edu.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.Inventory;
import uth.edu.pojo.Part;
import uth.edu.pojo.ServiceCenter;
import uth.edu.pojo.User;
import uth.edu.service.InventoryService;

@RestController
@RequestMapping("/api/evm_staff/manage_ev_parts")
public class ManageEvPartsController {

    private final InventoryService inventoryService;

    @Autowired
    public ManageEvPartsController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * API: Lấy danh sách phụ tùng tồn kho (cho bảng chính)
     */
    @GetMapping("/list")
    public ResponseEntity<?> getEVMStockList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            HttpSession session) {

        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Không có quyền truy cập"));
        }

        try {
            
            List<Inventory> stock = inventoryService.getAllInventoriesWithFilters(page, pageSize, search, type);
            int totalItems = inventoryService.countAllInventoriesWithFilters(search, type);
            
            List<Map<String, Object>> result = stock.stream().map(inv -> {
                Part part = inv.getPart();
                ServiceCenter inventorySC = inv.getServiceCenter(); // Lấy SC từ chính inventory
                
                Map<String, Object> map = new HashMap<>();
                map.put("inventoryId", inv.getInventoryID());
            
                map.put("partId", part != null ? part.getPartID() : null);
                map.put("partCode", part != null ? "PT-" + String.format("%03d", part.getPartID()) : "N/A");
                map.put("partName", part != null ? part.getName() : "N/A");
                map.put("partType", part != null ? part.getType() : "N/A");
                
                map.put("quantity", inv.getCurrentStock());
                
                // Hiển thị vị trí kho (tên của SC)
                map.put("location", inventorySC != null ? inventorySC.getName() : "N/A");
                
                return map;
            }).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("data", result);
            response.put("page", page);
            response.put("totalItems", totalItems);
            response.put("totalPages", (int) Math.ceil((double) totalItems / pageSize));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("message", "Lỗi server: " + e.getMessage()));
        }
    }

    @PostMapping("/add-part")
    public ResponseEntity<?> addNewPart(@RequestBody Map<String, String> payload, HttpSession session) {
        
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Không có quyền thực hiện"));
        }


        try {
            String partName = payload.get("name");
            String partType = payload.get("partType");
            
            Integer quantity = 0;
            try {
                String quantityStr = payload.get("quantity");
                if (quantityStr != null && !quantityStr.isEmpty()) {
                    quantity = Integer.parseInt(quantityStr);
                }
            } catch (NumberFormatException e) {
                // Bỏ qua, quantity = 0
            }

            if (partName == null || partName.trim().isEmpty() || partType == null || partType.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                     .body(Map.of("message", "Tên phụ tùng và Loại là bắt buộc."));
            }

            // Gọi hàm service (bản đã sửa, không cần SCID)
            Part newPart = inventoryService.createNewPartAndAddToStock(
                partName,
                partType,
                quantity
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                                 .body(Map.of(
                                     "message", "Thêm phụ tùng mới và nhập kho thành công!", 
                                     "partId", newPart.getPartID()
                                 ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("message", "Lỗi server khi tạo phụ tùng: " + e.getMessage()));
        }
    }
}