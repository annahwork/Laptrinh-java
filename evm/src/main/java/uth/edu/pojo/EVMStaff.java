package edu.vn.ev_wms;

import javax.persistence.*;

@Entity
@Table(name = "EVMStaff")
@Inheritance(strategy = InheritanceType.JOINED)
public class EVMStaff extends User {

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
