package uth.edu.pojo;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;

@Entity
@DiscriminatorValue("EVM_STAFF")
public class EVMStaff extends User {

    @OneToMany(
            mappedBy = "CreatedByStaff",
            fetch = FetchType.LAZY
    )
    private List<RecallCampaign> ManagedCampaigns = new ArrayList<>();

    @OneToMany(mappedBy = "createdByEVMStaff", fetch = FetchType.LAZY)
    private List<AllocatePartHistory> createdAllocations = new ArrayList<>();

    @JsonIgnore
    public List<RecallCampaign> getManagedCampaigns() {
        return ManagedCampaigns;
    }

    public void setManagedCampaigns(List<RecallCampaign> managedCampaigns) {
        ManagedCampaigns = managedCampaigns;
    }
    @JsonIgnore
    public List<AllocatePartHistory> getCreatedAllocations() {
        return createdAllocations;
    }

    public void setCreatedAllocations(List<AllocatePartHistory> createdAllocations) {
        this.createdAllocations = createdAllocations;
    }

    public EVMStaff() {}

    public EVMStaff(String userName, String password, String name, String email, String phone) {
        super(userName, password, name, email, phone);
    }

}