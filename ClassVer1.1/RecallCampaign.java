package edu.vn.ev_wms;
import java.util.Date;

public class RecallCampaign {
    
    private Integer CampaignID;
    private String Name;
    private String Status;
    private Date Date;
    private String Description;

    public RecallCampaign(){}

    public RecallCampaign(Integer CampaignID, String Name, String Status, Date Date, String Description)
    {
        this.CampaignID = CampaignID;
        this.Name = Name;
        this.Status = Status;
        this.Date = Date;
        this.Description = Description;
    }

    public void addVehicle(String VIN)
    {

    }

    public void startCampaign()
    {

    }

    public void endCampaign()
    {

    }
    
}
