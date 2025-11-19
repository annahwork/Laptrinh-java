package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.dao.WarrantyHistoryDAO;
import uth.edu.pojo.WarrantyHistory;

@Repository
public class WarrantyHistoryRepository implements IWarrantyHistoryRepository {

    private WarrantyHistoryDAO WarrantyHistoryDAO = null;

    public WarrantyHistoryRepository() {
        WarrantyHistoryDAO = new WarrantyHistoryDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addWarrantyHistory(WarrantyHistory WarrantyHistory) {
        WarrantyHistoryDAO.addWarrantyHistory(WarrantyHistory);
    }

    @Override
    public void updateWarrantyHistory(WarrantyHistory WarrantyHistory) {
        WarrantyHistoryDAO.updateWarrantyHistory(WarrantyHistory);
    }

    @Override
    public void deleteWarrantyHistory(WarrantyHistory WarrantyHistory) {
        WarrantyHistoryDAO.deleteWarrantyHistory(WarrantyHistory);
    }

    @Override
    public WarrantyHistory getWarrantyHistoryById(int WarrantyHistoryId) {
        return WarrantyHistoryDAO.getWarrantyHistoryById(WarrantyHistoryId);
    }

    @Override
    public List<WarrantyHistory> getAllWarrantyHistories(int page, int pageSize) {
        return WarrantyHistoryDAO.getAllWarrantyHistories(page, pageSize);
    }
}
