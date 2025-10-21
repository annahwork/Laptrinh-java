package edu.vn.ev_wms;

import java.util.Date;

public class ClaimService {

    private String ServiceID;
    private String UserID;
    private Date Date;
    private String Result;
    private String Note;

    public ClaimService(){}

    public ClaimService(String ServiceID, String UserID, Date Date, String Result, String Note)
    {
        this.ServiceID = ServiceID;
        this.UserID = UserID;
        this.Date = Date;
        this.Result = Result;
        this.Note = Note;
    }

    public String getServiceID(){
        return this.ServiceID;
    }

    public String getUserID(){
        return this.UserID;
    }

    public Date getDate(){
        return this.Date;
    }

    public String getResult(){
        return this.Result;
    }

    public String getNote(){
        return this.Note;
    }

    public void setServiceID(String ServiceID){
        this.ServiceID = ServiceID;
    }

    public void setUserID(String UserID){
        this.UserID = UserID;
    }

    public void setDate(Date Date){
        this.Date = Date;
    }   

    public void setResult(String Result){
        this.Result = Result;
    }

    public void setNote(String Note){
        this.Note = Note;
    }
    
}
