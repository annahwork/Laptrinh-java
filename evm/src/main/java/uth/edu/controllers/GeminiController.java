package uth.edu.controllers;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import uth.edu.service.WarrantyClaimService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api/gemini")
public class GeminiController {

    private final String MODEL_NAME = "gemini-2.5-flash";

    @Autowired
    private WarrantyClaimService warrantyClaimService; 

    private Client geminiClient; 

    @PostConstruct
    public void init() {
        try {
            this.geminiClient = new Client(); 
            System.out.println("Gemini Client đã được khởi tạo thành công (sử dụng Biến Môi Trường).");
        } catch (IllegalArgumentException e) {
            System.err.println("LỖI CẤU HÌNH: Gemini Client không thể khởi tạo. Vui lòng set biến môi trường GEMINI_API_KEY hoặc GOOGLE_API_KEY.");
            this.geminiClient = null;
        } catch (Exception e) {
            System.err.println("Lỗi bất ngờ khi khởi tạo Gemini Client: " + e.getMessage());
            this.geminiClient = null;
        }
    }

    @GetMapping("/analyze-claims")
    public String analyzeClaimsData() {
        if (this.geminiClient == null) {
            return "{\"error\": \"Lỗi: Hệ thống chưa được cấu hình API Key cho Gemini (client is null).\"}";
        }

        List<Map<String, Object>> claimsData = warrantyClaimService.getAllClaimDescriptionsForAnalysis(); 

        if (claimsData.isEmpty()) {
            return "{\"error\": \"Không có dữ liệu yêu cầu bảo hành để phân tích.\"}";
        }

        String allDescriptions = claimsData.stream()
            .map(data -> "ClaimID " + data.get("claimID") + ": " + data.get("description"))
            .collect(Collectors.joining("\n"));

        String prompt = "Dưới đây là danh sách các mô tả sự cố từ các yêu cầu bảo hành gần đây:\n" +
            "===\n" +
            allDescriptions +
            "\n===\n" +
            "Hãy tổng hợp và phân tích dữ liệu này. Đưa ra 3-5 điểm phân tích (insight) chính, " +
            "bao gồm: 1. Các lỗi phổ biến nhất. 2. Các cảnh báo rủi ro (nếu có). 3. Đề xuất tối ưu. " +
            "Mỗi điểm phân tích phải có tiêu đề (ví dụ: 'Lỗi phổ biến', 'Cảnh báo rủi ro', 'Đề xuất tối ưu') " +
            "và nội dung chi tiết. Phản hồi **DUY NHẤT** dưới dạng JSON object chứa một key tên 'insights' " +
            "là một mảng các đối tượng JSON, mỗi đối tượng có 2 key là 'title' và 'content'. " +
            "Ví dụ: {\"insights\": [{\"title\": \"Lỗi phổ biến\", \"content\": \"...\"}, {\"title\": \"Cảnh báo rủi ro\", \"content\": \"...\"}]}";
        
        System.out.println("Gửi prompt tới Gemini để phân tích, tổng dung lượng: " + allDescriptions.length() + " ký tự.");

        try {
            GenerateContentResponse response = this.geminiClient.models.generateContent(
                MODEL_NAME, 
                prompt, 
                null
            );
            
            return response.text(); 
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi Gemini API: " + e.getMessage());
            return "{\"error\": \"Lỗi khi thực hiện phân tích AI: " + e.getMessage() + "\"}";
        }
    }
}