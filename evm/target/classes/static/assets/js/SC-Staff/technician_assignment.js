// /evm/assets/js/SC-Staff/technician_assignment.js
(function () {
    'use strict';

    function initTechAssign() {
        console.log('[TechAssign] initTechAssign running');

        // ========== 1. FILTER BẢNG YÊU CẦU ==========
        const searchBox = document.getElementById('searchBox');
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('dateFilter');
        const claimsTbody = document.getElementById('claimsTbody');

        function filterTable() {
            if (!claimsTbody) return;

            const search = (searchBox?.value || '').toLowerCase();
            const status = statusFilter?.value || '';
            const date = dateFilter?.value || '';

            [...claimsTbody.querySelectorAll('tr')].forEach(row => {
                if (row.id === 'placeholderRow') return;

                const text = row.innerText.toLowerCase();
                const matchesSearch = !search || text.includes(search);
                const matchesStatus = !status || row.dataset.status === status;
                const matchesDate = !date || row.dataset.date === date;

                row.style.display = (matchesSearch && matchesStatus && matchesDate) ? '' : 'none';
            });
        }

        searchBox && searchBox.addEventListener('input', filterTable);
        statusFilter && statusFilter.addEventListener('change', filterTable);
        dateFilter && dateFilter.addEventListener('change', filterTable);

        // ========== LOAD ASSIGNMENTS ==========
        async function loadAllAssignments() {
            if (!claimsTbody) {
                console.warn('claimsTbody not found, retrying in 500ms');
                setTimeout(loadAllAssignments, 500);
                return;
            }
            claimsTbody.innerHTML = `<tr><td colspan="5" class="table-placeholder-cell">Đang tải dữ liệu...</td></tr>`;
            try {
                const response = await fetch('/evm/api/technician-assignments', { credentials: 'include' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                console.log('[TechAssign] API trả về assignments:', data);
                renderAssignments(data);
            } catch (error) {
                if (claimsTbody)
                    claimsTbody.innerHTML = `<tr><td colspan="5" class="table-placeholder-cell">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
            }
        }

        function renderAssignments(assignments) {
            if (!claimsTbody) return;
            claimsTbody.innerHTML = '';

            if (!assignments || assignments.length === 0) {
                claimsTbody.innerHTML = `<tr><td colspan="5" class="table-placeholder-cell">Không tìm thấy yêu cầu nào.</td></tr>`;
                return;
            }

            assignments.forEach(assignment => {
                const code = assignment.code || 'N/A';
                const vin = assignment.vin || 'N/A';
                const date = assignment.requestDate ? new Date(assignment.requestDate).toLocaleDateString('vi-VN') : 'N/A';
                const technicianName = assignment.technicianName || 'N/A';

                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${code}</td>
                <td>${vin}</td>
                <td>${date}</td>
                <td>${technicianName}</td>
                <td>
                    <button class="btn-sua" data-id="${assignment.id}">Sửa</button>
                    <button class="btn-xoa" data-id="${assignment.id}">Xóa</button>
                </td>`;
                claimsTbody.appendChild(row);
            });
        }

        // ========== 2. MODAL PHÂN CÔNG KỸ THUẬT VIÊN ==========
        const assignModal = document.getElementById('assignModal');
        const assignModalClose = document.getElementById('assignModalClose');
        const assignCancelBtn = document.getElementById('assignCancelBtn');
        const assignForm = document.getElementById('assignForm');

        // Load kỹ thuật viên cho select trong modal tạo yêu cầu mới
        async function loadTechniciansForNewRequest() {
            const select = document.getElementById('technician_name');
            if (!select) return;

            // reset options mặc định
            select.innerHTML = '<option value="">-- Chọn kỹ thuật viên --</option>';

            try {
                const res = await fetch('/evm/api/technician-assignments/technicians/all', {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Không lấy được danh sách kỹ thuật viên');

                const data = await res.json();

                (data || []).forEach(t => {
                    const op = document.createElement('option');
                    op.value = t.id || t.userID || '';
                    op.textContent =
                        t.name ||
                        t.fullName ||
                        t.userName ||
                        t.username ||
                        ('Tech #' + (t.id || ''));
                    select.appendChild(op);
                });
            } catch (err) {
                console.error('[TechAssign] loadTechniciansForNewRequest error:', err);
                alert(err.message || 'Không load được danh sách kỹ thuật viên');
            }
        }


        function openAssignModal(claimId, claimCode) {
            if (!assignModal) return;
            console.log('[TechAssign] openAssignModal', claimId, claimCode);

            assignModal.style.display = 'flex';
            assignModal.classList.remove('modal-hidden');
            document.body.classList.add('modal-open');

            const idInput = document.getElementById('assignClaimId');
            const codeSpan = document.getElementById('assignClaimCode');
            if (idInput) idInput.value = claimId || '';
            if (codeSpan) codeSpan.textContent = claimCode || '';

            loadTechnicianDropdown();
        }

        function closeAssignModal() {
            if (!assignModal) return;
            assignModal.style.display = 'none';
            assignModal.classList.add('modal-hidden');
            document.body.classList.remove('modal-open');
        }

        // Cho HTML dùng: onclick="openAssignModal('1','CLM-0001')"
        window.openAssignModal = openAssignModal;

        assignModalClose && assignModalClose.addEventListener('click', closeAssignModal);
        assignCancelBtn && assignCancelBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeAssignModal();
        });

        window.addEventListener('click', (e) => {
            if (e.target === assignModal) closeAssignModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeAssignModal();
        });

        // SUBMIT PHÂN CÔNG (có await nên phải async)
        if (assignForm) {
            assignForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const claimId = document.getElementById('assignClaimId')?.value;
                const techId = document.getElementById('techSelect')?.value;
                const note = document.getElementById('assignNote')?.value || '';

                if (!claimId) {
                    alert('Thiếu thông tin yêu cầu!');
                    return;
                }
                if (!techId) {
                    alert('Vui lòng chọn kỹ thuật viên!');
                    return;
                }

                try {
                    // TODO: đổi URL này thành API phân công thật của m
                    const res = await fetch('/evm/api/assign-technician', {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ claimId, techId, note })
                    });

                    const msg = await res.text().catch(() => '');

                    if (!res.ok) {
                        throw new Error(msg || 'Phân công thất bại');
                    }

                    alert(msg || 'Phân công kỹ thuật viên thành công!');
                    closeAssignModal();
                } catch (err) {
                    console.error(err);
                    alert(err.message || 'Có lỗi xảy ra khi phân công');
                }
            });
        }

        // ========== 3. MODAL TẠO YÊU CẦU ĐIỀU PHỐI MỚI ==========
        const btnOpenNewReq = document.getElementById('btntechnician_assignment');
        const newReqModal = document.getElementById('modalYeuCauDieuPhoi');
        const newReqCloseBtn = document.getElementById('newReqCloseBtn');
        const newReqCancelBtn = document.getElementById('assignCancelBtnModal');
        const newReqForm = document.getElementById('newRequestForm');

        function openNewReqModal() {
            if (!newReqModal) return;
            console.log('[TechAssign] openNewReqModal');
            newReqModal.style.display = 'block';
            document.body.classList.add('modal-open');
            newReqForm && newReqForm.reset();

            // load danh sách kỹ thuật viên cho select trong form
            loadTechniciansForNewRequest();
        }

        function closeNewReqModal() {
            if (!newReqModal) return;
            newReqModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            newReqForm && newReqForm.reset();
        }

        btnOpenNewReq && btnOpenNewReq.addEventListener('click', openNewReqModal);
        newReqCloseBtn && newReqCloseBtn.addEventListener('click', closeNewReqModal);
        newReqCancelBtn &&
            newReqCancelBtn.addEventListener('click', function (e) {
                e.preventDefault();
                closeNewReqModal();
            });

        window.addEventListener('click', (e) => {
            if (e.target === newReqModal) closeNewReqModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNewReqModal();
        });

        // SUBMIT TẠO YÊU CẦU MỚI (async + await)
        if (newReqForm) {
            newReqForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const code = document.getElementById('assign_code')?.value?.trim();
                const vin = document.getElementById('vehicle_vin')?.value?.trim();
                const requestDate = document
                    .getElementById('assign_date')
                    ?.value;
                const technicianId = document.getElementById('technician_name')
                    ?.value || null;
                const location = document
                    .getElementById('assign_location')
                    ?.value?.trim();
                const description = document
                    .getElementById('assign_desc')
                    ?.value?.trim();
                const status = document.getElementById('assign_status')
                    ?.value || 'pending';

                if (!code || !vin) {
                    alert('Vui lòng nhập Mã yêu cầu và Biển số/VIN');
                    return;
                }
                if (!technicianId) {
                    alert('Vui lòng chọn kỹ thuật viên phụ trách');
                    return;
                }

                const payload = {
                    code,
                    vin,
                    requestDate,
                    technicianId: Number(technicianId),
                    location,
                    description,
                    status
                };

                try {
                    console.log('[TechAssign] gửi payload tạo yêu cầu:', payload);

                    const res = await fetch(
                        '/evm/api/technician-assignments/create',
                        {
                            method: 'POST',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        }
                    );

                    const data = await res.json().catch(() => ({}));

                    if (!res.ok || data.success === false) {
                        throw new Error(
                            data.message || 'Tạo yêu cầu thất bại'
                        );
                    }

                    alert(
                        data.message ||
                        'Tạo yêu cầu điều phối thành công!'
                    );
                    closeNewReqModal();

                    // Reload assignments
                    loadAllAssignments();
                } catch (err) {
                    console.error('[TechAssign] lỗi tạo yêu cầu:', err);
                    alert(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
                }
            });
        }

        // Load initial data
        loadAllAssignments();
    }

    // SPA: nếu DOMContentLoaded chạy rồi thì init ngay
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTechAssign);
    } else {
        initTechAssign();
    }
})();
