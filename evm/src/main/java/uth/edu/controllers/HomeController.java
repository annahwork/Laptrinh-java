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
    @RequestMapping({"/EVMStaff",})
    public String EVMStaff(){
        return "/frontend/pages/EVM-Staff/home_evm_staff";
    }
    @GetMapping("/allocate_parts")
    public String allocate_parts() {
        return "/frontend/pages/EVM-Staff/Section/allocate_parts"; 
    }
    @GetMapping("/attach_serial")
    public String attach_serial() {
        return "/frontend/pages/EVM-Staff/Section/attach_serial"; 
    }
    @GetMapping("/dashboardEVM")
    public String showDashboardEVMStaff() {
        return "/frontend/pages/EVM-Staff/Section/dashboard"; 
    }
    // SC-Staff Pages
    @GetMapping("/SCStaff")
    public String showSCStaffHome() {
        return "/frontend/pages/SC-Staff/home_sc_staff";
    }

    @GetMapping("/scstaff/account")
    public String showSCStaffAccount() {
        return "/frontend/pages/SC-Staff/Section/account";
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


