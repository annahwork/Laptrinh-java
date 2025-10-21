package edu.vn.ev_wms;

public class VehicalPart {

    private String PartID;
    private String InstallDate;
    private String RemoveDate;
    private String InstalledBy;
    private String Status;

    public VehicalPart(){}

    public VehicalPart(String PartID, String InstallDate, String RemoveDate, String InstalledBy)
    {
        this.PartID = PartID;
        this.InstallDate = InstallDate;
        this.RemoveDate = RemoveDate;
        this.InstalledBy = InstalledBy;
    }

    public String getPartID(){
        return this.PartID;
    }

    public String getInstallDate(){
        return this.InstallDate;
    }

    public String getRemoveDate(){
        return this.RemoveDate;
    }

    public String getInstalledBy(){
        return this.InstalledBy;
    }

    public void setPartID(String PartID){
        this.PartID = PartID;
    }

    public void setInstallDate(String InstallDate){
        this.InstallDate = InstallDate;
    }

    public void setRemoveDate(String RemoveDate){
        this.RemoveDate = RemoveDate;
    }

    public void setInstalledBy(String InstalledBy){
        this.InstalledBy = InstalledBy;
    }

}
