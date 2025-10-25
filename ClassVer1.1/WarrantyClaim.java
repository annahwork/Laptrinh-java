package edu.vn.ev_wms;

import javax.xml.crypto.Data;

public class WarrantyClaim {

    private String ClaimID;
    private Integer VehiclePartID;
    private String UserID;
    private String Description;
    private String Status;
    private Data Date;
    private String Attachment;

    public WarrantyClaim(){}
    
    public WarrantyClaim(String ClaimID, Integer VehiclePartID, String UserID, String Description, String Status, Data Date, String Attachment)
    {
        this.ClaimID = ClaimID;
        this.VehiclePartID = VehiclePartID;
        this.UserID = UserID;
        this.Description = Description;
        this.Status = Status;
        this.Date = Date;
        this.Attachment = Attachment;
    }

    public String getClaimID(){
        return this.ClaimID;
    }

    public String getUserID() {
        return UserID;
    }

    public Integer getVehiclePartID() {
        return VehiclePartID;
    }

    public String getDescription(){
        return this.Description;
    }
    
    public String getStatus(){
        return this.Status;
    }

    public Data getDate(){
        return this.Date;
    }

    public String getAttachment(){
        return this.Attachment;
    }

    public void setClaimID(String ClaimID){
        this.ClaimID = ClaimID;
    }

    public void setVehiclePartID(Integer VehiclePartID) {
        this.VehiclePartID = VehiclePartID;
    }

    public void setUserID(String UserID) {
        this.UserID = UserID;
    }

    public void setDescription(String Description){
        this.Description = Description;
    }
    
    public void setStatus(String Status){
        this.Status = Status;
    }
    public void setDate(Data Date){
        this.Date = Date;
    }

    public void setAttachment(String Attachment){
        this.Attachment = Attachment;
    }
    
    public void updateStatus(String newStatus, String note)
    {

    }

    public void addPartToClaim(Integer partId, String quantity)
    {

    }

    public void addServiceToClaim(String serviceDetails)
    {

    }

    public void attachFile(String fileData)
    {

    }
    
}
