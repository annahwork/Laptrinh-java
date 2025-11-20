(function () {
    'use strict';

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
                    op.textContent = s.name || ('Service #' + s.serviceID);
                    select.appendChild(op);
                });
            } catch (err) {
                console.error('[TechAssign] loadWarrantyServicesDropdown error:', err);
                select.innerHTML = '<option value="">-- Lỗi tải dịch vụ --</option>';
            }
        }

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

            assignments.forEach(item => {
                const code = item[0] || 'N/A'; 
                const vin = item[1] || 'N/A';
                const date = item[2] ? new Date(item[2]).toLocaleDateString('vi-VN') : 'N/A';
                const technicianName = item[3] || 'N/A';
                const status = item[4] || 'unknown'; 

                const row = document.createElement('tr');
                if(item[2]) row.dataset.date = new Date(item[2]).toISOString().split('T')[0];
                row.dataset.status = status;
                
                row.innerHTML = `
                <td>${code}</td>
                <td>${vin}</td>
                <td>${date}</td>
                <td>${technicianName}</td>
                <td>
                    <button class="btn-sua" data-id="${code}">Sửa</button>
                    <button class="btn-xoa" data-id="${code}">Xóa</button>
                </td>`;
                claimsTbody.appendChild(row);
            });
        }
        
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

        function openAssignModal(claimId, claimCode) {
            if (!assignModal) return;
            console.warn('[TechAssign] Mở modal "Sửa". Vui lòng cung cấp controller Java cho việc "UPDATE"');
            assignForm.reset(); 
            document.getElementById('assignClaimId').value = claimId || '';
            document.getElementById('assignClaimCode').textContent = claimCode || '';
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

        function openNewReqModal() {
            if (!newReqModal) return;
            console.log('[TechAssign] openNewReqModal');
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
                    warrantyClaimId: parseInt(warrantyClaimId),
                    warrantyServiceId: parseInt(warrantyServiceId),
                    technicianId: parseInt(technicianId),
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

        loadAllAssignments();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTechAssign);
    } else {
        initTechAssign();
    }
})();