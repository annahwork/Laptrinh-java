package uth.edu.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import uth.edu.pojo.User;
import uth.edu.service.UserService;

@Controller
public class HomeController {

    private final UserService userService;
    @Autowired
    public HomeController(UserService _userService)
    {
        this.userService = _userService;
    }

    @ModelAttribute("users")
    public List<User> getStudents(){
        return userService.GetUsers();
    }

    @RequestMapping({
        "/",
        "/home",
    })
    public String home(){
        return "/frontend/pages/SC-Admin/home_sc_admin";
    }

    @GetMapping("/dashboard")
    public String showDashboard() {
        return "/frontend/pages/SC-Admin/Section/dashboard"; 
    }

    @GetMapping("/user_management")
    public String showUserManagement() {
        return "/frontend/pages/SC-Admin/Section/user_management"; 
    }
    @GetMapping("/account_admin")
    public String showAccountAdmin() {
        return "/frontend/pages/SC-Admin/Section/account_admin"; 
    }




    @RequestMapping("/login")
    public String loginPage() {
        return "/frontend/pages/login";
    }

    @RequestMapping({"/SCTechnician",})
    public String SCTechnician(){
        return "/frontend/pages/SC-Technician/home_sc_technician";
    }
    
    @GetMapping("/campaign_list")
    public String showCampaign_list() {
        return "/frontend/pages/SC-Technician/Section/campaign_list"; 
    }

    @GetMapping("/campaign_report")
    public String showCampaign_report() {
        return "/frontend/pages/SC-Technician/Section/campaign_report"; 
    }

    @GetMapping("/campaign_vehicle")
    public String showCampaign_vehicle() {
        return "/frontend/pages/SC-Technician/Section/campaign_vehicle"; 
    }

    @GetMapping("/dashboardSCTech")
    public String showDashboardSCTech() {
        return "/frontend/pages/SC-Technician/Section/dashboard"; 
    }

    @GetMapping("/job_list")
    public String showJob_list() {
        return "/frontend/pages/SC-Technician/Section/job_list"; 
    }

    @GetMapping("/notification")
    public String showNotification() {
        return "/frontend/pages/SC-Technician/Section/notification"; 
    }

    @GetMapping("/performance")
    public String showPerformance() {
        return "/frontend/pages/SC-Technician/Section/performance"; 
    }

    @GetMapping("/spare_part")
    public String showSpare_part() {
        return "/frontend/pages/SC-Technician/Section/spare_part"; 
    }

    @GetMapping("/technical_documents")
    public String showTechnical_documents() {
        return "/frontend/pages/SC-Technician/Section/technical_documents"; 
    }

    @GetMapping("/warranty_result")
    public String showWarranty_result() {
        return "/frontend/pages/SC-Technician/Section/warranty_result"; 
    }

    @GetMapping("/work_schedule")
    public String showWork_schedule() {
        return "/frontend/pages/SC-Technician/Section/work_schedule"; 
    }
    @GetMapping("/account_technician")
    public String showAccountTechnician() {
        return "/frontend/pages/SC-Technician/Section/account_technician"; 
    }


    
   @RequestMapping({"/EVMStaff",})
    public String EVMStaff(){
        return "/frontend/pages/EVM-Staff/home_evm_staff";
    }

    // Đã có, đúng
    @GetMapping("/dashboardEVM")
    public String showDashboardEVMStaff() {
        return "/frontend/pages/EVM-Staff/Section/dashboard"; 
    }

    // Đã có, đúng
    @GetMapping("/allocate_parts")
    public String allocate_parts() {
        return "/frontend/pages/EVM-Staff/Section/allocate_parts";
    }

    // SỬA LẠI: Bỏ chữ "m"
    @GetMapping("/manage_ev_parts")
    public String manage_ev_parts() {
        return "/frontend/pages/EVM-Staff/Section/manage_ev_parts";
    }

