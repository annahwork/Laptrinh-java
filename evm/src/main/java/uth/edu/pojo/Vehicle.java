package uth.edu.pojo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import javax.persistence.JoinColumn;

@Entity
@Table(name = "Vehicle")
public class Vehicle {

    @Id
    @Column(name = "VIN", nullable = false, unique = true, length = 20)
    private String Vin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private Customer customer;

    @Column(name = "Model", nullable = false, length = 50)
    private String Model;

    @Column(name = "Year_Of_Manufacture", nullable = false)
    private Integer Year_Of_Manufacture;

    @Column(name = "Warranty_Time", length = 50)
    private String Warranty_Time;

    @Column(name = "Status", length = 20)
    private String Status;

    @OneToMany(
            mappedBy = "vehicle",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<VehiclePart> vehicleParts = new ArrayList<>();

    @OneToMany(
            mappedBy = "vehicle",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<WarrantyClaim> warrantyClaims = new ArrayList<>();

    @OneToMany(
            mappedBy = "vehicle",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<RecallVehicle> recalls = new ArrayList<>();

    public Vehicle() {}

    public Vehicle(String Vin, Customer customer, String Model, Integer Year_Of_Manufacture, String Warranty_Time, String Status) {
        this.Vin = Vin;
        this.CustomerID = customer;
        this.Model = Model;
        this.Year_Of_Manufacture = Year_Of_Manufacture;
        this.Warranty_Time = Warranty_Time;
        this.Status = Status;
    }

    public String getVin() {
        return this.Vin;
    }

    public Customer CustomerID() {
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

    public void setCustomer(Customer CustomerID) {
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
