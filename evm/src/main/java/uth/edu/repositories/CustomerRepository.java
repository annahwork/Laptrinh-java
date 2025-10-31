package uth.edu.repositories;

import java.util.List;

import uth.edu.dao.CustomerDAO;
import uth.edu.pojo.Customer;

public class CustomerRepository implements ICustomerRepository {

    private CustomerDAO customerDAO = null;

    public CustomerRepository() {
        customerDAO = new CustomerDAO("Hibernate.cfg.xml");
    }

    @Override
    public void addCustomer(Customer customer) {
        customerDAO.addCustomer(customer);
    }

    @Override
    public void updateCustomer(Customer customer) {
        customerDAO.updateCustomer(customer);
    }

    @Override
    public void deleteCustomer(Customer customer) {
        customerDAO.deleteCustomer(customer);
    }

    @Override
    public Customer getCustomerById(int id) {
        return customerDAO.getCustomerById(id);
    }

    @Override
    public List<Customer> getAllCustomers(int page, int pageSize) {
        return customerDAO.getAllCustomers(page, pageSize);
    }
}
