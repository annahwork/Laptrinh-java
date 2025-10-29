package uth.edu.pojo;
import javax.persistence.*;

@Entity
@Table(name = "ClaimService")
public class ClaimService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ClaimServID")
    private Integer ClaimServID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClaimID", nullable = false)
    private WarrantyClaim warrantyClaim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServiceID", nullable = false)
    private WarrantyService warrantyService;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TechnicianID")
    private SCTechnician technician;

    @Column(name = "Result", length = 200)
    private String Result;

    @Column(name = "Note", length = 500)
    private String Note;

    public ClaimService() {}

    public ClaimService(Integer claimServID, WarrantyClaim warrantyClaim, WarrantyService warrantyService, SCTechnician technician, String result, String note) {
        ClaimServID = claimServID;
        this.warrantyClaim = warrantyClaim;
        this.warrantyService = warrantyService;
        this.technician = technician;
        Result = result;
        Note = note;
    }

    public Integer getClaimServID() {
        return ClaimServID;
    }

    public void setClaimServID(Integer claimServID) {
        ClaimServID = claimServID;
    }

    public WarrantyClaim getWarrantyClaim() {
        return warrantyClaim;
    }

    public void setWarrantyClaim(WarrantyClaim warrantyClaim) {
        this.warrantyClaim = warrantyClaim;
    }

    public WarrantyService getWarrantyService() {
        return warrantyService;
    }

    public void setWarrantyService(WarrantyService warrantyService) {
        this.warrantyService = warrantyService;
    }

    public SCTechnician getTechnician() {
        return technician;
    }

    public void setTechnician(SCTechnician technician) {
        this.technician = technician;
    }

    public String getResult() {
        return Result;
    }

    public void setResult(String result) {
        Result = result;
    }

    public String getNote() {
        return Note;
    }

    public void setNote(String note) {
        Note = note;
    }
}
