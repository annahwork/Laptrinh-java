package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.VehicleDAO;
import uth.edu.pojo.Vehicle;

public class VehicleRepository implements IVehicleRepository {

    private VehicleDAO VehicleDAO = null;

    public VehicleRepository() {
        VehicleDAO = new VehicleDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addVehicle(Vehicle Vehicle) {
        VehicleDAO.addVehicle(Vehicle);
    }

    @Override
    public void updateVehicle(Vehicle Vehicle) {
        VehicleDAO.updateVehicle(Vehicle);
    }

    @Override
    public void deleteVehicle(Vehicle Vehicle) {
        VehicleDAO.deleteVehicle(Vehicle);
    }

    @Override
    public Vehicle getVehicleByVin(String Vin) {
        return VehicleDAO.getVehicleByVin(Vin);
    }

    @Override
    public List<Vehicle> getAllVehicles(int page, int pageSize) {
        return VehicleDAO.getAllVehicles(page, pageSize);
    }
}
