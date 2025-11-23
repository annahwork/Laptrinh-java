(function () {
    'use strict';
    console.log('manage_ev_parts.js loaded');

    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/manage_ev_parts';
    const API_LIST = `${API_BASE}/list`;
    const API_ADD_PART = `${API_BASE}/add-part`;

    // 💡 Hàm tra cứu dịch thuật
    const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;


    const tableBody = document.getElementById('partsTableBody');
    const searchInput = document.getElementById('searchInput');
    const btnMo = document.getElementById('btnMoFormAttachSerial');

    const btnPrev = document.getElementById('prevPage');
    const btnNext = document.getElementById('nextPage');
    const btnCurrent = document.getElementById('currentPage');
    const pageInfo = document.getElementById('pageInfo');
    const totalItemsEl = document.getElementById('totalItems');

    const modal = document.getElementById('modalCreate');
    const form = document.getElementById('modalForm');
    const btnClose = modal.querySelector('.modal-panel__close');
    const btnCancel = modal.querySelector('.btn-cancel'); // Sử dụng class .btn-cancel

    let currentPage = 1;
    let currentQuery = '';
    let totalPages = 1;

    // (Giữ nguyên openModal, closeModal, modal event listeners)
    function openModal() {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        form.reset();
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        form.reset();
    }


    async function fetchData(page = 1, query = '') {
        currentPage = page;
        currentQuery = query;
        if (!tableBody) return;

        // 💡 Dịch: Đang tải dữ liệu...
        tableBody.innerHTML = `<tr><td colspan="6" class="no-data">${T('message.loading_data', 'Đang tải dữ liệu...')}</td></tr>`;

        try {
            const url = `${API_LIST}?page=${page}&pageSize=10&search=${encodeURIComponent(query)}`;
            const response = await fetch(url);

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || T('error.load_list', `Lỗi HTTP ${response.status}`));
            }

            const result = await response.json();

            renderTable(result.data);

            const totalItems = result.totalItems || 0;
            totalPages = result.totalPages || 1;

            if (totalItems === 0 && (!result.data || result.data.length === 0)) {
                updatePagination(0, 0);
            } else {
                updatePagination(totalItems, result.data.length);
            }

        } catch (error) {
            // 💡 Dịch: Lỗi tải danh sách:
            console.error(T('error.load_list', "Lỗi tải danh sách:"), error);
            const errorText = T('error.load_list', "Lỗi tải dữ liệu");
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="color: var(--danger);">${errorText}: ${error.message}</td></tr>`;
        }
    }

    function renderTable(parts) {
        if (!parts || parts.length === 0) {
            // 💡 Dịch: Không tìm thấy phụ tùng (kèm từ khóa tìm kiếm)
            let noDataText;
            if (currentQuery) {
                 noDataText = T('manage.parts.no_data_search', `Không tìm thấy phụ tùng cho "${currentQuery}".`);
                 noDataText = noDataText.replace('"%s"', `"${currentQuery}"`); // Nếu dùng format %s
            } else {
                 noDataText = T('manage.parts.no_data', 'Chưa có dữ liệu');
            }
            tableBody.innerHTML = `<tr><td colspan="5" class="no-data">${noDataText}</td></tr>`;
            return;
        }

        tableBody.innerHTML = parts.map(p => `
            <tr>
                <td style="text-align: center;">${p.partCode || 'N/A'}</td>
                <td style="text-align: center;">${p.partName || 'N/A'}</td>
                <td style="text-align: center;">${p.partType || 'N/A'}</td>
                <td style="text-align: center;">${p.quantity}</td>
                <td style="text-align: center;">${p.location || 'N/A'}</td>
            </tr>
        `).join('');
    }

    function updatePagination(total, currentCount) {
        btnPrev.disabled = currentPage <= 1;
        btnNext.disabled = currentPage >= totalPages;
        btnCurrent.textContent = currentPage;

        const start = (currentPage - 1) * 10 + 1;
        const end = start + currentCount - 1;

        if (total === 0) {
             pageInfo.textContent = `0`;
             totalItemsEl.textContent = '0';
        } else {
             pageInfo.textContent = `${start} - ${end}`;
             totalItemsEl.textContent = total;
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('.btn-save'); // Sử dụng class .btn-save
        const originalText = submitBtn.textContent;

        const payload = {
            code: document.getElementById('code').value,
            name: document.getElementById('name').value,
            partType: document.getElementById('partType').value,
            quantity: document.getElementById('quantity').value || '0',
            location: document.getElementById('location').value
        };

        // 💡 Dịch: Vui lòng điền Mã, Tên và Loại phụ tùng.
        if (!payload.code || !payload.name || !payload.partType) {
            alert(T('manage.parts.form.validate', "Vui lòng điền Mã, Tên và Loại phụ tùng."));
            return;
        }

        submitBtn.disabled = true;
        // 💡 Dịch: Đang lưu...
        submitBtn.textContent = T('manage.parts.form.saving', 'Đang lưu...');

        try {
            const response = await fetch(API_ADD_PART, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || T('manage.parts.form.error', 'Lỗi không xác định'));
            }

            // 💡 Dịch: Thêm thành công!
            alert(result.message || T('manage.parts.form.added', 'Thêm thành công!'));
            closeModal();
            fetchData(1, '');
        } catch (error) {
            console.error("Lỗi khi thêm phụ tùng:", error);
            // 💡 Dịch: Lỗi:
            alert(`${T('manage.parts.form.error', 'Lỗi')}: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // Gán sự kiện (đã điều chỉnh để khớp với HTML mới)
    if (btnMo) btnMo.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    // Modal Cancel Button sử dụng class .btn-cancel trong HTML mới, cần tìm đúng nút
    modal?.querySelector('.btn-cancel')?.addEventListener('click', closeModal);
    if (form) form.addEventListener('submit', handleFormSubmit);

    // Tìm kiếm (Debounce)
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                fetchData(1, searchInput.value);
            }, 500);
        });
    }

    // Phân trang
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentPage > 1) fetchData(currentPage - 1, currentQuery);
        });
    }
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentPage < totalPages) fetchData(currentPage + 1, currentQuery);
        });
    }

    // Khởi tạo dữ liệu
    fetchData(1, '');

})();