package uth.edu.repositories;

import org.springframework.stereotype.Repository;

@Repository
public interface IWarrantyServiceRepository {
    public void addWarrantyService(uth.edu.pojo.WarrantyService WarrantyService);
    public void updateWarrantyService(uth.edu.pojo.WarrantyService WarrantyService);
    public void deleteWarrantyService(uth.edu.pojo.WarrantyService WarrantyService);
    public uth.edu.pojo.WarrantyService getWarrantyServiceById(int id);
    public java.util.List<uth.edu.pojo.WarrantyService> getAllWarrantyServices(int page, int pageSize);
}