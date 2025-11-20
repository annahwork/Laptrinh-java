package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.AllocatePartHistory;

@Repository
public interface IAllocatePartHistoryRepository {
    void addAllocatePartHistory(AllocatePartHistory history);
    void updateAllocatePartHistory(AllocatePartHistory history);
    AllocatePartHistory getAllocatePartHistoryById(int id);
    List<AllocatePartHistory> getAllAllocatePartHistories(int page, int pageSize);
    List<AllocatePartHistory> getPendingAllocationsBySC(int scId, int page, int pageSize);
    void closeResources();
}