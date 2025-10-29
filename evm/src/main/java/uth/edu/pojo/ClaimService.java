package edu.vn.ev_wms;

import javax.persistence.*;

@Entity
@Table(name = "ClaimService")
public class ClaimService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ClaimServID")
    private Integer ClaimServID;

    @Column(name = "ClaimID", nullable = false)
    private Integer ClaimID;

    @Column(name = "ServiceID", nullable = false)
    private Integer ServiceID;

    @Column(name = "Result", length = 200)
    private String Result;

    @Column(name = "Note", length = 500)
    private String Note;

    public ClaimService() {}

    public ClaimService(Integer ClaimServID, Integer ClaimID, Integer ServiceID, String Name, String Result, String Note) {
        this.ClaimServID = ClaimServID;
        this.ClaimID = ClaimID;
        this.ServiceID = ServiceID;
        this.Result = Result;
        this.Note = Note;
    }

    public Integer getClaimServID() {
        return this.ClaimServID;
    }

    public Integer getClaimID() {
        return this.ClaimID;
    }

    public Integer getServiceID() {
        return this.ServiceID;
    }

    public String getResult() {
        return this.Result;
    }

    public String getNote() {
        return this.Note;
    }

    public void setClaimServID(Integer ClaimServID) {
        this.ClaimServID = ClaimServID;
    }

    public void setClaimID(Integer ClaimID) {
        this.ClaimID = ClaimID;
    }

    public void setServiceID(Integer ServiceID) {
        this.ServiceID = ServiceID;
    }

    public void setResult(String Result) {
        this.Result = Result;
    }

    public void setDetail(String Note) {
        this.Note = Note;
    }

}
