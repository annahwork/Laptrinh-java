package edu.vn.ev_wms;

import javax.persistence.*;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Integer InvenStoryID;

    @Column(name = "part_id", nullable = false)
    private Integer PartID;

    @Column(name = "current_stock")
    private Integer CurrentStock;

    @Column(name = "location", length = 100)
    private String Location;

    public Inventory() {}

    public Inventory(Integer InvenStoryID, Integer PartID, String Location, Integer CurrentStock) {
        this.InvenStoryID = InvenStoryID;
        this.PartID = PartID;
        this.Location = Location;
        this.CurrentStock = CurrentStock;
    }

    public Integer getInvenStoryID() {
        return this.InvenStoryID;
    }

    public Integer getPartID() {
        return this.PartID;
    }

    public String getLocation() {
        return this.Location;
    }

    public Integer getCurrentStock() {
        return this.CurrentStock;
    }

    public void setInvenStoryID(Integer InvenStoryID) {
        this.InvenStoryID = InvenStoryID;
    }

    public void setPartID(Integer PartID) {
        this.PartID = PartID;
    }

    public void setLocation(String Location) {
        this.Location = Location;
    }

    public void setCurrentStock(Integer CurrentStock) {
        this.CurrentStock = CurrentStock;
    }

    public void updateStock(Integer quantity) {

    }

    public void checkStockLevel() {
        
    }
}
