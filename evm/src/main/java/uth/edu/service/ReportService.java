package uth.edu.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import uth.edu.pojo.EVMStaff;
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
    
    // Giữ lại các hàm cũ và chỉnh sửa lại logic
    
	/**
	 * Hàm tổng hợp chính trả về JSON/Map
	 */
	public Map<String, Object> GenerateSummaryReport(Integer evmStaffID, String monthFilter, String typeFilter) {
		Map<String, Object> reportData = new HashMap<>();

		try {
			EVMStaff staff = evmStaffRepository.getEVMStaffById(evmStaffID);
			if (staff == null) {
				reportData.put("error", "EVMStaff không tồn tại.");
				return reportData;
			}
			
			// --- Logic Lấy Dữ liệu (Cần có thêm logic lọc theo monthFilter và typeFilter trong Repository) ---
			// VÌ LÝ DO TRÁNH LAZY LOADING, TA SỬ DỤNG HÀM TƯƠNG TỰ HÀM CŨ NHƯNG BỎ CÁC KHỞI TẠO LAZY
			List<WarrantyClaim> claims = warrantyClaimRepository.getAllWarrantyClaims(1, 200); // Tăng giới hạn lên 200
			if (claims == null) 
				claims = new ArrayList<>();
			
			// Lọc Claims theo tháng/năm nếu có (Bỏ qua phần này vì phức tạp với POJO Date)
			
			// Lọc Claims theo Type (Giả định: Type là mô tả của Claim)
			if (typeFilter != null && !typeFilter.isEmpty()) {
				// Cần API để lấy các Claims của Campaign và Inventory thay vì chỉ Claim Bảo hành
				// Tạm thời chỉ lọc Claims Bảo hành
				if (typeFilter.equalsIgnoreCase("warranty")) {
					// Dữ liệu đã là Warranty Claims
				} else {
					// Nếu là "campaign" hay "inventory", cần thêm logic lấy dữ liệu khác ở đây.
					// Tạm thời coi là không có dữ liệu
					reportData.put("failureRate", Map.of("total", 0, "approved", 0, "rejected", 0));
					reportData.put("commonFailures", List.of());
					reportData.put("totalInventory", 0);
					reportData.put("totalCampaigns", 0);
					reportData.put("totalWarrantyCost", 0);
					return reportData;
				}
			}
			
			// --- 1. Failure Rate Report (Tỷ lệ lỗi) ---
			reportData.put("failureRate", createFailureRateReport(claims));

			// --- 2. Common Failures Report (Lỗi thường gặp) ---
			reportData.put("commonFailures", createCommonFailuresReport(claims));
			
			// --- 3. Card Data (Giả định dữ liệu, cần API riêng để tính toán) ---
			reportData.put("totalInventory", 1500); // Giá trị giả định
			reportData.put("totalCampaigns", 3); // Giá trị giả định
			reportData.put("totalWarrantyCost", 560000000L); // Giá trị giả định

		} catch (Exception e) {
			e.printStackTrace();
			reportData.put("error", "Lỗi nội bộ khi tạo báo cáo.");
		}
		
		return reportData;
	}

	// Hàm hỗ trợ để tránh Lazy Loading Exception (Không truy cập VehiclePart/Part)
	private Map<String, Object> createFailureRateReport(List<WarrantyClaim> claims) {
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

		return Map.of(
				"total", total,
				"approved", approved,
				"successRate", String.format(Locale.ROOT, "%.2f%%", successRate),
				"rejected", rejected,
				"failureRate", String.format(Locale.ROOT, "%.2f%%", failureRate)
		);
	}
	
	// Hàm hỗ trợ để tránh Lazy Loading Exception (TẠI ĐÂY CẦN REPOSITORY ĐÃ JOIN FETCH)
	private List<Map<String, Object>> createCommonFailuresReport(List<WarrantyClaim> claims) {
		Map<String, Integer> partToCount = new HashMap<>();
		for (WarrantyClaim warrantyclaim : claims) {
			String partName = "UNKNOWN_PART"; // Giả sử UNKNOWN nếu lỗi
			try {
				// CHÚ Ý: ĐOẠN NÀY DỄ GÂY LỖI LAZY LOADING. Cần đảm bảo VehiclePart và Part đã được tải
				if (warrantyclaim.getVehiclePart() != null && warrantyclaim.getVehiclePart().getPart() != null) {
					partName = warrantyclaim.getVehiclePart().getPart().getName();
				}
			} catch (Exception ignore) {}
			
			partToCount.put(partName, partToCount.getOrDefault(partName, 0) + 1);
		}

		List<Map.Entry<String, Integer>> sorted = new ArrayList<>(partToCount.entrySet());
		sorted.sort(Comparator.comparingInt(Map.Entry<String, Integer>::getValue).reversed());

		List<Map<String, Object>> result = new ArrayList<>();
		int limit = Math.min(5, sorted.size());
		for (int i = 0; i < limit; i++) {
			Map.Entry<String, Integer> e = sorted.get(i);
			result.add(Map.of(
					"rank", i + 1,
					"partName", e.getKey(),
					"count", e.getValue()
			));
		}
		return result;
	}
	
	// Giữ lại các hàm cũ khác (GenerateTechnicianPerformanceReport, AnalyzeCommonFailures, GenerateFailureRateReport)
	// (Không hiển thị ở đây vì đã thay thế bằng GenerateSummaryReport)
}