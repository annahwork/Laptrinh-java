(function () {
    'use strict';
    console.log('manage_ev_parts.js loaded');

    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/manage_ev_parts';
    const API_LIST = `${API_BASE}/list`;
    const API_ADD_PART = `${API_BASE}/add-part`;

    const tableBody = document.getElementById('partsTableBody');
    const searchInput = document.getElementById('searchInput');
    const btnMo = document.getElementById('btnMoFormManageEvParts'); 

    const btnPrev = document.getElementById('prevPage');
    const btnNext = document.getElementById('nextPage');
    const btnCurrent = document.getElementById('currentPage');
    const pageInfo = document.getElementById('pageInfo');
    const totalItemsEl = document.getElementById('totalItems'); 

    const modal = document.getElementById('modalCreate');
    const form = document.getElementById('modalForm');
    const btnClose = modal.querySelector('.modal-panel__close');
    const btnCancel = modal.querySelector('.modalCancel');

    let currentPage = 1;
    let currentQuery = '';
    let totalPages = 1;


    async function fetchData(page = 1, query = '') {
        currentPage = page;
        currentQuery = query; 
        if (!tableBody) return;

        tableBody.innerHTML = `<tr><td colspan="5" class="no-data">Đang tải dữ liệu...</td></tr>`;
        
        try {
            const url = `${API_LIST}?page=${page}&pageSize=10&search=${encodeURIComponent(query)}`;
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
            tableBody.innerHTML = `<tr><td colspan="5" class="no-data" style="color: red;">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
        }
    }

    function renderTable(parts) {
        if (!parts || parts.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="no-data">Không tìm thấy phụ tùng${currentQuery ? ' cho "' + currentQuery + '"' : ''}.</td></tr>`;
            return;
        }
        
        tableBody.innerHTML = parts.map(p => `
            <tr>
                <td class="text-center">${p.partCode || 'N/A'}</td>
                <td class="text-center">${p.partName || 'N/A'}</td>
                <td class="text-center">${p.partType || 'N/A'}</td>
                <td class="text-center">${p.quantity}</td>
                <td class="text-center">${p.location || 'N/A'}</td>
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

    function openModal() {
        modal.setAttribute('aria-hidden', 'false');
        form.reset();

    }

    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        form.reset();
    }

 
    async function handleFormSubmit(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('.modalSubmit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang lưu...';

        try {
            const payload = {
                name: document.getElementById('name').value,
                partType: document.getElementById('partType').value,
                quantity: document.getElementById('quantity').value || '0'
            };
            
            if (!payload.name || !payload.partType) {
                throw new Error("Vui lòng điền Tên và Loại phụ tùng.");
            }
            
            const response = await fetch(API_ADD_PART, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Lỗi không xác định');
            }
            
            alert(result.message || 'Thêm thành công!');
            closeModal();
            fetchData(1, ''); 
        } catch (error) {
            console.error("Lỗi khi thêm phụ tùng:", error);
            alert(`Lỗi: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Lưu';
        }
    }

    btnMo?.addEventListener('click', openModal);
    btnClose?.addEventListener('click', closeModal);
    btnCancel?.addEventListener('click', closeModal);
    form?.addEventListener('submit', handleFormSubmit);

    let searchTimeout;
    searchInput?.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchData(1, searchInput.value); 
        }, 500);
    });

    btnPrev?.addEventListener('click', () => {
        if (currentPage > 1) fetchData(currentPage - 1, currentQuery);
    });
    btnNext?.addEventListener('click', () => {
        if (currentPage < totalPages) fetchData(currentPage + 1, currentQuery);
    });

    fetchData(1, '');

})();