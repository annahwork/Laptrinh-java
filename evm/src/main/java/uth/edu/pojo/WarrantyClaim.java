package uth.edu.pojo;

import java.util.Date;
import javax.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "jpa_warranty_claim")
public class WarrantyClaim {

    @Id
    @Column(name = "ClaimID", nullable = false, unique = true, length = 20)
    private Integer ClaimID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VehiclePartID", nullable = false)
    private VehiclePart VehiclePart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID") // Người tạo claim (SCStaff)
    private SCStaff CreatedByStaff;

    @Column(name = "Description", length = 500)
    private String Description;

    @Column(name = "Status", length = 20)
    private String Status;

    @Temporal(TemporalType.DATE)
    @Column(name = "Date")
    private Date Date;

    @Column(name = "Attachment", length = 255)
    private String Attachment;

    @OneToMany(
            mappedBy = "WarrantyClaim",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<WarrantyHistory> History = new ArrayList<>();

    @OneToMany(
            mappedBy = "WarrantyClaim",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<ClaimService> ClaimServices = new ArrayList<>();

    public WarrantyClaim() {}

    public WarrantyClaim(Integer ClaimID, VehiclePart VehiclePart, SCStaff CreatedByStaff, String Description, String Status, Date Date, String Attachment) {
        this.ClaimID = ClaimID;
        this.VehiclePart = VehiclePart;
        this.CreatedByStaff = CreatedByStaff;
        this.Description = Description;
        this.Status = Status;
        this.Date = Date;
        this.Attachment = Attachment;
    }

    public Integer getClaimID() {
        return this.ClaimID;
    }

    public VehiclePart getVehiclePart() {
        return this.VehiclePart;
    }

    public User getCreatedByStaff() {
        return this.CreatedByStaff;
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

    public void setClaimID(Integer ClaimID) {
        this.ClaimID = ClaimID;
    }

    public void setVehiclePart(VehiclePart VehiclePart) {
        this.VehiclePart = VehiclePart;
    }

    public void setCreatedByStaff(SCStaff CreatedByStaff) {
        this.CreatedByStaff = CreatedByStaff;
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
