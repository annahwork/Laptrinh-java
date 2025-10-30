package uth.edu.repositories;

public interface IAdminRepository {
    public void addAdmin(uth.edu.pojo.Admin admin);
    public void updateAdmin(uth.edu.pojo.Admin admin);
    public void deleteAdmin(uth.edu.pojo.Admin admin);
    public uth.edu.pojo.Admin getAdminById(long id);
    public java.util.List<uth.edu.pojo.Admin> getAllAdmins(int page, int pageSize);
}
