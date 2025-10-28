package edu.vn.ev_wms;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "jpa_vehicle")
public class Vehicle {

    @Id
    @Column(nullable = false, unique = true, length = 20)
    private String Vin;

    @Column(nullable = false)
    private Integer CustomerID;

    @Column(nullable = false, length = 50)
    private String Model;

    @Column(nullable = false)
    private Integer Year_Of_Manufacture;

    @Column(length = 50)
    private String Warranty_Time;

    @Column(length = 20)
    private String Status;

    public Vehicle() {}

    public Vehicle(String Vin, Integer CustomerID, String Model, Integer Year_Of_Manufacture, String Warranty_Time, String Status) {
        this.Vin = Vin;
        this.CustomerID = CustomerID;
        this.Model = Model;
        this.Year_Of_Manufacture = Year_Of_Manufacture;
        this.Warranty_Time = Warranty_Time;
        this.Status = Status;
    }

    public String getVin() {
        return this.Vin;
    }

    public Integer CustomerID() {
        return this.CustomerID;
    }

    public String getModel() {
        return this.Model;
    }

    public Integer getYear_Of_Manufacture() {
        return this.Year_Of_Manufacture;
    }

    public String getWarranty_Time() {
        return this.Warranty_Time;
    }

    public String getStatus() {
        return this.Status;
    }

    public void setVin(String Vin) {
        this.Vin = Vin;
    }

    public void setCustomerID(Integer CustomerID) {
        this.CustomerID = CustomerID;
    }

    public void setModel(String Model) {
        this.Model = Model;
    }

    public void setYear_Of_Manufacture(Integer Year_Of_Manufacture) {
        this.Year_Of_Manufacture = Year_Of_Manufacture;
    }

    public void setWarranty_Time(String Warranty_Time) {
        this.Warranty_Time = Warranty_Time;
    }

    public void setStatus(String Status) {
        this.Status = Status;
    }
}
