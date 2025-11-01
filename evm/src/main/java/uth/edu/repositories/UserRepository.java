package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.UserDAO;
import uth.edu.pojo.User;

public class UserRepository implements IUserRepository {

    private UserDAO UserDAO = null;

    public UserRepository() {
        UserDAO = new UserDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addUser(User User) {
        UserDAO.addUser(User);
    }

    @Override
    public void updateUser(User User) {
        UserDAO.updateUser(User);
    }

    @Override
    public void deleteUser(User User) {
        UserDAO.deleteUser(User);
    }

    @Override
    public User getUserById(int UserId) {
        return UserDAO.getUserById(UserId);
    }

    @Override
    public List<User> getAllUsers(int page, int pageSize) {
        return UserDAO.getAllUsers(page, pageSize);
    }
}
