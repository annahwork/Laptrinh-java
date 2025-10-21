package edu.vn.ev_wms;

public class Manufacturer {
    
    private String ManufacturerID;
    private String Name;
    private String Email;

    public Manufacturer(){}
    public Manufacturer(String ManufacturerID, String Name, String Email)
    {
        this.ManufacturerID = ManufacturerID;
        this.Name = Name;
        this.Email = Email;
    }
    public String getManufacturerID(){
        return this.ManufacturerID;
    }
    public String getName(){
        return this.Name;
    }
    public String getEmail(){
        return this.Email;
    }
    public void setManufacturerID(String ManufacturerID){
        this.ManufacturerID = ManufacturerID;
    }
    public void setName(String Name){
        this.Name = Name;
    }
    public void setEmail(String Email){
        this.Email = Email;
    }

    public void requestPart(){
    }

    public void receivePart(){
    }

}
