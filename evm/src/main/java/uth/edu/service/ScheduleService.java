package uth.edu.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import uth.edu.pojo.Customer;
import uth.edu.pojo.RecallCampaign;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.Schedule;
import uth.edu.repositories.CustomerRepository;
import uth.edu.repositories.RecallCampaignRepository;
import uth.edu.repositories.SCStaffRepository;
import uth.edu.repositories.ScheduleRepository;

@Service
public class ScheduleService {

	private final ScheduleRepository scheduleRepository;
	private final SCStaffRepository scStaffRepository;
	private final CustomerRepository customerRepository;
	private final RecallCampaignRepository recallCampaignRepository;

	public ScheduleService() {
		scheduleRepository = new ScheduleRepository();
		scStaffRepository = new SCStaffRepository();
		customerRepository = new CustomerRepository();
		recallCampaignRepository = new RecallCampaignRepository();
	}

	public boolean CreateAppointment(Integer scStaffID, Integer customerID, Integer campaignID, Date date, String note) {
		try {
			if (scStaffID == null || customerID == null || campaignID == null || date == null) {
				return false;
			}

			SCStaff staff = scStaffRepository.getSCStaffById(scStaffID);
			Customer customer = customerRepository.getCustomerById(customerID);
			RecallCampaign campaign = recallCampaignRepository.getRecallCampaignById(campaignID);

			if (staff == null || customer == null || campaign == null) {
				return false;
			}

			Schedule newschedule = new Schedule();
			newschedule.setCreatedByStaff(staff);
			newschedule.setCustomer(customer);
			newschedule.setRecallCampaign(campaign);
			newschedule.setDate(date);
			newschedule.setNote(note);

			scheduleRepository.addSchedule(newschedule);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public List<Schedule> GetScheduleForSC(Integer scStaffID) {
		try {
			if (scStaffID == null) {
				return new ArrayList<>();
			}

			SCStaff staff = scStaffRepository.getSCStaffById(scStaffID);
			if (staff == null) {
				return new ArrayList<>();
			}

			List<Schedule> all = getAllSchedules();
			List<Schedule> filtered = new ArrayList<>();
			for (Schedule schedule : all) {
				if (schedule.getCreatedByStaff() != null && schedule.getCreatedByStaff().getUserID() == scStaffID) {
					filtered.add(schedule);
				}
			}

			Collections.sort(filtered, (s1, s2) -> {
				Date d1 = s1.getDate();
				Date d2 = s2.getDate();
				if (d1 == null && d2 == null) 
					return 0;
				if (d1 == null) 
					return 1;
				if (d2 == null) 
					return -1;
				return d1.compareTo(d2);
			});

			return filtered;
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<>();
		}
	}

	public boolean UpdateAppointment(Integer scheduleID, Date newDate, String note) {
		try {
			if (scheduleID == null || newDate == null) {
				return false;
			}
			Schedule existing = scheduleRepository.getScheduleById(scheduleID);
			if (existing == null) {
				return false;
			}
			existing.setDate(newDate);
			existing.setNote(note);
			scheduleRepository.updateSchedule(existing);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	private List<Schedule> getAllSchedules() {
		List<Schedule> result = new ArrayList<>();  
		int page = 1;
		int pageSize = 20;
		while (true) {
			List<Schedule> pageItems = scheduleRepository.getAllSchedules(page, pageSize);
			if (pageItems == null || pageItems.isEmpty()) {
				break;
			}
			result.addAll(pageItems);
			if (pageItems.size() < pageSize) {
				break;
			}
			page++;
		}
		return result;
	}
}


