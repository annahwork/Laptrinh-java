package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.ClaimServiceDAO;
import uth.edu.pojo.ClaimService;

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
    public ClaimService getClaimServiceById(long id) {
        return claimServiceDAO.getClaimServiceById((int) id);
    }

    @Override
    public List<ClaimService> getAllClaimServices(int page, int pageSize) {
        return claimServiceDAO.getAllClaimServices(page, pageSize);
    }
}
