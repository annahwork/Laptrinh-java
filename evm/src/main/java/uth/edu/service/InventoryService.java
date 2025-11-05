package uth.edu.service;

import java.util.ArrayList; // Giả định
import java.util.List;

import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.Inventory;
import uth.edu.pojo.Part;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.ServiceCenter;
import uth.edu.pojo.User;
import uth.edu.repositories.InventoryRepository;
import uth.edu.repositories.PartRepository;
import uth.edu.repositories.ServiceCenterRepository;
import uth.edu.repositories.UserRepository;

public class InventoryService {

    // Khai báo các Repository cần thiết
    private InventoryRepository inventoryRepository;
    private PartRepository partRepository;
    private ServiceCenterRepository serviceCenterRepository;
    private UserRepository userRepository; // Dùng để xác thực
    
    // Giả định có NotificationService để gửi cảnh báo
    private NotificationService notificationService; 

    private static final int DEFAULT_PAGE = 1;
    private static final int MAX_PAGE_SIZE = 9999;
    private static final String EVM_WAREHOUSE_TYPE = "EVM_Warehouse"; 
    private static final int LOW_STOCK_THRESHOLD = 10; 

    public InventoryService() {
        inventoryRepository = new InventoryRepository();
        partRepository = new PartRepository();
        serviceCenterRepository = new ServiceCenterRepository();
        userRepository = new UserRepository();
        notificationService = new NotificationService(); 
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

    public boolean AllocatePartsToSC(Integer EVMStaffID, Integer PartID, Integer Quantity) {
        try {
            // 1. Xác thực
            User staff = userRepository.getUserById(EVMStaffID);
            if (staff == null || !(staff instanceof EVMStaff)) {
                return false; 
            }
            ServiceCenter evmWarehouse = serviceCenterRepository.getServiceCenterByType(EVM_WAREHOUSE_TYPE);
            if (evmWarehouse == null) {
                return false; 
            }

            Inventory evmStock = inventoryRepository.getInventoryByPartAndSC(PartID, evmWarehouse.getSCID());
            if (evmStock == null || evmStock.getCurrentStock() < Quantity) {
                return false; 
            }

            evmStock.setCurrentStock(evmStock.getCurrentStock() - Quantity);

            inventoryRepository.updateInventory(evmStock);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean ReceiveParts(Integer SCStaffID, Integer PartID, Integer Quantity) {
        try {
            User staff = userRepository.getUserById(SCStaffID);
            if (staff == null || !(staff instanceof SCStaff) || staff.getServiceCenter() == null) {
                return false; 
            }
            
            Integer scId = staff.getServiceCenter().getSCID();

            Inventory scStock = inventoryRepository.getInventoryByPartAndSC(PartID, scId);

            if (scStock == null) {
                Part part = partRepository.getPartById(PartID);
                ServiceCenter sc = staff.getServiceCenter();
                if (part == null) return false;

                scStock = new Inventory(null, part, sc, Quantity);
                inventoryRepository.addInventory(scStock);
            } else {
                scStock.setCurrentStock(scStock.getCurrentStock() + Quantity);
                inventoryRepository.updateInventory(scStock);
            }
            
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void CheckStockLevels() {
        try {
            List<Inventory> allStock = inventoryRepository.getAllInventories(DEFAULT_PAGE, MAX_PAGE_SIZE);
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