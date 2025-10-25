package edu.vn.ev_wms;

public class Schedule {

    private String ScheduleID;
    private Integer CampaignID;
    private Integer CustomerID;
    private String Date;
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
