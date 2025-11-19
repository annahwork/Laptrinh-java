package uth.edu.repositories;

import org.springframework.stereotype.Repository;
import uth.edu.pojo.Schedule;
import java.util.List;
@Repository
public interface IScheduleRepository {
    public void addSchedule(Schedule Schedule);
    public void updateSchedule(Schedule Schedule);
    public void deleteSchedule(Schedule Schedule);
    public Schedule getScheduleById(int id);
    public List<Schedule> getAllSchedules(int page, int pageSize);
    public List<Object[]> getScheduleVehicleInfo(int userID, int page, int pageSize);
    public List<Object[]> getScheduleVehicleTodayInfo(int userID, int page, int pageSize);
}