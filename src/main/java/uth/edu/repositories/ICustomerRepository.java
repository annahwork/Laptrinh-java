package uth.edu.repositories;
import uth.edu.pojo.Customer;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface ICustomerRepository {
    public void addCustomer(Customer customer);
    public void updateCustomer(Customer customer);
    public void deleteCustomer(Customer customer);
    public Customer getCustomerById(int id);
    public List<Customer> getAllCustomers(int page, int pageSize);
    public int countAllCustomers();
}