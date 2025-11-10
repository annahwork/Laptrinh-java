package uth.edu.pojo;
import jakarta.persistence.*;

@Entity
@Table(name = "ClaimService")
public class ClaimService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ClaimServID")
    private Integer ClaimServID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClaimID", nullable = false)
    private WarrantyClaim WarrantyClaim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServiceID", nullable = false)
    private WarrantyService WarrantyService;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TechnicianID")
    private SCTechnician technician;

    @Column(name = "Result", length = 200)
    private String Result;

    @Column(name = "Note", length = 500)
    private String Note;

    public ClaimService() {}

    public ClaimService(Integer ClaimServID, WarrantyClaim WarrantyClaim, WarrantyService WarrantyService, SCTechnician technician, String result, String note) {
        this.ClaimServID = ClaimServID;
        this.WarrantyClaim = WarrantyClaim;
        this.WarrantyService = WarrantyService;
        this.technician = technician;
        this.Result = result;
        this.Note = note;
    }

    public Integer getClaimServID() {
        return ClaimServID;
    }

    public void setClaimServID(Integer ClaimServID) {
        this.ClaimServID = ClaimServID;
    }

    public WarrantyClaim getWarrantyClaim() {
        return WarrantyClaim;
    }

    public void setWarrantyClaim(WarrantyClaim WarrantyClaim) {
        this.WarrantyClaim = WarrantyClaim;
    }

    public WarrantyService getWarrantyService() {
        return this.WarrantyService;
    }

    public void setWarrantyService(WarrantyService WarrantyService) {
        this.WarrantyService = WarrantyService;
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
