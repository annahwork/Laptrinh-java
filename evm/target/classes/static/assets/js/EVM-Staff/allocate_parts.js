(function() {
    'use strict';

    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/allocate_parts';
    const API_PARTS = `${API_BASE}/parts`;
    const API_HISTORY = `${API_BASE}/history`;
    const API_SERVICE_CENTERS = `${API_BASE}/service-centers`;
    const API_CREATE = `${API_BASE}/create`;

    // 💡 Hàm tra cứu dịch thuật
    const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

    const partsTableBody = document.getElementById('partsTableBody');
    const allocationHistoryBody = document.getElementById('allocationHistoryBody');
    const refreshBtn = document.getElementById('refreshPartsList');
    const openModalBtn = document.getElementById('openAllocateModal');
    const allocateModal = document.getElementById('allocateModal');
    const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
    const allocateForm = document.getElementById('allocateForm');
    const partsMoreRow = document.querySelector('.parts-more-row');
    const partsViewMoreBtn = document.getElementById('partsViewMoreBtn');

    const partSelect = document.getElementById('partSelect');
    const scCenterSelect = document.getElementById('scCenterSelect');

    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchPart');
    const filterSelect = document.getElementById('filterCategory');

    function getDataRows() {
        if (!partsTableBody) return [];
        return Array.from(partsTableBody.querySelectorAll('tr')).filter(tr => !tr.classList.contains('parts-more-row'));
    }

    // (Giữ nguyên updatePartsVisibility)

    async function loadParts() {
        if (!partsTableBody) return;

        // 💡 Dịch: Đang tải...
        partsTableBody.innerHTML = `<tr><td colspan="5" class="no-data">${T('message.loading', 'Đang tải...')}</td></tr>`;

        try {
            const searchTerm = searchInput.value;
            const typeFilter = filterSelect.value;

            const url = `${API_PARTS}?page=1&pageSize=20&search=${encodeURIComponent(searchTerm)}&type=${encodeURIComponent(typeFilter)}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const parts = await response.json();

            partsTableBody.innerHTML = "";

            if (parts.length === 0) {
                // 💡 Dịch: Không tìm thấy phụ tùng nào.
                partsTableBody.innerHTML = `<tr><td colspan="5" class="no-data">${T('parts.no_data', 'Không tìm thấy phụ tùng nào.')}</td></tr>`;
            } else {
                parts.forEach(part => {
                    const tr = document.createElement('tr');
                    // ... (phần này giữ nguyên, vì dữ liệu API không được dịch ở đây)
                    tr.innerHTML = `
                        <td class="text-center">${part.partCode}</td>
                        <td class="text-center">${part.partName}</td>
                        <td class="text-center">${part.partType}</td>
                        <td class="text-center">${part.quantity}</td>
                        <td class="text-center">${part.location}</td>
                    `;
                    partsTableBody.appendChild(tr);
                });
            }

            if (partsMoreRow) {
                partsTableBody.appendChild(partsMoreRow);
            }

            // updatePartsVisibility(); // Cập nhật hiển thị (nếu cần)

        } catch (error) {
            // 💡 Dịch: Lỗi tải dữ liệu.
            console.error("Lỗi tải danh sách phụ tùng:", error);
            const errorDataText = T('error.load_data', 'Lỗi tải dữ liệu.');
            partsTableBody.innerHTML = `<tr><td colspan="5" class="no-data" style="color: red;">${errorDataText}</td></tr>`;
        }
    }

    async function loadHistory() {
        if (!allocationHistoryBody) return;
        // 💡 Dịch: Đang tải...
        allocationHistoryBody.innerHTML = `<tr><td colspan="5" class="no-data">${T('message.loading', 'Đang tải...')}</td></tr>`;

        try {
            const response = await fetch(`${API_HISTORY}?page=1&pageSize=5`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const history = await response.json();

            allocationHistoryBody.innerHTML = "";

            if (history.length === 0) {
                // 💡 Dịch: Chưa có lịch sử phân bổ.
                allocationHistoryBody.innerHTML = `<tr><td colspan="5" class="no-data">${T('history.no_data', 'Chưa có lịch sử phân bổ.')}</td></tr>`;
            } else {
                history.forEach(item => {
                    // ... (phần này giữ nguyên)
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${item.allocationCode}</td>
                        <td>${item.date}</td>
                        <td>${item.toCenter}</td>
                        <td>${item.quantity}</td>
                        <td>${item.createdBy}</td>
                    `;
                    allocationHistoryBody.appendChild(tr);
                });
            }
        } catch (error) {
            // 💡 Dịch: Lỗi tải dữ liệu.
            console.error("Lỗi tải lịch sử phân bổ:", error);
            const errorDataText = T('error.load_data', 'Lỗi tải dữ liệu.');
            allocationHistoryBody.innerHTML = `<tr><td colspan="5" class="no-data" style="color: red;">${errorDataText}</td></tr>`;
        }
    }

    async function loadModalData() {
        const selectCenterPlaceholder = T('modal.placeholder.select_center', '-- Chọn trung tâm --');
        const selectPartPlaceholder = T('modal.placeholder.select_part', '-- Chọn phụ tùng --');
        const errorLoadingText = T('modal.error.load', 'Lỗi tải dữ liệu');

        // Khởi tạo các select với placeholder đã dịch
        scCenterSelect.innerHTML = `<option value="">${selectCenterPlaceholder}</option>`;
        partSelect.innerHTML = `<option value="">${selectPartPlaceholder}</option>`;

        try {
            const response = await fetch(API_SERVICE_CENTERS);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const centers = await response.json();

            scCenterSelect.innerHTML = `<option value="">${selectCenterPlaceholder}</option>`;
            centers.forEach(sc => {
                scCenterSelect.innerHTML += `<option value="${sc.scId}">${sc.name}</option>`;
            });
        } catch (error) {
            console.error("Lỗi tải Service Centers:", error);
            scCenterSelect.innerHTML = `<option value="">${errorLoadingText}</option>`;
        }

        try {
            const response = await fetch(`${API_PARTS}?page=1&pageSize=100`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const parts = await response.json();

            partSelect.innerHTML = `<option value="">${selectPartPlaceholder}</option>`;
            parts.forEach(part => {
                partSelect.innerHTML += `<option value="${part.partId}">${part.partName} (Tồn: ${part.quantity})</option>`;
            });
        } catch (error) {
            console.error("Lỗi tải danh sách phụ tùng (cho modal):", error);
            partSelect.innerHTML = `<option value="">${errorLoadingText}</option>`;
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const partId = partSelect.value;
        const toScId = scCenterSelect.value;
        const quantity = Number(document.getElementById('quantity').value || 0);

        // 💡 Dịch: Vui lòng chọn phụ tùng, trung tâm nhận và số lượng hợp lệ.
        if (!partId || !toScId || quantity <= 0) {
            alert(T('form.alert.invalid', 'Vui lòng chọn phụ tùng, trung tâm nhận và số lượng hợp lệ.'));
            return;
        }

        const submitBtn = allocateForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        // 💡 Dịch: Đang xử lý...
        submitBtn.textContent = T('form.processing', 'Đang xử lý...');

        try {
            const response = await fetch(API_CREATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partId, toScId, quantity })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}`);
            }

            // 💡 Dịch: Tạo yêu cầu thành công!
            alert(result.message || T('form.success', 'Tạo yêu cầu thành công!'));
            closeModal();
            allocateForm.reset();

            loadParts();
            loadHistory();

        } catch (error) {
            // 💡 Dịch: Tạo yêu cầu thất bại:
            console.error("Lỗi khi tạo phân bổ:", error);
            alert(`${T('form.failed', 'Tạo yêu cầu thất bại')}: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            // 💡 Dịch: Xác nhận
            submitBtn.textContent = T('form.confirm', 'Xác nhận');
        }
    }


    // (Giữ nguyên các hàm quản lý modal và event listeners)

    function openModal() {
        if (allocateModal) {
            allocateModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if(partSelect) partSelect.focus();

            loadModalData();
        }
    }

    function closeModal() {
        if (allocateModal) {
            allocateModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    openModalBtn?.addEventListener('click', openModal);

    modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));

    allocateModal?.addEventListener('click', (e) => {
        if (e.target === allocateModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && allocateModal && allocateModal.style.display !== 'none') {
            closeModal();
        }
    });

    allocateForm?.addEventListener('submit', handleFormSubmit);

    partsViewMoreBtn?.addEventListener('click', () => {
        window.location.href = '/evm/manage_ev_parts';
    });

    refreshBtn?.addEventListener('click', () => {
        loadParts();
        loadHistory();
    });

    searchBtn?.addEventListener('click', loadParts);
    // searchInput?.addEventListener('input', loadParts);
    filterSelect?.addEventListener('change', loadParts);


    function init() {
        loadParts();
        loadHistory();
    }
    
    init();

})();