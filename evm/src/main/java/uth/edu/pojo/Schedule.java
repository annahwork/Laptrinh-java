package uth.edu.pojo;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Schedule")
public class Schedule {

    @Id
    @Column(name = "ScheduleID", length = 20)
    private String ScheduleID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CampaignID", nullable = false)
    private RecallCampaign CampaignID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private Customer CustomerID;

    @Temporal(TemporalType.DATE)
    @Column(name = "Date", nullable = false)
    private Date Date;

    @Column(name = "Note", length = 255)
    private String Note;

    public Schedule(){}

    public Schedule(String ScheduleID, RecallCampaign CampaignID, Customer CustomerID, Date Date, String Note)
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

    public RecallCampaign CampaignID(){
        return this.CampaignID;
    }

    public Customer CustomerID(){
        return this.CustomerID;
    }

    public Date getDate(){
        return this.Date;
    }

    public String getNote(){
        return this.Note;
    }

    public void setScheduleID(String ScheduleID){
        this.ScheduleID = ScheduleID;
    }

    public void setCampaignID(RecallCampaign CampaignID)
    {
        this.CampaignID = CampaignID;
    }

    public void setCustomerID(Customer CustomerID)
    {
        this.CustomerID = CustomerID;
    }

    public void setDate(Date Date){
        this.Date = Date;
    }

    public void setNote(String Note){
        this.Note = Note;
    }

}
