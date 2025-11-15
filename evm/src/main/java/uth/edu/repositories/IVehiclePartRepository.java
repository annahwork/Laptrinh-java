package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.VehiclePart;

@Repository
public interface IVehiclePartRepository {
    public void addVehiclePart(uth.edu.pojo.VehiclePart VehiclePart);
    public void updateVehiclePart(uth.edu.pojo.VehiclePart VehiclePart);
    public void deleteVehiclePart(uth.edu.pojo.VehiclePart VehiclePart);
    public uth.edu.pojo.VehiclePart getVehiclePartById(int id);
    public List<VehiclePart> getAllVehicleParts(int page, int pageSize);
    public List<VehiclePart> searchVehicleParts(String query, int page, int pageSize);
    public void closeResources();  
}