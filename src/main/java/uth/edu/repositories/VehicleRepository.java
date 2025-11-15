package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.dao.VehicleDAO;
import uth.edu.pojo.Vehicle;

@Repository
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
    public List<Vehicle> getVehiclesByModel(String model, int page, int pageSize) {
        return VehicleDAO.getVehiclesByModel(model, page, pageSize);
    }
    @Override
    public List<Vehicle> getAllVehicles(int page, int pageSize) {
        return VehicleDAO.getAllVehicles(page, pageSize);
    }
    @Override
    public int countAllVehicles() {
        return VehicleDAO.countAllVehicles();
    }

    @Override
    public int countVehiclesByStatus(String status) {
        return VehicleDAO.countVehiclesByStatus(status);
    }
    @Override
    public void closeResources() {
        if (VehicleDAO != null) {
            VehicleDAO.closeSessionFactory();
        }
    }
}
