package uth.edu.repositories;

public interface IVehicleRepository {
    public void addVehicle(uth.edu.pojo.Vehicle Vehicle);
    public void updateVehicle(uth.edu.pojo.Vehicle Vehicle);
    public void deleteVehicle(uth.edu.pojo.Vehicle Vehicle);
    public uth.edu.pojo.Vehicle getVehicleByVin(String Vin);
    public java.util.List<uth.edu.pojo.Vehicle> getAllVehicles(int page, int pageSize);
}