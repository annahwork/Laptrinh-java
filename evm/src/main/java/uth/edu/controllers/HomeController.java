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

}


