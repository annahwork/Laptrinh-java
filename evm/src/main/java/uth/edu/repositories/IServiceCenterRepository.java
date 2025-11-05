package uth.edu.repositories;

import java.util.List;

import uth.edu.pojo.ServiceCenter;

public interface IServiceCenterRepository {
    public void addServiceCenter(ServiceCenter serviceCenter);
    public void updateServiceCenter(ServiceCenter serviceCenter);
    public void deleteServiceCenter(ServiceCenter serviceCenter);
    public ServiceCenter getServiceCenterById(int serviceCenterId);
    public ServiceCenter getServiceCenterByType(String type);
    public List<ServiceCenter> getAllServiceCenters(int page, int pageSize);
    public void closeResources();
}