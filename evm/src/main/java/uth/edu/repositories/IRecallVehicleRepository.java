package uth.edu.repositories;

public interface IRecallVehicleRepository {
    public void addRecallVehicle(uth.edu.pojo.RecallVehicle RecallVehicle);
    public void updateRecallVehicle(uth.edu.pojo.RecallVehicle RecallVehicle);
    public void deleteRecallVehicle(uth.edu.pojo.RecallVehicle RecallVehicle);
    public uth.edu.pojo.RecallVehicle getRecallVehicleById(int id);
    public java.util.List<uth.edu.pojo.RecallVehicle> getAllRecallVehicles(int page, int pageSize);
}