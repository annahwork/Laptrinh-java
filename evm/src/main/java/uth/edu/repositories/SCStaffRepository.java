package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.SCStaffDAO;
import uth.edu.pojo.SCStaff;

public class SCStaffRepository implements ISCStaffRepository {

    private SCStaffDAO SCStaffDAO = null;

    public SCStaffRepository() {
        SCStaffDAO = new SCStaffDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addSCStaff(SCStaff SCStaff) {
        SCStaffDAO.addSCStaff(SCStaff);
    }

    @Override
    public void updateSCStaff(SCStaff SCStaff) {
        SCStaffDAO.updateSCStaff(SCStaff);
    }

    @Override
    public void deleteSCStaff(SCStaff SCStaff) {
        SCStaffDAO.deleteSCStaff(SCStaff);
    }

    @Override
    public SCStaff getSCStaffById(int SCStaffId) {
        return SCStaffDAO.getSCStaffById(SCStaffId);
    }

    @Override
    public List<SCStaff> getAllSCStaffs(int page, int pageSize) {
        return SCStaffDAO.getAllSCStaff(page, pageSize);
    }
}
