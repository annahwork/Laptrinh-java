package uth.edu.pojo;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@DiscriminatorValue("EVM_STAFF")
public class EVMStaff extends User {

    @OneToMany(
            mappedBy = "CreatedByStaff",
            fetch = FetchType.LAZY
    )
    private List<RecallCampaign> ManagedCampaigns = new ArrayList<>();
    
    @JsonIgnore
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

}