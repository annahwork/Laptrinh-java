package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.WarrantyService;

@Repository
public interface IWarrantyServiceRepository {
    public void addWarrantyService(uth.edu.pojo.WarrantyService WarrantyService);
    public void updateWarrantyService(uth.edu.pojo.WarrantyService WarrantyService);
    public void deleteWarrantyService(uth.edu.pojo.WarrantyService WarrantyService);
    public uth.edu.pojo.WarrantyService getWarrantyServiceById(int id);
    public List<WarrantyService> getAllWarrantyServices(int page, int pageSize);
}