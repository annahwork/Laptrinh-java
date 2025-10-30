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
    private RecallCampaign RecallCampaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private Customer Customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false) // FK đến System_User
    private SCStaff CreatedByStaff;

    @Temporal(TemporalType.DATE)
    @Column(name = "Date", nullable = false)
    private Date Date;

    @Column(name = "Note", length = 255)
    private String Note;

    public Schedule(){}

    public Schedule(Integer ScheduleID, RecallCampaign RecallCampaign, Customer customer, Date Date, String Note)
    {
        this.ScheduleID = ScheduleID;
        this.RecallCampaign = RecallCampaign;
        this.Customer = customer;
        this.Date = Date;
        this.Note = Note;
    }

    public Integer getScheduleID(){
        return this.ScheduleID;
    }

    public RecallCampaign getRecallCampaign(){
        return this.RecallCampaign;
    }

    public Customer getCustomer(){
        return this.Customer;
    }

    public Date getDate(){
        return this.Date;
    }

    public String getNote(){
        return this.Note;
    }

    public SCStaff getCreatedByStaff(){
        return this.CreatedByStaff;
    }

    public void setScheduleID(Integer ScheduleID){
        this.ScheduleID = ScheduleID;
    }

    public void setRecallCampaign(RecallCampaign RecallCampaign)
    {
        this.RecallCampaign = RecallCampaign;
    }

    public void setCustomer(Customer Customer)
    {
        this.Customer = Customer;
    }

    public void setDate(Date Date){
        this.Date = Date;
    }

    public void setNote(String Note){
        this.Note = Note;
    }

    public void setCreatedByStaff(SCStaff CreatedByStaff){
        this.CreatedByStaff = CreatedByStaff;
    }
}
