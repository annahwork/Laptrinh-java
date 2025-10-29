package uth.edu.pojo;

import java.util.Date;
import javax.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "VehiclePart")
public class VehiclePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VehiclePartID")
    private Integer VehiclePartID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PartID", nullable = false)
    private Part part;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VIN", nullable = false)
    private Vehicle vehicle;

    @Column(name = "SerialNumber", length = 50)
    private String SerialNumber;

    @Temporal(TemporalType.DATE)
    @Column(name = "InstallDate")
    private Date InstallDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "RemoveDate")
    private Date RemoveDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "InstalledBy", referencedColumnName = "UserID")
    private User InstalledBy;

    @Column(name = "Status", length = 20)
    private String Status;

    public VehiclePart() {}

    public VehiclePart(Integer VehiclePartID, Part part, Vehicle vehicle, String SerialNumber, Date InstallDate, Date RemoveDate, User InstalledBy, String Status) {
        this.VehiclePartID = VehiclePartID;
        this.PartID = part;
        this.VIN = vehicle;
        this.SerialNumber = SerialNumber;
        this.InstallDate = InstallDate;
        this.RemoveDate = RemoveDate;
        this.InstalledBy = InstalledBy;
        this.Status = Status;
    }

    public Integer getVehiclePartID() {
        return this.VehiclePartID;
    }

    public Part getPart() {
        return this.PartID;
    }

    public Vehicle getVehicle() {
        return this.VIN;
    }

    public String SerialNumber() {
        return this.SerialNumber;
    }

    public Date getInstallDate() {
        return this.InstallDate;
    }

    public Date getRemoveDate() {
        return this.RemoveDate;
    }

    public User getInstalledBy() {
        return this.InstalledBy;
    }

    public String Status() {
        return this.Status;
    }

    public void setVehiclePartID(Integer VehiclePartID) {
        this.VehiclePartID = VehiclePartID;
    }

    public void setPart(Part PartID) {
        this.PartID = PartID;
    }

    public void setVehicle(Vehicle vehicle) {
        this.VIN = vehicle;
    }

    public void SerialNumber(String SerialNumber) {
        this.SerialNumber = SerialNumber;
    }

    public void setInstallDate(Date InstallDate) {
        this.InstallDate = InstallDate;
    }

    public void setRemoveDate(Date RemoveDate) {
        this.RemoveDate = RemoveDate;
    }

    public void setInstalledBy(User InstalledBy) {
        this.InstalledBy = InstalledBy;
    }

    public void setStatus(String Status) {
        this.Status = Status;
    }
}
