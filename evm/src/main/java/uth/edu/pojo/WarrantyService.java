package edu.vn.ev_wms;

import javax.persistence.*;

@Entity
@Table(name = "WarrantyService")
public class WarrantyService {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ServiceID;

    private String Name;
    private String Detail;
    private String Duration;
    private String Condition;

    public WarrantyService(){}

    public WarrantyService(Integer ServiceID, String Name, String Detail, String Duration, String Condition)
    {
        this.ServiceID = ServiceID;
        this.Name = Name;
        this.Detail = Detail;
        this.Duration = Duration;
        this.Condition = Condition;
    }

    public Integer getServiceID(){
        return this.ServiceID;
    }

    public String getName(){
        return this.Name;
    }

    public String getDetail(){
        return this.Detail;
    }

    public String getDuration(){
        return this.Duration;
    }

    public String getCondition(){
        return this.Condition;
    }

    public void setServiceID(Integer ServiceID){
        this.ServiceID = ServiceID;
    }

    public void setName(String Name){
        this.Name = Name;
    }

    public void setDetail(String Detail){
        this.Detail = Detail;
    }

    public void setDuration(String Duration){
        this.Duration = Duration;
    }

    public void setCondition(String Condition){
        this.Condition = Condition;
    }

}