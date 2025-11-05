package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.UserDAO;
import uth.edu.pojo.User;

public class UserRepository implements IUserRepository {

    private UserDAO userDAO = null;

    public UserRepository() {
        userDAO = new UserDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addUser(User user) {
        userDAO.addUser(user);
    }

    @Override
    public void updateUser(User user) {
        userDAO.updateUser(user);
    }

    @Override
    public void deleteUser(User user) {
        userDAO.deleteUser(user);
    }

    @Override
    public User getUserById(int id) {
        return userDAO.getUserById(id);
    }

    @Override
    public List<User> getAllUsers(int page, int pageSize) {
        return userDAO.getAllUsers(page, pageSize);
    }

    @Override
    public User getUserByUserName(String userName) {
        return userDAO.getUserByUserName(userName);
    }
    @Override
    public List<User> getUsersByRole(String role) {
        return userDAO.getUsersByRole(role);
    }
    @Override
    public List<User> getUsersByRoleAndSC(String role, int scId) {
        return userDAO.getUsersByRoleAndSC(role, scId);
    }

    @Override
    public void closeResources() {
        userDAO.closeSessionFactory();
    }   
}

