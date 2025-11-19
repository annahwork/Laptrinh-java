package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.EVMStaff;

@Repository
public interface IEVMStaffRepository {
    public void addEVMStaff(uth.edu.pojo.EVMStaff EVMStaff);
    public void updateEVMStaff(uth.edu.pojo.EVMStaff EVMStaff);
    public void deleteEVMStaff(uth.edu.pojo.EVMStaff EVMStaff);
    public uth.edu.pojo.EVMStaff getEVMStaffById(int id);
    public List<EVMStaff> getAllEVMStaffs(int page, int pageSize);
}