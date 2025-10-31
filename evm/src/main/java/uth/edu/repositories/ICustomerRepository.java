package uth.edu.repositories;

public interface ICustomerRepository {
    public void addCustomer(uth.edu.pojo.Customer customer);
    public void updateCustomer(uth.edu.pojo.Customer customer);
    public void deleteCustomer(uth.edu.pojo.Customer customer);
    public uth.edu.pojo.Customer getCustomerById(int id);
    public java.util.List<uth.edu.pojo.Customer> getAllCustomers(int page, int pageSize);
}