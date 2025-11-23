(function () {
    'use strict';

    // 💡 Hàm tra cứu dịch thuật (giả định)
    const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

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
                console.error(`[TechAssign] ${T('tech.assign.error.select_not_found', 'Không tìm thấy select:')} #${selectElementId}`);
                return;
            }
            // Dịch: Đang tải KTV...
            select.innerHTML = `<option value="">${T('tech.assign.placeholder.loading_tech', '-- Đang tải KTV... --')}</option>`;

            try {
                const res = await fetch('/evm/api/warranty-claims/technicians', {
                    credentials: 'include'
                });
                // Dịch: Không lấy được danh sách kỹ thuật viên
                if (!res.ok) throw new Error(T('tech.assign.error.load_tech_failed', 'Không lấy được danh sách kỹ thuật viên'));

                const data = await res.json();
                // Dịch: Chọn kỹ thuật viên
                select.innerHTML = `<option value="">${T('tech.assign.placeholder.select_tech', '-- Chọn kỹ thuật viên --')}</option>`;

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
                // Dịch: Lỗi tải KTV
                select.innerHTML = `<option value="">${T('tech.assign.error.load_tech_placeholder', '-- Lỗi tải KTV --')}</option>`;
            }
        }

        async function loadWarrantyServicesDropdown(selectElementId) {
            const select = document.getElementById(selectElementId);
            if (!select) {
                console.error(`[TechAssign] ${T('tech.assign.error.select_not_found', 'Không tìm thấy select:')} #${selectElementId}`);
                return;
            }
            // Dịch: Đang tải dịch vụ...
            select.innerHTML = `<option value="">${T('tech.assign.placeholder.loading_service', '-- Đang tải dịch vụ... --')}</option>`;

            try {
                const res = await fetch('/evm/api/warranty-claims/warranty-services', {
                    credentials: 'include'
                });
                // Dịch: Không lấy được danh sách dịch vụ
                if (!res.ok) throw new Error(T('tech.assign.error.load_service_failed', 'Không lấy được danh sách dịch vụ'));

                const data = await res.json();
                // Dịch: Chọn dịch vụ
                select.innerHTML = `<option value="">${T('tech.assign.placeholder.select_service', '-- Chọn dịch vụ --')}</option>`;

                (data || []).forEach(s => {
                    const op = document.createElement('option');
                    op.value = s.serviceID || s.id || '';
                    op.textContent = s.name || ('Service #' + (s.serviceID || s.id));
                    select.appendChild(op);
                });
            } catch (err) {
                console.error('[TechAssign] loadWarrantyServicesDropdown error:', err);
                 // Dịch: Lỗi tải dịch vụ
                select.innerHTML = `<option value="">${T('tech.assign.error.load_service_placeholder', '-- Lỗi tải dịch vụ --')}</option>`;
            }
        }

        // ========== LOAD & RENDER DANH SÁCH ==========
        async function loadAllAssignments() {
            if (!claimsTbody) {
                console.warn('[TechAssign] claimsTbody not found');
                return;
            }
            // Dịch: Đang tải dữ liệu...
            claimsTbody.innerHTML = `<tr><td colspan="5" class="table-placeholder-cell">${T('message.loading_data', 'Đang tải dữ liệu...')}</td></tr>`;

            try {
                const response = await fetch('/evm/api/warranty-claims/allwc', { credentials: 'include' });
                // Dịch: Lỗi tải danh sách yêu cầu
                if (!response.ok) throw new Error(T('tech.assign.error.load_claims_failed', `HTTP ${response.status}`));
                const data = await response.json();

                assignmentsCache = Array.isArray(data) ? data : [];
                currentPage = 1;
                renderAssignments();
            } catch (error) {
                console.error('[TechAssign] loadAllAssignments error:', error);
                // Dịch: Lỗi tải dữ liệu: [message]
                if (claimsTbody)
                    claimsTbody.innerHTML =
                        `<tr><td colspan="5" class="table-placeholder-cell">${T('tech.assign.error.load_data', 'Lỗi tải dữ liệu:')} ${escapeHtml(error.message)}</td></tr>`;
                if (paginationInfo) paginationInfo.textContent = T('pagination.display_info', 'Hiển thị 0 của 0');
            }
        }

        function renderAssignments() {
            if (!claimsTbody) return;
            claimsTbody.innerHTML = '';

            let list = Array.isArray(assignmentsCache) ? assignmentsCache.slice() : [];

            // --- filter logic (Giữ nguyên) ---

            const term = (currentSearchTerm || '').trim().toLowerCase();
            if (term) {
                list = list.filter(item => {
                    const claimCode = String(item[0] || '').toLowerCase();
                    const vin = String(item[1] || '').toLowerCase();
                    const techName = String(item[3] || '').toLowerCase();
                    return claimCode.includes(term) || vin.includes(term) || techName.includes(term);
                });
            }
            if (currentStatusFilter) {
                list = list.filter(item => {
                    const status = String(item[4] || '').toLowerCase();
                    return status === currentStatusFilter.toLowerCase();
                });
            }
            if (currentDateFilter) {
                list = list.filter(item => {
                    if (!item[2]) return false;
                    const d = new Date(item[2]);
                    const iso = d.toISOString().split('T')[0];
                    return iso === currentDateFilter;
                });
            }
            // --- end filter logic ---


            const total = list.length;
            const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

            if (currentPage > totalPages) currentPage = totalPages;
            if (currentPage < 1) currentPage = 1;

            const startIndex = (currentPage - 1) * PAGE_SIZE;
            const endIndex = startIndex + PAGE_SIZE;
            const pageItems = list.slice(startIndex, endIndex);

            // --- cập nhật "Hiển thị X của Y" ---
            if (paginationInfo) {
                paginationInfo.textContent = T('pagination.display_info_of', 'Hiển thị %s của %s')
                                                .replace('%s', `${pageItems.length}`)
                                                .replace('%s', total);
            }

            // --- cập nhật số trang + disable nút ---
            if (pageBtn) {
                pageBtn.textContent = String(currentPage);
            }
            if (prevBtn) prevBtn.disabled = currentPage <= 1;
            if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

            // Dịch: Nhãn nút
            const editBtnText = T('button.edit', 'Sửa');
            const deleteBtnText = T('button.delete', 'Xóa');


            if (!pageItems.length) {
                // Dịch: Không tìm thấy yêu cầu nào.
                claimsTbody.innerHTML =
                    `<tr><td colspan="5" class="table-placeholder-cell">${T('tech.assign.table.no_data', 'Không tìm thấy yêu cầu nào.')}</td></tr>`;
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
                        <button class="btn-action btn-edit btn-sua" data-id="${escapeHtml(code)}">${editBtnText}</button>
                        <button class="btn-action btn-delete btn-xoa" data-id="${escapeHtml(code)}">${deleteBtnText}</button>
                    </td>
                `;
                claimsTbody.appendChild(row);
            });
        }

        // ========== FILTER EVENTS (Giữ nguyên) ==========
        function onSearchChange() { /* ... */ }
        function onStatusChange() { /* ... */ }
        function onDateChange() { /* ... */ }

        // ... (Giữ nguyên các event listeners cho filter/pagination) ...

        // ========== MODAL SỬA (assignModal) ==========
        function openAssignModal(claimId, claimCode) {
            if (!assignModal) return;
            // Dịch: Tiêu đề modal sửa
            const title = T('tech.assign.modal.assign_title', 'Phân công Kỹ thuật viên');
            document.getElementById('assignModalTitle').textContent = title;

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

        // ... (Giữ nguyên modal close listeners) ...

        // ========== MODAL GIAO VIỆC MỚI ==========
        function openNewReqModal() {
            if (!newReqModal) return;

            // Dịch: Tiêu đề modal tạo mới
            const title = T('tech.assign.modal.new_request_title', 'Tạo yêu cầu điều phối mới');
            newReqModal.querySelector('.technician-assign__title').textContent = title;

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

        // ... (Giữ nguyên event listeners cho modal tạo mới) ...

        if (newReqForm) {
            newReqForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const warrantyClaimId = document.getElementById('assign_code')?.value?.trim();
                const warrantyServiceId = document.getElementById('warranty_service')?.value;
                const technicianId = document.getElementById('technician_name')?.value;
                const jobDescription = document.getElementById('assign_desc')?.value?.trim();

                // Dịch: Cảnh báo validation
                if (!warrantyClaimId || !warrantyServiceId || !technicianId || !jobDescription) {
                    alert(T('tech.assign.alert.validate_required', 'Vui lòng nhập đầy đủ: Mã Yêu Cầu, Dịch Vụ, Kỹ Thuật Viên, và Mô Tả.'));
                    return;
                }

                const payload = { /* ... */ };

                try {
                    // Dịch: Nhãn nút đang xử lý
                    e.target.querySelector('button[type="submit"]').textContent = T('form.processing', 'Đang xử lý...');

                    const res = await fetch('/evm/api/warranty-claims/assign-task', { /* ... */ });
                    const data = await res.json().catch(() => ({}));

                    // Dịch: Lỗi giao việc
                    if (!res.ok) {
                        throw new Error(data.message || T('tech.assign.error.submit_failed', 'Giao việc thất bại'));
                    }

                    // Dịch: Thành công
                    alert(data.message || T('form.success', 'Giao việc thành công!'));
                    closeNewReqModal();
                    loadAllAssignments();

                } catch (err) {
                    console.error('[TechAssign] lỗi giao việc:', err);
                    alert(err.message || T('tech.assign.error.submit_alert', 'Có lỗi xảy ra, vui lòng thử lại'));
                } finally {
                    e.target.querySelector('button[type="submit"]').textContent = T('button.create', 'Tạo');
                    e.target.querySelector('button[type="submit"]').disabled = false;
                }
            });
        }

        // ========== DELETE (Đã sửa để dùng khóa dịch) ==========
        async function handleDeleteClaim(claimId) {
            // Dịch: Xác nhận xóa
            if (!confirm(T('tech.assign.alert.confirm_delete', `Bạn có chắc chắn muốn xóa yêu cầu "${claimId}"?`))) {
                return;
            }
            try {
                // ... (API call)
                const response = await fetch(`/evm/api/warranty-claims/delete/${claimId}`, { method: 'DELETE', credentials: 'include' });
                const message = await response.text();
                if (response.ok) {
                    // Dịch: Xóa thành công
                    alert(message || T('tech.assign.alert.delete_success', 'Xóa thành công!'));
                    loadAllAssignments();
                } else {
                    // Dịch: Xóa thất bại
                    throw new Error(message || T('tech.assign.error.delete_failed', 'Xóa thất bại'));
                }
            } catch (err) {
                console.error('Lỗi khi xóa:', err);
                // Dịch: Lỗi server, không thể xóa.
                alert(err.message || T('tech.assign.error.server_delete', 'Lỗi server, không thể xóa.'));
            }
        }

        if (claimsTbody) {
            claimsTbody.addEventListener('click', function (e) {
                const target = e.target;
                const deleteBtn = target.closest('.btn-delete.btn-xoa'); // Dùng class delete
                const editBtn = target.closest('.btn-edit.btn-sua'); // Dùng class edit

                if (deleteBtn) {
                    handleDeleteClaim(deleteBtn.dataset.id);
                }

                if (editBtn) {
                    const claimId = editBtn.dataset.id;
                    openAssignModal(claimId, claimId);
                }
            });
        }


        loadAllAssignments();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTechAssign);
    } else {
        initTechAssign();
    }
})();