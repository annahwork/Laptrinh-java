package uth.edu.service;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import uth.edu.dao.ClaimServiceDAO;
import uth.edu.dao.SCTechnicianDAO;
import uth.edu.dao.WarrantyClaimDAO;
import uth.edu.dao.WarrantyHistoryDAO;
import uth.edu.pojo.ClaimService;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.WarrantyClaim;
import uth.edu.pojo.WarrantyHistory;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class RepairService {

    private final ClaimServiceDAO claimServiceDAO;
    private final WarrantyClaimDAO warrantyClaimDAO;
    private final WarrantyHistoryDAO warrantyHistoryDAO;
    private final SCTechnicianDAO technicianDAO;
    private final SessionFactory sessionFactory;

    public RepairService() {
        claimServiceDAO = new ClaimServiceDAO("Hibernate.cfg.xml");
        warrantyClaimDAO = new WarrantyClaimDAO("Hibernate.cfg.xml");
        warrantyHistoryDAO = new WarrantyHistoryDAO("Hibernate.cfg.xml");
        technicianDAO = new SCTechnicianDAO("Hibernate.cfg.xml");

        Configuration configuration = new Configuration();
        configuration.configure("Hibernate.cfg.xml");
        sessionFactory = configuration.buildSessionFactory();
    }

    public List<ClaimService> GetAssignedTasks(Integer SCTechnicianID) {
        Session session = null;
        try {
            SCTechnician technician = technicianDAO.getTechnicianById(SCTechnicianID);
            if (technician == null) 
				return new ArrayList<>();

            session = sessionFactory.openSession();
            List<ClaimService> tasks = session.createQuery(
                    "SELECT claimservice FROM ClaimService claimservice " +
                            "JOIN claimservice.WarrantyClaim warrantyclaim " +
                            "WHERE claimservice.technician.UserID = :tid " +
                            "AND (warrantyclaim.Status IS NULL OR warrantyclaim.Status <> :completed)",
                    ClaimService.class)
                    .setParameter("tid", SCTechnicianID)
                    .setParameter("completed", "Completed")
                    .getResultList();
            return tasks;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        } finally {
            if (session != null) session.close();
        }
    }

    public boolean UpdateServiceProgress(Integer SCTechnicianID, Integer ClaimServiceID, String Result, String Note) {
        try {
            SCTechnician technician = technicianDAO.getTechnicianById(SCTechnicianID);
            if (technician == null) 
				return false;

            ClaimService claimService = claimServiceDAO.getClaimServiceById(ClaimServiceID);
            if (claimService == null) 
				return false;

            if (claimService.getTechnician() == null ||
                claimService.getTechnician().getUserID() != SCTechnicianID)
                return false;

            if (Result != null) claimService.setResult(Result);
            if (Note != null) claimService.setNote(Note);

            claimServiceDAO.updateClaimService(claimService);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean CompleteWarrantyService(Integer SCTechnicianID, Integer ClaimServiceID, String FinalNote) {
        try {
            SCTechnician technician = technicianDAO.getTechnicianById(SCTechnicianID);
            if (technician == null) 
				return false;

            ClaimService claimService = claimServiceDAO.getClaimServiceById(ClaimServiceID);
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

            claimServiceDAO.updateClaimService(claimService);
            warrantyClaimDAO.updateWarrantyClaim(claim);
            warrantyHistoryDAO.addWarrantyHistory(history);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public ClaimService GetTaskDetail(Integer ClaimServiceID, Integer SCTechnicianID) {
        try {
            ClaimService claimservice = claimServiceDAO.getClaimServiceById(ClaimServiceID);
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

            SCTechnician technician = technicianDAO.getTechnicianById(SCTechnicianID);
            if (technician == null) 
				return false;

            ClaimService claimService = claimServiceDAO.getClaimServiceById(ClaimServiceID);
            if (claimService == null) 
				return false;

            if (claimService.getTechnician() == null ||
                claimService.getTechnician().getUserID() != SCTechnicianID)
                return false;

            WarrantyClaim claim = claimService.getWarrantyClaim();
            if (claim == null) 
				return false;

            WarrantyHistory history = new WarrantyHistory(null, claim, new Date(), Note);
            warrantyHistoryDAO.addWarrantyHistory(history);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean ReassignTask(Integer FromTechnicianID, Integer ToTechnicianID, Integer ClaimServiceID, String Note) {
        try {
            SCTechnician fromTech = technicianDAO.getTechnicianById(FromTechnicianID);
            SCTechnician toTech = technicianDAO.getTechnicianById(ToTechnicianID);
            if (fromTech == null || toTech == null) 
				return false;

            ClaimService claimService = claimServiceDAO.getClaimServiceById(ClaimServiceID);
            if (claimService == null) 
				return false;

            if (claimService.getTechnician() == null ||
                claimService.getTechnician().getUserID() != FromTechnicianID)
                return false;

            claimService.setTechnician(toTech);
            claimServiceDAO.updateClaimService(claimService);

            WarrantyClaim claim = claimService.getWarrantyClaim();
            if (claim != null && Note != null && !Note.trim().isEmpty()) {
                WarrantyHistory history = new WarrantyHistory(null, claim, new Date(), Note);
                warrantyHistoryDAO.addWarrantyHistory(history);
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<WarrantyHistory> GetTaskTimeline(Integer ClaimServiceID) {
        Session session = null;
        try {
            ClaimService claimservice = claimServiceDAO.getClaimServiceById(ClaimServiceID);
            if (claimservice == null || claimservice.getWarrantyClaim() == null)
                return new ArrayList<>();

            Integer claimId = claimservice.getWarrantyClaim().getClaimID();
            session = sessionFactory.openSession();

            List<WarrantyHistory> histories = session.createQuery(
                    "SELECT warrantyhistory FROM WarrantyHistory warrantyhistory " +
                            "WHERE warrantyhistory.WarrantyClaim.ClaimID = :cid " +
                            "ORDER BY warrantyhistory.Date DESC",
                    WarrantyHistory.class)
                    .setParameter("cid", claimId)
                    .getResultList();

            return histories;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        } finally {
            if (session != null) session.close();
        }
    }

    public void closeResources() {
        try {
            if (sessionFactory != null) sessionFactory.close();
            claimServiceDAO.closeSessionFactory();
            warrantyClaimDAO.closeSessionFactory();
            warrantyHistoryDAO.closeSessionFactory();
            technicianDAO.closeSessionFactory();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}