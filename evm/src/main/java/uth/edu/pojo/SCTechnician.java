package uth.edu.pojo;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

@Entity
@DiscriminatorValue("SC_TECHNICIAN")
public class SCTechnician extends User {

    @OneToMany(mappedBy = "technician", fetch = FetchType.LAZY)
    private List<ClaimService> claimServices = new ArrayList<>();
    @OneToMany(mappedBy = "InstalledBy", fetch = FetchType.LAZY)
    private List<VehiclePart> vehicleParts = new ArrayList<>();

    public SCTechnician(){}

    public SCTechnician(String UserName, String Password, String Name)
    {
        super(UserName, Password, Name);
    }

    public void addNewPart(String partData)
    {

    }

    public void updateWarrantyPolicy(Integer partId, String period, String conditions)
    {

    }

    public void reviewClaim(Integer claimId, String decision, String note)
    {

    }

    public void createRecallCampaign(String campaignData)
    {

    }

    public void addVehicleToRecall(Integer campaignId, String VIN)
    {

    }

    public void allocatePartsToSC(Integer partId, String quantity, String location)
    {

    }

    public void generateFailureReport()
    {

    }

    public List<ClaimService> getClaimServices() {
        return claimServices;
    }

    public void setClaimServices(List<ClaimService> claimServices) {
        this.claimServices = claimServices;
    }

    public List<VehiclePart> getVehicleParts() {
        return vehicleParts;
    }

    public void setVehicleParts(List<VehiclePart> vehicleParts) {
        this.vehicleParts = vehicleParts;
    }
    
}
