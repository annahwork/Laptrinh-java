package edu.vn.ev_wms;

public class Inventory {
    
    private String InvenStoryID;
    private String Location;
    private String CurrentStock;

    public Inventory(){}
    public Inventory(String InvenStoryID, String Location, String CurrentStock)
    {
        this.InvenStoryID = InvenStoryID;
        this.Location = Location;
        this.CurrentStock = CurrentStock;
    }
    public String getInvenStoryID(){
        return this.InvenStoryID;
    }
    public String getLocation(){
        return this.Location;
    }
    public String getCurrentStock(){
        return this.CurrentStock;
    }
    public void setInvenStoryID(String InvenStoryID){
        this.InvenStoryID = InvenStoryID;
    }
    public void setLocation(String Location){
        this.Location = Location;
    }
    public void setCurrentStock(String CurrentStock){
        this.CurrentStock = CurrentStock;
    }

    public void checkStock(){
    }

    public void updateStock(){
    }

}
