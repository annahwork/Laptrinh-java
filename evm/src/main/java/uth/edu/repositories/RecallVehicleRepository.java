package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.dao.RecallVehicleDAO;
import uth.edu.pojo.RecallVehicle;

@Repository
public class RecallVehicleRepository implements IRecallVehicleRepository {

    private RecallVehicleDAO RecallVehicleDAO = null;

    public RecallVehicleRepository() {
        RecallVehicleDAO = new RecallVehicleDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addRecallVehicle(RecallVehicle RecallVehicle) {
        RecallVehicleDAO.addRecallVehicle(RecallVehicle);
    }

    @Override
    public void updateRecallVehicle(RecallVehicle RecallVehicle) {
        RecallVehicleDAO.updateRecallVehicle(RecallVehicle);
    }

    @Override
    public void deleteRecallVehicle(RecallVehicle RecallVehicle) {
        RecallVehicleDAO.deleteRecallVehicle(RecallVehicle);
    }

    @Override
    public RecallVehicle getRecallVehicleById(int RecallVehicleId) {
        return RecallVehicleDAO.getRecallVehicleById(RecallVehicleId);
    }
    @Override
    public List<RecallVehicle> getRecallVehiclesByVIN(String vin, int page, int pageSize) {
        return RecallVehicleDAO.getRecallVehiclesByVIN(vin, page, pageSize);
    }
    @Override
    public List<RecallVehicle> getRecallVehiclesByCampaignID(Integer campaignID, int page, int pageSize) {
        return RecallVehicleDAO.getRecallVehiclesByCampaignID(campaignID, page, pageSize);
    }

    @Override
    public List<RecallVehicle> getAllRecallVehicles(int page, int pageSize) {
        return RecallVehicleDAO.getAllRecallVehicles(page, pageSize);
    }
    @Override
    public void closeResources() {
        if (RecallVehicleDAO != null) {
            RecallVehicleDAO.closeSessionFactory();
        }
    }
}
