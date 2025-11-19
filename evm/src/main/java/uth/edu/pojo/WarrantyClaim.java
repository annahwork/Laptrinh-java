package uth.edu.pojo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @Column(name = "Description", length = 500, columnDefinition = "NVARCHAR(500)")
    private String Description;

    @Column(name = "Status", length = 20, columnDefinition = "NVARCHAR(20)")
    private String Status;

    @Temporal(TemporalType.DATE)
    @Column(name = "Date")
    private Date Date;

    @Column(name = "Attachment", length = 255, columnDefinition = "NVARCHAR(255)")
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

    @JsonIgnore 
    public Vehicle getVehicle() {
        return vehicle;
    }

    @JsonIgnore 
    public VehiclePart getVehiclePart() {
        return this.VehiclePart;
    }

    @JsonIgnore 
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

    @JsonIgnore
    public List<WarrantyHistory> getHistory() {
        return this.History;
    }

    @JsonIgnore 
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

}