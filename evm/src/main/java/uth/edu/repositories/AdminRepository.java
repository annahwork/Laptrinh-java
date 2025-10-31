package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.AdminDAO;
import uth.edu.pojo.Admin;

public class AdminRepository implements IAdminRepository {

    private AdminDAO adminDAO = null;

    public AdminRepository() {
        adminDAO = new AdminDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addAdmin(Admin admin) {
        adminDAO.addAdmin(admin);
    }

    @Override
    public void updateAdmin(Admin admin) {
        adminDAO.updateAdmin(admin);
    }

    @Override
    public void deleteAdmin(Admin admin) {
        adminDAO.deleteAdmin(admin);
    }

    @Override
    public Admin getAdminById(int id) {
        return adminDAO.getAdminById(id);
    }

    @Override
    public List<Admin> getAllAdmins(int page, int pageSize) {
        return adminDAO.getAllAdmins(page, pageSize);
    }
}
