package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.ClaimService;
@Repository
public interface IClaimServiceRepository {
    public void addClaimService(uth.edu.pojo.ClaimService claimService);
    public void updateClaimService(uth.edu.pojo.ClaimService claimService);
    public void deleteClaimService(uth.edu.pojo.ClaimService claimService);
    public uth.edu.pojo.ClaimService getClaimServiceById(int id);
    public List<ClaimService> getAllClaimServices(int page, int pageSize);
    public List<ClaimService> getAllClaimServices(int userID, int page, int pageSize);
    public String getFirstActiveTaskNote(int technicianId);
    public String getFirstActiveTaskNoteForSCT(int userId);
}
