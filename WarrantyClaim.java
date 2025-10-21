package edu.vn.ev_wms;

import javax.xml.crypto.Data;

public class WarrantyClaim {

    private String ClaimID;
    private Data Date;
    private String Status;
    private String Description;
    private String Attachment;

    public WarrantyClaim(){}
    
    public WarrantyClaim(String ClaimID, Data Date, String Status, String Description, String Attachment)
    {
        this.ClaimID = ClaimID;
        this.Date = Date;
        this.Status = Status;
        this.Description = Description;
        this.Attachment = Attachment;
    }

    public String getClaimID(){
        return this.ClaimID;
    }

    public Data getDate(){
        return this.Date;
    }

    public String getStatus(){
        return this.Status;
    }

    public String getDescription(){
        return this.Description;
    }

    public String getAttachment(){
        return this.Attachment;
    }

    public void setClaimID(String ClaimID){
        this.ClaimID = ClaimID;
    }

    public void setDate(Data Date){
        this.Date = Date;
    }

    public void setStatus(String Status){
        this.Status = Status;
    }

    public void setDescription(String Description){
        this.Description = Description;
    }

    public void setAttachment(String Attachment){
        this.Attachment = Attachment;
    }

    public void create(){
    }

    public void approve(){
    }

    public void reject(){
    }

    public void complete(){
    }
}
