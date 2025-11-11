package uth.edu.pojo;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;

@Entity
@DiscriminatorValue("SC_STAFF")
public class SCStaff extends User {

    @OneToMany(mappedBy = "CreatedByStaff", fetch = FetchType.LAZY)
    private List<WarrantyClaim> warrantyClaims = new ArrayList<>();
    
    @OneToMany(mappedBy = "CreatedByStaff",fetch = FetchType.LAZY)
    private List<Schedule> CreatedSchedules = new ArrayList<>();
    
    public SCStaff(){}

    public SCStaff(String userName, String password, String name, String email, String phone) {
        super(userName, password, name, email, phone);
    }
    
    @JsonIgnore 
    public List<WarrantyClaim> getWarrantyClaims() {
        return warrantyClaims;
    }

    public void setWarrantyClaims(List<WarrantyClaim> warrantyClaims) {
        this.warrantyClaims = warrantyClaims;
    }

    @JsonIgnore
    public List<Schedule> getCreatedSchedules() {
        return CreatedSchedules;
    }

    public void setCreatedSchedules(List<Schedule> createdSchedules) {
        CreatedSchedules = createdSchedules;
    }
    
}