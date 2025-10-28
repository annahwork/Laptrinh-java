package edu.vn.ev_wms;

import javax.persistence.*;

@Entity
@Table(name = "Schedule")
public class Schedule {

    @Id
    @Column(length = 20)
    private String ScheduleID;

    @Column(nullable = false)
    private Integer CampaignID;

    @Column(nullable = false)
    private Integer CustomerID;

    @Column(nullable = false, length = 20)
    private String Date;

    @Column(length = 255)
    private String Note;

    public Schedule(){}

    public Schedule(String ScheduleID, Integer CampaignID, Integer CustomerID, String Date, String Note)
    {
        this.ScheduleID = ScheduleID;
        this.CampaignID = CampaignID;
        this.CustomerID = CustomerID;
        this.Date = Date;
        this.Note = Note;
    }

    public String getScheduleID(){
        return this.ScheduleID;
    }

    public Integer CampaignID(){
        return this.CampaignID;
    }

    public Integer CustomerID(){
        return this.CustomerID;
    }

    public String getDate(){
        return this.Date;
    }

    public String getNote(){
        return this.Note;
    }

    public void setScheduleID(String ScheduleID){
        this.ScheduleID = ScheduleID;
    }

    public void setCampaignID(Integer CampaignID)
    {
        this.CampaignID = CampaignID;
    }

    public void setCustomerID(Integer CustomerID)
    {
        this.CustomerID = CustomerID;
    }

    public void setDate(String Date){
        this.Date = Date;
    }

    public void setNote(String Note){
        this.Note = Note;
    }

}
