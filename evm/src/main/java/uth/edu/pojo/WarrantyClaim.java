package uth.edu.pojo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "WarrantyClaim")
public class WarrantyClaim {

    @Id
    @Column(name = "ClaimID", nullable = false, unique = true, length = 20)
    private Integer ClaimID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VIN", referencedColumnName = "VIN", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VehiclePartID", nullable = false)
    private VehiclePart VehiclePart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID") 
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

    public Vehicle getVehicle() {
        return vehicle;
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

    public List<WarrantyHistory> getHistory() {
        return this.History;
    }

    public List<ClaimService> getClaimServices() {
        return this.ClaimServices;
    }

    public void setClaimID(Integer ClaimID) {
        this.ClaimID = ClaimID;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
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
    

    public void setHistory(List<WarrantyHistory> history) {
        History = history;
    }

    public void setClaimServices(List<ClaimService> claimServices) {
        ClaimServices = claimServices;
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