    // Đã có, đúng
    @GetMapping("/attach_serial")
    public String attach_serial() {
        return "/frontend/pages/EVM-Staff/Section/attach_serial";
    }

    // SỬA LẠI: Thêm chữ "EVM"
    @GetMapping("/inventory")
    public String showInventory() {
        return "/frontend/pages/EVM-Staff/Section/inventory";
    }

    // SỬA LẠI: Bỏ chữ "d"
    @GetMapping("/claim_requests")
    public String showClaimedRequests() {
        return "/frontend/pages/EVM-Staff/Section/claim_requests";
    }

    // Đã có, đúng
    @GetMapping("/claim_tracking")
    public String showClaimTracking() {
        return "/frontend/pages/EVM-Staff/Section/claim_tracking";
    }
    
    // Đã có, đúng
    @GetMapping("/warranty_cost")
    public String showWarrantyCost() {
        return "/frontend/pages/EVM-Staff/Section/warranty_cost";
    }

    // Đã có, đúng
    @GetMapping("/campaigns")
    public String showCampaigns() {
        return "/frontend/pages/EVM-Staff/Section/campaigns";
    }

    // Đã có, đúng
    @GetMapping("/warranty_policy")
    public String showWarrantyPolicy() {
        return "/frontend/pages/EVM-Staff/Section/warranty_policy";
    }

    // Đã có, đúng
    @GetMapping("/statistics")
    public String showStatistics() {
        return "/frontend/pages/EVM-Staff/Section/statistics";
    }

    // Đã có, đúng
    @GetMapping("/reports")
    public String showReports() {
        return "/frontend/pages/EVM-Staff/Section/reports";
    }

    @GetMapping("/account_evm")
    public String showAccountEVM() {
        return "/frontend/pages/EVM-Staff/Section/account_evm";
    }


    // SC-Staff Pages
    @GetMapping("/SCStaff")
    public String showSCStaffHome() {
        return "/frontend/pages/SC-Staff/home_sc_staff";
    }

    @GetMapping("/scstaff/account_staff")
    public String showSCStaffAccount() {
        return "/frontend/pages/SC-Staff/Section/account_staff";
    }

    @GetMapping("/scstaff/campaign_management")
    public String showSCStaffCampaignManagement() {
        return "/frontend/pages/SC-Staff/Section/campaign_management";
    }

    @GetMapping("/scstaff/customer_record_management")
    public String showSCStaffCustomerRecordManagement() {
        return "/frontend/pages/SC-Staff/Section/customer_record_management";
    }

    @GetMapping("/scstaff/dashboard")
    public String showSCStaffDashboard() {
        return "/frontend/pages/SC-Staff/Section/dashboard";
    }

    @GetMapping("/scstaff/job_notifications")
    public String showSCStaffJobNotifications() {
        System.out.println("Đã vào controller job_notifications");
        return "/frontend/pages/SC-Staff/Section/job_notifications";
    }

    @GetMapping("/scstaff/privacy_policy")
    public String showSCStaffPrivacyPolicy() {
        return "/frontend/pages/SC-Staff/Section/privacy_policy";
    }

    @GetMapping("/scstaff/technician_assignment")
    public String showSCStaffTechnicianAssignment() {
        return "/frontend/pages/SC-Staff/Section/technician_assignment";
    }

    @GetMapping("/scstaff/terms_of_service")
    public String showSCStaffTermsOfService() {
        return "/frontend/pages/SC-Staff/Section/terms_of_service";
    }

    @GetMapping("/scstaff/vehicle_record_management")
    public String showSCStaffVehicleRecordManagement() {
        return "/frontend/pages/SC-Staff/Section/vehicle_record_management";
    }

    @GetMapping("/scstaff/warranty_claim_management")
    public String showSCStaffWarrantyClaimManagement() {
        return "/frontend/pages/SC-Staff/Section/warranty_claim_management";
    }
    
}


