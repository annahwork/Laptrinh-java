package uth.edu.pojo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

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

    public Part getPart() {
        return this.Part;
    }
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
    
    public void updateStock(Integer quantity) {

    }

    public void checkStockLevel() {
        
    }

}
