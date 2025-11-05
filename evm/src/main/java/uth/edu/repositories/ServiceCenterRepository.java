package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.ServiceCenterDAO;
import uth.edu.pojo.ServiceCenter;

public class ServiceCenterRepository implements IServiceCenterRepository {

    private ServiceCenterDAO serviceCenterDAO = null;

    public ServiceCenterRepository() {
        serviceCenterDAO = new ServiceCenterDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addServiceCenter(ServiceCenter serviceCenter) {
        serviceCenterDAO.addServiceCenter(serviceCenter);
    }

    @Override
    public void updateServiceCenter(ServiceCenter serviceCenter) {
        serviceCenterDAO.updateServiceCenter(serviceCenter);
    }

    @Override
    public void deleteServiceCenter(ServiceCenter serviceCenter) {
        serviceCenterDAO.deleteServiceCenter(serviceCenter);
    }

    @Override
    public ServiceCenter getServiceCenterById(int serviceCenterId) {
        return serviceCenterDAO.getServiceCenterById(serviceCenterId);
    }
    @Override
    public ServiceCenter getServiceCenterByType(String type) {
        return serviceCenterDAO.getServiceCenterByType(type);
    }

    @Override
    public List<ServiceCenter> getAllServiceCenters(int page, int pageSize) {
        return serviceCenterDAO.getAllServiceCenters(page, pageSize);
    }
    @Override
    public void closeResources() {
        if (serviceCenterDAO != null) {
            serviceCenterDAO.closeSessionFactory();
        }
    }
}