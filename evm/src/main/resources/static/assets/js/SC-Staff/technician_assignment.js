(function () {
    'use strict';

    // ========== STATE PHÂN TRANG & FILTER ==========
    let assignmentsCache = [];        // cache toàn bộ kết quả /allwc
    let currentPage = 1;              // trang hiện tại
    const PAGE_SIZE = 5;              // mỗi trang 5 dòng
    let currentSearchTerm = '';       // từ khóa search
    let currentStatusFilter = '';     // filter trạng thái
    let currentDateFilter = '';       // filter ngày (yyyy-MM-dd)

    // ========== UTIL ==========
    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"'`=\/]/g, function (c) {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
            })[c];
        });
    }

    function initTechAssign() {
        const searchBox = document.getElementById('searchBox');
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('dateFilter');
        const claimsTbody = document.getElementById('claimsTbody');

        const assignModal = document.getElementById('assignModal');
        const assignModalClose = document.getElementById('assignModalClose');
        const assignCancelBtn = document.getElementById('assignCancelBtn');
        const assignForm = document.getElementById('assignForm');

        const btnOpenNewReq = document.getElementById('btntechnician_assignment');
        const newReqModal = document.getElementById('modalYeuCauDieuPhoi');
        const newReqCloseBtn = document.getElementById('newReqCloseBtn');
        const newReqCancelBtn = document.getElementById('assignCancelBtnModal');
        const newReqForm = document.getElementById('newRequestForm');

        const paginationWrapper = document.querySelector('.pagination-wrapper');
        const paginationInfo = document.querySelector('.pagination-info');



        // Lấy nút Trước / Sau / nút hiển thị số trang từ pagination hiện có (không cần sửa HTML)
        let prevBtn = null;
        let nextBtn = null;
        let pageBtn = null;
        if (paginationWrapper) {
            const btns = paginationWrapper.querySelectorAll('button');
            if (btns.length >= 2) {
                prevBtn = btns[0];                 // « Trước
                nextBtn = btns[btns.length - 1];   // Sau »
            }
            pageBtn = paginationWrapper.querySelector('.btn-primary') ||
                paginationWrapper.querySelector('.pagination-btn-active');
        }

        // ========== DROPDOWNS ==========
        async function loadTechnicianDropdown(selectElementId, selectedTechnicianId) {
            const select = document.getElementById(selectElementId);
            if (!select) {
                console.error(`[TechAssign] Không tìm thấy select: #${selectElementId}`);
                return;
            }
            select.innerHTML = '<option value="">-- Đang tải KTV... --</option>';

            try {
                const res = await fetch('/evm/api/warranty-claims/technicians', {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Không lấy được danh sách kỹ thuật viên');

                const data = await res.json();
                select.innerHTML = '<option value="">-- Chọn kỹ thuật viên --</option>';

                (data || []).forEach(t => {
                    const op = document.createElement('option');
                    const techId = t.userID || t.id || '';
                    op.value = techId;
                    op.textContent = t.name || t.fullName || t.userName || ('Tech #' + techId);
                    select.appendChild(op);
                });

                if (selectedTechnicianId) {
                    select.value = selectedTechnicianId;
                }
            } catch (err) {
                console.error('[TechAssign] loadTechnicianDropdown error:', err);
                select.innerHTML = '<option value="">-- Lỗi tải KTV --</option>';
            }
        }

        async function loadWarrantyServicesDropdown(selectElementId) {
            const select = document.getElementById(selectElementId);
            if (!select) {
                console.error(`[TechAssign] Không tìm thấy select: #${selectElementId}`);
                return;
            }
            select.innerHTML = '<option value="">-- Đang tải dịch vụ... --</option>';

            try {
                const res = await fetch('/evm/api/warranty-claims/warranty-services', {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Không lấy được danh sách dịch vụ');

                const data = await res.json();
                select.innerHTML = '<option value="">-- Chọn dịch vụ --</option>';

                (data || []).forEach(s => {
                    const op = document.createElement('option');
                    op.value = s.serviceID || s.id || '';
                    op.textContent = s.name || ('Service #' + (s.serviceID || s.id));
                    select.appendChild(op);
                });
            } catch (err) {
                console.error('[TechAssign] loadWarrantyServicesDropdown error:', err);
                select.innerHTML = '<option value="">-- Lỗi tải dịch vụ --</option>';
            }
        }

        // ========== LOAD & RENDER DANH SÁCH ==========
        async function loadAllAssignments() {
            if (!claimsTbody) {
                console.warn('[TechAssign] claimsTbody not found');
                return;
            }
            claimsTbody.innerHTML = `<tr><td colspan="5" class="table-placeholder-cell">Đang tải dữ liệu...</td></tr>`;

            try {
                const response = await fetch('/evm/api/warranty-claims/allwc', { credentials: 'include' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();

                assignmentsCache = Array.isArray(data) ? data : [];
                currentPage = 1;
                renderAssignments();
            } catch (error) {
                console.error('[TechAssign] loadAllAssignments error:', error);
                if (claimsTbody)
                    claimsTbody.innerHTML =
                        `<tr><td colspan="5" class="table-placeholder-cell">Lỗi tải dữ liệu: ${escapeHtml(error.message)}</td></tr>`;
                if (paginationInfo) paginationInfo.textContent = 'Hiển thị 0 của 0';
            }
        }

        function renderAssignments() {
            if (!claimsTbody) return;
            claimsTbody.innerHTML = '';

            let list = Array.isArray(assignmentsCache) ? assignmentsCache.slice() : [];

            // --- filter search ---
            const term = (currentSearchTerm || '').trim().toLowerCase();
            if (term) {
                list = list.filter(item => {
                    const claimCode = String(item[0] || '').toLowerCase(); // ClaimID
                    const vin = String(item[1] || '').toLowerCase();       // VIN
                    const techName = String(item[3] || '').toLowerCase();  // technicianName
                    return claimCode.includes(term) || vin.includes(term) || techName.includes(term);
                });
            }

            // --- filter status ---
            if (currentStatusFilter) {
                list = list.filter(item => {
                    const status = String(item[4] || '').toLowerCase();
                    return status === currentStatusFilter.toLowerCase();
                });
            }

            // --- filter date (yyyy-MM-dd) ---
            if (currentDateFilter) {
                list = list.filter(item => {
                    if (!item[2]) return false;
                    const d = new Date(item[2]);
                    const iso = d.toISOString().split('T')[0];
                    return iso === currentDateFilter;
                });
            }

            const total = list.length;
            const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

            if (currentPage > totalPages) currentPage = totalPages;
            if (currentPage < 1) currentPage = 1;

            const startIndex = (currentPage - 1) * PAGE_SIZE;
            const endIndex = startIndex + PAGE_SIZE;
            const pageItems = list.slice(startIndex, endIndex);

            // --- cập nhật "Hiển thị X của Y" ---
            if (paginationInfo) {
                paginationInfo.textContent = `Hiển thị ${pageItems.length} của ${total}`;
            }

            // --- cập nhật số trang + disable nút ---
            if (pageBtn) {
                pageBtn.textContent = String(currentPage);
            }
            if (prevBtn) prevBtn.disabled = currentPage <= 1;
            if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

            if (!pageItems.length) {
                claimsTbody.innerHTML =
                    `<tr><td colspan="5" class="table-placeholder-cell">Không tìm thấy yêu cầu nào.</td></tr>`;
                return;
            }

            pageItems.forEach(item => {
                const code = item[0] || 'N/A';
                const vin = item[1] || 'N/A';
                const dateObj = item[2] ? new Date(item[2]) : null;
                const dateDisplay = dateObj ? dateObj.toLocaleDateString('vi-VN') : 'N/A';
                const dateIso = dateObj ? dateObj.toISOString().split('T')[0] : '';
                const technicianName = item[3] || 'N/A';
                const status = item[4] || 'unknown';

                const row = document.createElement('tr');
                if (dateIso) row.dataset.date = dateIso;
                row.dataset.status = status;

                row.innerHTML = `
                    <td>${escapeHtml(code)}</td>
                    <td>${escapeHtml(vin)}</td>
                    <td>${escapeHtml(dateDisplay)}</td>
                    <td>${escapeHtml(technicianName)}</td>
                    <td>
                        <button class="btn-action btn-edit" data-id="${escapeHtml(code)}">Sửa</button>
                        <button class="btn-action btn-delete" data-id="${escapeHtml(code)}">Xóa</button>
                    </td>
                `;
                claimsTbody.appendChild(row);
            });
        }

        // ========== FILTER EVENTS ==========
        function onSearchChange() {
            currentSearchTerm = searchBox ? searchBox.value : '';
            currentPage = 1;
            renderAssignments();
        }

        function onStatusChange() {
            currentStatusFilter = statusFilter ? statusFilter.value : '';
            currentPage = 1;
            renderAssignments();
        }

        function onDateChange() {
            currentDateFilter = dateFilter ? dateFilter.value : '';
            currentPage = 1;
            renderAssignments();
        }

        searchBox && searchBox.addEventListener('input', onSearchChange);
        statusFilter && statusFilter.addEventListener('change', onStatusChange);
        dateFilter && dateFilter.addEventListener('change', onDateChange);

        // ========== PAGINATION BUTTONS ==========
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                if (currentPage > 1) {
                    currentPage--;
                    renderAssignments();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                currentPage++;
                renderAssignments();
            });
        }

        // ========== MODAL SỬA (assignModal) ==========
        function openAssignModal(claimId, claimCode) {
            if (!assignModal) return;
            console.warn('[TechAssign] Mở modal "Sửa" (chưa implement UPDATE claim/service).');
            if (assignForm) assignForm.reset();
            const claimIdInput = document.getElementById('assignClaimId');
            const claimCodeSpan = document.getElementById('assignClaimCode');
            if (claimIdInput) claimIdInput.value = claimId || '';
            if (claimCodeSpan) claimCodeSpan.textContent = claimCode || '';
            assignModal.style.display = 'flex';
            document.body.classList.add('modal-open');
            loadTechnicianDropdown('techSelect', null);
        }

        function closeAssignModal() {
            if (!assignModal) return;
            assignModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }

        assignModalClose && assignModalClose.addEventListener('click', closeAssignModal);
        assignCancelBtn && assignCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeAssignModal();
        });

        // ========== MODAL GIAO VIỆC MỚI ==========
        function openNewReqModal() {
            if (!newReqModal) return;
            newReqModal.style.display = 'block';
            document.body.classList.add('modal-open');
            newReqForm && newReqForm.reset();

            loadTechnicianDropdown('technician_name', null);
            loadWarrantyServicesDropdown('warranty_service');
        }

        function closeNewReqModal() {
            if (!newReqModal) return;
            newReqModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            newReqForm && newReqForm.reset();
        }

        btnOpenNewReq && btnOpenNewReq.addEventListener('click', openNewReqModal);
        newReqCloseBtn && newReqCloseBtn.addEventListener('click', closeNewReqModal);
        newReqCancelBtn && newReqCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeNewReqModal();
        });

        if (newReqForm) {
            newReqForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const warrantyClaimId = document.getElementById('assign_code')?.value?.trim();
                const warrantyServiceId = document.getElementById('warranty_service')?.value;
                const technicianId = document.getElementById('technician_name')?.value;
                const jobDescription = document.getElementById('assign_desc')?.value?.trim();

                if (!warrantyClaimId || !warrantyServiceId || !technicianId || !jobDescription) {
                    alert('Vui lòng nhập đầy đủ: Mã Yêu Cầu, Dịch Vụ, Kỹ Thuật Viên, và Mô Tả.');
                    return;
                }

                const payload = {
                    warrantyClaimId: parseInt(warrantyClaimId, 10),
                    warrantyServiceId: parseInt(warrantyServiceId, 10),
                    technicianId: parseInt(technicianId, 10),
                    jobDescription: jobDescription
                };

                try {
                    console.log('[TechAssign] Gửi payload Giao việc:', payload);

                    const res = await fetch('/evm/api/warranty-claims/assign-task', {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const data = await res.json().catch(() => ({}));

                    if (!res.ok) {
                        throw new Error(data.message || 'Giao việc thất bại');
                    }

                    alert(data.message || 'Giao việc thành công!');
                    closeNewReqModal();
                    loadAllAssignments();

                } catch (err) {
                    console.error('[TechAssign] lỗi giao việc:', err);
                    alert(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
                }
            });
        }

        // ========== DELETE ==========
        async function handleDeleteClaim(claimId) {
            if (!claimId) return;
            if (!confirm(`Bạn có chắc chắn muốn xóa yêu cầu "${claimId}"?`)) {
                return;
            }
            try {
                const response = await fetch(`/evm/api/warranty-claims/delete/${claimId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const message = await response.text();
                if (response.ok) {
                    alert(message || 'Xóa thành công!');
                    loadAllAssignments();
                } else {
                    throw new Error(message || 'Xóa thất bại');
                }
            } catch (err) {
                console.error('Lỗi khi xóa:', err);
                alert(err.message || 'Lỗi server, không thể xóa.');
            }
        }

        if (claimsTbody) {
            claimsTbody.addEventListener('click', function (e) {
                const target = e.target;

                if (target.classList.contains('btn-xoa')) {
                    handleDeleteClaim(target.dataset.id);
                }

                if (target.classList.contains('btn-sua')) {
                    const claimId = target.dataset.id;
                    openAssignModal(claimId, claimId);
                }
            });
        }

        // ========== ĐÓNG MODAL BẰNG ESC & CLICK RA NGOÀI ==========
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAssignModal();
                closeNewReqModal();
            }
        });

        window.addEventListener('click', (e) => {
            if (e.target === assignModal) closeAssignModal();
            if (e.target === newReqModal) closeNewReqModal();
        });

        // Khởi động: load danh sách
        loadAllAssignments();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTechAssign);
    } else {
        initTechAssign();
    }
})();
