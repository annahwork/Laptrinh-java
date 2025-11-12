package uth.edu.pojo;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Part")
public class Part {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PartID")
    private Integer PartID;

    @Column(name = "Name", nullable = false, length = 100)
    private String Name;

    @Column(name = "Type", length = 50)
    private String Type;

    @Column(name = "WarrantyPeriod", length = 30)
    private String WarrantyPeriod;

    @Column(name = "Manufacturer", length = 100)
    private String Manufacturer;

    @OneToMany(
            mappedBy = "Part",
            fetch = FetchType.LAZY
    )
    private List<VehiclePart> VehicleParts = new ArrayList<>();

    @OneToMany(
            mappedBy = "Part",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<Inventory> InventoryRecords = new ArrayList<>();

    @OneToMany(mappedBy = "part", fetch = FetchType.LAZY)
    private List<AllocatePartHistory> partAllocations = new ArrayList<>();
    
    public Part(){}

    public Part(Integer PartID, String Name, String Type, String WarrantyPeriod, String Manufacturer)
    {
        this.PartID = PartID;
        this.Name = Name;
        this.Type = Type;
        this.WarrantyPeriod = WarrantyPeriod;
        this.Manufacturer = Manufacturer;
    }

    public Integer getPartID(){
        return this.PartID;
    }

    public String getName(){
        return this.Name;
    }

    public String getType(){
        return this.Type;
    }

    public String getWarrantyPeriod(){
        return this.WarrantyPeriod;
    }

    public String getManufacturer(){
        return this.Manufacturer;
    }

    @JsonIgnore
    public List<AllocatePartHistory> getPartAllocations() {
        return partAllocations;
    }

    public void setPartID(Integer PartID){
        this.PartID = PartID;
    }

    public void setPartName(String PartName){
        this.Name = PartName;
    }

    public void setType(String Type){
        this.Type = Type;
    }

    public void setWarrantyPeriod(String WarrantyPeriod){
        this.WarrantyPeriod = WarrantyPeriod;
    }

    public void setManufacturer(String Manufacturer){
        this.Manufacturer = Manufacturer;
    }

    @JsonIgnore
    public List<VehiclePart> getVehicleParts() {
        return VehicleParts;
    }

    public void setVehicleParts(List<VehiclePart> vehicleParts) {
        VehicleParts = vehicleParts;
    }

    @JsonIgnore 
    public List<Inventory> getInventoryRecords() {
        return InventoryRecords;
    }

    public void setInventoryRecords(List<Inventory> inventoryRecords) {
        InventoryRecords = inventoryRecords;
    }
    
    public void setPartAllocations(List<AllocatePartHistory> partAllocations) {
        this.partAllocations = partAllocations;
    }
}
