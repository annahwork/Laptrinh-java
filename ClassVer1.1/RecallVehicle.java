package edu.vn.ev_wms;
import java.util.Date;

public class RecallVehicle {
    
    private Integer CampaignID;
    private String VIN;
    private Date AppointmentDate;
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
