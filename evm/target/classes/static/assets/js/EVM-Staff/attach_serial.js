(function () {
    'use strict';

    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/attach_serial';
    const API_LIST = `${API_BASE}/list`;
    const API_GET_PARTS = `${API_BASE}/get-parts`;
    const API_GET_INSTALLERS = `${API_BASE}/get-installers`;
    const API_CREATE = `${API_BASE}/create`;

    const btnMo = document.getElementById('btnMoFormAttachSerial');
    const modal = document.getElementById('modalCreate');
    const btnClose = modal.querySelector('.modal-panel__close');
    const btnCancel = modal.querySelector('.modalCancel');
    const form = document.getElementById('modalForm');
    const tableBody = document.getElementById('partsTableBody');
    const searchInput = document.getElementById('searchInput');

    const vinInput = document.getElementById('vinInput');
    const partSelect = document.getElementById('partSelect');
    const serialNumberInput = document.getElementById('serialNumber');
    const dateAttachInput = document.getElementById('dateAttach');
    const installerSelect = document.getElementById('installerSelect');

    let currentPage = 1;
    let currentQuery = '';


    async function fetchData(page = 1, query = '') {
        currentPage = page;
        currentQuery = query;
        if (!tableBody) return;

        tableBody.innerHTML = `<tr><td colspan="5" class="no-data">Đang tải dữ liệu...</td></tr>`;
        
        try {
            const url = `${API_LIST}?page=${page}&pageSize=10&query=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const parts = await response.json();
            renderTable(parts);

        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
            tableBody.innerHTML = `<tr><td colspan="5" class="no-data" style="color: red;">Lỗi tải dữ liệu.</td></tr>`;
        }
    }

    function renderTable(parts) {
        if (!parts || parts.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="no-data">Không tìm thấy dữ liệu${currentQuery ? ' cho "' + currentQuery + '"' : ''}.</td></tr>`;
            return;
        }
        
        tableBody.innerHTML = parts.map(p => `
            <tr>
                <td>${p.vin || 'N/A'}</td>
                <td>${p.partName || 'N/A'}</td>
                <td>${p.serial || 'N/A'}</td>
                <td>${p.installDate || 'N/A'}</td>
                <td>${p.installerName || 'N/A'}</td>
            </tr>
        `).join('');
    }

    async function openModal() {
        modal.setAttribute('aria-hidden', 'false');
        form.reset(); 
        
        dateAttachInput.value = new Date().toISOString().split('T')[0];

        await loadDropdownData();
    }


    async function loadDropdownData() {
        // Tải Phụ tùng
        partSelect.innerHTML = `<option value="">Đang tải phụ tùng...</option>`;
        try {
            const resParts = await fetch(API_GET_PARTS);
            if (!resParts.ok) throw new Error('Lỗi tải phụ tùng');
            const parts = await resParts.json();
            partSelect.innerHTML = `<option value="">-- Chọn phụ tùng --</option>`;
            parts.forEach(p => {
                partSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
            });
        } catch (e) {
            console.error(e);
            partSelect.innerHTML = `<option value="">Lỗi tải phụ tùng</option>`;
        }

        installerSelect.innerHTML = `<option value="">Đang tải người dùng...</option>`;
         try {
            const resInstallers = await fetch(API_GET_INSTALLERS);
            if (!resInstallers.ok) throw new Error('Lỗi tải người cài đặt');
            const installers = await resInstallers.json();
            installerSelect.innerHTML = `<option value="">-- Chọn người gắn --</option>`;
            installers.forEach(i => {
                installerSelect.innerHTML += `<option value="${i.id}">${i.name}</option>`;
            });
        } catch (e) {
            console.error(e);
            installerSelect.innerHTML = `<option value="">Lỗi tải người dùng</option>`;
        }
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
                vin: vinInput.value,
                partId: partSelect.value,
                serialNumber: serialNumberInput.value,
                installDate: dateAttachInput.value,
                installerId: installerSelect.value
            };
            
            if (!payload.vin || !payload.partId || !payload.serialNumber || !payload.installDate || !payload.installerId) {
                throw new Error("Vui lòng điền đầy đủ thông tin.");
            }
            
            const response = await fetch(API_CREATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Lỗi không xác định');
            }
            
            alert(result.message || 'Thành công!');
            closeModal();
            fetchData(1, ''); // Tải lại trang đầu tiên

        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            alert(`Lỗi: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Lưu';
        }
    }

    // --- Gắn sự kiện ---
    btnMo?.addEventListener('click', openModal);
    btnClose?.addEventListener('click', closeModal);
    btnCancel?.addEventListener('click', closeModal);
    form?.addEventListener('submit', handleFormSubmit);

    // Tìm kiếm khi người dùng ngừng gõ
    let searchTimeout;
    searchInput?.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchData(1, searchInput.value);
        }, 500); // Đợi 500ms
    });

    // Tải dữ liệu lần đầu
    fetchData(1, '');

})();