package uth.edu.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import uth.edu.pojo.ClaimService;
import uth.edu.pojo.EVMStaff;
import uth.edu.pojo.SCStaff;
import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.WarrantyClaim;
import uth.edu.repositories.ClaimServiceRepository;
import uth.edu.repositories.EVMStaffRepository;
import uth.edu.repositories.SCStaffRepository;
import uth.edu.repositories.SCTechnicianRepository;
import uth.edu.repositories.WarrantyClaimRepository;

@Service
public class ReportService {

	private EVMStaffRepository evmStaffRepository;
	private SCStaffRepository scStaffRepository;
	private SCTechnicianRepository technicianRepository;
	private ClaimServiceRepository claimServiceRepository;
	private WarrantyClaimRepository warrantyClaimRepository;

	public ReportService() {
		evmStaffRepository = new EVMStaffRepository();
		scStaffRepository = new SCStaffRepository();
		technicianRepository = new SCTechnicianRepository();
		claimServiceRepository = new ClaimServiceRepository();
		warrantyClaimRepository = new WarrantyClaimRepository();
	}

	public String GenerateTechnicianPerformanceReport(Integer scStaffID, Integer scTechnicianID, Date startDate, Date endDate) {
		try {
			SCStaff staff = scStaffRepository.getSCStaffById(scStaffID);
			if (staff == null) {
				return "SCStaff không tồn tại hoặc ID không hợp lệ.";
			}

			SCTechnician technician = technicianRepository.getSCTechnicianById(scTechnicianID);
			if (technician == null) {
				return "SCTechnician không tồn tại hoặc ID không hợp lệ.";
			}

			List<ClaimService> allClaimServices = claimServiceRepository.getAllClaimServices(1, 20);
			if (allClaimServices == null) 
				allClaimServices = new ArrayList<>();

			Date start = startDate;
			Date end = endDate;

			List<ClaimService> technicianServices = allClaimServices.stream()
					.filter(claimService -> claimService.getTechnician() != null &&
							claimService.getTechnician().getUserID() == scTechnicianID)
					.filter(claimService -> {
						WarrantyClaim claim = claimService.getWarrantyClaim();
						Date d = claim != null ? claim.getDate() : null;
						if (start != null && (d == null || d.before(start))) 
								return false;
						if (end != null && (d == null || d.after(end))) 
								return false;
						return true;
					})
					.collect(Collectors.toList());

			int totalJobs = technicianServices.size();
			int successJobs = 0;
			int failedJobs = 0;

			for (ClaimService claimservice : technicianServices) {
				String result = claimservice.getResult();
				String status = claimservice.getWarrantyClaim() != null ? claimservice.getWarrantyClaim().getStatus() : null;
				boolean isSuccess = (result != null && result.toUpperCase(Locale.ROOT).contains("SUCCESS")) ||
						(status != null && status.equalsIgnoreCase("APPROVED"));
				boolean isFail = (result != null && result.toUpperCase(Locale.ROOT).contains("FAIL")) ||
						(status != null && status.equalsIgnoreCase("REJECTED"));
				if (isSuccess) 
					successJobs++;
				else if (isFail) 
					failedJobs++;
			}

			double successRate = totalJobs == 0 ? 0 : (successJobs * 100.0) / totalJobs;
			double failureRate = totalJobs == 0 ? 0 : (failedJobs * 100.0) / totalJobs;

			StringBuilder sb = new StringBuilder();
			sb.append("BÁO CÁO HIỆU SUẤT KỸ THUẬT VIÊN\n");
			sb.append("SCStaffID: ").append(scStaffID).append("\n");
			sb.append("TechnicianID: ").append(scTechnicianID).append("\n");
			if (start != null || end != null) {
				sb.append("Khoảng thời gian: ")
						.append(start != null ? start : "-")
						.append(" -> ")
						.append(end != null ? end : "-")
						.append("\n");
			}
			sb.append("Tổng số tác vụ: ").append(totalJobs).append("\n");
			sb.append("Thành công: ").append(successJobs).append(String.format(" (%.2f%%)", successRate)).append("\n");
			sb.append("Thất bại: ").append(failedJobs).append(String.format(" (%.2f%%)", failureRate)).append("\n");
			return sb.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return "Không thể tạo báo cáo hiệu suất kỹ thuật viên.";
		}
	}

