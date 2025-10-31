package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.InventoryDAO;
import uth.edu.pojo.Inventory;

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
    public List<Inventory> getAllInventories(int page, int pageSize) {
        return InventoryDAO.getAllInventories(page, pageSize);
    }
}
