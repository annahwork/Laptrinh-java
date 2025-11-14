package uth.edu.pojo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "RecallCampaign")
public class RecallCampaign {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CampaignID")
    private Integer CampaignID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID") 
    private EVMStaff CreatedByStaff;

    @Column(name = "Name", nullable = false, length = 100, columnDefinition = "NVARCHAR(100)")
    @JsonProperty("Name")
    private String Name;

    @Column(name = "Status", length = 50, columnDefinition = "NVARCHAR(50)")
    @JsonProperty("Status")
    private String Status;

    @Temporal(TemporalType.DATE)
    @JsonProperty("Date")
    @Column(name = "Date")
    private Date Date;

    @Column(name = "Description", length = 255, columnDefinition = "NVARCHAR(255)")
    @JsonProperty("Description")
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

    @JsonIgnore
    public EVMStaff getCreatedByStaff() {
        return CreatedByStaff;
    }

    public String getCreatedByStaffName() {
        return (CreatedByStaff != null) ? (CreatedByStaff.getName()) : "N/A";
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

    @JsonIgnore 
    public List<RecallVehicle> getVehiclesInCampaign() {
        return VehiclesInCampaign;
    }

    public void setVehiclesInCampaign(List<RecallVehicle> vehiclesInCampaign) {
        VehiclesInCampaign = vehiclesInCampaign;
    }

    @JsonIgnore 
    public List<Schedule> getSchedules() {
        return Schedules;
    }

    public void setSchedules(List<Schedule> schedules) {
        Schedules = schedules;
    }

}