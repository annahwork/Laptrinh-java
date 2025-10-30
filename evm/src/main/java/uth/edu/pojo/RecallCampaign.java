package uth.edu.pojo;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "RecallCampaign")
public class RecallCampaign {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CampaignID")
    private Integer CampaignID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Creator_UserID") // Tên cột khóa ngoại trong bảng Recall_Campaign
    private EVMStaff createdByStaff;

    @Column(name = "Name", nullable = false, length = 100)
    private String Name;

    @Column(name = "Status", length = 50)
    private String Status;

    @Temporal(TemporalType.DATE)
    @Column(name = "Date")
    private Date Date;

    @Column(name = "Description", length = 255)
    private String Description;

    @OneToMany(
            mappedBy = "recallCampaign",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<RecallVehicle> vehiclesInCampaign = new ArrayList<>();

    @OneToMany(
            mappedBy = "recallCampaign",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL
    )
    private List<Schedule> schedules = new ArrayList<>();

    public RecallCampaign(){}

    public RecallCampaign(Integer CampaignID, EVMStaff createdByStaff, String Name, String Status, Date Date, String Description)
    {
        this.CampaignID = CampaignID;
        this.createdByStaff = createdByStaff;
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
