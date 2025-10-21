package edu.vn.ev_wms;

public class Technician extends User {

    private String TechnicanID;
    private String Name;
    private String Specialization;

    public Technician(){}

    public Technician(String TechnicanID, String Name, String Specialization)
    {
        this.TechnicanID = TechnicanID;
        this.Name = Name;
        this.Specialization = Specialization;
    }

    public String getTechnicanID(){
        return this.TechnicanID;
    }

    public String getName(){
        return this.Name;
    }

    public String getSpecicalization(){
        return this.Specialization;
    }

    public void setTechnicanID(String TechnicanID){
        this.TechnicanID = TechnicanID;
    }

    public void setName(String Name){
        this.Name = Name;
    }

    public void setSpecicalization(String Specialization){
        this.Specialization = Specialization;
    }

    public void repairVehicle(){
    }

    public void reportCompletion(){
    }

}
