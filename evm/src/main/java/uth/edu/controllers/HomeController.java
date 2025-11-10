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

}