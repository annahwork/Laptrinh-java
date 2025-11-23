(function () {
    'use strict';
    console.log('claim_requests.js loaded with Custom Styles');

    // ============================================================
    // 1. INJECT CSS (Giữ nguyên)
    // ============================================================
    const styleId = 'claim-custom-styles';
    if (!document.getElementById(styleId)) {
        // ... (Giữ nguyên đoạn tạo và inject CSS) ...
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* Căn giữa nút trong cột cuối */
            #claimTableBody td:last-child {
                display: flex !important;
                gap: 8px !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 10px !important;
            }

            /* Style chung cho nút hành động */
            #claimTableBody .btn-action {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 6px 12px !important;
                font-size: 13px !important;
                font-weight: 600 !important;
                border-radius: 6px !important;
                border: 1px solid transparent !important;
                cursor: pointer !important;
                color: white !important;
                line-height: 1.2 !important;
                box-shadow: 0 1px 2px rgba(0,0,0,0.15) !important;
                transition: all 0.2s ease !important;
                min-width: 70px !important; /* Độ rộng tối thiểu để nút đều nhau */
            }

            /* Nút DUYỆT - Màu Xanh Lá */
            #claimTableBody .btn-approve {
                background-color: #10b981 !important; /* Emerald-500 */
            }
            #claimTableBody .btn-approve:hover {
                background-color: #059669 !important; /* Emerald-600 */
                transform: translateY(-2px);
                box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3) !important;
            }

            /* Nút TỪ CHỐI - Màu Đỏ */
            #claimTableBody .btn-reject {
                background-color: #ef4444 !important; /* Red-500 */
            }
            #claimTableBody .btn-reject:hover {
                background-color: #dc2626 !important; /* Red-600 */
                transform: translateY(-2px);
                box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================================
    // 2. LOGIC JAVASCRIPT CHÍNH
    // ============================================================

    // 💡 Hàm tra cứu dịch thuật
    const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

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

    let currentClaimId = null;

    /**
     * Tải danh sách các claim đang chờ
     */
    async function loadPendingClaims() {
        if (!tableBody) return;
        // 💡 Dịch: Đang tải dữ liệu...
        tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="text-align:center; padding:20px;">${T('message.loading_data', 'Đang tải dữ liệu...')}</td></tr>`;

        try {
            const response = await fetch(API_PENDING);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.message || T('claim.requests.loading_error', 'Lỗi tải dữ liệu')}`);
            }
            const claims = await response.json();
            renderTable(claims);

        } catch (error) {
            console.error('Lỗi tải danh sách chờ duyệt:', error);
            // 💡 Dịch: Lỗi tải dữ liệu
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="color: red; text-align:center; padding:20px;">${error.message}</td></tr>`;
        }
    }

    /**
     * Hiển thị dữ liệu lên bảng
     */
    function renderTable(claims) {
        tableBody.innerHTML = ''; // Xóa sạch
        if (!claims || claims.length === 0) {
            // 💡 Dịch: Không có yêu cầu nào chờ duyệt.
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="text-align:center; padding:20px;">${T('claim.requests.no_data', 'Không có yêu cầu nào chờ duyệt.')}</td></tr>`;
            return;
        }

        const approveText = T('button.approve', 'Duyệt');
        const rejectText = T('button.reject', 'Từ chối');

        claims.forEach(claim => {
            const row = document.createElement('tr');

            // Mapping badge style (tùy chọn, giữ nguyên logic cũ của bạn)
            let statusClass = '';
            if (claim.status === 'Pending' || claim.status === 'Đã gửi') {
                statusClass = 'status-pending';
            }

            const rawId = claim.claimId.replace('CR-', '');

            row.innerHTML = `
                <td style="text-align:center;">${claim.claimId}</td>
                <td style="text-align:center;">${claim.vin}</td>
                <td>${claim.requester}</td>
                <td style="text-align:center;">${claim.date}</td>
                <td style="text-align:center;"><span class="status-badge ${statusClass}">${claim.status}</span></td>
                <td>
                    <button class="btn-action btn-approve" data-id="${rawId}" data-details="${claim.vin} - ${claim.requester}" data-action="approve">
                        ${approveText}
                    </button>

                    <button class="btn-action btn-reject" data-id="${rawId}" data-details="${claim.vin} - ${claim.requester}" data-action="reject">
                        ${rejectText}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        tableBody.querySelectorAll('.btn-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const btn = e.currentTarget;
                const id = btn.dataset.id;
                const details = btn.dataset.details;
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

        if (modal) {
            modal.style.display = 'block';
        }
    }

    /**
     * Đóng modal
     */
    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
        }
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

        // 💡 Dịch: Vui lòng nhập lý do khi TỪ CHỐI yêu cầu.
        if (action === 'reject' && (!note || note.trim() === '')) {
            alert(T('form.approval.reject_reason_required', 'Vui lòng nhập lý do khi TỪ CHỐI yêu cầu.'));
            approvalNote.focus();
            return;
        }

        const submitBtn = event.submitter;
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        // 💡 Dịch: Đang xử lý...
        submitBtn.textContent = T('form.processing', 'Đang xử lý...');

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note: note })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || T('form.failed', 'Xử lý thất bại'));
            }

            // 💡 Dịch: Thành công!
            alert(result.message || T('form.success', 'Thành công!'));
            closeModal();
            loadPendingClaims(); // Tải lại bảng

        } catch (error) {
            console.error('Lỗi khi xử lý:', error);
            // 💡 Dịch: Lỗi:
            alert(`${T('form.failed', 'Lỗi')}: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // --- Gắn các sự kiện ---
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (form) form.addEventListener('submit', handleApproval);

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    setTimeout(loadPendingClaims, 100);

})();