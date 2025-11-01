package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.WarrantyClaimDAO;
import uth.edu.pojo.WarrantyClaim;

public class WarrantyClaimRepository implements IWarrantyClaimRepository {

    private WarrantyClaimDAO WarrantyClaimDAO = null;

    public WarrantyClaimRepository() {
        WarrantyClaimDAO = new WarrantyClaimDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addWarrantyClaim(WarrantyClaim WarrantyClaim) {
        WarrantyClaimDAO.addWarrantyClaim(WarrantyClaim);
    }

    @Override
    public void updateWarrantyClaim(WarrantyClaim WarrantyClaim) {
        WarrantyClaimDAO.updateWarrantyClaim(WarrantyClaim);
    }

    @Override
    public void deleteWarrantyClaim(WarrantyClaim WarrantyClaim) {
        WarrantyClaimDAO.deleteWarrantyClaim(WarrantyClaim);
    }

    @Override
    public WarrantyClaim getWarrantyClaimById(int WarrantyClaimId) {
        return WarrantyClaimDAO.getWarrantyClaimById(WarrantyClaimId);
    }

    @Override
    public List<WarrantyClaim> getAllWarrantyClaims(int page, int pageSize) {
        return WarrantyClaimDAO.getAllWarrantyClaims(page, pageSize);
    }
}
