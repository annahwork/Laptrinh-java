package uth.edu.pojo;

import javax.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@DiscriminatorValue("SC_STAFF")
public class SCStaff extends User {

    @OneToMany(
            mappedBy = "createdByStaff",
            fetch = FetchType.LAZY
    )
    private List<Schedule> createdSchedules = new ArrayList<>();
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