package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.dao.AllocatePartHistoryDAO;
import uth.edu.pojo.AllocatePartHistory;

@Repository
public class AllocatePartHistoryRepository implements IAllocatePartHistoryRepository {

    private AllocatePartHistoryDAO historyDAO = null;

    public AllocatePartHistoryRepository() {
        historyDAO = new AllocatePartHistoryDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addAllocatePartHistory(AllocatePartHistory history) {
        historyDAO.addAllocatePartHistory(history);
    }

    @Override
    public void updateAllocatePartHistory(AllocatePartHistory history) {
        historyDAO.updateAllocatePartHistory(history);
    }

    @Override
    public AllocatePartHistory getAllocatePartHistoryById(int id) {
        return historyDAO.getAllocatePartHistoryById(id);
    }

    @Override
    public List<AllocatePartHistory> getAllAllocatePartHistories(int page, int pageSize) {
        return historyDAO.getAllAllocatePartHistories(page, pageSize);
    }

    @Override
    public List<AllocatePartHistory> getPendingAllocationsBySC(int scId, int page, int pageSize) {
        return historyDAO.getPendingAllocationsBySC(scId, page, pageSize);
    }

    @Override
    public void closeResources() {
        if (historyDAO != null) {
            historyDAO.closeSessionFactory();
        }
    }
}