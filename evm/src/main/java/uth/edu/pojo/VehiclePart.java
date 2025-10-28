package edu.vn.ev_wms;

import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "jpa_vehicle_part")
public class VehiclePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer VehiclePartID;

    @Column(nullable = false)
    private Integer PartID;

    @Column(nullable = false, length = 20)
    private String VIN;

    @Column(length = 50)
    private String SerialNumber;

    @Temporal(TemporalType.DATE)
    private Date InstallDate;

    @Temporal(TemporalType.DATE)
    private Date RemoveDate;

    @ManyToOne
    @JoinColumn(name = "InstalledBy", referencedColumnName = "UserID")
    private User InstalledBy;

    @Column(length = 20)
    private String Status;

    public VehiclePart() {}

    public VehiclePart(Integer VehiclePartID, Integer PartID, String VIN, String SerialNumber, Date InstallDate, Date RemoveDate, User InstalledBy, String Status) {
        this.VehiclePartID = VehiclePartID;
        this.PartID = PartID;
        this.VIN = VIN;
        this.SerialNumber = SerialNumber;
        this.InstallDate = InstallDate;
        this.RemoveDate = RemoveDate;
        this.InstalledBy = InstalledBy;
        this.Status = Status;
    }

    public Integer getVehiclePartID() {
        return this.VehiclePartID;
    }

    public Integer getPartID() {
        return this.PartID;
    }

    public String getVIN() {
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

    public void setPartID(Integer PartID) {
        this.PartID = PartID;
    }

    public void setVIN(String VIN) {
        this.VIN = VIN;
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
