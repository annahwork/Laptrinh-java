package uth.edu.repositories;

import org.springframework.stereotype.Repository;

@Repository
public interface ISCTechnicianRepository {
    public void addSCTechnician(uth.edu.pojo.SCTechnician SCTechnician);
    public void updateSCTechnician(uth.edu.pojo.SCTechnician SCTechnician);
    public void deleteSCTechnician(uth.edu.pojo.SCTechnician SCTechnician);
    public uth.edu.pojo.SCTechnician getSCTechnicianById(int id);
    public java.util.List<uth.edu.pojo.SCTechnician> getAllSCTechnicians(int page, int pageSize);
}