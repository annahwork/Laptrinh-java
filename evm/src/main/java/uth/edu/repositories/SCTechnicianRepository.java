package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.dao.SCTechnicianDAO;
import uth.edu.pojo.SCTechnician;

@Repository
public class SCTechnicianRepository implements ISCTechnicianRepository {

    private SCTechnicianDAO SCTechnicianDAO = null;

    public SCTechnicianRepository() {
        SCTechnicianDAO = new SCTechnicianDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addSCTechnician(SCTechnician SCTechnician) {
        SCTechnicianDAO.addTechnician(SCTechnician);
    }

    @Override
    public void updateSCTechnician(SCTechnician SCTechnician) {
        SCTechnicianDAO.updateTechnician(SCTechnician);
    }

    @Override
    public void deleteSCTechnician(SCTechnician SCTechnician) {
        SCTechnicianDAO.deleteTechnician(SCTechnician);
    }

    @Override
    public SCTechnician getSCTechnicianById(int SCTechnicianId) {
        return SCTechnicianDAO.getTechnicianById(SCTechnicianId);
    }

    @Override
    public List<SCTechnician> getAllSCTechnicians(int page, int pageSize) {
        return SCTechnicianDAO.getAllTechnicians(page, pageSize);
    }
}
