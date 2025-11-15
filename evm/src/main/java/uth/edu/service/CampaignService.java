package uth.edu.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.RecallCampaign;
import uth.edu.pojo.RecallVehicle;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.User;
import uth.edu.pojo.Vehicle;
import uth.edu.repositories.RecallCampaignRepository;
import uth.edu.repositories.RecallVehicleRepository;
import uth.edu.repositories.UserRepository;
import uth.edu.repositories.VehicleRepository;

@Service
public class CampaignService {
    private RecallCampaignRepository recallCampaignRepository;
    private RecallVehicleRepository recallVehicleRepository;
    private VehicleRepository vehicleRepository;
    private UserRepository userRepository;

    private static final int DEFAULT_PAGE = 1;
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 50;

    @Autowired
    public CampaignService(RecallCampaignRepository recallCampaignRepository,
            RecallVehicleRepository recallVehicleRepository, VehicleRepository vehicleRepository,
            UserRepository userRepository) {
        this.recallCampaignRepository = recallCampaignRepository;
        this.recallVehicleRepository = recallVehicleRepository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    public boolean CreateRecallCampaign(Integer EVMStaffID, RecallCampaign CampaignData) {
        try {
            User staff = userRepository.getUserById(EVMStaffID);
            if (staff == null || !(staff instanceof EVMStaff)) {
                return false;
            }

            CampaignData.setCreatedByStaff((EVMStaff) staff);
            CampaignData.setDate(new Date());
            CampaignData.setStatus("Pending");

            recallCampaignRepository.addRecallCampaign(CampaignData);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean AddVehiclesToCampaign(Integer EVMStaffID, Integer CampaignID, String Model) {
        try {
            User staff = userRepository.getUserById(EVMStaffID);
            if (staff == null || !(staff instanceof EVMStaff)) {
                return false;
            }

            RecallCampaign campaign = recallCampaignRepository.getRecallCampaignById(CampaignID);
            if (campaign == null) {
                return false;
            }

            List<Vehicle> vehiclesToRecall = vehicleRepository.getVehiclesByModel(Model, DEFAULT_PAGE, MAX_PAGE_SIZE);

            for (Vehicle vehicle : vehiclesToRecall) {
                RecallVehicle recallVehicle = new RecallVehicle();
                recallVehicle.setRecallCampaign(campaign);
                recallVehicle.setVehicle(vehicle);
                recallVehicle.setStatus("Thông báo đang chờ xử lý");

                recallVehicleRepository.addRecallVehicle(recallVehicle);
            }

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<RecallVehicle> GetRecallVehicles(int page, int pageSize) {
        try {
            if (page <= 0)
                page = DEFAULT_PAGE;
            if (pageSize <= 0)
                pageSize = DEFAULT_PAGE_SIZE;

            return recallVehicleRepository.getAllRecallVehicles(page, pageSize);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<RecallVehicle> GetRecallsForVehicle(String VIN) {
        try {
            return recallVehicleRepository.getRecallVehiclesByVIN(VIN, DEFAULT_PAGE, MAX_PAGE_SIZE);

        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<RecallCampaign> GetCampaigns(int page, int pageSize) {
        try {
            if (page <= 0)
                page = DEFAULT_PAGE;
            if (pageSize <= 0)
                pageSize = DEFAULT_PAGE_SIZE;

            return recallCampaignRepository.getAllRecallCampaigns(page, pageSize);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<RecallCampaign> GetCampaigns(Integer userID) {
        try {
            return recallCampaignRepository.getAllRecallCampaigns(userID, 1, 9999);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<Object[]> GetCampaignReport(Integer userID) {
        try {
            return recallVehicleRepository.getCampaignReportData(userID, 1, 9999);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Transactional
    public List<RecallVehicle> GetRecallVehicles(Integer userID) {
        try {
            List<RecallVehicle> recallVehicles = recallVehicleRepository.getAllRecallVehicles(userID, 1, 9999);
            return recallVehicles;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public RecallCampaign GetCampaignDetails(Integer CampaignID) {
        try {
            RecallCampaign campaign = recallCampaignRepository.getRecallCampaignById(CampaignID);
            if (campaign == null) {
                return null;
            }

            List<RecallVehicle> campaignVehicles = recallVehicleRepository.getRecallVehiclesByCampaignID(CampaignID,
                    DEFAULT_PAGE, MAX_PAGE_SIZE);
            campaign.setVehiclesInCampaign(campaignVehicles);

            return campaign;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean PerformRecallService(Integer StaffID, Integer RecallVehicleID, String Status) {
        try {
            User staff = userRepository.getUserById(StaffID);
            if (staff == null || !(staff instanceof SCStaff || staff instanceof SCTechnician)) {
                return false;
            }

            RecallVehicle recallVehicle = recallVehicleRepository.getRecallVehicleById(RecallVehicleID);
            if (recallVehicle == null) {
                return false;
            }

            recallVehicle.setStatus(Status);
            recallVehicleRepository.updateRecallVehicle(recallVehicle);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public int countCampaignsByStatus(String status) {
        try {
            if (status == null || status.isEmpty()) {
                return 0;
            }
            List<RecallCampaign> allCampaigns = recallCampaignRepository.getAllRecallCampaigns(DEFAULT_PAGE,
                    MAX_PAGE_SIZE);
            if (allCampaigns == null || allCampaigns.isEmpty()) {
                return 0;
            }
            long count = allCampaigns.stream()
                    .filter(campaign -> status.equalsIgnoreCase(campaign.getStatus()))
                    .count();
            return (int) count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Transactional
    public boolean updateCampaign(Integer EVMStaffID, Integer campaignId, RecallCampaign campaignData) {
        try {
            User staff = userRepository.getUserById(EVMStaffID);
            if (staff == null || !(staff instanceof EVMStaff)) {
                return false;
            }

            RecallCampaign existingCampaign = recallCampaignRepository.getRecallCampaignById(campaignId);
            if (existingCampaign == null) {
                return false;
            }

            existingCampaign.setName(campaignData.getName());
            existingCampaign.setDescription(campaignData.getDescription());
            existingCampaign.setDate(campaignData.getDate());

            recallCampaignRepository.updateRecallCampaign(existingCampaign);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    public boolean approveCampaign(Integer EVMStaffID, Integer campaignId) {
        return updateCampaignStatus(EVMStaffID, campaignId, "Active");
    }

    @Transactional
    public boolean rejectCampaign(Integer EVMStaffID, Integer campaignId) {
        return updateCampaignStatus(EVMStaffID, campaignId, "Rejected");
    }

    private boolean updateCampaignStatus(Integer EVMStaffID, Integer campaignId, String newStatus) {
        try {
            User staff = userRepository.getUserById(EVMStaffID);
            if (staff == null || !(staff instanceof EVMStaff)) {
                return false;
            }

            RecallCampaign campaign = recallCampaignRepository.getRecallCampaignById(campaignId);
            if (campaign == null) {
                return false;
            }

            campaign.setStatus(newStatus);
            recallCampaignRepository.updateRecallCampaign(campaign);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void closeResources() {
        try {
            recallCampaignRepository.closeResources();
            recallVehicleRepository.closeResources();
            vehicleRepository.closeResources();
            userRepository.closeResources();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
