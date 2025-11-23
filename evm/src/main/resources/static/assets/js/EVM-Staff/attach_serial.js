(function () {
    'use strict';

    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/attach_serial';
    const API_LIST = `${API_BASE}/list`;
    const API_GET_PARTS = `${API_BASE}/get-parts`;
    const API_GET_INSTALLERS = `${API_BASE}/get-installers`;
    const API_CREATE = `${API_BASE}/create`;

    const btnMo = document.getElementById('btnMoFormAttachSerial');
    const modal = document.getElementById('modalCreate');
    const btnClose = modal.querySelector('.modal-close-btn');
    const btnCancel = modal.querySelector('.modalCancel');
    const form = document.getElementById('modalForm');
    const tableBody = document.getElementById('partsTableBody');
    const searchInput = document.getElementById('searchInput');

    const paginationWrapper = document.querySelector('.pagination-wrapper');
    const paginationInfo = document.querySelector('.pagination-info');

    const vinInput = document.getElementById('vinInput');
    const partSelect = document.getElementById('partSelect');
    const serialNumberInput = document.getElementById('serialNumber');
    const dateAttachInput = document.getElementById('dateAttach');
    const installerSelect = document.getElementById('installerSelect');

    let currentPage = 1;
    let currentQuery = '';
    const PAGE_SIZE = 5;
    let isLastPage = false;

    async function fetchData(page = 1, query = '') {
        currentPage = page;
        currentQuery = query;
        if (!tableBody) return;

        tableBody.innerHTML = `<tr><td colspan="5" class="no-data-cell">Đang tải dữ liệu...</td></tr>`;

        try {
            const url = `${API_LIST}?page=${page}&pageSize=${PAGE_SIZE}&query=${encodeURIComponent(query)}`;
            console.log("Đang gọi API:", url); // Debug xem URL

            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 401) throw new Error("Lỗi 401: Hết phiên đăng nhập.");
                if (response.status === 404) throw new Error("Lỗi 404: Sai đường dẫn API.");
                throw new Error(`Lỗi Server HTTP ${response.status}`);
            }

            const parts = await response.json();

            if (!parts || !Array.isArray(parts)) {
                throw new Error("Dữ liệu trả về từ Server không đúng định dạng Mảng.");
            }

            if (parts.length < PAGE_SIZE) {
                isLastPage = true;
            } else {
                isLastPage = false;
            }

            if (parts.length === 0 && currentPage > 1) {
                fetchData(currentPage - 1, currentQuery);
                return;
            }

            renderTable(parts);
            renderPaginationInfo(parts.length);
            updatePaginationButtons();

        } catch (error) {
            console.error("Chi tiết lỗi:", error);
            tableBody.innerHTML = `<tr><td colspan="5" class="no-data-cell" style="color: red;">${error.message}</td></tr>`;
        }
    }

    function renderTable(parts) {
        if (!parts || parts.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="no-data-cell">Không tìm thấy dữ liệu${currentQuery ? ' cho "' + currentQuery + '"' : ''}.</td></tr>`;
            return;
        }

        tableBody.innerHTML = parts.map(p => `
            <tr>
                <td class="text-left">${p.vin || 'N/A'}</td>
                <td class="text-left">${p.partName || 'N/A'}</td>
                <td class="text-center">${p.serial || 'N/A'}</td>
                <td class="text-center">${p.installDate || 'N/A'}</td>
                <td class="text-left">${p.installerName || 'N/A'}</td>
            </tr>
        `).join('');
    }
    function renderPaginationInfo(currentCount) {
        if (!paginationInfo) return;
        const start = (currentPage - 1) * PAGE_SIZE + 1;
        const end = Math.min(currentPage * PAGE_SIZE, ((currentCount && currentCount > 0) ? ((currentPage - 1) * PAGE_SIZE + currentCount) : 0));
        if (currentCount === 0) paginationInfo.innerText = 'Hiển thị 0 của 0';
        else paginationInfo.innerText = `Hiển thị ${start} - ${end}`;
    }

    function updatePaginationButtons() {
        if (!paginationWrapper) return;
        const btns = paginationWrapper.querySelectorAll('button');
        if (btns.length >= 3) {
            const btnPrev = btns[0];
            const btnNum = btns[1];
            const btnNext = btns[2];

            btnNum.innerText = currentPage;

            btnPrev.style.visibility = currentPage > 1 ? 'visible' : 'hidden';
            btnNext.style.visibility = isLastPage ? 'hidden' : 'visible';
        }
    }

    async function openModal() {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        form.reset();

        dateAttachInput.value = new Date().toISOString().split('T')[0];

        await loadDropdownData();
    }


    async function loadDropdownData() {
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
        modal.style.display = 'none';
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
            fetchData(1, '');

        } catch (error) {
            console.error("Lỗi khi lưu:", error);
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

    if (paginationWrapper) {
        paginationWrapper.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const text = e.target.innerText.toLowerCase();

                if (text.includes('trước') || text.includes('«')) {
                    if (currentPage > 1) fetchData(currentPage - 1, currentQuery);
                }
                else if (text.includes('sau') || text.includes('»')) {
                    if (!isLastPage) fetchData(currentPage + 1, currentQuery);
                }
            }
        });
    }

    let searchTimeout;
    searchInput?.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchData(1, searchInput.value);
        }, 500);
    });
    fetchData(1, '');

})();