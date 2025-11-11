package uth.edu.repositories;

import org.springframework.stereotype.Repository;

@Repository
public interface IWarrantyHistoryRepository {
    public void addWarrantyHistory(uth.edu.pojo.WarrantyHistory WarrantyHistory);
    public void updateWarrantyHistory(uth.edu.pojo.WarrantyHistory WarrantyHistory);
    public void deleteWarrantyHistory(uth.edu.pojo.WarrantyHistory WarrantyHistory);
    public uth.edu.pojo.WarrantyHistory getWarrantyHistoryById(int id);
    public java.util.List<uth.edu.pojo.WarrantyHistory> getAllWarrantyHistories(int page, int pageSize);
}