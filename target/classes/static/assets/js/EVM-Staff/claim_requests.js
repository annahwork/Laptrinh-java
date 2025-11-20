(function () {
    'use strict';
    console.log('claim_requests.js loaded with Custom Styles');

    // ============================================================
    // 1. INJECT CSS (Style riêng cho bảng Claim)
    // ============================================================
    const styleId = 'claim-custom-styles';
    if (!document.getElementById(styleId)) {
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
    // const btnApprove = document.getElementById('btnApprove'); // Không cần select global
    // const btnReject = document.getElementById('btnReject'); // Không cần select global

    let currentClaimId = null;

    /**
     * Tải danh sách các claim đang chờ
     */
    async function loadPendingClaims() {
        if (!tableBody) return;
        tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="text-align:center; padding:20px;">Đang tải dữ liệu...</td></tr>`;

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
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="color: red; text-align:center; padding:20px;">${error.message}</td></tr>`;
        }
    }

    /**
     * Hiển thị dữ liệu lên bảng
     */
    function renderTable(claims) {
        tableBody.innerHTML = ''; // Xóa sạch
        if (!claims || claims.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="text-align:center; padding:20px;">Không có yêu cầu nào chờ duyệt.</td></tr>`;
            return;
        }

        claims.forEach(claim => {
            const row = document.createElement('tr');
            
            // Mapping badge style (tùy chọn, giữ nguyên logic cũ của bạn)
            let statusClass = '';
            if (claim.status === 'Pending' || claim.status === 'Đã gửi') {
                statusClass = 'status-pending'; // Bạn có thể đổi thành badge--warning nếu muốn
            }

            // Format hiển thị ID (bỏ 'CR-')
            const rawId = claim.claimId.replace('CR-', '');

            row.innerHTML = `
                <td style="text-align:center;">${claim.claimId}</td>
                <td style="text-align:center;">${claim.vin}</td>
                <td>${claim.requester}</td>
                <td style="text-align:center;">${claim.date}</td>
                <td style="text-align:center;"><span class="status-badge ${statusClass}">${claim.status}</span></td>
                <td>
                    <button class="btn-action btn-approve" data-id="${rawId}" data-details="${claim.vin} - ${claim.requester}" data-action="approve">
                        Duyệt
                    </button>
                    
                    <button class="btn-action btn-reject" data-id="${rawId}" data-details="${claim.vin} - ${claim.requester}" data-action="reject">
                        Từ chối
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Gắn sự kiện cho các nút mới
        tableBody.querySelectorAll('.btn-action').forEach(button => {
            button.addEventListener('click', (e) => {
                // Lấy dataset từ chính button (e.target có thể là icon bên trong nếu có, nên dùng closest hoặc e.currentTarget cho chắc chắn)
                const btn = e.currentTarget; 
                const id = btn.dataset.id;
                const details = btn.dataset.details;
                
                // Mở modal, ta có thể truyền thêm action nếu muốn modal biết đang bấm nút nào
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
        
        // Hiển thị modal
        if (modal) {
            modal.style.display = 'block'; // Hoặc 'flex' tùy CSS modal của bạn
            // Nếu bạn dùng class show như bài trước: modal.classList.add('show');
        }
    }

    /**
     * Đóng modal
     */
    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            // modal.classList.remove('show');
        }
        currentClaimId = null;
    }

    /**
     * Gửi yêu cầu Duyệt hoặc Từ chối
     */
    async function handleApproval(event) {
        event.preventDefault();
        const note = approvalNote.value;
        
        // Xác định hành động dựa trên nút submit nào được bấm trong Modal
        const action = event.submitter.id === 'btnApprove' ? 'approve' : 'reject';
        
        // Build URL (Giả sử API nhận ID trần, nếu API cần 'CR-' thì phải thêm vào)
        const url = action === 'approve' ? `${API_APPROVE}/${currentClaimId}` : `${API_REJECT}/${currentClaimId}`;

        if (action === 'reject' && (!note || note.trim() === '')) {
            alert('Vui lòng nhập lý do khi TỪ CHỐI yêu cầu.');
            approvalNote.focus();
            return;
        }

        const submitBtn = event.submitter;
        const originalText = submitBtn.textContent;
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
            submitBtn.textContent = originalText;
        }
    }

    // --- Gắn các sự kiện ---
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (form) form.addEventListener('submit', handleApproval);

    // Đóng modal khi click ra ngoài
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Tải dữ liệu lần đầu sau 1 khoảng ngắn để DOM ổn định
    setTimeout(loadPendingClaims, 100);

})();