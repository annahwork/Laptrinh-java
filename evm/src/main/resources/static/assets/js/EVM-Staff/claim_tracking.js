(function () {
    'use strict';
    console.log('claim_tracking.js loaded');

    const API_BASE_URL = (window.contextPath || '/evm/') + 'api/evm_staff/claims';
    const API_ALL_CLAIMS = `${API_BASE_URL}/all`;
    const API_HISTORY = `${API_BASE_URL}/history`;

    const tableBody = document.getElementById('trackingTableBody');

    const modal = document.getElementById('trackingModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalClaimIdSpan = document.getElementById('modalClaimId');
    const modalProgressBody = document.getElementById('modalProgressBody');

    // pagination state
    let claimsCache = [];
    let currentPage = 1;
    const PAGE_SIZE = 5; // mỗi trang 5 dòng

    const paginationInfoEl = document.querySelector('.pagination-info');
    const prevPageBtn = document.getElementById('prevPage');
    const currentPageBtn = document.getElementById('currentPage');
    const nextPageBtn = document.getElementById('nextPage');

    async function loadAllClaims() {
        if (!tableBody) return;
        tableBody.innerHTML = `<tr><td colspan="6" class="no-data">Đang tải dữ liệu...</td></tr>`;

        try {
            const response = await fetch(API_ALL_CLAIMS);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.message || 'Lỗi tải dữ liệu'}`);
            }
            const claims = await response.json();
            // store and render first page
            claimsCache = Array.isArray(claims) ? claims : [];
            currentPage = 1;
            renderPage();

        } catch (error) {
            console.error('Lỗi tải danh sách claim:', error);
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="color: red;">${error.message}</td></tr>`;
        }
    }


    function renderPage() {
        tableBody.innerHTML = '';
        const total = claimsCache.length;
        if (!claimsCache || total === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data">Không có yêu cầu nào.</td></tr>`;
            // update pagination info
            if (paginationInfoEl) paginationInfoEl.textContent = `Hiển thị 0 của 0`;
            if (currentPageBtn) currentPageBtn.textContent = '1';
            if (prevPageBtn) prevPageBtn.disabled = true;
            if (nextPageBtn) nextPageBtn.disabled = true;
            return;
        }

        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = Math.min(startIndex + PAGE_SIZE, total);
        const pageItems = claimsCache.slice(startIndex, endIndex);

        // render rows for current page
        pageItems.forEach(claim => {
            const row = document.createElement('tr');
            let statusClass = '';
            const status = (claim.status || '').toString().toLowerCase();
            if (status.includes('pending') || status.includes('đã gửi')) {
                statusClass = 'status-pending';
            } else if (status.includes('approved') || status.includes('được chấp nhận') || status.includes('completed')) {
                statusClass = 'status-success';
            } else if (status.includes('rejected') || status.includes('bị từ chối')) {
                statusClass = 'status-danger';
            }

            const claimIdText = claim.claimId ?? claim.claimID ?? claim.id ?? '';
            const displayId = String(claimIdText).replace(/^CR-/, '');

            row.innerHTML = `
                <td>${escapeHtml(claimIdText)}</td>
                <td>${escapeHtml(claim.vin || '')}</td>
                <td>${escapeHtml(claim.requester || '')}</td>
                <td>${escapeHtml(claim.date || '')}</td>
                <td><span class="status-badge ${statusClass}">${escapeHtml(claim.status || '')}</span></td>
                <td>
                    <button class="btn-view" data-id="${escapeHtml(displayId)}">Xem tiến trình</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // attach handlers
        tableBody.querySelectorAll('.btn-view').forEach(button => {
            button.removeEventListener('click', onViewClick);
            button.addEventListener('click', onViewClick);
        });

        // update pagination UI
        if (paginationInfoEl) paginationInfoEl.textContent = `Hiển thị ${startIndex + 1}-${endIndex} của ${total}`;
        if (currentPageBtn) currentPageBtn.textContent = String(currentPage);
        if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
    }

    function onViewClick(e) {
        const id = e.currentTarget.dataset.id;
        openTrackingModal(id);
    }

    async function openTrackingModal(claimId) {
        modalClaimIdSpan.textContent = `(CR-${claimId})`;
        modalProgressBody.innerHTML = `<tr><td colspan="4" class="no-data">Đang tải lịch sử...</td></tr>`;
        modal.style.display = 'flex';

        try {
            const response = await fetch(`${API_HISTORY}/${claimId}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const history = await response.json();
            renderHistoryTable(history);

        } catch (error) {
            console.error('Lỗi tải lịch sử:', error);
            modalProgressBody.innerHTML = `<tr><td colspan="4" class="no-data" style="color: red;">Lỗi tải lịch sử.</td></tr>`;
        }
    }

    function renderHistoryTable(history) {
        modalProgressBody.innerHTML = '';
        if (!history || history.length === 0) {
            modalProgressBody.innerHTML = `<tr><td colspan="4" class="no-data">Không có lịch sử cho yêu cầu này.</td></tr>`;
            return;
        }

        history.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.step}</td>
                <td>${item.user}</td>
                <td>${item.date}</td>
                <td>${item.status}</td>
            `;
            const noteRow = document.createElement('tr');
            noteRow.innerHTML = `<td colspan="4" class="history-note"><strong>Ghi chú:</strong> ${item.note}</td>`;

            modalProgressBody.appendChild(row);
            modalProgressBody.appendChild(noteRow);
        });
    }

}

    closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        closeModal();
    }
});

// pagination button handlers
if (prevPageBtn) {
    prevPageBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });
}

if (nextPageBtn) {
    nextPageBtn.addEventListener('click', function () {
        const total = claimsCache.length;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    });
}

if (currentPageBtn) {
    currentPageBtn.addEventListener('click', function () {
        // simple behaviour: go back to page 1 when clicking center
        currentPage = 1;
        renderPage();
    });
}

loadAllClaims();

}) ();