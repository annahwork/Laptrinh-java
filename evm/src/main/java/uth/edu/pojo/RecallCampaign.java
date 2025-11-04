package uth.edu.pojo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "RecallCampaign")
public class RecallCampaign {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CampaignID")
    private Integer CampaignID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID") // Tên cột khóa ngoại trong bảng Recall_Campaign
    private EVMStaff CreatedByStaff;

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
            mappedBy = "RecallCampaign",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )

    private List<RecallVehicle> VehiclesInCampaign = new ArrayList<>();

    @OneToMany(
            mappedBy = "RecallCampaign",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL
    )
    private List<Schedule> Schedules = new ArrayList<>();

    public RecallCampaign(){}

    public RecallCampaign(Integer CampaignID, EVMStaff CreatedByStaff, String Name, String Status, Date Date, String Description)
    {
        this.CampaignID = CampaignID;
        this.CreatedByStaff = CreatedByStaff;
        this.Name = Name;
        this.Status = Status;
        this.Date = Date;
        this.Description = Description;
    }

    
    public Integer getCampaignID() {
        return CampaignID;
    }

    public void setCampaignID(Integer campaignID) {
        CampaignID = campaignID;
    }

    public EVMStaff getCreatedByStaff() {
        return CreatedByStaff;
    }

    public void setCreatedByStaff(EVMStaff createdByStaff) {
        CreatedByStaff = createdByStaff;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getStatus() {
        return Status;
    }

    public void setStatus(String status) {
        Status = status;
    }

    public Date getDate() {
        return Date;
    }

    public void setDate(Date date) {
        Date = date;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public List<RecallVehicle> getVehiclesInCampaign() {
        return VehiclesInCampaign;
    }

    public void setVehiclesInCampaign(List<RecallVehicle> vehiclesInCampaign) {
        VehiclesInCampaign = vehiclesInCampaign;
    }

    public List<Schedule> getSchedules() {
        return Schedules;
    }

    public void setSchedules(List<Schedule> schedules) {
        Schedules = schedules;
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
