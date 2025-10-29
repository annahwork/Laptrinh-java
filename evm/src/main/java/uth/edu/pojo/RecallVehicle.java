package uth.edu.pojo;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "RecallVehicle")
public class RecallVehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer CampaignID;

    @Column(name = "VIN", nullable = false, length = 20)
    private String VIN;

    @Temporal(TemporalType.DATE)
    @Column(name = "AppointmentDate")
    private Date AppointmentDate;

    @Column(name = "Status", length = 50)
    private String Status;

    public RecallVehicle(){
    }

    public RecallVehicle(Integer CampaignID, String VIN, Date AppointmentDate, String Status){
        this.CampaignID = CampaignID;
        this.VIN = VIN;
        this.AppointmentDate = AppointmentDate;
        this.Status = Status;
    }

    public Integer getCampaignID(){
        return CampaignID;
    }

    public String getVIN(){
        return VIN;
    }

    public Date AppointmentDate(){
        return AppointmentDate;
    }

    public String Status()
    {
        return Status;
    }

    public void setCampaignID(Integer CampaignID)
    {
        this.CampaignID = CampaignID;
    }

    public void setVIN(String VIN)
    {
        this.VIN = VIN;
    }

    public void setAppointmentDate(Date AppointmentDate)
    {
        this.AppointmentDate = AppointmentDate;
    }

    public void setStatus(String Status)
    {
        this.Status = Status;
    }
}