package edu.vn.ev_wms;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "WarrantyHistory")
public class WarrantyHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer WarrantyHistory;

    private Integer ClaimID;

    @Temporal(TemporalType.DATE)
    private Date Date;

    private String Note;

    public WarrantyHistory(){}

    public WarrantyHistory(Integer WarrantyHistory, Integer ClaimID, Date Date, String Note){
        this.WarrantyHistory = WarrantyHistory;
        this.ClaimID = ClaimID;
        this.Date = Date;
        this.Note = Note;
    }

    public Integer getWarrantyHistory() {
        return this.WarrantyHistory;
    }

    public Integer getClaimID() {
        return this.ClaimID;
    }

    public Date getDate() {
        return this.Date;
    }

    public String getNote() {
        return this.Note;
    }

    public void setWarrantyHistory(Integer WarrantyHistory) {
        this.WarrantyHistory = WarrantyHistory;
    }

    public void setClaimID(Integer ClaimID) {
        this.ClaimID = ClaimID;
    }

    public void setDate(Date Date) {
        this.Date = Date;
    }

    public void setNote(String Note) {
        this.Note = Note;
    }

}
