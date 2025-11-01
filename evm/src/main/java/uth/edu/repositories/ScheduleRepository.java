package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.ScheduleDAO;
import uth.edu.pojo.Schedule;

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
}
