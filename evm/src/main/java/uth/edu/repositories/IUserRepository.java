package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.User;

@Repository
public interface IUserRepository {
    public User addUser(User user);
    public void updateUser(User user);
    public void deleteUser(User user);
    public User getUserById(int id);
    public List<User> getAllUsers(int page, int pageSize);
    public User getUserByUserName(String userName);
    public List<User> getUsersByRole(String role);
    public List<User> getUsersByRoleAndSC(String role, int scId);
    public int countAllUsers();
    public int countUsersByRole(String Role);
    public List<User> getAllTechnicians(int page, int pageSize);
    public void closeResources();
}

