package uth.edu.repositories;

import java.util.List;

import uth.edu.pojo.Vehicle;

public interface IVehicleRepository {
    public void addVehicle(uth.edu.pojo.Vehicle Vehicle);
    public void updateVehicle(uth.edu.pojo.Vehicle Vehicle);
    public void deleteVehicle(uth.edu.pojo.Vehicle Vehicle);
    public uth.edu.pojo.Vehicle getVehicleByVin(String Vin);
    public List<Vehicle> getVehiclesByModel(String model, int page, int pageSize);
    public List<Vehicle> getAllVehicles(int page, int pageSize);
    public void closeResources();
}