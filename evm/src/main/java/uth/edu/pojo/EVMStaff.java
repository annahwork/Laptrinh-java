package uth.edu.pojo;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
@Entity
@DiscriminatorValue("EVM_STAFF")
public class EVMStaff extends User {

    @OneToMany(
            mappedBy = "createdByStaff",
            fetch = FetchType.LAZY
    )
    private List<RecallCampaign> managedCampaigns = new ArrayList<>();
    public EVMStaff() {}

    public EVMStaff(String UserName, String Password, String Name) {
        super(UserName, Password, Name);
    }

    public void updateServiceProgress(Integer serviceId, String result) {

    }

    public void completeWarrantyService(Integer serviceId, String result) {

    }

    public void performRecallService(Integer recallVehicelId, String notes) {

    }
    
}
