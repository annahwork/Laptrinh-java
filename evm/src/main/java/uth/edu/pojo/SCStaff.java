package edu.vn.ev_wms;

import javax.persistence.*;

@Entity
@Table(name = "SCStaff")
@Inheritance(strategy = InheritanceType.JOINED)
public class SCStaff extends User {

    public SCStaff(){}

    public SCStaff(String UserName, String Password, String ManufacturerID, String Name, String Email)
    {
        super(UserName, Password, Name);
    }

    public void EVRegister(String VIN, String CustomerID)
    {

    }

    public void AttachSerial(String VIN, Integer PartID, String SerialNumber)
    {

    }
    
    public void createWarrantyClaim(String claimData)
    {

    }

    public void trackClaimStatus(Integer claimId)
    {

    }

    public void getRecallList(Integer campaignId)
    {

    }

    public void createSchedule(String scheduleData)
    {

    }

    public void assignTechnicianToClaim(Integer ClaimId, String TechnicianID)
    {

    }

    public void generatePerformanceReport()
    {

    }
}