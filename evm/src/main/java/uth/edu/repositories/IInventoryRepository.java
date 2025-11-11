package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.Inventory;

@Repository
public interface IInventoryRepository {
    public void addInventory(Inventory Inventory);
    public void updateInventory(Inventory Inventory);
    public void deleteInventory(Inventory Inventory);
    public Inventory getInventoryById(int id);
    public Inventory getInventoryByPartAndSC(Integer partId, Integer scId);
    public List<Inventory> getInventoriesByPartID(Integer partId, int page, int pageSize);
    public List<Inventory> getAllInventories(int page, int pageSize);
    public void closeResources();
}