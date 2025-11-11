package uth.edu.pojo;

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

@Entity
@Table(name = "Inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InventoryID")
    private Integer InventoryID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PartID", nullable = false)
    private Part Part;

    @Column(name = "CurrentStock")
    private Integer CurrentStock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SCID", nullable = false) 
    private ServiceCenter ServiceCenter;

    public Inventory() {}

    public Inventory(Integer InventoryID, Part Part, ServiceCenter ServiceCenter, Integer CurrentStock) {
        this.InventoryID = InventoryID;
        this.Part = Part;
        this.ServiceCenter = ServiceCenter;
        this.CurrentStock = CurrentStock;
    }
    public Integer getInventoryID() {
        return this.InventoryID;
    }

    @JsonIgnore
    public Part getPart() {
        return this.Part;
    }
    
    @JsonIgnore 
    public ServiceCenter getServiceCenter() {
        return this.ServiceCenter;
    }

    public Integer getCurrentStock() {
        return this.CurrentStock;
    }

    public void setInventoryID(Integer InventoryID) {
        this.InventoryID = InventoryID;
    }

    public void setPart(Part Part) {
        this.Part = Part;
    }

    public void setCurrentStock(Integer CurrentStock) {
        this.CurrentStock = CurrentStock;
    }
    
    public void setServiceCenter(ServiceCenter serviceCenter) {
        ServiceCenter = serviceCenter;
    }
    
}