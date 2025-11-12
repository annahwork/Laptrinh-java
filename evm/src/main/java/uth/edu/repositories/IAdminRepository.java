package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.Admin;

@Repository
public interface IAdminRepository {
    public void addAdmin(uth.edu.pojo.Admin admin);
    public void updateAdmin(uth.edu.pojo.Admin admin);
    public void deleteAdmin(uth.edu.pojo.Admin admin);
    public uth.edu.pojo.Admin getAdminById(int id);
    public List<Admin> getAllAdmins(int page, int pageSize);
}
