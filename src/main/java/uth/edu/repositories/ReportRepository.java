package uth.edu.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Repository;
import uth.edu.dao.ReportDAO;

@Repository
public class ReportRepository implements IReportRepository {

    private ReportDAO reportDAO;

    public ReportRepository() {
        this.reportDAO = new ReportDAO("Hibernate.cfg.xml");
    }

    @Override
    public double getGrandTotalCost(LocalDate startDate, LocalDate endDate) {
        return reportDAO.getGrandTotalCost(startDate, endDate);
    }

    @Override
    public long getTotalCampaignCount(LocalDate startDate, LocalDate endDate) {
        return reportDAO.getTotalCampaignCount(startDate, endDate);
    }

    @Override
    public List<Map<String, Object>> getFailureRateByModel(LocalDate startDate, LocalDate endDate) {
        return reportDAO.getFailureRateByModel(startDate, endDate);
    }

    @Override
    public List<Map<String, Object>> getFailureRateByPart(LocalDate startDate, LocalDate endDate) {
        return reportDAO.getFailureRateByPart(startDate, endDate);
    }

    @Override
    public void closeResources() {
        if (reportDAO != null) {
            reportDAO.closeSessionFactory();
        }
    }
}