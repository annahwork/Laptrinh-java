package edu.vn.ev_wms;

import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "jpa_warranty_claim")
public class WarrantyClaim {

    @Id
    @Column(nullable = false, unique = true, length = 20)
    private String ClaimID;

    @Column(nullable = false)
    private Integer VehiclePartID;

    @Column(nullable = false, length = 20)
    private String UserID;

    @Column(length = 500)
    private String Description;

    @Column(length = 20)
    private String Status;

    @Temporal(TemporalType.DATE)
    private Date Date;

    @Column(length = 255)
    private String Attachment;

    public WarrantyClaim() {}

    public WarrantyClaim(String ClaimID, Integer VehiclePartID, String UserID, String Description, String Status, Date Date, String Attachment) {
        this.ClaimID = ClaimID;
        this.VehiclePartID = VehiclePartID;
        this.UserID = UserID;
        this.Description = Description;
        this.Status = Status;
        this.Date = Date;
        this.Attachment = Attachment;
    }

    public String getClaimID() {
        return this.ClaimID;
    }

    public Integer getVehiclePartID() {
        return this.VehiclePartID;
    }

    public String getUserID() {
        return this.UserID;
    }

    public String getDescription() {
        return this.Description;
    }

    public String getStatus() {
        return this.Status;
    }

    public Date getDate() {
        return this.Date;
    }

    public String getAttachment() {
        return this.Attachment;
    }

    public void setClaimID(String ClaimID) {
        this.ClaimID = ClaimID;
    }

    public void setVehiclePartID(Integer VehiclePartID) {
        this.VehiclePartID = VehiclePartID;
    }

    public void setUserID(String UserID) {
        this.UserID = UserID;
    }

    public void setDescription(String Description) {
        this.Description = Description;
    }

    public void setStatus(String Status) {
        this.Status = Status;
    }

    public void setDate(Date Date) {
        this.Date = Date;
    }

    public void setAttachment(String Attachment) {
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
