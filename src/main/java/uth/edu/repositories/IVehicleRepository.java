package uth.edu.repositories;

import java.util.List;

import org.hibernate.mapping.Map;
import org.springframework.stereotype.Repository;

import uth.edu.pojo.Vehicle;

@Repository
public interface IVehicleRepository {
    public void addVehicle(uth.edu.pojo.Vehicle Vehicle);
    public void updateVehicle(uth.edu.pojo.Vehicle Vehicle);
    public void deleteVehicle(uth.edu.pojo.Vehicle Vehicle);
    public uth.edu.pojo.Vehicle getVehicleByVin(String Vin);
    public List<Vehicle> getVehiclesByModel(String model, int page, int pageSize);
    public List<Map> getAllVehicles(int page, int pageSize);
    public int countAllVehicles();
    public int countVehiclesByStatus(String status);
    public void closeResources();
}