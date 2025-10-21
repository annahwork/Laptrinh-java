package edu.vn.ev_wms;

public class WarrantyStaff extends User {

    private String StaffID;
    private String Name;
    private String Email;

    public WarrantyStaff(){}

    public WarrantyStaff(String StaffID, String Name, String Email)
    {
        this.StaffID = StaffID;
        this.Name = Name;
        this.Email = Email;
    }

    public String getStaffID(){
        return this.StaffID;
    }

    public String getName(){
        return this.Name;
    }

    public String getEmail(){
        return this.Email;
    }

    public void setStaffID(String StaffID){
        this.StaffID = StaffID;
    }

    public void setName(String Name){
        this.Name = Name;
    }

    public void setSpecicalization(String Email){
        this.Email = Email;
    }

    public void requestWarranty(){
    }

    public void checkPartAvailability(){
    }

    public void updateWarrantyStatus(){
    }

}
