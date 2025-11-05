package uth.edu.repositories;

import java.util.List;

import uth.edu.pojo.RecallVehicle;

public interface IRecallVehicleRepository {
    public void addRecallVehicle(uth.edu.pojo.RecallVehicle RecallVehicle);
    public void updateRecallVehicle(uth.edu.pojo.RecallVehicle RecallVehicle);
    public void deleteRecallVehicle(uth.edu.pojo.RecallVehicle RecallVehicle);
    public uth.edu.pojo.RecallVehicle getRecallVehicleById(int id);
    public List<RecallVehicle> getRecallVehiclesByVIN(String vin, int page, int pageSize);
    public List<RecallVehicle> getRecallVehiclesByCampaignID(Integer campaignID, int page, int pageSize);
    public List<RecallVehicle> getAllRecallVehicles(int page, int pageSize);
    public void closeResources();
}