package uth.edu.dao;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.query.Query;

public class ReportDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public ReportDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }


    public double getGrandTotalCost(LocalDate startDate, LocalDate endDate) {
        Session session = null;
        Double totalCost = 0.0;
        try {
            session = sessionFactory.openSession();
            String hql = "SELECT SUM(ws.Cost) FROM ClaimService cs " +
                         "JOIN cs.WarrantyService ws " +
                         "JOIN cs.WarrantyClaim wc " + // Join để lọc theo ngày
                         "WHERE ws.Cost IS NOT NULL";
            
            if (startDate != null && endDate != null) {
                hql += " AND wc.Date BETWEEN :startDate AND :endDate";
            }

            Query<Double> query = session.createQuery(hql, Double.class);

            if (startDate != null && endDate != null) {
                query.setParameter("startDate", java.sql.Date.valueOf(startDate));
                query.setParameter("endDate", java.sql.Date.valueOf(endDate));
            }

            totalCost = query.uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return (totalCost != null) ? totalCost : 0.0;
    }


    public long getTotalCampaignCount(LocalDate startDate, LocalDate endDate) {
        Session session = null;
        Long count = 0L;
        try {
            session = sessionFactory.openSession();
            String hql = "SELECT COUNT(rc.id) FROM RecallCampaign rc";
            
            if (startDate != null && endDate != null) {
                hql += " WHERE rc.Date BETWEEN :startDate AND :endDate";
            }

            Query<Long> query = session.createQuery(hql, Long.class);

            if (startDate != null && endDate != null) {
                query.setParameter("startDate", java.sql.Date.valueOf(startDate));
                query.setParameter("endDate", java.sql.Date.valueOf(endDate));
            }
            
            count = query.uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return (count != null) ? count : 0L;
    }


    public List<Map<String, Object>> getFailureRateByModel(LocalDate startDate, LocalDate endDate) {
        Session session = null;
        List<Map<String, Object>> results = new ArrayList<>();
        try {
            session = sessionFactory.openSession();
            String hql = "SELECT v.Model, wc.Status, COUNT(wc.ClaimID) " +
                         "FROM WarrantyClaim wc " +
                         "JOIN wc.vehicle v " + 
                         "WHERE wc.Status IN ('Approved', 'Rejected')";
            
            if (startDate != null && endDate != null) {
                hql += " AND wc.Date BETWEEN :startDate AND :endDate";
            }
            
            hql += " GROUP BY v.Model, wc.Status";

            Query<Object[]> query = session.createQuery(hql, Object[].class);

            if (startDate != null && endDate != null) {
                query.setParameter("startDate", java.sql.Date.valueOf(startDate));
                query.setParameter("endDate", java.sql.Date.valueOf(endDate));
            }

            List<Object[]> queryResult = query.getResultList();
            
            results = processRateData(queryResult, "Model");

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return results;
    }

    public List<Map<String, Object>> getFailureRateByPart(LocalDate startDate, LocalDate endDate) {
        Session session = null;
        List<Map<String, Object>> results = new ArrayList<>();
        try {
            session = sessionFactory.openSession();
            String hql = "SELECT p.Name, wc.Status, COUNT(wc.ClaimID) " +
                         "FROM WarrantyClaim wc " +
                         "JOIN wc.VehiclePart vp " + //
                         "JOIN vp.Part p " +
                         "WHERE wc.Status IN ('Approved', 'Rejected')";

            if (startDate != null && endDate != null) {
                hql += " AND wc.Date BETWEEN :startDate AND :endDate";
            }
            
            hql += " GROUP BY p.Name, wc.Status";

            Query<Object[]> query = session.createQuery(hql, Object[].class);

            if (startDate != null && endDate != null) {
                query.setParameter("startDate", java.sql.Date.valueOf(startDate));
                query.setParameter("endDate", java.sql.Date.valueOf(endDate));
            }
            
            List<Object[]> queryResult = query.getResultList();
            results = processRateData(queryResult, "Part");

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return results;
    }

    private List<Map<String, Object>> processRateData(List<Object[]> queryResult, String groupKeyName) {
         Map<String, Map<String, Long>> groupedData = queryResult.stream()
            .collect(Collectors.groupingBy(
                row -> (String) row[0],
                Collectors.toMap(
                    row -> (String) row[1], 
                    row -> (Long) row[2]    
                )
            ));

        return groupedData.entrySet().stream().map(entry -> {
            String name = entry.getKey();
            long approved = entry.getValue().getOrDefault("Approved", 0L);
            long rejected = entry.getValue().getOrDefault("Rejected", 0L);
            long total = approved + rejected;
            double failureRate = (total == 0) ? 0 : ((double) rejected / total) * 100;
            
            return Map.<String, Object>of(
                "type", groupKeyName.equals("Model") ? "Báo cáo theo Model" : "Báo cáo theo Phụ tùng",
                "name", name,
                "total", total,
                "approved", approved,
                "rejected", rejected,
                "failureRate", String.format("%.2f%%", failureRate)
            );
        }).collect(Collectors.toList());
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}