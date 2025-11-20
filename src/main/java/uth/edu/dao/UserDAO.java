package uth.edu.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties.Admin;

import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.User;

public class UserDAO {

    private Configuration configuration = null;
    private SessionFactory sessionFactory = null;

    public UserDAO(String configFile) {
        configuration = new Configuration();
        configuration.configure(configFile);
        sessionFactory = configuration.buildSessionFactory();
    }

    public User addUser(User user) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            Integer generatedId = (Integer) session.save(user); 
            session.getTransaction().commit();
            System.out.println("User created with ID: " + user.getUserID());
            return user; 
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null && session.getTransaction().isActive()) {
                session.getTransaction().rollback();
            }
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }


    public void updateUser(User user) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.merge(user);
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

    public void deleteUser(User user) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.remove(user);
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

    public User getUserById(int id) {
        Session session = null;
        User user = null;
        
        try {
            session = sessionFactory.openSession();
                        user = session.get(User.class, id); 

            if (user != null) {
                System.out.println("DAO: Found user with ID " + id + ": " + user.getUserName() + " (Role: " + user.getUser_Role() + ")");
            } else {
                System.out.println("DAO: User not found with ID: " + id);
            }
        } catch (Exception e) {
            System.out.println("DAO: Exception while fetching user with ID: " + id);
            e.printStackTrace(); 
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return user;
    }

        public List<User> getAllUsers(int page, int pageSize) {
        Session session = null;
        List<User> users = new ArrayList<>();
        
        try {
            session = sessionFactory.openSession();
            users = session.createQuery("FROM User", User.class)
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
        
        return users;
    }


    public User getUserByUserName(String userName) {
        Session session = null;
        User user = null;
        try {
            session = sessionFactory.openSession();
            user = session.createQuery("FROM User WHERE userName = :userName", User.class)
                    .setParameter("userName", userName)
                    .uniqueResult();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return user;
    }
    
    public List<User> getUsersByRoleAndSC(String role, Integer scId) {
        Session session = null;
        List<User> users = null;
        try {
            session = sessionFactory.openSession();
            users = session.createNativeQuery("SELECT * FROM User_Table WHERE User_Role = :role AND SCID = :scId", User.class)
            .setParameter("role", role)
            .setParameter("scId", scId)
            .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>(); 
        } finally {
            if (session != null) session.close();
        }
        return users;
    }
    public List<User> getUsersByRole(String role) {
        Session session = null;
        List<User> users = null;
        try {
            session = sessionFactory.openSession();
            users = session.createNativeQuery("SELECT * FROM User_Table WHERE User_Role = :role", User.class)
                .setParameter("role", role)
                .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return users;
    }

    public int countAllUsers() {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            Long count = (Long) session.createQuery("SELECT COUNT(u) FROM User u").uniqueResult();
            return count.intValue();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        } finally {
            if (session != null) session.close();
        }
    }

    public int countUsersByRole(String role) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            Long count = (Long) session.createQuery("SELECT COUNT(u) FROM User u WHERE TYPE(u) = :roleClass")
                    .setParameter("roleClass", switch(role.toUpperCase()) {
                        case "ADMIN" -> Admin.class;
                        case "SC_STAFF" -> SCStaff.class;
                        case "SC_TECHNICIAN" -> SCTechnician.class;
                        case "EVM_STAFF" -> EVMStaff.class;
                        default -> User.class;
                    })
                    .uniqueResult();
            return count.intValue();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        } finally {
            if (session != null) session.close();
        }
    }

    public List<User> getAllTechnicians(int page, int pageSize) {
        Session session = null;
        List<User> users = new ArrayList<>();
        
        try {
            session = sessionFactory.openSession();
            String hql = "FROM SCTechnician"; 
            
            users = session.createQuery(hql, User.class)
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
        return users;
    }

    public void closeSessionFactory() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}
