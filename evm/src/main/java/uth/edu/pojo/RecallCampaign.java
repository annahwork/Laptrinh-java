package uth.edu.pojo;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "RecallCampaign")
public class RecallCampaign {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer RecallVehicleID;

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CampaignID")
    private Integer CampaignID;

    @Column(name = "Name", nullable = false, length = 100)
    private String Name;

    @Column(name = "Status", length = 50)
    private String Status;

    @Temporal(TemporalType.DATE)
    @Column(name = "Date")
    private Date Date;

    @Column(name = "Description", length = 255)
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
