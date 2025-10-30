package uth.edu.pojo;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
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

    @OneToMany(
            mappedBy = "warrantyService",
            fetch = FetchType.LAZY
    )
    private List<ClaimService> ClaimServices = new ArrayList<>();

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