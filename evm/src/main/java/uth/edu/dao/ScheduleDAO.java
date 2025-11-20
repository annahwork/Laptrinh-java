package uth.edu.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.query.Query;

import uth.edu.pojo.Schedule;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ScheduleDAO {
    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public ScheduleDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public void addSchedule(Schedule schedule) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.persist(schedule);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()) {
                session.getTransaction().rollback();
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public void updateSchedule(Schedule schedule) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(schedule);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()) {
                session.getTransaction().rollback();
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public void deleteSchedule(Schedule schedule) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(schedule);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()) {
                session.getTransaction().rollback();
            }
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public Schedule getScheduleById(int scheduleID) {
        Session session = null;
        Schedule schedule = null;
        try {
            session = sessionFactory.openSession();
            schedule = session.get(Schedule.class, scheduleID);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return schedule;
    }

    public List<Schedule> getAllSchedules(int page, int pageSize) {
        Session session = null;
        List<Schedule> schedules = null;
        try {
            session = sessionFactory.openSession();
            schedules = session.createQuery("FROM Schedule", Schedule.class)
                    .setFirstResult((page - 1) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return schedules;
    }

    public List<Object[]> getScheduleVehicleInfo(int userID, int page, int pageSize) {
        Session session = null;
        List<Object[]> results = new ArrayList<>(); 
        
        try {
            session = sessionFactory.openSession();
            String hql = "SELECT s.Date, v.VIN, c.Name, s.Note, v.Status FROM Schedule s JOIN s.Customer c JOIN Vehicle v ON v.customer = c WHERE s.CreatedByStaff.UserID = :userID ORDER BY s.Date DESC";

            results = session.createQuery(hql, Object[].class)
                            .setParameter("userID", userID) 
                            .setFirstResult((page - 1) * pageSize)
                            .setMaxResults(pageSize)
                            .getResultList();
                            
        } catch (Exception e) {
            e.printStackTrace(); 
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return results;
    }   

    public List<Object[]> getScheduleVehicleTodayInfo(int userID, int page, int pageSize) {
        
        List<Object[]> results = new ArrayList<>();
        LocalDate localToday = LocalDate.now();
        Date today = Date.from(localToday.atStartOfDay(ZoneId.systemDefault()).toInstant());
        
        try (Session session = sessionFactory.openSession()) {

            String hql = "SELECT wc.Date, wc.vehicle.VIN, wc.vehicle.customer.Name, ws.Name, wc.Status, cs.ClaimServID FROM ClaimService cs JOIN cs.WarrantyClaim wc JOIN cs.WarrantyService ws WHERE cs.technician.UserID = :userID AND wc.Date = :today ORDER BY wc.Date DESC";

            Query<Object[]> query = session.createQuery(hql, Object[].class);
            query.setParameter("userID", userID); 
            query.setParameter("today", today);
            query.setFirstResult((page - 1) * pageSize);
            query.setMaxResults(pageSize);
            results = query.getResultList();
                                
        } catch (Exception e) {
            System.err.println("Lỗi khi truy vấn thông tin dịch vụ bảo hành hôm nay:");
            e.printStackTrace(); 
        } 
        
        return results;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
