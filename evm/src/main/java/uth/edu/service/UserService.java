package uth.edu.service;

import uth.edu.pojo.Admin;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.User;
import uth.edu.repositories.AdminRepository;
import uth.edu.repositories.ClaimServiceRepository;
import uth.edu.repositories.UserRepository;
import uth.edu.repositories.VehicleRepository;
import uth.edu.repositories.SCTechnicianRepository;
import uth.edu.repositories.CustomerRepository;
import uth.edu.repositories.WarrantyClaimRepository;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    private UserRepository userRepository;
    private AdminRepository adminRepository;
    private SCTechnicianRepository technicianRepository;
    private VehicleRepository vehicleRepository;
    private CustomerRepository customerRepository;
    private WarrantyClaimRepository warrantyclaimRepository;
    private ClaimServiceRepository claimServiceRepository;

    @Autowired
    public UserService(UserRepository userRepository, AdminRepository adminRepository, SCTechnicianRepository technicianRepository, CustomerRepository customerRepository, WarrantyClaimRepository warrantyclaimRepository, ClaimServiceRepository claimServiceRepository) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.vehicleRepository = vehicleRepository;
        this.technicianRepository = technicianRepository;
        this.customerRepository = customerRepository;
        this.warrantyclaimRepository = warrantyclaimRepository;
        this.claimServiceRepository = claimServiceRepository;
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
            return userRepository.getAllUsers(1, 9999);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<User> GetUsers(int page) {
        try {
            return userRepository.getAllUsers(page, 9999);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public User GetUserProfile(Integer userId) {
        try {
            User user = userRepository.getUserById(userId);
            if (user == null) {
                System.out.println("SERVICE: User không tồn tại với ID: " + userId);
            } else {
                System.out.println("SERVICE: User found: " + user);
            }
            return user;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean deleteUser(Integer userId) {
        try {
            if (userId == null || userId <= 0) {
                System.out.println("User ID không hợp lệ.");
                return false;
            }

            User existingUser = userRepository.getUserById(userId);
            if (existingUser == null) {
                System.out.println("User không tồn tại với ID: " + userId);
                return false;
            }

            userRepository.deleteUser(existingUser); 
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    public User ManageUserAccount(Integer adminId, User userData, String role) {
    try {
        Admin admin = adminRepository.getAdminById(adminId);
        if (admin == null) {
            System.out.println("Admin không tồn tại hoặc không có quyền thực hiện thao tác này.");
            return null;
        }

        if (userData == null) {
            System.out.println("Dữ liệu user không hợp lệ.");
            return null;
        }

        if (userData.getUserID() == null || userData.getUserID() <= 0) {
            return createUserWithRole(userData, role);
        } else {
            return updateUserWithRole(userData, role);
        }
    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}

    @Transactional
    public User createUserWithRole(User userData, String role) {
        try {
            User newUser = null;
            switch (role.toUpperCase()) {
                case "ADMIN" -> newUser = new Admin(userData.getUserName(), userData.getPassword(), userData.getName(), userData.getEmail(), userData.getPhone());
                case "SC_STAFF" -> newUser = new SCStaff(userData.getUserName(), userData.getPassword(), userData.getName(), userData.getEmail(), userData.getPhone());
                case "SC_TECHNICIAN" -> newUser = new SCTechnician(userData.getUserName(), userData.getPassword(), userData.getName(), userData.getEmail(), userData.getPhone());
                case "EVM_STAFF" -> newUser = new EVMStaff(userData.getUserName(), userData.getPassword(), userData.getName(), userData.getEmail(), userData.getPhone());
                default -> {
                    System.out.println("Role không hợp lệ: " + role);
                    return null;
                }
            }
            User savedUser = userRepository.addUser(newUser);
            return savedUser;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public User updateUserWithRole(User userData, String role) {
        try {
            if (userData == null || userData.getUserID() == null || userData.getUserID() <= 0) {
                return null;
            }

            User existingUser = userRepository.getUserById(userData.getUserID());
            if (existingUser == null) {
                return null;
            }

            existingUser.setUserName(userData.getUserName());
            if (userData.getPassword() != null && !userData.getPassword().isEmpty()) {
                existingUser.setPassword(userData.getPassword());
            }
            existingUser.setName(userData.getName());
            existingUser.setEmail(userData.getEmail());
            existingUser.setPhone(userData.getPhone());

            userRepository.updateUser(existingUser);

            return existingUser; 
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public User updateUser(User userData) {
        if (userData == null || userData.getUserID() == null) return null;
        return updateUserWithRole(userData, userData.getUser_Role());
    }


    public List<User> GetUserByRole(String role) {
         try {
              if (role == null || role.isEmpty()) {
               return GetUsers(); 
            }
            return userRepository.getUsersByRole(role.toUpperCase());
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
            }
        }

    public int countAllUsers() {
        try {
            int userCount = userRepository.countAllUsers(); 
            return (int) userCount;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public int countAllCustomer() {
        try {
            int customerCount = customerRepository.countAllCustomers(); 
            return (int) customerCount;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public int countAllWarrantyClaims() {
        try {
                int warrantyclaimCount = warrantyclaimRepository.countAllWarrantyClaims() ; 
                return warrantyclaimCount;
            } catch (Exception e) {
                e.printStackTrace();
                return 0;
            }
    }

    public int countUsersByRole(String role) {
        try {
            if (role == null || role.isEmpty()) return 0;
            List<User> users = userRepository.getUsersByRole(role.toUpperCase());
            return users.size();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public List<User> GetTechnicians() {
        try {
            List<User> technicians = userRepository.getAllTechnicians(1, 9999); 
            
            for (User tech : technicians) {
                String taskNote = claimServiceRepository.getFirstActiveTaskNote(tech.getUserID());
                ((SCTechnician) tech).setCurrentTask(taskNote);
            }
            return technicians; 
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<User> GetTechniciansForSCT() {
        try {
            List<User> technicians = userRepository.getAllTechnicians(1, 9999); 
            
            for (User tech : technicians) {
                String taskNote = claimServiceRepository.getFirstActiveTaskNoteForSCT(tech.getUserID());
                ((SCTechnician) tech).setCurrentTask(taskNote);
            }
            return technicians; 
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public int countVehicles() {
        try {
            return vehicleRepository.countAllVehicles(); 
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

}
