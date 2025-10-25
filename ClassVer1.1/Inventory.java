package edu.vn.ev_wms;

import java.util.function.IntConsumer;

public class Inventory {
    
    private Integer InvenStoryID;
    private Integer PartID;
    private String CurrentStock;
    private String Location;

    public Inventory(){}

    public Inventory(Integer InvenStoryID, Integer PartID, String Location, String CurrentStock)
    {
        this.InvenStoryID = InvenStoryID;
        this.PartID = PartID;
        this.Location = Location;
        this.CurrentStock = CurrentStock;
    }

    public Integer getInvenStoryID(){
        return this.InvenStoryID;
    }

    public Integer getPartID(){
        return this.PartID;
    }

    public String getLocation(){
        return this.Location;
    }

    public String getCurrentStock(){
        return this.CurrentStock;
    }

    public void setInvenStoryID(Integer InvenStoryID){
        this.InvenStoryID = InvenStoryID;
    }

    public void setPartID(Integer PartID){
        this.PartID = PartID;
    }

    public void setLocation(String Location){
        this.Location = Location;
    }

    public void setCurrentStock(String CurrentStock){
        this.CurrentStock = CurrentStock;
    }

    public void updateStock(Integer quantity)
    {

    }

    public void checkStockLevel()
    {

    }



}
