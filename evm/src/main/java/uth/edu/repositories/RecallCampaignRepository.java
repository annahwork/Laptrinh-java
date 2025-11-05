package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.RecallCampaignDAO;
import uth.edu.pojo.RecallCampaign;

public class RecallCampaignRepository implements IRecallCampaignRepository {

    private RecallCampaignDAO RecallCampaignDAO = null;

    public RecallCampaignRepository() {
        RecallCampaignDAO = new RecallCampaignDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addRecallCampaign(RecallCampaign RecallCampaign) {
        RecallCampaignDAO.addRecallCampaign(RecallCampaign);
    }

    @Override
    public void updateRecallCampaign(RecallCampaign RecallCampaign) {
        RecallCampaignDAO.updateRecallCampaign(RecallCampaign);
    }

    @Override
    public void deleteRecallCampaign(RecallCampaign RecallCampaign) {
        RecallCampaignDAO.deleteRecallCampaign(RecallCampaign);
    }

    @Override
    public RecallCampaign getRecallCampaignById(int RecallCampaignId) {
        return RecallCampaignDAO.getRecallCampaignById(RecallCampaignId);
    }

    @Override
    public List<RecallCampaign> getAllRecallCampaigns(int page, int pageSize) {
        return RecallCampaignDAO.getAllRecallCampaigns(page, pageSize);
    }
    @Override
    public void closeResources() {
        if (RecallCampaignDAO != null) {
            RecallCampaignDAO.closeSessionFactory();
        }
    }
}
