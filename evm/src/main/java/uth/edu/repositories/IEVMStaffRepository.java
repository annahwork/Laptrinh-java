package uth.edu.repositories;

public interface IEVMStaffRepository {
    public void addEVMStaff(uth.edu.pojo.EVMStaff EVMStaff);
    public void updateEVMStaff(uth.edu.pojo.EVMStaff EVMStaff);
    public void deleteEVMStaff(uth.edu.pojo.EVMStaff EVMStaff);
    public uth.edu.pojo.EVMStaff getEVMStaffById(int id);
    public java.util.List<uth.edu.pojo.EVMStaff> getAllEVMStaffs(int page, int pageSize);
}