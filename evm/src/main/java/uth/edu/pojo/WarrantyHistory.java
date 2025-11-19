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
@Table(name = "WarrantyHistory")
public class WarrantyHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "WarrantyHistoryID")
    private Integer WarrantyHistoryID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClaimID", nullable = false)
    private WarrantyClaim WarrantyClaim;

    @Temporal(TemporalType.DATE)
    @Column(name = "Date")
    private Date Date;

    @Column(name = "Note", length = 500, columnDefinition = "NVARCHAR(500)")
    private String Note;

    public WarrantyHistory(){}

    public WarrantyHistory(Integer WarrantyHistoryID, WarrantyClaim WarrantyClaim, Date Date, String Note){
        this.WarrantyHistoryID = WarrantyHistoryID;
        this.WarrantyClaim = WarrantyClaim;
        this.Date = Date;
        this.Note = Note;
    }

    public Integer getWarrantyHistoryID() {
        return this.WarrantyHistoryID;
    }

    @JsonIgnore 
    public WarrantyClaim getWarrantyClaim() {
        return this.WarrantyClaim;
    }

    public Date getDate() {
        return this.Date;
    }

    public String getNote() {
        return this.Note;
    }

    public void setWarrantyHistory(Integer WarrantyHistoryID) {
        this.WarrantyHistoryID = WarrantyHistoryID;
    }

    public void setWarrantyClaim(WarrantyClaim WarrantyClaim) {
        this.WarrantyClaim = WarrantyClaim;
    }

    public void setDate(Date Date) {
        this.Date = Date;
    }

    public void setNote(String Note) {
        this.Note = Note;
    }
}