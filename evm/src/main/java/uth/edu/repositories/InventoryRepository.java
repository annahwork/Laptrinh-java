package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.dao.InventoryDAO;
import uth.edu.pojo.AllocatePartHistory;
import uth.edu.pojo.Inventory;

@Repository
public class InventoryRepository implements IInventoryRepository {

    private InventoryDAO InventoryDAO = null;

    public InventoryRepository() {
        InventoryDAO = new InventoryDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addInventory(Inventory Inventory) {
        InventoryDAO.addInventory(Inventory);
    }

    @Override
    public void updateInventory(Inventory Inventory) {
        InventoryDAO.updateInventory(Inventory);
    }

    @Override
    public void deleteInventory(Inventory Inventory) {
        InventoryDAO.deleteInventory(Inventory);
    }

    @Override
    public Inventory getInventoryById(int id) {
        return InventoryDAO.getInventoryById(id);
    }
    @Override
    public Inventory getInventoryByPartAndSC(Integer partId, Integer scId) {
        return InventoryDAO.getInventoryByPartAndSC(partId, scId);
    }

    @Override
    public List<Inventory> getInventoriesByPartID(Integer partId, int page, int pageSize) {
        return InventoryDAO.getInventoriesByPartID(partId, page, pageSize);
    }

    @Override
    public List<Inventory> getAllInventories(int page, int pageSize) {
        return InventoryDAO.getAllInventories(page, pageSize);
    }
    @Override
    public List<Inventory> getAllInventoriesWithDetails(int page, int pageSize) {
        return InventoryDAO.getAllInventoriesWithDetails(page, pageSize);
    }
    @Override
    public List<Inventory> getInventoriesBySCID(int scId, int page, int pageSize, String search, String type) {
        return InventoryDAO.getInventoriesBySCID(scId, page, pageSize, search, type);
    }
    @Override
    public boolean approveAllocationTransaction(Inventory from, Inventory to, AllocatePartHistory history) {
        return InventoryDAO.approveAllocationTransaction(from, to, history);
    }
    @Override
    public void closeResources() {
        if (InventoryDAO != null) {
            InventoryDAO.closeSessionFactory();
        }
    }
}
