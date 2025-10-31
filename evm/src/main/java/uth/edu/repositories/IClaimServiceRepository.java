package uth.edu.repositories;

public interface IClaimServiceRepository {
    public void addClaimService(uth.edu.pojo.ClaimService claimService);
    public void updateClaimService(uth.edu.pojo.ClaimService claimService);
    public void deleteClaimService(uth.edu.pojo.ClaimService claimService);
    public uth.edu.pojo.ClaimService getClaimServiceById(int id);
    public java.util.List<uth.edu.pojo.ClaimService> getAllClaimServices(int page, int pageSize);
}
