package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.SCTechnician;

@Repository
public interface ISCTechnicianRepository {
    public void addSCTechnician(uth.edu.pojo.SCTechnician SCTechnician);
    public void updateSCTechnician(uth.edu.pojo.SCTechnician SCTechnician);
    public void deleteSCTechnician(uth.edu.pojo.SCTechnician SCTechnician);
    public uth.edu.pojo.SCTechnician getSCTechnicianById(int id);
}