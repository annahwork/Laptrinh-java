package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.PartDAO;
import uth.edu.pojo.Part;

public class PartRepository implements IPartRepository {

    private PartDAO PartDAO = null;

    public PartRepository() {
        PartDAO = new PartDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addPart(Part Part) {
        PartDAO.addPart(Part);
    }

    @Override
    public void updatePart(Part Part) {
        PartDAO.updatePart(Part);
    }

    @Override
    public void deletePart(Part Part) {
        PartDAO.deletePart(Part);
    }

    @Override
    public Part getPartById(int partId) {
        return PartDAO.getPartById(partId);
    }

    @Override
    public List<Part> getAllParts(int page, int pageSize) {
        return PartDAO.getAllParts(page, pageSize);
    }
    @Override
    public void closeResources() {
        PartDAO.closeSessionFactory();
    }
}
