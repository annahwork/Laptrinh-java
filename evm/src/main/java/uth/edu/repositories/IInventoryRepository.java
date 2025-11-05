package uth.edu.repositories;

import java.util.List;

import uth.edu.pojo.Inventory;

public interface IInventoryRepository {
    public void addInventory(uth.edu.pojo.Inventory Inventory);
    public void updateInventory(uth.edu.pojo.Inventory Inventory);
    public void deleteInventory(uth.edu.pojo.Inventory Inventory);
    public uth.edu.pojo.Inventory getInventoryById(int id);
    public Inventory getInventoryByPartAndSC(Integer partId, Integer scId);
    public List<Inventory> getInventoriesByPartID(Integer partId, int page, int pageSize);
    public java.util.List<uth.edu.pojo.Inventory> getAllInventories(int page, int pageSize);
    public void closeResources();
}