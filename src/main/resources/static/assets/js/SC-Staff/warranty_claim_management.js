(function () {
    'use strict';
    console.log('Warranty Claim Management script loaded');

    const API_CLAIMS_BASE = '/evm/api/warranty-claims';
    const PAGE_SIZE = 5;

    let allClaims = [];
    let currentFilteredClaims = [];
    let currentPage = 1;
    let currentEditingClaimId = null;

    function parseVietnameseDate(dateString) {
        if (!dateString || dateString === 'N/A') return null;
        try {
            const parts = dateString.split('/'); 
            if (parts.length !== 3) return null;
            return new Date(parts[2], parts[1] - 1, parts[0]);
        } catch (e) {
            console.error('Không thể phân tích ngày:', dateString, e);
            return null;
        }
    }


    function renderClaims(claimsToRender) {
        const tableBody = document.getElementById('claimsTbody');
        if (!tableBody) {
            console.error('Không tìm thấy #claimsTbody');
            return;
        }
        tableBody.innerHTML = '';

        if (!claimsToRender || claimsToRender.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell">Không tìm thấy yêu cầu nào khớp.</td></tr>`;
            return;
        }

        claimsToRender.forEach(claim => {
            const vin = claim.vin || 'N/A';
            const claimId = claim.claimId || 'N/A';
            
            const dateObj = parseVietnameseDate(claim.date);
            const date = dateObj ? dateObj.toLocaleDateString('vi-VN') : 'N/A';
            
            const status = claim.status || 'N/A';
            const description = claim.description || 'N/A'; 

            const row = document.createElement('tr');
            
            row.innerHTML = `
            <td>${claimId}</td>
            <td>${vin}</td>
            <td>${description}</td>
            <td>${date}</td>
            <td>${status}</td>
            <td>
                <button class="btn-sua" data-id="${claimId}">Sửa</button>
                <button class="btn-xoa" data-id="${claimId}">Xóa</button>
            </td>`;
            tableBody.appendChild(row);
        });
    }

    async function loadAllClaims() {
        const tableBody = document.getElementById('claimsTbody');
        if (!tableBody) {
            console.warn('claimsTbody not found, retrying in 500ms');
            setTimeout(loadAllClaims, 500);
            return;
        }
        tableBody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell">Đang tải dữ liệu...</td></tr>`;
        try {
            const url = `${API_CLAIMS_BASE}/all`;
            
            const response = await fetch(url, { credentials: 'include' }); 
            
            if (response.status === 401) {
                 throw new Error('Chưa đăng nhập hoặc không có quyền.');
            }
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API trả về:', data);
            
            allClaims = data;
            currentFilteredClaims = data;
            
            filterAndRenderClaims(); 
            
        } catch (error) {
            if (tableBody)
                tableBody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
        }
    }

    function filterAndRenderClaims() {
        const searchValue = document.getElementById('searchBox')?.value.trim().toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const dateFilterValue = document.getElementById('dateFilter')?.value || '';
        const filterDateObj = dateFilterValue ? new Date(dateFilterValue) : null;

        if (!searchValue && !statusFilter && !filterDateObj) { 
            currentFilteredClaims = allClaims;
        } else {
            currentFilteredClaims = allClaims.filter(claim => {
                const matchesStatus = statusFilter ? claim.status === statusFilter : true;
                
                const matchesSearch = searchValue ?
                    (
                        (claim.vin && claim.vin.toLowerCase().includes(searchValue))
                        || (claim.claimId && claim.claimId.toString().toLowerCase().includes(searchValue)) 
                        || (claim.status && claim.status.toLowerCase().includes(searchValue))
                        || (claim.description && claim.description.toLowerCase().includes(searchValue))
                        || (claim.requester && claim.requester.toLowerCase().includes(searchValue))
                    )
                    : true;
                
                let matchesDate = true;
                if (filterDateObj) {
                    const claimDateObj = parseVietnameseDate(claim.date);
                    if (!claimDateObj) {
                        matchesDate = false; 
                    } else {
                        matchesDate = claimDateObj.getFullYear() === filterDateObj.getFullYear() &&
                                      claimDateObj.getMonth() === filterDateObj.getMonth() &&
                                      claimDateObj.getDate() === filterDateObj.getDate();
                    }
                }

                return matchesStatus && matchesSearch && matchesDate;
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

    async function openWarrantyModal(claimId = null) {
        const modal = document.getElementById('modalYeuCauBaoHanh');
        const form = modal.querySelector('.warranty-claim__form');
        const codeInput = document.getElementById('warranty_code');
        form.reset();
        
        currentEditingClaimId = claimId; 

        if (claimId === null) {
            if (codeInput) codeInput.disabled = false;
            modal.style.display = 'block';
        } else {
            try {
                const idAsNumber = parseInt(String(claimId).replace('CR-', ''), 10);
                if (isNaN(idAsNumber)) {
                    throw new Error("Mã claim không hợp lệ: " + claimId);
                }

                const response = await fetch(`${API_CLAIMS_BASE}/getbyID/${idAsNumber}`, { credentials: 'include' });
                if (!response.ok) throw new Error('Không tải được chi tiết yêu cầu');
                const claim = await response.json();  

                document.getElementById('warranty_code').value = claim.claimID || ''; 
                document.getElementById('warranty_vin').value = (claim.vehicle ? claim.vehicle.vin : '') || '';
                document.getElementById('warranty_desc').value = claim.description || '';
                document.getElementById('warranty_status').value = claim.status || 'pending';
                
                if (codeInput) codeInput.disabled = true; 
                modal.style.display = 'block';
            } catch (error) {
                alert('Lỗi tải chi tiết yêu cầu: ' + error.message);
            }
        }
    }

    function closeWarrantyModal() {
        const modal = document.getElementById('modalYeuCauBaoHanh');
        if (modal) modal.style.display = 'none';
    }
    async function submitWarrantyForm(e) {
        e.preventDefault();

        if (submitWarrantyForm.submitting) return;
        submitWarrantyForm.submitting = true;

        const payload = {
            vehiclePartId: 1, 
            vin: document.getElementById('warranty_vin')?.value || '',
            description: document.getElementById('warranty_desc')?.value || '',
            status: document.getElementById('warranty_status')?.value || 'pending',
            attachmentUrl: ''
        };

        if (!payload.vin.trim()) {
            alert('Vui lòng nhập VIN của xe!');
            submitWarrantyForm.submitting = false;
            return;
        }
        if (!payload.description.trim()) {
            alert('Vui lòng nhập mô tả yêu cầu!');
            submitWarrantyForm.submitting = false;
            return;
        }

        let url = '';
        let method = '';
        
        if (currentEditingClaimId) {
            const idAsNumber = parseInt(String(currentEditingClaimId).replace('CR-', ''), 10);
            url = `${API_CLAIMS_BASE}/update/${idAsNumber}`;
            method = 'PUT';
            payload.scStaffId = 2;
        } else {
            url = `${API_CLAIMS_BASE}/create`; 
            method = 'POST';
             payload.scStaffId = 2; 
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(await response.text());
            alert(currentEditingClaimId ? 'Sửa yêu cầu thành công!' : 'Tạo yêu cầu thành công!');
            closeWarrantyModal();
            loadAllClaims();
        } catch (err) {
            console.error('Lỗi khi lưu yêu cầu:', err);
            alert(`Lỗi: ${err.message}`);
        } finally {
            submitWarrantyForm.submitting = false;
        }
    }
    async function handleDelete(claimId) {
        if (!confirm(`M chắc chắn muốn XÓA yêu cầu: ${claimId} không?`)) {
            return;
        }

        try {
            const idAsNumber = parseInt(String(claimId).replace('CR-', ''), 10);
            if (isNaN(idAsNumber)) {
                throw new Error("Mã claim không hợp lệ: " + claimId);
            }

            const response = await fetch(`${API_CLAIMS_BASE}/delete/${idAsNumber}`, { 
                method: 'DELETE',
                credentials: 'include' 
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            alert('Xóa yêu cầu thành công!');
            loadAllClaims(); 
        } catch (err) {
            console.error('Lỗi khi xóa yêu cầu:', err);
            alert(`Lỗi: ${err.message}`);
        }
    }

    function init() {
        document.getElementById('searchBox')?.addEventListener('input', filterAndRenderClaims);
        document.getElementById('statusFilter')?.addEventListener('change', filterAndRenderClaims);
        document.getElementById('dateFilter')?.addEventListener('change', filterAndRenderClaims);


        document.querySelector('.pagination-btn:first-child')?.addEventListener('click', () => {
            if (currentPage > 1) { currentPage--; renderPaginatedClaims(); }
        });
        document.querySelector('.pagination-btn:last-child')?.addEventListener('click', () => {
            if (currentPage * PAGE_SIZE < currentFilteredClaims.length) { currentPage++; renderPaginatedClaims(); }
        });

        document.getElementById('btnMoFormYeuCau')?.addEventListener('click', () => openWarrantyModal(null));
        document.querySelector('.warranty-claim__close-button')?.addEventListener('click', closeWarrantyModal);
        document.getElementById('warrantyCancelBtn')?.addEventListener('click', closeWarrantyModal);
        document.querySelector('.warranty-claim__form')?.addEventListener('submit', submitWarrantyForm);
        
        const tableBody = document.getElementById('claimsTbody');
        if (tableBody) {
             tableBody.addEventListener('click', function (e) {
                const target = e.target;
                const id = target.getAttribute('data-id');
                if (!id) return;

                if (target.classList.contains('btn-xoa')) {
                    handleDelete(id);
                } else if (target.classList.contains('btn-sua')) {
                    openWarrantyModal(id);
                }
            });
        } else {
            console.error('Không tìm thấy #claimsTbody khi init');
        }

        loadAllClaims();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();