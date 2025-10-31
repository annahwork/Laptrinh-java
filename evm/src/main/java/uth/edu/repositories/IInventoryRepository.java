package uth.edu.repositories;

public interface IInventoryRepository {
    public void addInventory(uth.edu.pojo.Inventory Inventory);
    public void updateInventory(uth.edu.pojo.Inventory Inventory);
    public void deleteInventory(uth.edu.pojo.Inventory Inventory);
    public uth.edu.pojo.Inventory getInventoryById(int id);
    public java.util.List<uth.edu.pojo.Inventory> getAllInventories(int page, int pageSize);
}