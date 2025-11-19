package uth.edu.pojo;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("SC_TECHNICIAN")
public class SCTechnician extends User {

    @OneToMany(mappedBy = "technician", fetch = FetchType.LAZY)
    private List<ClaimService> claimServices = new ArrayList<>();
    
    @OneToMany(mappedBy = "InstalledBy", fetch = FetchType.LAZY)
    private List<VehiclePart> vehicleParts = new ArrayList<>();

    @Transient 
    private String currentTask;

    public SCTechnician(){}

    public SCTechnician(String userName, String password, String name, String email, String phone) {
        super(userName, password, name, email, phone);
    }

    @JsonIgnore
    public List<ClaimService> getClaimServices() {
        return claimServices;
    }

    public void setClaimServices(List<ClaimService> claimServices) {
        this.claimServices = claimServices;
    }

    @JsonIgnore 
    public List<VehiclePart> getVehicleParts() {
        return vehicleParts;
    }

    public void setVehicleParts(List<VehiclePart> vehicleParts) {
        this.vehicleParts = vehicleParts;
    }
    
    public String getCurrentTask() {
        return currentTask;
    }

    public void setCurrentTask(String currentTask) {
        this.currentTask = currentTask;
    }

}