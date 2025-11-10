package uth.edu.repositories;

import org.springframework.stereotype.Repository;

@Repository
public interface IAdminRepository {
    public void addAdmin(uth.edu.pojo.Admin admin);
    public void updateAdmin(uth.edu.pojo.Admin admin);
    public void deleteAdmin(uth.edu.pojo.Admin admin);
    public uth.edu.pojo.Admin getAdminById(int id);
    public java.util.List<uth.edu.pojo.Admin> getAllAdmins(int page, int pageSize);
}
