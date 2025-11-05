package uth.edu.repositories;
import java.util.List;

import uth.edu.pojo.WarrantyClaim;
import uth.edu.pojo.WarrantyHistory;
public interface IWarrantyClaimRepository {
    public boolean addWarrantyClaim(WarrantyClaim WarrantyClaim, WarrantyHistory WarrantyHistory);
    public boolean updateWarrantyClaim(WarrantyClaim WarrantyClaim, WarrantyHistory WarrantyHistory);
    public boolean deleteWarrantyClaim(WarrantyClaim WarrantyClaim);
    public WarrantyClaim getWarrantyClaimById(int id);
    public WarrantyClaim getClaimDetailsById(Integer claimId);
    public List<WarrantyClaim> getAllWarrantyClaims(int page, int pageSize);
    public List<WarrantyClaim> getClaimsByStatus(String status, int page, int pageSize);
    public List<WarrantyClaim> getClaimsByUserID(Integer userID, int page, int pageSize);
    public List<WarrantyHistory> getHistoryByClaimId(Integer claimId, int page, int pageSize);
    public void closeResources();
}