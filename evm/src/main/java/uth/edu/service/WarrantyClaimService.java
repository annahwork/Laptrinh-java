package uth.edu.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uth.edu.pojo.Admin;
import uth.edu.pojo.ClaimService;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.User;
import uth.edu.pojo.VehiclePart;
import uth.edu.pojo.WarrantyClaim;
import uth.edu.pojo.WarrantyHistory;
import uth.edu.pojo.WarrantyService;
import uth.edu.repositories.ClaimServiceRepository;
import uth.edu.repositories.UserRepository;
import uth.edu.repositories.VehiclePartRepository;
import uth.edu.repositories.WarrantyClaimRepository;
import uth.edu.repositories.WarrantyHistoryRepository;
import uth.edu.repositories.WarrantyServiceRepository;

@Service
public class WarrantyClaimService {

    private WarrantyClaimRepository warrantyClaimRepository;
    private UserRepository userRepository;
    private VehiclePartRepository vehiclePartRepository;
    private ClaimServiceRepository claimServiceRepository;
    private WarrantyHistoryRepository warrantyHistoryRepository;
    private WarrantyServiceRepository warrantyServiceRepository;

    private static final int DEFAULT_PAGE = 1;
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 9999;

    @Autowired
    public WarrantyClaimService(WarrantyClaimRepository warrantyClaimRepository, UserRepository userRepository,
            VehiclePartRepository vehiclePartRepository, ClaimServiceRepository claimServiceRepository,
            WarrantyServiceRepository warrantyServiceRepository, WarrantyHistoryRepository warrantyHistoryRepository) {
        this.warrantyClaimRepository = warrantyClaimRepository;
        this.userRepository = userRepository;
        this.vehiclePartRepository = vehiclePartRepository;
        this.claimServiceRepository = claimServiceRepository;
        this.warrantyServiceRepository = warrantyServiceRepository;
        this.warrantyHistoryRepository = warrantyHistoryRepository;
    }

