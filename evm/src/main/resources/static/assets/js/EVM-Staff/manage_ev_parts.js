(function () {
    'use strict';
    console.log('manage_ev_parts.js loaded');

    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/manage_ev_parts';
    const API_LIST = `${API_BASE}/list`;
    const API_ADD_PART = `${API_BASE}/add-part`;

    const tableBody = document.getElementById('partsTableBody');
    const searchInput = document.getElementById('searchInput');
    // CẬP NHẬT 1: Sửa ID nút mở form cho khớp HTML
    const btnMo = document.getElementById('btnMoFormAttachSerial');

    const btnPrev = document.getElementById('prevPage');
    const btnNext = document.getElementById('nextPage');
    const btnCurrent = document.getElementById('currentPage');
    const pageInfo = document.getElementById('pageInfo');
    const totalItemsEl = document.getElementById('totalItems');

    const modal = document.getElementById('modalCreate');
    const form = document.getElementById('modalForm');

    const btnClose = modal ? modal.querySelector('.modal-panel__close') : null;
    const btnCancel = modal ? modal.querySelector('.btn-cancel') : null;

    let currentPage = 1;
    let currentQuery = '';
    let totalPages = 1;

    function openModal() {
        if (!modal) return;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        if (form) form.reset();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        if (form) form.reset();
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal || e.target.classList.contains('modal-panel__backdrop')) {
                closeModal();
            }
        });
    }


    async function fetchData(page = 1, query = '') {
        currentPage = page;
        currentQuery = query;
        if (!tableBody) return;

        tableBody.innerHTML = `<tr><td colspan="6" class="no-data">Đang tải dữ liệu...</td></tr>`;

        try {
            const url = `${API_LIST}?page=${page}&pageSize=5&search=${encodeURIComponent(query)}`;
            const response = await fetch(url);

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || `HTTP ${response.status}`);
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
            console.error("Lỗi tải danh sách:", error);
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="color: var(--danger);">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
        }
    }

    function renderTable(parts) {
        if (!parts || parts.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data">Không tìm thấy phụ tùng${currentQuery ? ' cho "' + currentQuery + '"' : ''}.</td></tr>`;
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

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Lưu';
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
        }

        try {
            const codeInput = document.getElementById('code'); 
            const nameInput = document.getElementById('name');
            const typeInput = document.getElementById('partType');
            const qtyInput = document.getElementById('quantity');
            const locInput = document.getElementById('location');

            const payload = {
                code: codeInput ? codeInput.value.trim() : '', 
                name: nameInput ? nameInput.value.trim() : '',
                partType: typeInput ? typeInput.value : '',
                quantity: qtyInput ? String(qtyInput.value) : "0", 
                location: locInput ? locInput.value.trim() : ''
            };
            
            if (!payload.code || !payload.name || !payload.partType) {
                throw new Error("Vui lòng điền Mã, Tên và Loại phụ tùng.");
            }
            
            const response = await fetch(API_ADD_PART, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json().catch(() => ({ message: 'Thao tác thành công' }));
            
            if (!response.ok) {
                throw new Error(result.message || 'Lỗi server khi thêm phụ tùng');
            }
            
            alert(result.message || 'Thêm phụ tùng thành công!');
            closeModal();
            fetchData(1, '');
            
        } catch (error) {
            console.error("Lỗi submit:", error);
            alert(`Thất bại: ${error.message}`);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    }

    // Gán sự kiện
    if (btnMo) btnMo.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
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