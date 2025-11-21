package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.dao.WarrantyClaimDAO;
import uth.edu.pojo.WarrantyClaim;
import uth.edu.pojo.WarrantyHistory;

@Repository
public class WarrantyClaimRepository implements IWarrantyClaimRepository {

    private WarrantyClaimDAO WarrantyClaimDAO = null;

    public WarrantyClaimRepository() {
        WarrantyClaimDAO = new WarrantyClaimDAO("Hibernate.cfg.xml");
    }

    @Override
    public boolean addWarrantyClaim(WarrantyClaim WarrantyClaim, WarrantyHistory history) {
        return WarrantyClaimDAO.addWarrantyClaim(WarrantyClaim, history);
    }

    @Override
    public boolean updateWarrantyClaim(WarrantyClaim WarrantyClaim, WarrantyHistory history) {
        return WarrantyClaimDAO.updateWarrantyClaim(WarrantyClaim, history);
    }

    @Override
    public boolean deleteWarrantyClaim(WarrantyClaim WarrantyClaim) {
        return WarrantyClaimDAO.deleteWarrantyClaim(WarrantyClaim);
    }

    @Override
    public WarrantyClaim getWarrantyClaimById(int WarrantyClaimId) {
        return WarrantyClaimDAO.getWarrantyClaimById(WarrantyClaimId);
    }
    @Override
    public List<WarrantyClaim> getClaimsByStatus(String status, int page, int pageSize) {
        return WarrantyClaimDAO.getClaimsByStatus(status, page, pageSize);
    }
    @Override
    public List<WarrantyClaim> getAllWarrantyClaims(int page, int pageSize) {
        return WarrantyClaimDAO.getAllWarrantyClaims(page, pageSize);
    }
    @Override
    public List<WarrantyClaim> getClaimsByUserID(Integer userID, int page, int pageSize) {
        return WarrantyClaimDAO.getClaimsByUserID(userID, page, pageSize);
    }
    @Override
    public List<WarrantyHistory> getHistoryByClaimId(Integer claimId, int page, int pageSize) {
        return WarrantyClaimDAO.getHistoryByClaimId(claimId, page, pageSize);
    }
    @Override
    public WarrantyClaim getClaimDetailsById(Integer claimId) {
        return WarrantyClaimDAO.getClaimDetailsById(claimId);
    }

    @Override
    public int countAllWarrantyClaims() {
        return WarrantyClaimDAO.countAllWarrantyClaims();
    }
    @Override
    public List<WarrantyClaim> getAllWarrantyClaimsWithDetails(int page, int pageSize) {
        return WarrantyClaimDAO.getAllWarrantyClaimsWithDetails(page, pageSize);
    }

    public int getNextClaimId() {
        return WarrantyClaimDAO.getNextClaimId();
    }

    @Override
    public List<Object[]> getAllClaimSummaryDetails(int page, int pageSize) {
        return WarrantyClaimDAO.getAllClaimSummaryDetails(page, pageSize);
    }

    @Override
    public List<Object[]> getAllClaimDescriptions() {
        return WarrantyClaimDAO.getAllClaimDescriptions();
    }

    @Override
    public void closeResources() {
        if (WarrantyClaimDAO != null) {
            WarrantyClaimDAO.closeSessionFactory();
        }
    }
}