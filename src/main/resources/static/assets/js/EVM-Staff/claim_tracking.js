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
            renderTable(claims);

        } catch (error) {
            console.error('Lỗi tải danh sách claim:', error);
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data" style="color: red;">${error.message}</td></tr>`;
        }
    }


    function renderTable(claims) {
        tableBody.innerHTML = ''; 
        if (!claims || claims.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data">Không có yêu cầu nào.</td></tr>`;
            return;
        }

        claims.forEach(claim => {
            const row = document.createElement('tr');
            
            let statusClass = '';
            const status = claim.status.toLowerCase();
            if (status.includes('pending') || status.includes('đã gửi')) {
                statusClass = 'status-pending';
            } else if (status.includes('approved') || status.includes('được chấp nhận') || status.includes('completed')) {
                statusClass = 'status-success';
            } else if (status.includes('rejected') || status.includes('bị từ chối')) {
                statusClass = 'status-danger';
            }

            row.innerHTML = `
                <td>${claim.claimId}</td>
                <td>${claim.vin}</td>
                <td>${claim.requester}</td>
                <td>${claim.date}</td>
                <td><span class="status-badge ${statusClass}">${claim.status}</span></td>
                <td>
                    <button class="btn-view" data-id="${claim.claimId.replace('CR-', '')}">
                        Xem tiến trình
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        tableBody.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                openTrackingModal(id);
            });
        });
    }

    async function openTrackingModal(claimId) {
        modalClaimIdSpan.textContent = `(CR-${claimId})`;
        modalProgressBody.innerHTML = `<tr><td colspan="4" class="no-data">Đang tải lịch sử...</td></tr>`;
        modal.style.display = 'block';

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

    function closeModal() {
        modal.style.display = 'none';
    }

    closeModalBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    loadAllClaims();

})();