package uth.edu.pojo;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "RecallVehicle")
public class RecallVehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RecallVehicleID")
    private Integer RecallVehicleID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CampaignID", nullable = false)
    private RecallCampaign RecallCampaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VIN", referencedColumnName = "VIN", nullable = false)
    private Vehicle vehicle;

    @Temporal(TemporalType.DATE)
    @Column(name = "AppointmentDate")
    private Date AppointmentDate;

    @Column(name = "Status", length = 50, columnDefinition = "NVARCHAR(50)")
    private String Status;

    public RecallVehicle(){
    }

    public RecallVehicle(Integer RecallVehicleID, RecallCampaign RecallCampaign, Vehicle vehicle, Date appointmentDate, String status) {
        this.RecallVehicleID = RecallVehicleID;
        this.RecallCampaign = RecallCampaign;
        this.vehicle = vehicle;
        AppointmentDate = appointmentDate;
        Status = status;
    }

    public int getCampaignCode() { 
        return RecallCampaign != null ? RecallCampaign.getCampaignID() : null;
    }
    
    public String getVin() { 
        return vehicle != null ? vehicle.getVIN() : null;
    }
    
    public String getCustomerName() {
        return (vehicle != null && vehicle.getCustomer() != null) ? vehicle.getCustomer().getName() : null;
    }
    
    public String getCampaignCreatedByStaffName() {
        return (RecallCampaign != null) ? RecallCampaign.getCreatedByStaffName() : "N/A";
    }

    public Integer getRecallVehicleID() {
        return RecallVehicleID;
    }

    public void setRecallVehicleID(Integer RecallVehicleID) {
        this.RecallVehicleID = RecallVehicleID;
    }

    @JsonIgnore 
    public RecallCampaign getRecallCampaign() {
        return RecallCampaign;
    }

    public void setRecallCampaign(RecallCampaign recallCampaign) {
        this.RecallCampaign = recallCampaign;
    }

    @JsonIgnore 
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