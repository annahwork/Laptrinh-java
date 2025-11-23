(function () {
    'use strict';
    console.log('warranty_cost.js loaded');

    // 💡 Hàm tra cứu dịch thuật
    const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/claims/cost';
    const API_LIST = `${API_BASE}/list`;
    const API_DETAILS = `${API_BASE}/details`;

    const tableBody = document.getElementById('warrantyCostTableBody');
    const grandTotalEl = document.getElementById('grandTotalCost');

    const btnPrev = document.getElementById('prevPage');
    const btnNext = document.getElementById('nextPage');
    const btnCurrent = document.getElementById('currentPage');
    const pageInfo = document.getElementById('pageInfo');
    const totalItemsEl = document.getElementById('totalItems');

    const modal = document.getElementById('warrantyCostModal');
    const modalBody = document.getElementById('modalCostBody');
    const modalClaimId = document.getElementById('modalClaimId');
    const btnClose = modal.querySelector('.warranty-cost__modal-close');
    const backdrop = modal.querySelector('.warranty-cost__modal-backdrop'); // Giữ nguyên nếu tồn tại

    let currentPage = 1;
    let totalPages = 1;

    const currencyFormatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });

    /**
     * Tải và render bảng dữ liệu chính
     */
    async function fetchData(page = 1) {
        currentPage = page;
        if (!tableBody) return;

        // 💡 Dịch: Đang tải dữ liệu...
        tableBody.innerHTML = `<tr><td colspan="6" class="no-data">${T('message.loading_data', 'Đang tải dữ liệu...')}</td></tr>`;

        try {
            const url = `${API_LIST}?page=${page}&pageSize=10`;
            const response = await fetch(url);

            if (!response.ok) {
                const err = await response.json();
                // 💡 Dịch: Lỗi tải danh sách chi phí
                throw new Error(err.message || T('warranty.cost.error_list', `Lỗi HTTP ${response.status}`));
            }

            const result = await response.json();

            renderTable(result.data);
            updatePagination(result.totalItems, result.totalPages);

            if (grandTotalEl && result.grandTotal != null) {
                grandTotalEl.textContent = currencyFormatter.format(result.grandTotal).replace(/\s/g, '');
            }

        } catch (error) {
            console.error("Lỗi tải danh sách chi phí:", error);
            const errorText = T('warranty.cost.error_list', 'Lỗi tải dữ liệu');
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="color: red;">${errorText}: ${error.message}</td></tr>`;
        }
    }

    /**
     * Render bảng chính
     */
    function renderTable(claims) {
        if (!claims || claims.length === 0) {
             // 💡 Dịch: Không tìm thấy dữ liệu chi phí.
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data">${T('warranty.cost.no_data', 'Không tìm thấy dữ liệu chi phí.')}</td></tr>`;
            return;
        }

        const btnViewText = T('button.view_details', 'Xem chi tiết');

        tableBody.innerHTML = claims.map(c => `
            <tr>
                <td>${c.claimId || 'N/A'}</td>
                <td>${c.vin || 'N/A'}</td>
                <td>${c.requester || 'N/A'}</td>
                <td>${c.date || 'N/A'}</td>
                <td class="text-right">${currencyFormatter.format(c.totalCost || 0).replace(/\s/g, '')}</td>
                <td class="text-center">
                    <button class="btn-action btn-view" data-id="${c.claimIdRaw}">
                      ${btnViewText}
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // (Giữ nguyên updatePagination)
    function updatePagination(totalItems, totalPg) {
        totalPages = totalPg;
        btnPrev.disabled = currentPage <= 1;
        btnNext.disabled = currentPage >= totalPages;
        btnCurrent.textContent = currentPage;

        const start = (currentPage - 1) * 10 + 1;
        const end = Math.min(currentPage * 10, totalItems);

        pageInfo.textContent = (totalItems > 0) ? `${start} - ${end}` : '0';
        totalItemsEl.textContent = totalItems;
    }

    /**
     * Mở Modal
     */
    async function openModal(claimId) {
        // 💡 Dịch: Đang tải chi tiết...
        modalBody.innerHTML = `<tr><td colspan="4" class="no-data">${T('warranty.cost.modal.loading', 'Đang tải chi tiết...')}</td></tr>`;
        modalClaimId.textContent = `CR-${claimId}`;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        try {
            const response = await fetch(`${API_DETAILS}/${claimId}`);
            if (!response.ok) {
                const err = await response.json();
                // 💡 Dịch: Lỗi tải chi tiết
                throw new Error(err.message || T('warranty.cost.modal.error', 'Lỗi tải chi tiết'));
            }
            const details = await response.json();
            renderModalTable(details);

        } catch (error) {
            console.error("Lỗi tải chi tiết modal:", error);
            const errorText = T('warranty.cost.modal.error', 'Lỗi tải chi tiết');
            modalBody.innerHTML = `<tr><td colspan="4" class="no-data" style="color: red;">${errorText}: ${error.message}</td></tr>`;
        }
    }

    /**
     * Render bảng trong Modal
     */
    function renderModalTable(details) {
         if (!details || details.length === 0) {
             // 💡 Dịch: Không có dịch vụ nào cho yêu cầu này.
            modalBody.innerHTML = `<tr><td colspan="4" class="no-data">${T('warranty.cost.modal.no_data', 'Không có dịch vụ nào cho yêu cầu này.')}</td></tr>`;
            return;
        }

        modalBody.innerHTML = details.map(d => `
            <tr>
                <td>${d.serviceName || 'N/A'}</td>
                <td class="text-center">${d.quantity || 1}</td>
                <td class="text-right">${currencyFormatter.format(d.unitPrice || 0).replace(/\s/g, '')}</td>
                <td class="text-right">${currencyFormatter.format(d.totalPrice || 0).replace(/\s/g, '')}</td>
            </tr>
        `).join('');
    }

    /**
     * Đóng Modal
     */
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        modalBody.innerHTML = ''; 
    }

    tableBody.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('btn-view')) {
            const id = e.target.getAttribute('data-id');
            if (id) {
                openModal(id);
            }
        }
    });

    btnClose?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);

    btnPrev?.addEventListener('click', () => {
        if (currentPage > 1) fetchData(currentPage - 1);
    });
    btnNext?.addEventListener('click', () => {
        if (currentPage < totalPages) fetchData(currentPage + 1);
    });

    fetchData(1);

})();