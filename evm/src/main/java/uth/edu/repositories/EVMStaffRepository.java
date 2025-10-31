package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.EVMStaffDAO;
import uth.edu.pojo.EVMStaff;

public class EVMStaffRepository implements IEVMStaffRepository {

    private EVMStaffDAO EVMStaffDAO = null;

    public EVMStaffRepository() {
        EVMStaffDAO = new EVMStaffDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addEVMStaff(EVMStaff EVMStaff) {
        EVMStaffDAO.addStaff(EVMStaff);
    }

    @Override
    public void updateEVMStaff(EVMStaff EVMStaff) {
        EVMStaffDAO.updateStaff(EVMStaff);
    }

    @Override
    public void deleteEVMStaff(EVMStaff EVMStaff) {
        EVMStaffDAO.deleteStaff(EVMStaff);
    }

    @Override
    public EVMStaff getEVMStaffById(int id) {
        return EVMStaffDAO.getStaffById(id);
    }

    @Override
    public List<EVMStaff> getAllEVMStaffs(int page, int pageSize) {
        return EVMStaffDAO.getAllStaff(page, pageSize);
    }
}
