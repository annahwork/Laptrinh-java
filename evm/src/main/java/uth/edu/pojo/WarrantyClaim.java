package uth.edu.pojo;

import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "jpa_warranty_claim")
public class WarrantyClaim {

    @Id
    @Column(name = "ClaimID", nullable = false, unique = true, length = 20)
    private String ClaimID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VehiclePartID", nullable = false)
    private VehiclePart VehiclePartID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User UserID;

    @Column(name = "Description", length = 500)
    private String Description;

    @Column(name = "Status", length = 20)
    private String Status;

    @Temporal(TemporalType.DATE)
    @Column(name = "Date")
    private Date Date;

    @Column(name = "Attachment", length = 255)
    private String Attachment;

    public WarrantyClaim() {}

    public WarrantyClaim(String ClaimID, VehiclePart VehiclePartID, User UserID, String Description, String Status, Date Date, String Attachment) {
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

    public VehiclePart getVehiclePartID() {
        return this.VehiclePartID;
    }

    public User getUserID() {
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

    public void setVehiclePartID(VehiclePart VehiclePartID) {
        this.VehiclePartID = VehiclePartID;
    }

    public void setUserID(User UserID) {
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
