package uth.edu.repositories;

import org.springframework.stereotype.Repository;

@Repository
public interface IVehiclePartRepository {
    public void addVehiclePart(uth.edu.pojo.VehiclePart VehiclePart);
    public void updateVehiclePart(uth.edu.pojo.VehiclePart VehiclePart);
    public void deleteVehiclePart(uth.edu.pojo.VehiclePart VehiclePart);
    public uth.edu.pojo.VehiclePart getVehiclePartById(int id);
    public java.util.List<uth.edu.pojo.VehiclePart> getAllVehicleParts(int page, int pageSize);
    public void closeResources();  
}