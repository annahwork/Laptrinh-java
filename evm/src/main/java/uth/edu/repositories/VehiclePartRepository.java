package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.VehiclePartDAO;
import uth.edu.pojo.VehiclePart;

public class VehiclePartRepository implements IVehiclePartRepository {

    private VehiclePartDAO VehiclePartDAO = null;

    public VehiclePartRepository() {
        VehiclePartDAO = new VehiclePartDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addVehiclePart(VehiclePart VehiclePart) {
        VehiclePartDAO.addVehiclePart(VehiclePart);
    }

    @Override
    public void updateVehiclePart(VehiclePart VehiclePart) {
        VehiclePartDAO.updateVehiclePart(VehiclePart);
    }

    @Override
    public void deleteVehiclePart(VehiclePart VehiclePart) {
        VehiclePartDAO.deleteVehiclePart(VehiclePart);
    }

    @Override
    public VehiclePart getVehiclePartById(int VehiclePartId) {
        return VehiclePartDAO.getVehiclePartById(VehiclePartId);
    }

    @Override
    public List<VehiclePart> getAllVehicleParts(int page, int pageSize) {
        return VehiclePartDAO.getAllVehicleParts(page, pageSize);
    }
    @Override
    public void closeResources() {
        VehiclePartDAO.closeSessionFactory();
    }
}
