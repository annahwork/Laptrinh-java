package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.WarrantyServiceDAO;
import uth.edu.pojo.WarrantyService;

public class WarrantyServiceRepository implements IWarrantyServiceRepository {

    private WarrantyServiceDAO WarrantyServiceDAO = null;

    public WarrantyServiceRepository() {
        WarrantyServiceDAO = new WarrantyServiceDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addWarrantyService(WarrantyService WarrantyService) {
        WarrantyServiceDAO.addWarrantyService(WarrantyService);
    }

    @Override
    public void updateWarrantyService(WarrantyService WarrantyService) {
        WarrantyServiceDAO.updateWarrantyService(WarrantyService);
    }

    @Override
    public void deleteWarrantyService(WarrantyService WarrantyService) {
        WarrantyServiceDAO.deleteWarrantyService(WarrantyService);
    }

    @Override
    public WarrantyService getWarrantyServiceById(int WarrantyServiceId) {
        return WarrantyServiceDAO.getWarrantyServiceById(WarrantyServiceId);
    }

    @Override
    public List<WarrantyService> getAllWarrantyServices(int page, int pageSize) {
        return WarrantyServiceDAO.getAllWarrantyServices(page, pageSize);
    }
}
