package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.SCStaff;

@Repository
public interface ISCStaffRepository {
    public void addSCStaff(uth.edu.pojo.SCStaff SCStaff);
    public void updateSCStaff(uth.edu.pojo.SCStaff SCStaff);
    public void deleteSCStaff(uth.edu.pojo.SCStaff SCStaff);
    public uth.edu.pojo.SCStaff getSCStaffById(int id);
    public List<SCStaff> getAllSCStaffs(int page, int pageSize);
}