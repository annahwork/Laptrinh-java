package uth.edu.pojo;

import javax.persistence.*;

@Entity
@Table(name = "Inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InvenStoryID")
    private Integer InvenStoryID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PartID", nullable = false)
    private Part PartID;

    @Column(name = "CurrentStock")
    private Integer CurrentStock;

    @Column(name = "Location", length = 100)
    private String Location;

    public Inventory() {}

    public Inventory(Integer InvenStoryID, Part PartID, String Location, Integer CurrentStock) {
        this.InvenStoryID = InvenStoryID;
        this.PartID = PartID;
        this.Location = Location;
        this.CurrentStock = CurrentStock;
    }

    public Integer getInvenStoryID() {
        return this.InvenStoryID;
    }

    public Part getPartID() {
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

    public void setPartID(Part PartID) {
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
