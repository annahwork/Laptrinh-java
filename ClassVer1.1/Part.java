package edu.vn.ev_wms;

public class Part {
    String PartID;
    String Name;
    String Type;
    String WarrantyPeriod;
    String Manufacturer;

    public Part(){}

    public Part(String PartID, String Name, String Type, String WarrantyPeriod, String Manufacturer)
    {
        this.PartID = PartID;
        this.Name = Name;
        this.Type = Type;
        this.WarrantyPeriod = WarrantyPeriod;
        this.Manufacturer = Manufacturer;
    }

    public String getPartID(){
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

    public void setPartID(String PartID){
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

    public void checkWarrantyStatus(String purchaseDate)
    {

    }
}
