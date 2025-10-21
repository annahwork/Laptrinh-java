package edu.vn.ev_wms;

public class Schedule {

    private String ScheduleID;
    private String Date;
    private String Note;

    public Schedule(){}

    public Schedule(String ScheduleID, String Date, String Note)
    {
        this.ScheduleID = ScheduleID;
        this.Date = Date;
        this.Note = Note;
    }

    public String getScheduleID(){
        return this.ScheduleID;
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

    public void setDate(String Date){
        this.Date = Date;
    }

    public void setNote(String Note){
        this.Note = Note;
    }

}
