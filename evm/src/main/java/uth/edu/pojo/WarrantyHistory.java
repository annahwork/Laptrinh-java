package uth.edu.pojo;

import javax.persistence.*;
import java.util.Date;

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

    @Column(name = "Note", length = 500)
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
