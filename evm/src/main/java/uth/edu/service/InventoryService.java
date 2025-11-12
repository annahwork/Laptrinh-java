package uth.edu.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uth.edu.pojo.AllocatePartHistory;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.Inventory;
import uth.edu.pojo.Part;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.ServiceCenter;
import uth.edu.pojo.User;
import uth.edu.repositories.AllocatePartHistoryRepository;
import uth.edu.repositories.InventoryRepository;
import uth.edu.repositories.PartRepository;
import uth.edu.repositories.ServiceCenterRepository;
import uth.edu.repositories.UserRepository;

@Service
public class InventoryService {

    private InventoryRepository inventoryRepository;
    private PartRepository partRepository;
    private ServiceCenterRepository serviceCenterRepository;
    private UserRepository userRepository; 
    private AllocatePartHistoryRepository allocateHistoryRepository;
    private NotificationService notificationService; 

    private static final int DEFAULT_PAGE = 1;
    private static final int MAX_PAGE_SIZE = 9999;
    private static final String EVM_WAREHOUSE_TYPE = "EVM_Warehouse"; 
    private static final int LOW_STOCK_THRESHOLD = 10; 

    
   @Autowired
    public InventoryService( InventoryRepository inventoryRepository, PartRepository partRepository, ServiceCenterRepository serviceCenterRepository, UserRepository userRepository, AllocatePartHistoryRepository allocateHistoryRepository, NotificationService notificationService 
    ) {
        this.inventoryRepository = inventoryRepository;
        this.partRepository = partRepository;
        this.serviceCenterRepository = serviceCenterRepository;
        this.userRepository = userRepository;
        this.allocateHistoryRepository = allocateHistoryRepository;
        this.notificationService = notificationService;
    }

    public List<Part> GetParts(int page, int pageSize) {
        try {
            if (page <= 0) page = DEFAULT_PAGE;
            if (pageSize <= 0) pageSize = 10;
            
            return partRepository.getAllParts(page, pageSize);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<Inventory> GetPartStock(Integer PartID) {
        try {
            return inventoryRepository.getInventoriesByPartID(PartID, DEFAULT_PAGE, MAX_PAGE_SIZE);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public boolean AllocatePartsToSC(Integer EVMStaffID, Integer PartID, Integer Quantity, Integer toScId) {
        try {
            User staff = userRepository.getUserById(EVMStaffID);
            if (staff == null || !(staff instanceof EVMStaff)) {
                return false; 
            }
            
            ServiceCenter evmWarehouse = serviceCenterRepository.getServiceCenterByType(EVM_WAREHOUSE_TYPE);
            if (evmWarehouse == null) return false; 
            Inventory fromStock = inventoryRepository.getInventoryByPartAndSC(PartID, evmWarehouse.getSCID());
            if (fromStock == null || fromStock.getCurrentStock() < Quantity) {
                return false; 
            }

            Inventory toStock = inventoryRepository.getInventoryByPartAndSC(PartID, toScId);
            Part part = partRepository.getPartById(PartID);
            
            if (toStock == null) {
                ServiceCenter sc = serviceCenterRepository.getServiceCenterById(toScId);
                if (part == null || sc == null) return false;
                
                toStock = new Inventory(null, part, sc, 0); // Bắt đầu với 0
                inventoryRepository.addInventory(toStock);
                toStock = inventoryRepository.getInventoryByPartAndSC(PartID, toScId);
            }

            AllocatePartHistory history = new AllocatePartHistory();
            history.setFromInventory(fromStock);
            history.setToInventory(toStock);
            history.setPart(part);
            history.setQuantity(Quantity);
            history.setCreatedByEVMStaff((EVMStaff) staff);
            history.setStatus("Pending");
            history.setAllocationDate(new Date());

            allocateHistoryRepository.addAllocatePartHistory(history);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean ReceiveParts(Integer SCStaffID, Integer AllocationID) {
        try {
            User staff = userRepository.getUserById(SCStaffID);
            if (staff == null || !(staff instanceof SCStaff) || staff.getServiceCenter() == null) {
                return false; 
            }
            
            AllocatePartHistory history = allocateHistoryRepository.getAllocatePartHistoryById(AllocationID);
            if (history == null || !history.getStatus().equals("Pending")) {
                return false; 
            }
            
            Integer staffScId = staff.getServiceCenter().getSCID();
            if (!history.getToInventory().getServiceCenter().getSCID().equals(staffScId)) {
                return false; 
            }

            Inventory fromStock = history.getFromInventory();
            Inventory toStock = history.getToInventory();
            Integer quantity = history.getQuantity();

            if (fromStock.getCurrentStock() < quantity) {
                history.setStatus("Failed (Out of Stock)");
                allocateHistoryRepository.updateAllocatePartHistory(history);
                return false; 
            }

            fromStock.setCurrentStock(fromStock.getCurrentStock() - quantity);
            toStock.setCurrentStock(toStock.getCurrentStock() + quantity);

            history.setStatus("Completed");
            history.setApprovedBySCStaff((SCStaff) staff);
            history.setApprovalDate(new Date());

            return inventoryRepository.approveAllocationTransaction(fromStock, toStock, history);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void CheckStockLevels() {
        try {
            List<Inventory> allStock = inventoryRepository.getAllInventoriesWithDetails(DEFAULT_PAGE, MAX_PAGE_SIZE); 
            if (allStock == null) return;

            List<User> evmStaffList = userRepository.getUsersByRole("EVM_STAFF");
            if (evmStaffList == null || evmStaffList.isEmpty()) {
                return; 
            }

            for (Inventory item : allStock) {
                if (item.getCurrentStock() < LOW_STOCK_THRESHOLD) {
                    
                    String message = String.format(
                        "Cảnh báo: Tồn kho thấp. Phụ tùng [%s] (ID: %d) tại [%s] chỉ còn %d.",
                        item.getPart().getName(),
                        item.getPart().getPartID(),
                        item.getServiceCenter().getName(),
                        item.getCurrentStock()
                    );
                    
                    System.out.println("GỬI CẢNH BÁO: " + message);

                    for (User evmStaff : evmStaffList) {
                        notificationService.CreateNotification(evmStaff.getUserID(), "Tồn kho thấp", message);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public int getTotalPartsInStock() {
        try {
            List<Inventory> allStock = inventoryRepository.getAllInventories(DEFAULT_PAGE, MAX_PAGE_SIZE); 
            if (allStock == null || allStock.isEmpty()) {
                return 0;
            }
            return allStock.stream().mapToInt(Inventory::getCurrentStock).sum();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public int countLowStockItems() {
        try {
            List<Inventory> allStock = inventoryRepository.getAllInventories(DEFAULT_PAGE, MAX_PAGE_SIZE);
            if (allStock == null || allStock.isEmpty()) {
                return 0;
            }
            long count = allStock.stream()
                                 .filter(item -> item.getCurrentStock() < LOW_STOCK_THRESHOLD)
                                 .count();
            return (int) count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
    public List<AllocatePartHistory> getRecentAllocations(int page, int pageSize) {
        try {
            if (page <= 0) page = DEFAULT_PAGE;
            if (pageSize <= 0) pageSize = 5; 
            return allocateHistoryRepository.getAllAllocatePartHistories(page, pageSize);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public void closeResources() {
        try {
            inventoryRepository.closeResources();
            partRepository.closeResources(); 
            serviceCenterRepository.closeResources();
            userRepository.closeResources();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}