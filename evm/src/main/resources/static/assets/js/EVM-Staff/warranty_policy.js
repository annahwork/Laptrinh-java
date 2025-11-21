(function() {
    console.log("✅ JS Warranty Policy đã tải thành công!");

    // --- 1. DỮ LIỆU CHI TIẾT CHÍNH SÁCH DƯỚI DẠNG HTML ---
    
    // Dữ liệu HTML cho Bảo hành Chuẩn (WP001)
    const standardDetailsHTML = `
        <h4>1. Phạm Vi Bảo Hành</h4>
        <p>Bảo hành này bao gồm việc sửa chữa hoặc thay thế miễn phí các bộ phận/linh kiện bị hư hỏng do lỗi vật liệu hoặc lỗi sản xuất trong điều kiện hoạt động và sử dụng bình thường theo hướng dẫn của nhà sản xuất.</p>
        <h5>Các Linh Kiện Cơ Bản Được Bảo Hành:</h5>
        <ul>
            <li>Hệ thống Động cơ (Engine System)</li>
            <li>Hệ thống Hộp số (Transmission System)</li>
            <li>Hệ thống Treo (Suspension System)</li>
            <li>Hệ thống Phanh (Brake System)</li>
            <li>Các bộ phận thuộc hệ thống Điện cơ bản (Basic Electrical Components)</li>
        </ul>
        
        <h4>2. Điều Kiện Áp Dụng Bảo Hành</h4>
        <ul>
            <li>Sản phẩm/phương tiện phải được bảo dưỡng định kỳ đúng hạn và đúng quy trình tại các cơ sở được ủy quyền của nhà sản xuất/cung cấp dịch vụ.</li>
            <li>Khách hàng phải xuất trình đầy đủ các giấy tờ chứng minh bảo hành (Phiếu bảo hành, Sổ bảo dưỡng, hóa đơn mua hàng...).</li>
            <li>Việc sửa chữa và thay thế phải được thực hiện bởi Kỹ thuật viên được đào tạo và sử dụng Phụ tùng chính hãng.</li>
        </ul>

        <h4>3. Điều Kiện Từ Chối Bảo Hành (Các Trường Hợp Không Được Bảo Hành)</h4>
        <ul>
            <li>Hư hỏng do hao mòn tự nhiên hoặc tiêu hao (ví dụ: lốp xe, má phanh, bố ly hợp, bóng đèn, cầu chì, dầu nhớt, các loại dung dịch...).</li>
            <li>Hư hỏng do sử dụng sai mục đích, quá tải, hoặc do tai nạn, va chạm, hỏa hoạn, thiên tai, hành vi phá hoại.</li>
            <li>Hư hỏng do việc tự ý sửa đổi, lắp đặt thêm phụ kiện không chính hãng hoặc sửa chữa tại các cơ sở không được ủy quyền.</li>
            <li>Hư hỏng do việc không tuân thủ lịch bảo dưỡng định kỳ hoặc sử dụng các loại nhiên liệu/dầu nhớt không đúng tiêu chuẩn.</li>
            <li>Các chi phí phát sinh khác như chi phí kéo xe, thuê xe, ăn ở, thiệt hại về thời gian, hoặc thiệt hại gián tiếp khác.</li>
        </ul>
        
        <h4>4. Quy Trình Thực Hiện Bảo Hành</h4>
        <ul>
            <li>Ngừng sử dụng sản phẩm/phương tiện ngay lập tức.</li>
            <li>Liên hệ với trung tâm dịch vụ khách hàng hoặc đại lý ủy quyền gần nhất.</li>
            <li>Cung cấp thông tin chi tiết về lỗi và lịch sử bảo dưỡng.</li>
            <li>Đưa sản phẩm/phương tiện đến cơ sở dịch vụ để được kiểm tra và xác nhận bảo hành theo quy định.</li>
        </ul>
    `;

    // Dữ liệu HTML cho Bảo hành Mở rộng (WP002) - Bổ sung các phần mở rộng
    const extendedDetailsHTML = `
        <h4>Mô Tả Chi Tiết</h4>
        <p>Bảo hành này bao gồm toàn bộ các điều khoản, linh kiện và chính sách sửa chữa miễn phí của Bảo hành chuẩn 12 tháng, đồng thời mở rộng thêm phạm vi bảo hành cho các linh kiện phức tạp và đắt tiền hơn.</p>

        <h4>1. Phạm Vi Bảo Hành Mở Rộng</h4>
        <p>Bao gồm tất cả các linh kiện thuộc Bảo hành chuẩn (Hệ thống Động cơ, Hộp số, Treo, Phanh, Điện cơ bản).</p>
        <h5>Các Linh Kiện Mở Rộng Được Bảo Hành Thêm:</h5>
        <ul>
            <li>Hệ thống Điện tử và Điều khiển (ECUs & Control Units): Bộ điều khiển động cơ (ECU), Bộ điều khiển hộp số (TCU), các mô-đun điều khiển chính khác.</li>
            <li>Hệ thống An toàn (Safety Systems): Các bộ phận của túi khí (Airbag Modules), bộ căng đai khẩn cấp, cảm biến va chạm.</li>
            <li>Các Cảm biến (Sensors): Cảm biến oxy, cảm biến lưu lượng khí nạp (MAF), cảm biến ABS/ESP, cảm biến áp suất lốp (TPMS).</li>
            <li>Hệ thống Điều hòa không khí (A/C System): Máy nén (Compressor), Dàn lạnh (Evaporator), Dàn nóng (Condenser).</li>
            <li>Hệ thống Truyền động Điện (nếu có): Máy phát điện, motor khởi động.</li>
        </ul>
        
        <h4>2. Điều Kiện Áp Dụng Bảo Hành</h4>
        <ul>
            <li>Sản phẩm/phương tiện phải được bảo dưỡng định kỳ đúng hạn và đúng quy trình tại các cơ sở được ủy quyền của nhà sản xuất/cung cấp dịch vụ.</li>
            <li>Khách hàng phải xuất trình đầy đủ các giấy tờ chứng minh bảo hành (Phiếu bảo hành, Sổ bảo dưỡng, hóa đơn mua hàng...).</li>
            <li>Việc sửa chữa và thay thế phải được thực hiện bởi Kỹ thuật viên được đào tạo và sử dụng Phụ tùng chính hãng.</li>
        </ul>

        <h4>3. Điều Kiện Từ Chối Bảo Hành (Các Trường Hợp Không Được Bảo Hành)</h4>
        <ul>
            <li>Hư hỏng do hao mòn tự nhiên hoặc tiêu hao (ví dụ: lốp xe, má phanh, bố ly hợp, bóng đèn, cầu chì, dầu nhớt, các loại dung dịch...).</li>
            <li>Hư hỏng do sử dụng sai mục đích, quá tải, hoặc do tai nạn, va chạm, hỏa hoạn, thiên tai, hành vi phá hoại.</li>
            <li>Hư hỏng do việc tự ý sửa đổi, lắp đặt thêm phụ kiện không chính hãng hoặc sửa chữa tại các cơ sở không được ủy quyền.</li>
            <li>Hư hỏng do việc không tuân thủ lịch bảo dưỡng định kỳ hoặc sử dụng các loại nhiên liệu/dầu nhớt không đúng tiêu chuẩn.</li>
            <li>Các chi phí phát sinh khác như chi phí kéo xe, thuê xe, ăn ở, thiệt hại về thời gian, hoặc thiệt hại gián tiếp khác.</li>
        </ul>
        
        <h4>4. Quy Trình Thực Hiện Bảo Hành</h4>
        <ul>
            <li>Ngừng sử dụng sản phẩm/phương tiện ngay lập tức.</li>
            <li>Liên hệ với trung tâm dịch vụ khách hàng hoặc đại lý ủy quyền gần nhất.</li>
            <li>Cung cấp thông tin chi tiết về lỗi và lịch sử bảo dưỡng.</li>
            <li>Đưa sản phẩm/phương tiện đến cơ sở dịch vụ để được kiểm tra và xác nhận bảo hành theo quy định.</li>
        </ul>
    `;
    
    // --- 2. DỮ LIỆU GIẢ LẬP CHÍNH ---

    const policyData = {
        'WP001': {
            title: 'Bảo hành chuẩn 12 tháng',
            type: 'Bảo hành chuẩn',
            duration: '12 tháng hoặc 20,000 km',
            summary: 'Bao gồm bảo hành các linh kiện cơ bản và sửa chữa miễn phí theo chính sách.',
            detailsHTML: standardDetailsHTML
        },
        'WP002': {
            title: 'Bảo hành mở rộng 24 tháng',
            type: 'Bảo hành mở rộng',
            duration: '24 tháng hoặc 50,000 km',
            summary: 'Bao gồm bảo hành chuẩn và thêm các linh kiện điện tử, cảm biến, hệ thống an toàn.',
            detailsHTML: extendedDetailsHTML
        }
    };

    const modal = document.getElementById('modalPolicy');
    if (!modal) return console.error("Modal #modalPolicy không tìm thấy!");
    
    // 2. DI CHUYỂN MODAL RA BODY (Giữ nguyên)
    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }
    
    // --- KHAI BÁO HÀM MODAL ---

    function openModal(id) {
        const data = policyData[id];
        if (data) {
            // Điền dữ liệu chung
            document.getElementById('modalPolicyTitle').textContent = data.title;
            document.getElementById('modalPolicyType').textContent = data.type;
            document.getElementById('modalPolicyDuration').textContent = data.duration;
            
            // ĐIỀN NỘI DUNG TÓM TẮT
            document.getElementById('modalPolicySummary').textContent = data.summary;

            // ĐIỀN NỘI DUNG CHI TIẾT (Sử dụng innerHTML để hiển thị HTML đã định dạng)
            const detailsContainer = document.getElementById('modalPolicyDetails');
            detailsContainer.innerHTML = data.detailsHTML;

            // Hiển thị modal bằng cách thêm class 'show'
            modal.classList.add('show');
            // Ngăn cuộn trang nền
            document.body.style.overflow = 'hidden'; 
        } else {
             console.warn("Không tìm thấy dữ liệu cho ID:", id);
        }
    }

    function closeModal() {
        // Ẩn modal bằng cách loại bỏ class 'show'
        modal.classList.remove('show');
        // Cho phép cuộn trang nền trở lại
        document.body.style.overflow = '';
    }

    // --- LOGIC FILTER ---

    function handleFilter() {
        const searchInput = document.querySelector('.warranty-policy__search');
        const typeSelect = document.querySelector('.warranty-policy__select');
        
        if (!searchInput || !typeSelect) return;

        const keyword = searchInput.value.toLowerCase().trim();
        const selectedType = typeSelect.value;
        const policyCards = document.querySelectorAll('.policy-card');

        policyCards.forEach(card => {
            const titleText = card.querySelector('.policy-title')?.textContent.toLowerCase() || '';
            let cardType = '';
            if (card.querySelector('.badge-standard')) cardType = 'standard';
            else if (card.querySelector('.badge-extended')) cardType = 'extended';

            const matchesKeyword = titleText.includes(keyword);
            const matchesType = selectedType === '' || cardType === selectedType;
            card.style.display = (matchesKeyword && matchesType) ? '' : 'none';
        });
        
    }

    // Gắn sự kiện filter 
    document.body.addEventListener('input', (e) => {
        if (e.target.matches('.warranty-policy__search')) handleFilter();
    });
    document.body.addEventListener('change', (e) => {
        if (e.target.matches('.warranty-policy__select')) handleFilter();
    });

    // --- XỬ LÝ SỰ KIỆN CLICK (Event Delegation) ---

    document.body.addEventListener('click', function(e) {
        // Click nút View
        const viewBtn = e.target.closest('.warranty-policy__btn--view');
        if (viewBtn) {
            const id = viewBtn.getAttribute('data-id');
            openModal(id);
            return;
        }

        // Click nút Đóng (trong modal footer hoặc nút '×')
        if (e.target.closest('.warranty-policy__close-button') ||
            e.target.closest('.warranty-policy__button--close')) {
            closeModal();
            return;
        }

        // Click ra ngoài modal 
        if (e.target === modal && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // 6. Đóng modal khi nhấn phím ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

})();