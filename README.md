# OEM EV Warranty Management System  
---
## **Actors**
- **SC Staff**  
- **SC Technician**  
- **EVM Staff**  
- **Admin**
- 
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
---

📄 [Google Sheets - Phân công nhiệm vụ](https://docs.google.com/spreadsheets/d/1ALFW6oM45nOZvwYalNRPIAulkr0tZwtctJMqONaN7kI/edit?gid=0#gid=0)
---
## **4. Cấu trúc thư mục dự án**

```plaintext
EVM/
├── frontend/                        
│   ├── assets/                        
│   │   ├── css/                     
│   │   ├── js/                              
│   │   └── pic/                           
│   ├── components/            
│   └── pages/                                 
│
├── src/             
│   └── main/
│       ├── java/                
│       │   └── uth/
│       │       └── edu/
│       │           ├── dao/                
│       │           ├── pojo/                 
│       │           ├── repositories/       
│       │           ├── services/               
│       │           └── Main.java               
│       │
│       └── resources/                        
│  
│
├── test/                                
│   └── (java/, resources/)
│
├── target/                                  
└── pom.xml

---

## 🧾 Quy ước đặt tên Commit (Commit Convention)

Để đảm bảo codebase rõ ràng và dễ theo dõi lịch sử thay đổi, nhóm sử dụng **quy ước đặt tên commit theo chuẩn [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)** như sau:

| Prefix | Ý nghĩa | Ví dụ |
|---------|----------|--------|
| **feat:** | Thêm một **tính năng mới** | `feat: thêm module phân công kỹ thuật viên` |
| **fix:** | **Sửa lỗi** trong hệ thống | `fix: sửa lỗi hiển thị tên kỹ thuật viên` |
| **refactor:** | Thay đổi **cấu trúc code** mà không thêm tính năng hoặc sửa lỗi | `refactor: tách component bảng danh sách yêu cầu` |
| **docs:** | Cập nhật hoặc thay đổi **tài liệu** | `docs: thêm hướng dẫn chạy dự án vào README` |
| **chore:** | Thay đổi nhỏ, **không ảnh hưởng logic** code (build, config...) | `chore: cập nhật gitignore và cấu trúc thư mục` |
| **style:** | Thay đổi về **giao diện / CSS / UI**, không ảnh hưởng logic | `style: cải thiện màu sidebar và hiệu ứng hover` |
| **perf:** | Cải thiện **hiệu năng xử lý / tốc độ tải** | `perf: tối ưu vòng lặp load danh sách yêu cầu` |
| **vendor:** | Cập nhật **dependencies / packages / thư viện** | `vendor: nâng cấp Font Awesome lên v6.5.0` |

---


