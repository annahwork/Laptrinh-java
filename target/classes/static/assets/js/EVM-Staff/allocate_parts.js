(function() {
    'use strict';

    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/allocate_parts';
    const API_PARTS = `${API_BASE}/parts`;
    const API_HISTORY = `${API_BASE}/history`;
    const API_SERVICE_CENTERS = `${API_BASE}/service-centers`;
    const API_CREATE = `${API_BASE}/create`;

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

    function updatePartsVisibility() {
        const dataRows = getDataRows();
        if (dataRows.length > 2) {
            dataRows.forEach((tr, idx) => {
                tr.style.display = (idx >= 2) ? 'none' : '';
            });
            if (partsMoreRow) partsMoreRow.style.display = '';
        } else {
            dataRows.forEach(tr => tr.style.display = '');
            if (partsMoreRow) partsMoreRow.style.display = 'none';
        }
    }

    async function loadParts() {
        if (!partsTableBody) return;
        
        partsTableBody.innerHTML = `<tr><td colspan="5" class="no-data">Đang tải...</td></tr>`;

        try {
            const searchTerm = searchInput.value;
            const typeFilter = filterSelect.value;
            
            // Xây dựng URL (ví dụ, mặc dù controller chưa xử lý)
            const url = `${API_PARTS}?page=1&pageSize=20&search=${encodeURIComponent(searchTerm)}&type=${encodeURIComponent(typeFilter)}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const parts = await response.json();

            partsTableBody.innerHTML = ""; // Xóa "Đang tải..."
            
            if (parts.length === 0) {
                partsTableBody.innerHTML = `<tr><td colspan="5" class="no-data">Không tìm thấy phụ tùng nào.</td></tr>`;
            } else {
                parts.forEach(part => {
                    const tr = document.createElement('tr');
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
            
            updatePartsVisibility(); // Cập nhật hiển thị (ẩn > 2)

        } catch (error) {
            console.error("Lỗi tải danh sách phụ tùng:", error);
            partsTableBody.innerHTML = `<tr><td colspan="5" class="no-data" style="color: red;">Lỗi tải dữ liệu.</td></tr>`;
        }
    }

    async function loadHistory() {
        if (!allocationHistoryBody) return;
        allocationHistoryBody.innerHTML = `<tr><td colspan="5" class="no-data">Đang tải...</td></tr>`;

        try {
            const response = await fetch(`${API_HISTORY}?page=1&pageSize=5`); // Lấy 5 bản ghi
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const history = await response.json();

            allocationHistoryBody.innerHTML = ""; // Xóa "Đang tải..."
            
            if (history.length === 0) {
                allocationHistoryBody.innerHTML = `<tr><td colspan="5" class="no-data">Chưa có lịch sử phân bổ.</td></tr>`;
            } else {
                history.forEach(item => {
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
            console.error("Lỗi tải lịch sử phân bổ:", error);
            allocationHistoryBody.innerHTML = `<tr><td colspan="5" class="no-data" style="color: red;">Lỗi tải dữ liệu.</td></tr>`;
        }
    }

    async function loadModalData() {
        
        try {
            const response = await fetch(API_SERVICE_CENTERS);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const centers = await response.json();
            
            scCenterSelect.innerHTML = `<option value="">-- Chọn trung tâm --</option>`;
            centers.forEach(sc => {
                scCenterSelect.innerHTML += `<option value="${sc.scId}">${sc.name}</option>`;
            });
        } catch (error) {
            console.error("Lỗi tải Service Centers:", error);
            scCenterSelect.innerHTML = `<option value="">Lỗi tải dữ liệu</option>`;
        }
        
        try {
            const response = await fetch(`${API_PARTS}?page=1&pageSize=100`); 
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const parts = await response.json();
            
            partSelect.innerHTML = `<option value="">-- Chọn phụ tùng --</option>`;
            parts.forEach(part => {
                partSelect.innerHTML += `<option value="${part.partId}">${part.partName} (Tồn: ${part.quantity})</option>`;
            });
        } catch (error) {
            console.error("Lỗi tải danh sách phụ tùng (cho modal):", error);
            partSelect.innerHTML = `<option value="">Lỗi tải dữ liệu</option>`;
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const partId = partSelect.value;
        const toScId = scCenterSelect.value;
        const quantity = Number(document.getElementById('quantity').value || 0);

        if (!partId || !toScId || quantity <= 0) {
            alert('Vui lòng chọn phụ tùng, trung tâm nhận và số lượng hợp lệ.');
            return;
        }

        const submitBtn = allocateForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang xử lý...';

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

            alert(result.message || 'Tạo yêu cầu thành công!');
            closeModal();
            allocateForm.reset();
            
            // Tải lại cả hai bảng
            loadParts();
            loadHistory();

        } catch (error) {
            console.error("Lỗi khi tạo phân bổ:", error);
            alert(`Tạo yêu cầu thất bại: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Xác nhận';
        }
    }

 
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
        // TODO: Thay bằng URL chính xác đến trang quản lý phụ tùng
        window.location.href = '/evm/manage_ev_parts'; // Giả sử đây là endpoint
    });

    refreshBtn?.addEventListener('click', () => {
        loadParts();
        loadHistory();
    });

    searchBtn?.addEventListener('click', loadParts);
    // (Có thể thêm: tìm khi gõ phím)
    // searchInput?.addEventListener('input', loadParts);
    // filterSelect?.addEventListener('change', loadParts);


    // --- Khởi tạo khi tải trang ---
    function init() {
        loadParts();
        loadHistory();
        // Không tải modal data ngay, chỉ tải khi mở modal để lấy tồn kho mới nhất
    }
    
    init();

})();