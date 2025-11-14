package uth.edu.pojo;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
@Entity
@Table(name = "ServiceCenter")
public class ServiceCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SCID")
    private Integer SCID;

    @Column(name = "Name", length = 200, nullable = false, columnDefinition = "NVARCHAR(200)")
    private String Name;

    @Column(name = "Address", length = 500, columnDefinition = "NVARCHAR(500)")
    private String Address;

    @Column(name = "Type", length = 50, columnDefinition = "NVARCHAR(50)") 
    private String Type;

    @OneToMany(mappedBy = "serviceCenter", fetch = FetchType.LAZY)
    private List<User> Staffs = new ArrayList<>();

    @OneToMany(mappedBy = "ServiceCenter", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Inventory> InventoryStock = new ArrayList<>();

    public ServiceCenter() {}

    public ServiceCenter(Integer sCID, String name, String address, String type) {
        this.SCID = sCID;
        this.Name = name;
        this.Address = address;
        this.Type = type;
    }

    public Integer getSCID() {
        return this.SCID;
    }

    public void setSCID(Integer sCID) {
        this.SCID = sCID;
    }

    public String getName() {
        return this.Name;
    }

    public void setName(String name) {
        this.Name = name;
    }

    public String getAddress() {
        return this.Address;
    }

    public void setAddress(String address) {
        this.Address = address;
    }

    public String getType() {
        return this.Type;
    }

    public void setType(String type) {
        this.Type = type;
    }

    @JsonIgnore 
    public List<User> getStaffs() {
        return this.Staffs;
    }

    public void setStaffs(List<User> staffs) {
        this.Staffs = staffs;
    }

    @JsonIgnore 
    public List<Inventory> getInventoryStock() {
        return this.InventoryStock;
    }

    public void setInventoryStock(List<Inventory> inventoryStock) {
        this.InventoryStock = inventoryStock;
    }
}