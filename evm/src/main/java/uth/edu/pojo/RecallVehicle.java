package uth.edu.pojo;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "RecallVehicle")
public class RecallVehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RecallVehicleID")
    private Integer recallVehicleID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CampaignID", nullable = false)
    private RecallCampaign recallCampaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VIN", referencedColumnName = "VIN", nullable = false)
    private Vehicle vehicle;

    @Temporal(TemporalType.DATE)
    @Column(name = "AppointmentDate")
    private Date AppointmentDate;

    @Column(name = "Status", length = 50)
    private String Status;

    public RecallVehicle(){
    }

    public RecallVehicle(Integer recallVehicleID, RecallCampaign recallCampaign, Vehicle vehicle, Date appointmentDate, String status) {
        this.recallVehicleID = recallVehicleID;
        this.recallCampaign = recallCampaign;
        this.vehicle = vehicle;
        AppointmentDate = appointmentDate;
        Status = status;
    }

    public Integer getRecallVehicleID() {
        return recallVehicleID;
    }

    public void setRecallVehicleID(Integer recallVehicleID) {
        this.recallVehicleID = recallVehicleID;
    }

    public RecallCampaign getRecallCampaign() {
        return recallCampaign;
    }

    public void setRecallCampaign(RecallCampaign recallCampaign) {
        this.recallCampaign = recallCampaign;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Date getAppointmentDate() {
        return AppointmentDate;
    }

    public void setAppointmentDate(Date appointmentDate) {
        AppointmentDate = appointmentDate;
    }

    public String getStatus() {
        return Status;
    }

    public void setStatus(String status) {
        Status = status;
    }
}