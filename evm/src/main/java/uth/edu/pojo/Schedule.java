package uth.edu.pojo;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Schedule")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ScheduleID")
    private Integer ScheduleID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CampaignID", nullable = false)
    private RecallCampaign recallCampaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false) // FK đến System_User
    private SCStaff createdByStaff;

    @Temporal(TemporalType.DATE)
    @Column(name = "Date", nullable = false)
    private Date Date;

    @Column(name = "Note", length = 255)
    private String Note;

    public Schedule(){}

    public Schedule(String ScheduleID, RecallCampaign recallCampaign, Customer customer, Date Date, String Note)
    {
        this.ScheduleID = ScheduleID;
        this.CampaignID = recallCampaign;
        this.CustomerID = customer;
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

    public void setRecallCampaign(RecallCampaign CampaignID)
    {
        this.CampaignID = CampaignID;
    }

    public void setCustomer(Customer CustomerID)
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
