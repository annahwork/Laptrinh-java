(function () {
    'use strict';
    console.log('claim_requests.js loaded');

    // API Endpoints
    const API_BASE_URL = (window.contextPath || '/evm/') + 'api/evm_staff/claims';
    const API_PENDING = `${API_BASE_URL}/pending`;
    const API_APPROVE = `${API_BASE_URL}/approve`;
    const API_REJECT = `${API_BASE_URL}/reject`;

    // DOM Elements
    const tableBody = document.getElementById('claimTableBody');
    
    // Modal Elements
    const modal = document.getElementById('approvalModal');
    const closeModalBtn = document.getElementById('closeApprovalModal');
    const form = document.getElementById('approvalForm');
    const modalClaimIdSpan = document.getElementById('modalClaimId');
    const modalClaimDetailsSpan = document.getElementById('modalClaimDetails');
    const modalClaimIdInput = document.getElementById('modalClaimIdInput');
    const approvalNote = document.getElementById('approvalNote');
    const btnApprove = document.getElementById('btnApprove');
    const btnReject = document.getElementById('btnReject');

    let currentClaimId = null;

    /**
     * Tải danh sách các claim đang chờ
     */
    async function loadPendingClaims() {
        if (!tableBody) return;
        tableBody.innerHTML = `<tr><td colspan="6" class="no-data">Đang tải dữ liệu...</td></tr>`;

        try {
            const response = await fetch(API_PENDING);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.message || 'Lỗi tải dữ liệu'}`);
            }
            const claims = await response.json();
            renderTable(claims);

        } catch (error) {
            console.error('Lỗi tải danh sách chờ duyệt:', error);
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="color: red;">${error.message}</td></tr>`;
        }
    }

    /**
     * Hiển thị dữ liệu lên bảng
     */
    function renderTable(claims) {
        tableBody.innerHTML = ''; // Xóa sạch
        if (!claims || claims.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data">Không có yêu cầu nào chờ duyệt.</td></tr>`;
            return;
        }

        claims.forEach(claim => {
            const row = document.createElement('tr');
            // Thêm class dựa trên trạng thái
            let statusClass = '';
            if (claim.status === 'Pending' || claim.status === 'Đã gửi') {
                statusClass = 'status-pending';
            }

            row.innerHTML = `
                <td>${claim.claimId}</td>
                <td>${claim.vin}</td>
                <td>${claim.requester}</td>
                <td>${claim.date}</td>
                <td><span class="status-badge ${statusClass}">${claim.status}</span></td>
                <td>
                    <button class="btn-action" data-id="${claim.claimId.replace('CR-', '')}" data-details="${claim.vin} - ${claim.requester}">
                        Duyệt / Từ chối
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Gắn sự kiện cho các nút mới
        tableBody.querySelectorAll('.btn-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const details = e.target.dataset.details;
                openApprovalModal(id, details);
            });
        });
    }

    /**
     * Mở modal duyệt/từ chối
     */
    function openApprovalModal(claimId, details) {
        currentClaimId = claimId;
        modalClaimIdSpan.textContent = `(CR-${claimId})`;
        modalClaimDetailsSpan.textContent = details;
        modalClaimIdInput.value = claimId;
        approvalNote.value = ''; // Xóa note cũ
        modal.style.display = 'block';
    }

    /**
     * Đóng modal
     */
    function closeModal() {
        modal.style.display = 'none';
        currentClaimId = null;
    }

    /**
     * Gửi yêu cầu Duyệt hoặc Từ chối
     */
    async function handleApproval(event) {
        event.preventDefault();
        const note = approvalNote.value;
        const action = event.submitter.id === 'btnApprove' ? 'approve' : 'reject';
        const url = action === 'approve' ? `${API_APPROVE}/${currentClaimId}` : `${API_REJECT}/${currentClaimId}`;

        if (action === 'reject' && (!note || note.trim() === '')) {
            alert('Vui lòng nhập lý do khi TỪ CHỐI yêu cầu.');
            approvalNote.focus();
            return;
        }

        const submitBtn = event.submitter;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang xử lý...';

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note: note })
            });
            
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Xử lý thất bại');
            }

            alert(result.message || 'Thành công!');
            closeModal();
            loadPendingClaims(); // Tải lại bảng

        } catch (error) {
            console.error('Lỗi khi xử lý:', error);
            alert(`Lỗi: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = action === 'approve' ? 'Duyệt' : 'Từ chối';
        }
    }

    // --- Gắn các sự kiện ---
    closeModalBtn.addEventListener('click', closeModal);
    form.addEventListener('submit', handleApproval);

    // Đóng modal khi click ra ngoài
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Tải dữ liệu lần đầu
    loadPendingClaims();

})();