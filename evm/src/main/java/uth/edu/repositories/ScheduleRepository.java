package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.dao.ScheduleDAO;
import uth.edu.pojo.Schedule;

@Repository
public class ScheduleRepository implements IScheduleRepository {

    private ScheduleDAO ScheduleDAO = null;

    public ScheduleRepository() {
        ScheduleDAO = new ScheduleDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addSchedule(Schedule Schedule) {
        ScheduleDAO.addSchedule(Schedule);
    }

    @Override
    public void updateSchedule(Schedule Schedule) {
        ScheduleDAO.updateSchedule(Schedule);
    }

    @Override
    public void deleteSchedule(Schedule Schedule) {
        ScheduleDAO.deleteSchedule(Schedule);
    }

    @Override
    public Schedule getScheduleById(int ScheduleId) {
        return ScheduleDAO.getScheduleById(ScheduleId);
    }

    @Override
    public List<Schedule> getAllSchedules(int page, int pageSize) {
        return ScheduleDAO.getAllSchedules(page, pageSize);
    }

    @Override
    public List<Object[]> getScheduleVehicleInfo(int userID, int page, int pageSize){
        return ScheduleDAO.getScheduleVehicleInfo(userID, page, pageSize);
    }

    @Override
    public List<Object[]> getScheduleVehicleTodayInfo(int userID, int page, int pageSize) {
        return ScheduleDAO.getScheduleVehicleTodayInfo(userID, page, pageSize);
    }
    
}
