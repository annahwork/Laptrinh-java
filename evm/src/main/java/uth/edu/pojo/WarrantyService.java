package uth.edu.pojo;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
@Entity
@Table(name = "WarrantyService")
public class WarrantyService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServiceID")
    private Integer ServiceID;

    @Column(name = "Name", length = 100, nullable = false)
    private String Name;

    @Column(name = "Detail", length = 500)
    private String Detail;

    @Column(name = "Duration", length = 50)
    private String Duration;

    @Column(name = "Condition", length = 255)
    private String Condition;

    @Column(name ="Cost")
    private Double Cost;

    @OneToMany(
            mappedBy = "WarrantyService",
            fetch = FetchType.LAZY
    )
    private List<ClaimService> ClaimServices = new ArrayList<>();

    public WarrantyService(){}

    public WarrantyService(Integer ServiceID, String Name, String Detail, String Duration, String Condition, Double Cost)
    {
        this.ServiceID = ServiceID;
        this.Name = Name;
        this.Detail = Detail;
        this.Duration = Duration;
        this.Condition = Condition;
        this.Cost = Cost;
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
    public Double getCost(){
        return this.Cost;
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
    public void setCost(Double Cost){
        this.Cost = Cost;
    }

}