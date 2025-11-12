package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.RecallCampaign;

@Repository
public interface IRecallCampaignRepository {
    public void addRecallCampaign(uth.edu.pojo.RecallCampaign RecallCampaign);
    public void updateRecallCampaign(uth.edu.pojo.RecallCampaign RecallCampaign);
    public void deleteRecallCampaign(uth.edu.pojo.RecallCampaign RecallCampaign);
    public uth.edu.pojo.RecallCampaign getRecallCampaignById(int id);
    public List<RecallCampaign> getAllRecallCampaigns(int page, int pageSize);
    public List<RecallCampaign> getAllRecallCampaigns(Integer userID, int page, int pageSize);
    public void closeResources();
}