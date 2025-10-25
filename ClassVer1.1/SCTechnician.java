package edu.vn.ev_wms;

public class SCTechnician extends User {



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
}
