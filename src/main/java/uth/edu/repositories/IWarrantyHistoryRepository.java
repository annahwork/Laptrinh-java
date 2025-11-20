package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.WarrantyHistory;

@Repository
public interface IWarrantyHistoryRepository {
    public void addWarrantyHistory(uth.edu.pojo.WarrantyHistory WarrantyHistory);
    public void updateWarrantyHistory(uth.edu.pojo.WarrantyHistory WarrantyHistory);
    public void deleteWarrantyHistory(uth.edu.pojo.WarrantyHistory WarrantyHistory);
    public uth.edu.pojo.WarrantyHistory getWarrantyHistoryById(int id);
    public List<WarrantyHistory> getAllWarrantyHistories(int page, int pageSize);
}