(function () {
    'use strict';
    console.log('Warranty Claim Management script loaded');

    const API_CLAIMS_BASE = '/evm/api/warranty-claims';
    const PAGE_SIZE = 5;
    const CURRENT_USER_ID = 2;

    let allClaims = [];
    let currentFilteredClaims = [];
    let currentPage = 1;
    let claimsCache = [];        // cache danh sách claim
    let currentEditingClaimId = null; // null = thêm mới, khác null = đang sửa

    /** ----------- Hàm render bảng ----------- */
    function renderClaims(claimsToRender) {
        const tableBody = document.getElementById('claimsTbody');
        if (!tableBody) {
            console.error('Không tìm thấy #claimsTbody');
            return;
        }
        tableBody.innerHTML = '';

        if (!claimsToRender || claimsToRender.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="table-placeholder-cell">Không tìm thấy yêu cầu nào khớp.</td></tr>`;
            return;
        }

        claimsToRender.forEach(claim => {
            const vin = claim.vin || 'N/A';
            const claimId = claim.claimID || 'N/A';
            const date = claim.date ? new Date(claim.date).toLocaleDateString('vi-VN') : 'N/A';
            const status = claim.status || 'N/A';

            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${claimId}</td>
            <td>${vin}</td>
            <td>${date}</td>
            <td>${status}</td>
            <td>
                <button class="btn-sua" data-id="${claimId}">Sửa</button>
                <button class="btn-xoa" data-id="${claimId}">Xóa</button>
            </td>`;
            tableBody.appendChild(row);
        });
    }

    /** ----------- Hàm tải DỮ LIỆU ----------- */
    async function loadAllClaims() {
        const tableBody = document.getElementById('claimsTbody');
        if (tableBody)
            tableBody.innerHTML = `<tr><td colspan="5" class="table-placeholder-cell">Đang tải dữ liệu...</td></tr>`;
        try {
            const url = `/evm/api/warranty-claims?userId=2&page=1&size=9999`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            console.log('API trả về:', data);
            renderClaims(data);
        } catch (error) {
            if (tableBody)
                tableBody.innerHTML = `<tr><td colspan="5" class="table-placeholder-cell">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
        }
    }
    document.addEventListener('DOMContentLoaded', loadAllClaims);

    function filterAndRenderClaims() {
        const searchValue = document.getElementById('searchBox')?.value.trim().toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';

        // Nếu KHÔNG có searchValue và KHÔNG có statusFilter, trả lại full bảng
        if (!searchValue && !statusFilter) {
            currentFilteredClaims = allClaims;
        } else {
            currentFilteredClaims = allClaims.filter(claim => {
                const matchesStatus = statusFilter ? claim.status === statusFilter : true;
                const matchesSearch = searchValue ?
                    (
                        (claim.vin && claim.vin.toLowerCase().includes(searchValue))
                        || (claim.claimID && claim.claimID.toString().includes(searchValue))
                        || (claim.status && claim.status.toLowerCase().includes(searchValue))
                        || (claim.description && claim.description.toLowerCase().includes(searchValue))
                    )
                    : true;
                return matchesStatus && matchesSearch;
            });
        }
        currentPage = 1;
        renderPaginatedClaims();
    }
    function renderPaginatedClaims() {
        const totalRecords = currentFilteredClaims.length;
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const paginated = currentFilteredClaims.slice(startIndex, startIndex + PAGE_SIZE);
        renderClaims(paginated);
        updatePagination(totalRecords, startIndex);
    }

    function updatePagination(totalRecords, startIndex) {
        const btnPrev = document.querySelector('.pagination-btn:first-child');
        const btnNext = document.querySelector('.pagination-btn:last-child');
        const btnCurrent = document.querySelector('.pagination-btn-active');
        const paginationInfo = document.querySelector('.pagination-info');

        const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
        if (btnPrev) btnPrev.disabled = currentPage <= 1;
        if (btnNext) btnNext.disabled = currentPage >= totalPages;
        if (btnCurrent) btnCurrent.textContent = currentPage.toString();

        if (paginationInfo && totalRecords > 0)
            paginationInfo.textContent = `Hiển thị ${startIndex + 1} - ${Math.min(currentPage * PAGE_SIZE, totalRecords)} của ${totalRecords}`;
        else if (paginationInfo)
            paginationInfo.textContent = 'Hiển thị 0 của 0';
    }

    /** ----------- Mở/đóng Modal ----------- */
    async function openWarrantyModal(claimId = null) {
        const modal = document.getElementById('modalYeuCauBaoHanh');
        const form = modal.querySelector('.warranty-claim__form');
        const codeInput = document.getElementById('warranty_code');
        form.reset();

        if (claimId === null) {
            if (codeInput) codeInput.disabled = false;
            modal.style.display = 'block';
        } else {
            // Sửa (chưa code)
        }
    }

    function closeWarrantyModal() {
        const modal = document.getElementById('modalYeuCauBaoHanh');
        if (modal) modal.style.display = 'none';
    }
    async function submitWarrantyForm(e) {
        e.preventDefault();
        const payload = {
            scStaffId: CURRENT_USER_ID,
            vehiclePartId: 1,
            vin: document.getElementById('warranty_vin')?.value || '',
            description: document.getElementById('warranty_desc')?.value || '',
            status: document.getElementById('warranty_status')?.value || 'pending',
            attachmentUrl: ''
        };

        let url = API_CLAIMS_BASE;
        let method = 'POST';
        if (currentEditingClaimId) {
            url = `${API_CLAIMS_BASE}/${currentEditingClaimId}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(await response.text());
            alert(currentEditingClaimId ? 'Sửa yêu cầu thành công!' : 'Tạo yêu cầu thành công!');
            closeWarrantyModal();
            loadAllClaims();
        } catch (err) {
            console.error('Lỗi khi lưu yêu cầu:', err);
            alert(`Lỗi: ${err.message}`);
        }
    }
    async function handleDelete(claimId) {
        // Hỏi m có chắc không
        if (!confirm(`M chắc chắn muốn XÓA yêu cầu: ${claimId} không?`)) {
            return; // Nếu bấm "Hủy"
        }

        try {
            // 💥 M PHẢI CODE API "DELETE /{id}" BÊN BE (CONTROLLER)
            const response = await fetch(`${API_CLAIMS_BASE}/${claimId}`, { method: 'DELETE' });

            if (!response.ok) {
                // Nếu BE chửi, m văng lỗi
                throw new Error(await response.text());
            }

            alert('Xóa yêu cầu thành công!');
            loadAllClaims(); // Tải lại bảng (quan trọng)
        } catch (err) {
            console.error('Lỗi khi xóa yêu cầu:', err);
            alert(`Lỗi: ${err.message} (M code API DELETE bên BE chưa?)`);
        }
    }

    /** ----------- INIT ----------- */
    function init() {
        document.getElementById('searchBox')?.addEventListener('input', filterAndRenderClaims);
        document.getElementById('statusFilter')?.addEventListener('change', filterAndRenderClaims);

        document.querySelector('.pagination-btn:first-child')?.addEventListener('click', () => {
            if (currentPage > 1) { currentPage--; renderPaginatedClaims(); }
        });
        document.querySelector('.pagination-btn:last-child')?.addEventListener('click', () => {
            if (currentPage * PAGE_SIZE < currentFilteredClaims.length) { currentPage++; renderPaginatedClaims(); }
        });

        document.getElementById('btnMoFormYeuCau')?.addEventListener('click', () => openWarrantyModal(null));
        document.querySelector('.warranty-claim__close-button')?.addEventListener('click', closeWarrantyModal);
        document.getElementById('warrantyCancelBtn')?.addEventListener('click', closeWarrantyModal);
        // document.querySelector('.warranty-claim__form')?.addEventListener('submit', submitWarrantyForm);
        document.querySelector('.warranty-claim__form')?.addEventListener('submit', submitWarrantyForm);
        document.getElementById('claimsTbody').addEventListener('click', function (e) {
            const target = e.target;
            const id = target.getAttribute('data-id');

        });

        // Load lần đầu

        loadAllClaims();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();