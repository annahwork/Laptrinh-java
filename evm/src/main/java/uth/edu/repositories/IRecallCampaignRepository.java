package uth.edu.repositories;

public interface IRecallCampaignRepository {
    public void addRecallCampaign(uth.edu.pojo.RecallCampaign RecallCampaign);
    public void updateRecallCampaign(uth.edu.pojo.RecallCampaign RecallCampaign);
    public void deleteRecallCampaign(uth.edu.pojo.RecallCampaign RecallCampaign);
    public uth.edu.pojo.RecallCampaign getRecallCampaignById(int id);
    public java.util.List<uth.edu.pojo.RecallCampaign> getAllRecallCampaigns(int page, int pageSize);
}