package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.RecallVehicle;

@Repository
public interface IRecallVehicleRepository {
    public void addRecallVehicle(RecallVehicle RecallVehicle);
    public void updateRecallVehicle(RecallVehicle RecallVehicle);
    public void deleteRecallVehicle(RecallVehicle RecallVehicle);
    public RecallVehicle getRecallVehicleById(int id);
    public List<RecallVehicle> getRecallVehiclesByVIN(String vin, int page, int pageSize);
    public List<RecallVehicle> getRecallVehiclesByCampaignID(Integer campaignID, int page, int pageSize);
    public List<RecallVehicle> getAllRecallVehicles(int page, int pageSize);
    public void closeResources();
}