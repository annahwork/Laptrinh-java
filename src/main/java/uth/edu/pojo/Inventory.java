package uth.edu.pojo;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

    @OneToMany(mappedBy = "fromInventory", fetch = FetchType.LAZY)
    private List<AllocatePartHistory> allocationsSent = new ArrayList<>();

    @OneToMany(mappedBy = "toInventory", fetch = FetchType.LAZY)
    private List<AllocatePartHistory> allocationsReceived = new ArrayList<>();

    public Inventory() {
    }

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

    @JsonIgnore
    public List<AllocatePartHistory> getAllocationsSent() {
        return allocationsSent;
    }

    @JsonIgnore
    public List<AllocatePartHistory> getAllocationsReceived() {
        return allocationsReceived;
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

    public void setAllocationsSent(List<AllocatePartHistory> allocationsSent) {
        this.allocationsSent = allocationsSent;
    }

    public void setAllocationsReceived(List<AllocatePartHistory> allocationsReceived) {
        this.allocationsReceived = allocationsReceived;
    }
    
}