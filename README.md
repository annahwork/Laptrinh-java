# OEM EV Warranty Management System  
---
## **Actors**
- **SC Staff**  
- **SC Technician**  
- **EVM Staff**  
- **Admin**

---
## **1. Chức năng cho Trung tâm dịch vụ (SC Staff, SC Technician)**

### a. Quản lý hồ sơ xe & khách hàng  
- Đăng ký xe theo **VIN**  
- Gắn số seri phụ tùng lắp trên xe  
- Lưu lịch sử dịch vụ & bảo hành  

### b. Xử lý yêu cầu bảo hành  
- Tạo **yêu cầu bảo hành (Warranty Claim)** gửi lên hãng  
- Đính kèm báo cáo kiểm tra, hình ảnh, thông tin chẩn đoán  
- Theo dõi trạng thái yêu cầu:  
  `Đã gửi → Chờ duyệt → Được chấp nhận → Đã xử lý`  

### c. Thực hiện bảo hành  
- Nhận phụ tùng từ hãng  
- Quản lý tiến độ sửa chữa / thay thế phụ tùng  
- Cập nhật kết quả bảo hành và bàn giao xe  

### d. Thực hiện chiến dịch từ hãng (Recall / Service Campaigns)  
- Nhận danh sách xe thuộc diện **Recall / Service Campaigns**  
- Gửi thông báo cho khách hàng khi xe thuộc diện chiến dịch  
- Quản lý lịch hẹn → Thực hiện xử lý → Báo cáo kết quả về hãng  

### e. Quản lý nội bộ  
- Phân công kỹ thuật viên xử lý từng **case bảo hành**  
- Theo dõi thời gian & hiệu suất xử lý  
- Lưu trữ hồ sơ bảo hành phục vụ kiểm tra và báo cáo  

---

##  **2. Chức năng cho Hãng sản xuất xe (EVM Staff, Admin)**

### a. Quản lý sản phẩm & phụ tùng  
- Cơ sở dữ liệu bộ phận EV *(pin, mô-tơ, BMS, inverter, bộ sạc, phụ tùng...)*  
- Gắn số seri phụ tùng với xe (**VIN**)  
- Quản lý chính sách bảo hành *(thời hạn, phạm vi, điều kiện)*  

### b. Quản lý yêu cầu bảo hành  
- Tiếp nhận & phê duyệt yêu cầu từ trung tâm dịch vụ  
- Theo dõi trạng thái claim:  
  `Tiếp nhận → Xác thực → Xử lý → Hoàn tất`  
- Quản lý **chi phí bảo hành (hãng chi trả)**  
- Tạo & quản lý **chiến dịch Recall / Service Campaigns**  

### c. Chuỗi cung ứng phụ tùng bảo hành  
- Quản lý tồn kho phụ tùng cho bảo hành  
- Phân bổ phụ tùng thay thế cho trung tâm dịch vụ  
- Cảnh báo thiếu hụt phụ tùng  

### d. Báo cáo & phân tích  
- Thống kê số lượng và tỷ lệ hỏng hóc theo **model / phụ tùng / khu vực**  
- **AI phân tích** nguyên nhân lỗi phổ biến  
- Dự báo **chi phí bảo hành trong tương lai**  

