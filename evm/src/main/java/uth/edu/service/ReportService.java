package uth.edu.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uth.edu.repositories.IReportRepository;

@Service
public class ReportService {

    private final InventoryService inventoryService;
    private final IReportRepository reportRepository;

    @Autowired
    public ReportService(InventoryService inventoryService, 
                         IReportRepository reportRepository) {
        this.inventoryService = inventoryService;
        this.reportRepository = reportRepository;
    }

    public Map<String, Object> GenerateSummaryReport(Integer userID, String month, String type) {
        Map<String, Object> report = new HashMap<>();
        
        LocalDate startDate = null;
        LocalDate endDate = null;
        if (month != null && !month.isEmpty()) {
            try {
                YearMonth ym = YearMonth.parse(month);
                startDate = ym.atDay(1);
                endDate = ym.atEndOfMonth();
            } catch (DateTimeParseException e) {
                System.err.println("Invalid month format: " + month);
            }
        }

        report.put("totalInventory", inventoryService.getTotalPartsInStock()); 
        
        report.put("totalWarrantyCost", reportRepository.getGrandTotalCost(startDate, endDate));
        report.put("totalCampaigns", reportRepository.getTotalCampaignCount(startDate, endDate));

        List<Map<String, Object>> tableData = new ArrayList<>();
        String reportType = (type != null) ? type.toLowerCase() : "";

        if (reportType.equals("warranty") || reportType.isEmpty()) {
            tableData.addAll(reportRepository.getFailureRateByModel(startDate, endDate));
        }
        if (reportType.equals("inventory") || reportType.isEmpty()) {
             tableData.addAll(reportRepository.getFailureRateByPart(startDate, endDate));
        }
        
        report.put("tableData", tableData);
        return report;
    }
}