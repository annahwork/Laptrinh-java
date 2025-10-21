package edu.vn.ev_wms;

public class Vehicle {

    private String Vin;
    private String Model;
    private Integer year;
    private String soldID;
    private String WarrantyTime;
    private String Status;

    public Vehicle(){}

    public Vehicle(String Vin, String Model, Integer year, String soldID)
    {
        this.Vin = Vin;
        this.Model = Model;
        this.year = year;
        this.soldID = soldID;
    }

    public String getVin(){
        return this.Vin;
    }

    public String getModel(){
        return this.Model;
    }

    public Integer getYear(){
        return this.year;
    }

    public String getSoldID(){
        return this.soldID;
    }

    public void setVin(String Vin){
        this.Vin = Vin;
    }
    
    public void setModel(String Model){
        this.Model = Model;
    }
    
    public void setYear(Integer year){
        this.year = year;
    }

    public void setSoldID(String soldID){
        this.soldID = soldID;
    }
    
    public void getVerhicleInfo(){
    }
}
