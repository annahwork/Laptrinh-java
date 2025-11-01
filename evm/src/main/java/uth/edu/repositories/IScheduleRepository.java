package uth.edu.repositories;

public interface IScheduleRepository {
    public void addSchedule(uth.edu.pojo.Schedule Schedule);
    public void updateSchedule(uth.edu.pojo.Schedule Schedule);
    public void deleteSchedule(uth.edu.pojo.Schedule Schedule);
    public uth.edu.pojo.Schedule getScheduleById(int id);
    public java.util.List<uth.edu.pojo.Schedule> getAllSchedules(int page, int pageSize);
}