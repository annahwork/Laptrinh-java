package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.SCTechnician;

@Repository
public interface ISCTechnicianRepository {
    public void addSCTechnician(SCTechnician SCTechnician);
    public void updateSCTechnician(SCTechnician SCTechnician);
    public void deleteSCTechnician(SCTechnician SCTechnician);
    public SCTechnician getSCTechnicianById(int id);
}