    public boolean CreateWarrantyClaim(Integer SCStaffID, WarrantyClaim ClaimData, String AttachmentUrl) {
        try {
            User staff = userRepository.getUserById(SCStaffID);
            if (staff == null || !(staff instanceof SCStaff)) {
                return false;
            }

            if (ClaimData == null || ClaimData.getVehiclePart() == null
                    || ClaimData.getVehiclePart().getVehiclePartID() == null) {
                return false;
            }

            VehiclePart vehiclePart = vehiclePartRepository
                    .getVehiclePartById(ClaimData.getVehiclePart().getVehiclePartID());
            if (vehiclePart == null) {
                return false;
            }

            ClaimData.setCreatedByStaff((SCStaff) staff);
            ClaimData.setVehiclePart(vehiclePart);
            ClaimData.setDate(new Date());
            ClaimData.setStatus("Pending");
            ClaimData.setAttachment(AttachmentUrl);

            WarrantyHistory history = new WarrantyHistory();
            history.setDate(new Date());
            history.setNote("Yêu cầu bảo hành được tạo bởi " + staff.getName() + ". Trạng thái: Đã gửi.");

            return warrantyClaimRepository.addWarrantyClaim(ClaimData, history);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean CreateClaimService(Integer SCStaffID, Integer ClaimID, Integer ServiceID) {
        try {
            User staff = userRepository.getUserById(SCStaffID);
            if (staff == null || !(staff instanceof SCStaff)) {
                return false;
            }

            WarrantyClaim claim = warrantyClaimRepository.getWarrantyClaimById(ClaimID);
            if (claim == null) {
                return false;
            }

            WarrantyService serviceTemplate = warrantyServiceRepository.getWarrantyServiceById(ServiceID);
            if (serviceTemplate == null) {
                return false;
            }

            ClaimService newClaimService = new ClaimService();
            newClaimService.setWarrantyClaim(claim);
            newClaimService.setWarrantyService(serviceTemplate);
            newClaimService.setResult("Chờ phân công");

            claimServiceRepository.addClaimService(newClaimService);

            WarrantyHistory history = new WarrantyHistory();
            history.setDate(new Date());
            history.setNote(String.format(
                    "Đã thêm dịch vụ [%s] vào yêu cầu (Bởi: %s)",
                    serviceTemplate.getName(),
                    staff.getName()));
            history.setWarrantyClaim(claim);

            warrantyHistoryRepository.addWarrantyHistory(history);

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<WarrantyHistory> TrackClaimStatus(Integer ClaimId, int page, int pageSize) {
        try {
            if (page <= 0)
                page = DEFAULT_PAGE;
            if (pageSize <= 0)
                pageSize = DEFAULT_PAGE_SIZE;

            return warrantyClaimRepository.getHistoryByClaimId(ClaimId, page, pageSize);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<WarrantyClaim> GetClaims(Integer UserID, int page, int pageSize) {
        try {
            if (page <= 0)
                page = DEFAULT_PAGE;
            if (pageSize <= 0)
                pageSize = DEFAULT_PAGE_SIZE;

            User user = userRepository.getUserById(UserID);

            if (user == null || user instanceof SCTechnician) {
                return new ArrayList<>();
            }

            if (user instanceof SCStaff) {
                return warrantyClaimRepository.getClaimsByUserID(UserID, page, pageSize);
            } else if (user instanceof EVMStaff || user instanceof Admin) {
                return warrantyClaimRepository.getAllWarrantyClaims(page, pageSize);
            }

            return new ArrayList<>();

        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public WarrantyClaim GetClaimDetails(Integer ClaimId) {
        try {
            WarrantyClaim claim = warrantyClaimRepository.getClaimDetailsById(ClaimId);
            if (claim == null) {
                return null;
            }
            List<WarrantyHistory> history = TrackClaimStatus(ClaimId, 1, MAX_PAGE_SIZE);
            claim.setHistory(history);
            return claim;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<ClaimService> GetAllClaimServices(Integer ClaimId) {
        try {
            return GetClaimDetails(ClaimId).getClaimServices();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<WarrantyClaim> GetClaimsForApproval(Integer EVMStaffID, int page, int pageSize) {
        try {
            if (page <= 0)
                page = DEFAULT_PAGE;
            if (pageSize <= 0)
                pageSize = DEFAULT_PAGE_SIZE;

            User user = userRepository.getUserById(EVMStaffID);
            if (user == null || !(user instanceof EVMStaff || user instanceof Admin)) {
                return new ArrayList<>();
            }

            return warrantyClaimRepository.getClaimsByStatus("Pending", page, pageSize);

        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public boolean ApproveClaim(Integer EVMStaffID, Integer ClaimId, String Note) {
        return updateClaimStatus(EVMStaffID, ClaimId, "Approved", Note);
    }

    public boolean RejectClaim(Integer EVMStaffID, Integer ClaimId, String Note) {
        return updateClaimStatus(EVMStaffID, ClaimId, "Rejected", Note);
    }

    private boolean updateClaimStatus(Integer UserID, Integer ClaimId, String NewStatus, String Note) {
        try {
            User user = userRepository.getUserById(UserID);
            if (user == null || !(user instanceof EVMStaff || user instanceof Admin)) {
                return false;
            }

            WarrantyClaim claim = warrantyClaimRepository.getWarrantyClaimById(ClaimId);
            if (claim == null) {
                return false;
            }

            String oldStatus = claim.getStatus();
            if (!"Pending".equals(oldStatus)) {
                return false;
            }

            claim.setStatus(NewStatus);

            WarrantyHistory history = new WarrantyHistory();
            history.setDate(new Date());
            String historyNote = String.format(
                    "Trạng thái cập nhật: %s. Ghi chú: %s (Bởi: %s)",
                    NewStatus, Note, user.getName());
            history.setNote(historyNote);

            return warrantyClaimRepository.updateWarrantyClaim(claim, history);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean AssignTechnicianToClaimService(Integer SCStaffID, Integer ClaimServiceID, Integer SCTechnicianID) {
        try {
            User staff = userRepository.getUserById(SCStaffID);
            if (staff == null || !(staff instanceof SCStaff)) {
                return false;
            }

            User technicianUser = userRepository.getUserById(SCTechnicianID);
            if (technicianUser == null || !(technicianUser instanceof SCTechnician)) {
                return false;
            }
            SCTechnician technician = (SCTechnician) technicianUser;

            ClaimService claimService = claimServiceRepository.getClaimServiceById(ClaimServiceID);
            if (claimService == null) {
                return false;
            }

            claimService.setTechnician(technician);

            claimServiceRepository.updateClaimService(claimService);

            WarrantyHistory history = new WarrantyHistory();
            history.setDate(new Date());
            history.setNote(String.format(
                    "Đã phân công KTV [%s] cho dịch vụ [%s] (Bởi: %s)",
                    technician.getName(),
                    claimService.getWarrantyService().getName(),
                    staff.getName()));
            history.setWarrantyClaim(claimService.getWarrantyClaim());

            warrantyHistoryRepository.addWarrantyHistory(history);

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public int countClaimsByStatus(List<String> statuses) {
        try {
            if (statuses == null || statuses.isEmpty()) {
                return 0;
            }
            List<WarrantyClaim> allClaims = warrantyClaimRepository.getAllWarrantyClaims(DEFAULT_PAGE, MAX_PAGE_SIZE);
            if (allClaims == null || allClaims.isEmpty()) {
                return 0;
            }
            long count = allClaims.stream()
                    .filter(claim -> statuses.contains(claim.getStatus()))
                    .count();
            return (int) count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public boolean updateClaimStatus(Integer userID, Integer claimServID, String newStatus) {

            ClaimService claimService = claimServiceRepository.getClaimServiceById(claimServID);
            
            if (claimService == null) {
                System.err.println("Không tìm thấy ClaimService ID: " + claimServID);
                return false;
            }
            claimService.setResult(newStatus); 
            
            try {
                claimServiceRepository.updateClaimService(claimService);
                return true;
            } catch (Exception e) {
                System.err.println("Lỗi lưu trạng thái mới cho ClaimService ID: " + claimServID);
                e.printStackTrace();
                return false;
            }
    }

    public List<Object[]> getClaimServiceDetails(Integer userID) {
        try {
            return claimServiceRepository.getClaimServiceDetails(userID, 1 , 9999);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public Long[] getPerformanceMetrics(int technicianId) {
        try {
            return claimServiceRepository.getPerformanceMetrics(technicianId);
        } catch (Exception e) {
            e.printStackTrace();
            return new Long[]{0L, 0L};
        }
    }

    public WarrantyClaim getWarrantyClaimById(Integer warrantyClaimID) {
        return warrantyClaimRepository.getWarrantyClaimById(warrantyClaimID);
    }
    
    public boolean deleteWarrantyClaim(Integer warrantyClaimID) {
        WarrantyClaim warrantyClaim = getWarrantyClaimById(warrantyClaimID);
        if (warrantyClaim != null) {
            warrantyClaimRepository.deleteWarrantyClaim(warrantyClaim); 
            return true;
        }
        return false;
    }

    public void closeResources() {
        try {
            warrantyClaimRepository.closeResources();
            userRepository.closeResources();
            vehiclePartRepository.closeResources();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}