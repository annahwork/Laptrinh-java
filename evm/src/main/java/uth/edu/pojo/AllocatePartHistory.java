package uth.edu.pojo;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "AllocatePartHistory")
public class AllocatePartHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AllocationID")
    private Integer allocationID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FromInventoryID", nullable = false)
    private Inventory fromInventory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ToInventoryID", nullable = false)
    private Inventory toInventory; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PartID", nullable = false)
    private Part part;

    @Column(name = "Quantity", nullable = false)
    private Integer quantity; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedByUserID", nullable = false)
    private EVMStaff createdByEVMStaff; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApprovedByUserID")
    private SCStaff approvedBySCStaff;

    @Column(name = "Status", length = 50, columnDefinition = "NVARCHAR(50)")
    private String status;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "AllocationDate")
    private Date allocationDate; 

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "ApprovalDate")
    private Date approvalDate;

    public AllocatePartHistory() {}

    public Integer getAllocationID() {
        return allocationID;
    }

    public void setAllocationID(Integer allocationID) {
        this.allocationID = allocationID;
    }

    @JsonIgnore
    public Inventory getFromInventory() {
        return fromInventory;
    }

    public void setFromInventory(Inventory fromInventory) {
        this.fromInventory = fromInventory;
    }

    @JsonIgnore
    public Inventory getToInventory() {
        return toInventory;
    }

    public void setToInventory(Inventory toInventory) {
        this.toInventory = toInventory;
    }

    @JsonIgnore
    public Part getPart() {
        return part;
    }

    public void setPart(Part part) {
        this.part = part;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    @JsonIgnore
    public EVMStaff getCreatedByEVMStaff() {
        return createdByEVMStaff;
    }

    public void setCreatedByEVMStaff(EVMStaff createdByEVMStaff) {
        this.createdByEVMStaff = createdByEVMStaff;
    }

    @JsonIgnore
    public SCStaff getApprovedBySCStaff() {
        return approvedBySCStaff;
    }

    public void setApprovedBySCStaff(SCStaff approvedBySCStaff) {
        this.approvedBySCStaff = approvedBySCStaff;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getAllocationDate() {
        return allocationDate;
    }

    public void setAllocationDate(Date allocationDate) {
        this.allocationDate = allocationDate;
    }

    public Date getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(Date approvalDate) {
        this.approvalDate = approvalDate;
    }
}