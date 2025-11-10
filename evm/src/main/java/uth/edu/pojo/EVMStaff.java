package uth.edu.pojo;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
@Entity
@DiscriminatorValue("EVM_STAFF")
public class EVMStaff extends User {

    @OneToMany(
            mappedBy = "CreatedByStaff",
            fetch = FetchType.EAGER
    )
    private List<RecallCampaign> ManagedCampaigns = new ArrayList<>();
    
    public List<RecallCampaign> getManagedCampaigns() {
        return ManagedCampaigns;
    }

    public void setManagedCampaigns(List<RecallCampaign> managedCampaigns) {
        ManagedCampaigns = managedCampaigns;
    }

    public EVMStaff() {}

    public EVMStaff(String userName, String password, String name, String email, String phone) {
        super(userName, password, name, email, phone);
    }

    public void updateServiceProgress(Integer serviceId, String result) {

    }

    public void completeWarrantyService(Integer serviceId, String result) {

    }

    public void performRecallService(Integer recallVehicelId, String notes) {

    }
    
}
