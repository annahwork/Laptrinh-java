package uth.edu.repositories;

import org.springframework.stereotype.Repository;

@Repository
public interface IRecallCampaignRepository {
    public void addRecallCampaign(uth.edu.pojo.RecallCampaign RecallCampaign);
    public void updateRecallCampaign(uth.edu.pojo.RecallCampaign RecallCampaign);
    public void deleteRecallCampaign(uth.edu.pojo.RecallCampaign RecallCampaign);
    public uth.edu.pojo.RecallCampaign getRecallCampaignById(int id);
    public java.util.List<uth.edu.pojo.RecallCampaign> getAllRecallCampaigns(int page, int pageSize);
    public void closeResources();
}