	public String GenerateFailureRateReport(Integer evmStaffID) {
		try {
			EVMStaff staff = evmStaffRepository.getEVMStaffById(evmStaffID);
			if (staff == null) {
				return "EVMStaff không tồn tại hoặc ID không hợp lệ.";
			}

			List<WarrantyClaim> claims = warrantyClaimRepository.getAllWarrantyClaims(1, 100);
			if (claims == null) 
				claims = new ArrayList<>();

			int total = claims.size();
			int approved = 0;
			int rejected = 0;
			for (WarrantyClaim warrantyclaim : claims) {
				String st = warrantyclaim.getStatus();
				if (st == null) 
					continue;
				if (st.equalsIgnoreCase("APPROVED")) 
					approved++;
				else if (st.equalsIgnoreCase("REJECTED")) 
					rejected++;
			}

			double failureRate = total == 0 ? 0 : (rejected * 100.0) / total;
			double successRate = total == 0 ? 0 : (approved * 100.0) / total;

			StringBuilder sb = new StringBuilder();
			sb.append("BÁO CÁO TỶ LỆ LỖI (CLAIM)\n");
			sb.append("EVMStaffID: ").append(evmStaffID).append("\n");
			sb.append("Tổng số claim: ").append(total).append("\n");
			sb.append("Approved: ").append(approved).append(String.format(" (%.2f%%)", successRate)).append("\n");
			sb.append("Rejected: ").append(rejected).append(String.format(" (%.2f%%)", failureRate)).append("\n");
			return sb.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return "Không thể tạo báo cáo tỷ lệ lỗi.";
		}
	}

	public String AnalyzeCommonFailures(Integer evmStaffID) {
		try {
			EVMStaff staff = evmStaffRepository.getEVMStaffById(evmStaffID);
			if (staff == null)
				return "EVMStaff không tồn tại hoặc ID không hợp lệ.";

			List<WarrantyClaim> claims = warrantyClaimRepository.getAllWarrantyClaims(1, 20);
			if (claims == null) 
				claims = new ArrayList<>();

			Map<String, Integer> partToCount = new HashMap<>();
			for (WarrantyClaim warrantyclaim : claims) {
				String partName = null;
				try {
					partName = warrantyclaim.getVehiclePart() != null && warrantyclaim.getVehiclePart().getPart() != null
							? warrantyclaim.getVehiclePart().getPart().getName()
							: null;
				} catch (Exception ignore) {}
				if (partName == null) 
					partName = "UNKNOWN_PART";
				partToCount.put(partName, partToCount.getOrDefault(partName, 0) + 1);
			}

			List<Map.Entry<String, Integer>> sorted = new ArrayList<>(partToCount.entrySet());
			sorted.sort(Comparator.comparingInt(Map.Entry<String, Integer>::getValue).reversed());

			StringBuilder sb = new StringBuilder();
			sb.append("PHÂN TÍCH LỖI THƯỜNG GẶP THEO PHỤ TÙNG\n");
			sb.append("EVMStaffID: ").append(evmStaffID).append("\n");
			int limit = Math.min(5, sorted.size());
			for (int i = 0; i < limit; i++) {
				Map.Entry<String, Integer> e = sorted.get(i);
				sb.append(i + 1).append(". ").append(e.getKey()).append(": ").append(e.getValue()).append(" claim\n");
			}
			if (limit == 0)
				sb.append("Không có dữ liệu claim.");
			return sb.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return "Không thể phân tích lỗi thường gặp.";
		}
	}

}


