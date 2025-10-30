package uth.edu.pojo;

import javax.persistence.*;

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

    @Column(name = "Location", length = 100)
    private String Location;

    public Inventory() {}

    public Inventory(Integer InventoryID, Part Part, String Location, Integer CurrentStock) {
        this.InventoryID = InventoryID;
        this.Part = Part;
        this.Location = Location;
        this.CurrentStock = CurrentStock;
    }

    public Integer getInventoryID() {
        return this.InventoryID;
    }

    public Part getPart() {
        return this.Part;
    }

    public String getLocation() {
        return this.Location;
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
