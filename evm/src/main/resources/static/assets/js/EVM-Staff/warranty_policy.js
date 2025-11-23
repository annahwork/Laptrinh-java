(function() {
    console.log("✅ JS Warranty Policy đã tải thành công!");

    // 💡 Lấy dữ liệu đã được Thymeleaf xử lý và dịch
    const policyData = window.policyDataGlobal || {};

    // Nếu có lỗi, dùng hàm T() cơ bản
    const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

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

            // ĐIỀN NỘI DUNG CHI TIẾT
            const detailsContainer = document.getElementById('modalPolicyDetails');
            // Sử dụng dữ liệu HTML đã dịch từ properties
            detailsContainer.innerHTML = data.detailsHTML;

            // Hiển thị modal
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
             console.warn(T('policy.alert.no_data', "Không tìm thấy dữ liệu cho ID:"), id);
        }
    }

    function closeModal() {
        modal.classList.remove('show');
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