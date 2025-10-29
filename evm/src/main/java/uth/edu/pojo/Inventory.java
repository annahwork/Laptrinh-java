package uth.edu.pojo;

import javax.persistence.*;

@Entity
@Table(name = "Inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InventoryID")
    private Integer inventoryID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PartID", nullable = false)
    private Part part;

    @Column(name = "CurrentStock")
    private Integer CurrentStock;

    @Column(name = "Location", length = 100)
    private String Location;

    public Inventory() {}

    public Inventory(Integer inventoryID, Part part, String Location, Integer CurrentStock) {
        this.InvenStoryID = inventoryID;
        this.PartID = part;
        this.Location = Location;
        this.CurrentStock = CurrentStock;
    }

    public Integer getInventoryID() {
        return this.InvenStoryID;
    }

    public Part getPart() {
        return this.PartID;
    }

    public String getLocation() {
        return this.Location;
    }

    public Integer getCurrentStock() {
        return this.CurrentStock;
    }

    public void setInventoryID(Integer InvenStoryID) {
        this.InvenStoryID = InvenStoryID;
    }

    public void setPart(Part PartID) {
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
