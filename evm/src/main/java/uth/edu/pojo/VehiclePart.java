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
    private Part Part;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VIN", nullable = false)
    private Vehicle Vehicle;

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

    public VehiclePart(Integer VehiclePartID, Part Part, Vehicle Vehicle, String SerialNumber, Date InstallDate, Date RemoveDate, User InstalledBy, String Status) {
        this.VehiclePartID = VehiclePartID;
        this.Part = Part;
        this.Vehicle = Vehicle;
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
        return this.Part;
    }

    public Vehicle getVehicle() {
        return this.Vehicle;
    }

    public String getSerialNumber() {
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

    public String getStatus() {
        return this.Status;
    }

    public void setVehiclePartID(Integer VehiclePartID) {
        this.VehiclePartID = VehiclePartID;
    }

    public void setPart(Part Part) {
        this.Part = Part;
    }

    public void setVehicle(Vehicle Vehicle) {
        this.Vehicle = Vehicle;
    }

    public void setSerialNumber(String SerialNumber) {
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
