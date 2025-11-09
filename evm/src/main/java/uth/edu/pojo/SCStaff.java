package uth.edu.pojo;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@DiscriminatorValue("SC_STAFF")
public class SCStaff extends User {

    @OneToMany(mappedBy = "CreatedByStaff", fetch = FetchType.EAGER)
    private List<WarrantyClaim> warrantyClaims = new ArrayList<>();
    @OneToMany(mappedBy = "CreatedByStaff",fetch = FetchType.EAGER)
    private List<Schedule> CreatedSchedules = new ArrayList<>();
    public SCStaff(){}

    public SCStaff(String userName, String password, String name, String email, String phone) {
        super(userName, password, name, email, phone);
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