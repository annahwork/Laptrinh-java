package uth.edu.repositories;

public interface ISCStaffRepository {
    public void addSCStaff(uth.edu.pojo.SCStaff SCStaff);
    public void updateSCStaff(uth.edu.pojo.SCStaff SCStaff);
    public void deleteSCStaff(uth.edu.pojo.SCStaff SCStaff);
    public uth.edu.pojo.SCStaff getSCStaffById(int id);
    public java.util.List<uth.edu.pojo.SCStaff> getAllSCStaffs(int page, int pageSize);
}