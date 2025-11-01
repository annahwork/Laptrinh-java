package uth.edu.repositories;

public interface IWarrantyClaimRepository {
    public void addWarrantyClaim(uth.edu.pojo.WarrantyClaim WarrantyClaim);
    public void updateWarrantyClaim(uth.edu.pojo.WarrantyClaim WarrantyClaim);
    public void deleteWarrantyClaim(uth.edu.pojo.WarrantyClaim WarrantyClaim);
    public uth.edu.pojo.WarrantyClaim getWarrantyClaimById(int id);
    public java.util.List<uth.edu.pojo.WarrantyClaim> getAllWarrantyClaims(int page, int pageSize);
}