package uth.edu.service;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import uth.edu.pojo.ClaimService;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.WarrantyClaim;
import uth.edu.pojo.WarrantyHistory;
import uth.edu.repositories.ClaimServiceRepository;
import uth.edu.repositories.SCTechnicianRepository;
import uth.edu.repositories.WarrantyClaimRepository;
import uth.edu.repositories.WarrantyHistoryRepository;

public class RepairService {

    private final ClaimServiceRepository claimServiceRepository;
    private final WarrantyClaimRepository warrantyClaimRepository;
    private final WarrantyHistoryRepository warrantyHistoryRepository;
    private final SCTechnicianRepository technicianRepository;

    public RepairService() {
        claimServiceRepository = new ClaimServiceRepository();
        warrantyClaimRepository = new WarrantyClaimRepository();
        warrantyHistoryRepository = new WarrantyHistoryRepository();
        technicianRepository = new SCTechnicianRepository();
    }

    public List<ClaimService> GetAssignedTasks(Integer SCTechnicianID) {
        try {
            SCTechnician technician = technicianRepository.getSCTechnicianById(SCTechnicianID);
            if (technician == null) 
				return new ArrayList<>();

            List<ClaimService> all = claimServiceRepository.getAllClaimServices(1, 20);
            List<ClaimService> tasks = new ArrayList<>();
            for (ClaimService cs : all) {
                if (cs.getTechnician() != null && cs.getTechnician().getUserID() == SCTechnicianID) {
                    WarrantyClaim wc = cs.getWarrantyClaim();
                    String status = wc == null ? null : wc.getStatus();
                    if (status == null || !"Completed".equalsIgnoreCase(status)) {
                        tasks.add(cs);
                    }
                }
            }
            return tasks;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public boolean UpdateServiceProgress(Integer SCTechnicianID, Integer ClaimServiceID, String Result, String Note) {
        try {
            SCTechnician technician = technicianRepository.getSCTechnicianById(SCTechnicianID);
            if (technician == null) 
				return false;

            ClaimService claimService = claimServiceRepository.getClaimServiceById(ClaimServiceID);
            if (claimService == null) 
				return false;

            if (claimService.getTechnician() == null ||
                claimService.getTechnician().getUserID() != SCTechnicianID)
                return false;

            if (Result != null) claimService.setResult(Result);
            if (Note != null) claimService.setNote(Note);

            claimServiceRepository.updateClaimService(claimService);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean CompleteWarrantyService(Integer SCTechnicianID, Integer ClaimServiceID, String FinalNote) {
        try {
            SCTechnician technician = technicianRepository.getSCTechnicianById(SCTechnicianID);
            if (technician == null) 
				return false;

            ClaimService claimService = claimServiceRepository.getClaimServiceById(ClaimServiceID);
            if (claimService == null) 
				return false;

            if (claimService.getTechnician() == null ||
                claimService.getTechnician().getUserID() != SCTechnicianID)
                return false;

            WarrantyClaim claim = claimService.getWarrantyClaim();
            if (claim == null) return false;

            claimService.setResult("Completed");
            if (FinalNote != null) claimService.setNote(FinalNote);

            claim.setStatus("Completed");
            WarrantyHistory history = new WarrantyHistory(null, claim, new Date(), FinalNote);

            claimServiceRepository.updateClaimService(claimService);
            warrantyClaimRepository.updateWarrantyClaim(claim,history);
            warrantyHistoryRepository.addWarrantyHistory(history);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public ClaimService GetTaskDetail(Integer ClaimServiceID, Integer SCTechnicianID) {
        try {
            ClaimService claimservice = claimServiceRepository.getClaimServiceById(ClaimServiceID);
            if (claimservice == null) 
				return null;

            if (claimservice.getTechnician() == null ||
                (SCTechnicianID != null &&
                 claimservice.getTechnician().getUserID() != SCTechnicianID))
                return null;

            return claimservice;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean AddProgressNote(Integer SCTechnicianID, Integer ClaimServiceID, String Note) {
        try {
            if (Note == null || Note.trim().isEmpty()) 
				return false;

            SCTechnician technician = technicianRepository.getSCTechnicianById(SCTechnicianID);
            if (technician == null) 
				return false;

            ClaimService claimService = claimServiceRepository.getClaimServiceById(ClaimServiceID);
            if (claimService == null) 
				return false;

            if (claimService.getTechnician() == null ||
                claimService.getTechnician().getUserID() != SCTechnicianID)
                return false;

            WarrantyClaim claim = claimService.getWarrantyClaim();
            if (claim == null) 
				return false;

            WarrantyHistory history = new WarrantyHistory(null, claim, new Date(), Note);
            warrantyHistoryRepository.addWarrantyHistory(history);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean ReassignTask(Integer FromTechnicianID, Integer ToTechnicianID, Integer ClaimServiceID, String Note) {
        try {
            SCTechnician fromTech = technicianRepository.getSCTechnicianById(FromTechnicianID);
            SCTechnician toTech = technicianRepository.getSCTechnicianById(ToTechnicianID);
            if (fromTech == null || toTech == null) 
				return false;

            ClaimService claimService = claimServiceRepository.getClaimServiceById(ClaimServiceID);
            if (claimService == null) 
				return false;

            if (claimService.getTechnician() == null ||
                claimService.getTechnician().getUserID() != FromTechnicianID)
                return false;

            claimService.setTechnician(toTech);
            claimServiceRepository.updateClaimService(claimService);

            WarrantyClaim claim = claimService.getWarrantyClaim();
            if (claim != null && Note != null && !Note.trim().isEmpty()) {
                WarrantyHistory history = new WarrantyHistory(null, claim, new Date(), Note);
                warrantyHistoryRepository.addWarrantyHistory(history);
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<WarrantyHistory> GetTaskTimeline(Integer ClaimServiceID) {
        try {
            ClaimService claimservice = claimServiceRepository.getClaimServiceById(ClaimServiceID);
            if (claimservice == null || claimservice.getWarrantyClaim() == null)
                return new ArrayList<>();

            Integer claimId = claimservice.getWarrantyClaim().getClaimID();
            List<WarrantyHistory> all = warrantyHistoryRepository.getAllWarrantyHistories(1, 20);
            List<WarrantyHistory> result = new ArrayList<>();
            for (WarrantyHistory wh : all) {
                if (wh.getWarrantyClaim() != null && wh.getWarrantyClaim().getClaimID().equals(claimId)) {
                    result.add(wh);
                }
            }
            result.sort(Comparator.comparing(WarrantyHistory::getDate, (d1, d2) -> {
                if (d1 == null && d2 == null) return 0;
                if (d1 == null) return 1;
                if (d2 == null) return -1;
                return d2.compareTo(d1);
            }));
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
