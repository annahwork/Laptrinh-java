package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.dao.ClaimServiceDAO;
import uth.edu.pojo.ClaimService;

@Repository
public class ClaimServiceRepository implements IClaimServiceRepository {

    private ClaimServiceDAO claimServiceDAO = null;

    public ClaimServiceRepository() {
        claimServiceDAO = new ClaimServiceDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addClaimService(ClaimService claimService) {
        claimServiceDAO.addClaimService(claimService);
    }

    @Override
    public void updateClaimService(ClaimService claimService) {
        claimServiceDAO.updateClaimService(claimService);
    }

    @Override
    public void deleteClaimService(ClaimService claimService) {
        claimServiceDAO.deleteClaimService(claimService);
    }

    @Override
    public ClaimService getClaimServiceById(int id) {
        return claimServiceDAO.getClaimServiceById(id);
    }

    @Override
    public List<ClaimService> getAllClaimServices(int page, int pageSize) {
        return claimServiceDAO.getAllClaimServices(page, pageSize);
    }

    @Override
    public List<ClaimService> getAllClaimServices(int userID, int page, int pageSize) {
        return claimServiceDAO.getAllClaimServices(userID, page, pageSize);
    }

    @Override
    public String getFirstActiveTaskNote(int technicianId){
        return claimServiceDAO.getFirstActiveTaskNote(technicianId);
    }

    @Override
    public String getFirstActiveTaskNoteForSCT(int userID){
        return claimServiceDAO.getFirstActiveTaskNoteForSCT(userID);
    }

    @Override
    public List<Object[]> getClaimServiceDetails(int userID, int page, int pageSize){
        return claimServiceDAO.getClaimServiceDetails(userID, page, pageSize);
    }

    @Override
    public Long[] getPerformanceMetrics(int technicianId) {
        return claimServiceDAO.getPerformanceMetrics(technicianId);
    }
}
