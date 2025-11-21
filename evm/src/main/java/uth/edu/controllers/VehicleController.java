package uth.edu.controllers;

import uth.edu.pojo.Vehicle;
import uth.edu.pojo.Customer;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.User;
import uth.edu.service.VehicleService;
import uth.edu.repositories.VehicleRepository;
import uth.edu.repositories.CustomerRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;
    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public VehicleController(VehicleService vehicleService,
            VehicleRepository vehicleRepository,
            CustomerRepository customerRepository,
            ObjectMapper objectMapper) {
        this.vehicleService = vehicleService;
        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerVehicle(HttpSession session, @RequestBody Map<String, Object> requestBody,@RequestParam Integer staffId) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }
        try {
            Vehicle vehicleData = objectMapper.convertValue(requestBody.get("vehicle"), Vehicle.class);
            Customer customerData = objectMapper.convertValue(requestBody.get("customer"), Customer.class);

            boolean success = vehicleService.RegisterVehicle(staffId, vehicleData, customerData);

            if (success) {
                return ResponseEntity.ok("Đăng ký xe thành công!");
            } else {
                return ResponseEntity.badRequest().body("Đăng ký xe thất bại (VIN trùng?).");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server (POST): " + e.getMessage());
        }
    }

    @GetMapping("all")
    public ResponseEntity<List<org.hibernate.mapping.Map>> getAllVehicles(HttpSession session,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !(loggedInUser instanceof EVMStaff)) {
            return ResponseEntity.status(401).build();
        }        
        List<org.hibernate.mapping.Map> vehicles = vehicleService.GetVehicles();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{vin}")
    public ResponseEntity<Vehicle> getVehicleByVin(@PathVariable String vin) {
        Vehicle vehicle = vehicleService.GetVehicleDetails(vin);
        if (vehicle != null) {
            return ResponseEntity.ok(vehicle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("update/{vin}")
    public ResponseEntity<String> updateVehicle(
            @PathVariable String vin,
            @RequestBody Map<String, Object> requestBody,
            @RequestParam Integer staffId) {

        try {
            Vehicle existingVehicle = vehicleRepository.getVehicleByVin(vin);
            if (existingVehicle == null) {
                return ResponseEntity.status(404).body("Không tìm thấy xe để sửa.");
            }

            Vehicle vehicleData = objectMapper.convertValue(requestBody.get("vehicle"), Vehicle.class);
            Customer customerData = objectMapper.convertValue(requestBody.get("customer"), Customer.class);
            Customer existingCustomer = existingVehicle.getCustomer();
            if (existingCustomer == null) {
                existingCustomer = new Customer();
                existingCustomer.setPhone(customerData.getPhone());
            }

            existingCustomer.setName(customerData.getName());
            existingCustomer.setPhone(customerData.getPhone()); 
            customerRepository.updateCustomer(existingCustomer);

            existingVehicle.setCustomer(existingCustomer); 
            existingVehicle.setModel(vehicleData.getModel());
            existingVehicle.setYear_Of_Manufacture(vehicleData.getYear_Of_Manufacture());
            existingVehicle.setWarranty_Time(vehicleData.getWarranty_Time());
            existingVehicle.setStatus(vehicleData.getStatus());

            vehicleRepository.updateVehicle(existingVehicle);

            return ResponseEntity.ok("Cập nhật xe thành công!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server (PUT): " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{vin}")
    public ResponseEntity<String> deleteVehicle(@PathVariable String vin) {
        try {
            Vehicle existingVehicle = vehicleRepository.getVehicleByVin(vin);
            if (existingVehicle == null) {
                return ResponseEntity.status(404).body("Không tìm thấy xe để xóa.");
            }
            vehicleRepository.deleteVehicle(existingVehicle);
            return ResponseEntity.ok("Xóa xe thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server (DELETE): Không thể xóa (dính khóa ngoại?).");
        }
    }
}