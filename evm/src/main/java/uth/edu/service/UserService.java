package uth.edu.service;

import java.util.ArrayList;
import java.util.List;

import uth.edu.pojo.Admin;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.User;
import uth.edu.repositories.AdminRepository;
import uth.edu.repositories.SCTechnicianRepository;
import uth.edu.repositories.UserRepository;

public class UserService {

    private UserRepository userRepository;
    private AdminRepository adminRepository;
    private SCTechnicianRepository technicianRepository;

    public UserService() {
        userRepository = new UserRepository();
        adminRepository = new AdminRepository();
        technicianRepository = new SCTechnicianRepository();
    }

    public User Login(String userName, String password) {
        try {
            User user = userRepository.getUserByUserName(userName);
            if (user != null && user.getPassword().equals(password)) {
                return user;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<User> GetUsers() {
        try {
            return userRepository.getAllUsers(1, 20);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<User> GetUsers(int page) {
        try {
            return userRepository.getAllUsers(page, 30);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public User GetUserProfile(Integer userId) {
        try {
            return userRepository.getUserById(userId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean ManageUserAccount(Integer adminId, User userData, String role) {
        try {
            Admin admin = adminRepository.getAdminById(adminId);
            if (admin == null) {
                System.out.println("Admin không tồn tại hoặc không có quyền thực hiện thao tác này.");
                return false;
            }

            if (userData == null) {
                System.out.println("Dữ liệu user không hợp lệ.");
                return false;
            }

            if (userData.getUserID() <= 0) {
                return createUserWithRole(userData, role);
            } else {
                return updateUserWithRole(userData, role);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean createUserWithRole(User userData, String role) {
        try {
            User newUser = null;
            switch (role.toUpperCase()) {
                case "ADMIN":
                    newUser = new Admin(userData.getUserName(), userData.getPassword(), userData.getName());
                    break;
                case "SC_STAFF":
                    newUser = new SCStaff(userData.getUserName(), userData.getPassword(),
                            null, userData.getName(), userData.getEmail());
                    break;
                case "SC_TECHNICIAN":
                    newUser = new SCTechnician(userData.getUserName(), userData.getPassword(), userData.getName());
                    break;
                case "EVM_STAFF":
                    newUser = new EVMStaff(userData.getUserName(), userData.getPassword(), userData.getName());
                    break;
                default:
                    System.out.println("Role không hợp lệ: " + role);
                    return false;
            }

            newUser.setEmail(userData.getEmail());
            newUser.setPhone(userData.getPhone());
            userRepository.addUser(newUser);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean updateUserWithRole(User userData, String role) {
        try {
            if (userData == null || userData.getUserID() == 0) {
                return false;
            }
            User existingUser = userRepository.getUserById(userData.getUserID());
            if (existingUser == null) {
                return false;
            }
            existingUser.setUserName(userData.getUserName());
            existingUser.setPassword(userData.getPassword());
            existingUser.setName(userData.getName());
            existingUser.setEmail(userData.getEmail());
            existingUser.setPhone(userData.getPhone());
            userRepository.updateUser(existingUser);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<SCTechnician> GetTechnicians(Integer scStaffID) {
        try {
            User staff = userRepository.getUserById(scStaffID);
            if (staff == null || !(staff instanceof SCStaff)) {
                System.out.println("SCStaff không tồn tại hoặc ID không hợp lệ.");
                return new ArrayList<>();
            }
            return technicianRepository.getAllSCTechnicians(1, 20);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
