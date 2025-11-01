package uth.edu.repositories;

public interface IUserRepository {
    public void addUser(uth.edu.pojo.User User);
    public void updateUser(uth.edu.pojo.User User);
    public void deleteUser(uth.edu.pojo.User User);
    public uth.edu.pojo.User getUserById(int id);
    public java.util.List<uth.edu.pojo.User> getAllUsers(int page, int pageSize);
}