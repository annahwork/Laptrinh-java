package uth.edu.repositories;

import java.util.List;
import uth.edu.pojo.User;

public interface IUserRepository {
    public void addUser(User user);
    public void updateUser(User user);
    public void deleteUser(User user);
    public User getUserById(int id);
    public List<User> getAllUsers(int page, int pageSize);
    public User getUserByUserName(String userName);
}

