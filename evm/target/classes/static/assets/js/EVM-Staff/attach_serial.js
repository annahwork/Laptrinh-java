(function () {
    'use strict';

    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/attach_serial';
    const API_LIST = `${API_BASE}/list`;
    const API_GET_PARTS = `${API_BASE}/get-parts`;
    const API_GET_INSTALLERS = `${API_BASE}/get-installers`;
    const API_CREATE = `${API_BASE}/create`;

    // 💡 Hàm tra cứu dịch thuật
    const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

    const btnMo = document.getElementById('btnMoFormAttachSerial');
    const modal = document.getElementById('modalCreate');
    const btnClose = modal?.querySelector('.modal-close-btn');
    const btnCancel = modal?.querySelector('.modalCancel'); // Sử dụng class modalCancel để tìm nút Hủy bỏ
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

        // 💡 Dịch: Đang tải dữ liệu...
        tableBody.innerHTML = `<tr><td colspan="5" class="no-data-cell">${T('message.loading', 'Đang tải dữ liệu...')}</td></tr>`;

        try {
            const url = `${API_LIST}?page=${page}&pageSize=10&query=${encodeURIComponent(query)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const parts = await response.json();
            renderTable(parts);

        } catch (error) {
            // 💡 Dịch: Lỗi tải dữ liệu.
            console.error("Lỗi tải danh sách:", error);
            const errorText = T('error.load_data', 'Lỗi tải dữ liệu.');
            tableBody.innerHTML = `<tr><td colspan="5" class="no-data-cell" style="color: red;">${errorText}</td></tr>`;
        }
    }

    function renderTable(parts) {
        if (!parts || parts.length === 0) {
            // 💡 Dịch: Không tìm thấy dữ liệu (kèm từ khóa tìm kiếm)
            let noDataText;
            if (currentQuery) {
                 noDataText = T('attach.serial.no_data_search', `Không tìm thấy dữ liệu cho "${currentQuery}".`);
                 noDataText = noDataText.replace('"%s"', `"${currentQuery}"`);
            } else {
                 noDataText = T('attach.serial.no_data', 'Chưa có dữ liệu');
            }
            tableBody.innerHTML = `<tr><td colspan="5" class="no-data-cell">${noDataText}</td></tr>`;
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
        const selectPartPlaceholder = T('modal.placeholder.select_part', '-- Chọn phụ tùng --');
        const selectInstallerPlaceholder = T('attach.serial.placeholder.select_installer', '-- Chọn người gắn --');
        const errorLoadingText = T('modal.error.load', 'Lỗi tải dữ liệu');

        // Tải Phụ tùng
        // 💡 Dịch: Đang tải phụ tùng...
        partSelect.innerHTML = `<option value="">${T('modal.placeholder.loading_parts', 'Đang tải phụ tùng...')}</option>`;
        try {
            const resParts = await fetch(API_GET_PARTS);
            if (!resParts.ok) throw new Error(T('error.load_data', 'Lỗi tải dữ liệu'));
            const parts = await resParts.json();
            partSelect.innerHTML = `<option value="">${selectPartPlaceholder}</option>`;
            parts.forEach(p => {
                partSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
            });
        } catch (e) {
            console.error(e);
            partSelect.innerHTML = `<option value="">${errorLoadingText}</option>`;
        }

        // Tải Người gắn
        // 💡 Dịch: Đang tải người dùng...
        installerSelect.innerHTML = `<option value="">${T('modal.placeholder.loading_installers', 'Đang tải người dùng...')}</option>`;
         try {
            const resInstallers = await fetch(API_GET_INSTALLERS);
            if (!resInstallers.ok) throw new Error(T('error.load_data', 'Lỗi tải dữ liệu'));
            const installers = await resInstallers.json();
            installerSelect.innerHTML = `<option value="">${selectInstallerPlaceholder}</option>`;
            installers.forEach(i => {
                installerSelect.innerHTML += `<option value="${i.id}">${i.name}</option>`;
            });
        } catch (e) {
            console.error(e);
            installerSelect.innerHTML = `<option value="">${errorLoadingText}</option>`;
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

        // 💡 Dịch: Đang lưu...
        const originalText = submitBtn.textContent;
        submitBtn.textContent = T('form.saving', 'Đang lưu...');

        try {
            const payload = {
                vin: vinInput.value,
                partId: partSelect.value,
                serialNumber: serialNumberInput.value,
                installDate: dateAttachInput.value,
                installerId: installerSelect.value
            };

            // 💡 Dịch: Vui lòng điền đầy đủ thông tin.
            if (!payload.vin || !payload.partId || !payload.serialNumber || !payload.installDate || !payload.installerId) {
                throw new Error(T('form.alert.invalid', "Vui lòng điền đầy đủ thông tin."));
            }

            const response = await fetch(API_CREATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || T('form.failed', 'Lỗi không xác định'));
            }

            // 💡 Dịch: Thành công!
            alert(result.message || T('form.success', 'Thành công!'));
            closeModal();
            fetchData(1, '');

        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            // 💡 Dịch: Lỗi:
            alert(`${T('form.failed', 'Lỗi')}: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // --- Gắn sự kiện ---
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

    fetchData(1, '');

})();