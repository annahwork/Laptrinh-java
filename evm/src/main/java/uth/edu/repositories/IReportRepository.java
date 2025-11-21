package uth.edu.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IReportRepository {
    double getGrandTotalCost(LocalDate startDate, LocalDate endDate);
    long getTotalCampaignCount(LocalDate startDate, LocalDate endDate);
    List<Map<String, Object>> getFailureRateByModel(LocalDate startDate, LocalDate endDate);
    List<Map<String, Object>> getFailureRateByPart(LocalDate startDate, LocalDate endDate);
    void closeResources();
}