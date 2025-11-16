(function () {
    'use strict';

    console.log('Warranty Result script loaded');

    const API_CLAIM_DATA = '/evm/api/claimServiceDetails'; 
    const API_UPDATE_STATUS = '/evm/api/updateClaimServiceStatus/{id}'; 
    
    const PAGE_SIZE = 10; 

    let currentFilteredClaims = []; 
    let currentPage = 1;
    let allClaimData = [];
    
    const STATUS_OPTIONS = [
        { value: 'pending_parts', text: 'Đang chờ phụ tùng' },
        { value: 'completed', text: 'Hoàn thành' },
        { value: 'in_progress', text: 'Đang thực hiện' },
        { value: 'pending_approval', text: 'Chờ duyệt' }
    ];

    function mapStatusToDisplay(status) {
        const lowerStatus = status?.toLowerCase() || '';
        
        if (lowerStatus.includes('ch? ph? tùng') || lowerStatus.includes('pending_parts')) return 'Đang chờ phụ tùng';
        if (lowerStatus.includes('hoàn thành') || lowerStatus.includes('completed')) return 'Hoàn thành';
        if (lowerStatus.includes('th?c hi?n') || lowerStatus.includes('in_progress')) return 'Đang thực hiện';
        if (lowerStatus.includes('ch? duy?t') || lowerStatus.includes('pending_approval')) return 'Chờ duyệt';
        
        return lowerStatus || 'Không xác định'; 
    }

    function createStatusDropdown(claimServID, currentStatus) {
        let optionsHtml = '';
        const normalizedCurrentStatus = mapStatusToDisplay(currentStatus);
        
        STATUS_OPTIONS.forEach(opt => {
            const isSelected = opt.text === normalizedCurrentStatus ? 'selected' : '';
            optionsHtml += `<option value="${opt.value}" ${isSelected}>${opt.text}</option>`;
        });
        
        return `
            <select id="status-${claimServID}" 
                    class="status-select" 
                    onchange="toggleSaveButton('${claimServID}', this.value)">
                ${optionsHtml}
            </select>
        `;
    }

    function renderActionButton(claimServID) {
        return `
            <button class="action-btn btn-save" 
                    id="saveBtn-${claimServID}" 
                    onclick="saveClaimStatus('${claimServID}')" 
                    disabled>
                Lưu
            </button>
        `;
    }

    window.toggleSaveButton = function (claimServID, newValue) {
        const saveBtn = document.getElementById(`saveBtn-${claimServID}`);
        const originalItem = allClaimData.find(item => item.ClaimServID.toString() === claimServID);
        
        if (saveBtn && originalItem) {
            if (newValue.toLowerCase() !== originalItem.Status.toLowerCase()) {
                saveBtn.disabled = false;
            } else {
                saveBtn.disabled = true;
            }
        }
    };
    
    window.saveClaimStatus = async function (claimServID) {
        const statusSelect = document.getElementById(`status-${claimServID}`);
        const newStatus = statusSelect ? statusSelect.value : null;
        
        if (!newStatus) return;

        const saveBtn = document.getElementById(`saveBtn-${claimServID}`);
        saveBtn.disabled = true;
        
        try {
            const url = API_UPDATE_STATUS.replace('{id}', claimServID); 
            const response = await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status: newStatus }) });

            if (response.ok) {
                alert(`Cập nhật trạng thái cho ${claimServID} thành công: ${mapStatusToDisplay(newStatus)}`);
                const originalItem = allClaimData.find(item => item.ClaimServID.toString() === claimServID);
                if (originalItem) {
                    originalItem.Status = newStatus;
                }
                renderPaginatedClaims(); 
            } else {
                alert(`Cập nhật thất bại cho ${claimServID}.`);
                saveBtn.disabled = false;
            }
        } catch (err) {
            console.error('Lỗi lưu trạng thái:', err);
            alert('Lỗi mạng hoặc server. Không thể lưu trạng thái.');
            saveBtn.disabled = false;
        }
    };

    function renderTable(claims) {
        const tableBody = document.getElementById('campaignsTbody');
        if (!tableBody) return;
        tableBody.innerHTML = ''; 

        if (!claims || claims.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell">Không tìm thấy dịch vụ bảo hành nào.</td></tr>`;
            return;
        }

        claims.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.ClaimServID || 'N/A'}</td>
                <td>${item.VIN || 'N/A'}</td>
                <td>${item.CustomerName || 'N/A'}</td>
                <td>${item.NoteDetail || 'N/A'}</td>
                <td>${createStatusDropdown(item.ClaimServID, item.Status)}</td>
                <td>${renderActionButton(item.ClaimServID)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function renderPaginatedClaims() {
        const totalRecords = currentFilteredClaims.length;
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const paginated = currentFilteredClaims.slice(startIndex, startIndex + PAGE_SIZE);

        renderTable(paginated);
        updatePagination(totalRecords, startIndex);
    }

    async function fetchAndMapData() {
        const tableBody = document.getElementById('campaignsTbody');
        if (tableBody) tableBody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell">Đang tải dữ liệu...</td></tr>`;

        try {
            const res = await fetch(API_CLAIM_DATA);
            const rawData = await res.json();
            
            allClaimData = Array.isArray(rawData) ? rawData.map(row => {
                
                return {
                    ClaimServID: row[0], 
                    VIN: row[1],         
                    CustomerName: row[2],
                    Status: row[3],      
                    NoteDetail: row[4],  
                };
            }) : [];

            filterClaims(); 
        } catch (err) {
            console.error('Fetch error:', err);
            if (tableBody)
                tableBody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell" style="color: red;">Lỗi: ${err.message || 'Không thể tải dữ liệu.'}</td></tr>`;
            updatePagination(0, 0);
        }
    }
    
    function filterClaims() {
        const searchValue = document.getElementById('searchCampaignBox')?.value.trim().toLowerCase() || '';
        const statusFilterValue = document.getElementById('campaignStatusFilter')?.value.trim().toLowerCase() || '';
        const normalizedFilterText = statusFilterValue ? mapStatusToDisplay(statusFilterValue).toLowerCase() : '';

        currentFilteredClaims = allClaimData.filter(item => {
            const itemStatusText = mapStatusToDisplay(item.Status).toLowerCase();
            const matchesSearch = searchValue? (item.VIN?.toLowerCase().includes(searchValue) || item.ClaimServID?.toString().toLowerCase().includes(searchValue) || item.CustomerName?.toLowerCase().includes(searchValue) || itemStatusText.includes(searchValue) ||  item.NoteDetail?.toLowerCase().includes(searchValue) )  : true;
            
            const matchesStatus = normalizedFilterText ? itemStatusText === normalizedFilterText : true; 

            return matchesSearch && matchesStatus;
        });

        currentPage = 1;
        renderPaginatedClaims();
    }

    function updatePagination(totalRecords, startIndex) {
        const totalPages = Math.ceil(totalRecords / PAGE_SIZE) || 1;
        const paginationInfo = document.querySelector('.pagination-info');
        const paginationWrapper = document.querySelector('.pagination-wrapper');
        const currentDisplayStart = totalRecords === 0 ? 0 : startIndex + 1;
        const currentDisplayEnd = Math.min(startIndex + PAGE_SIZE, totalRecords);

        if (paginationInfo) paginationInfo.textContent = `Hiển thị ${currentDisplayStart} - ${currentDisplayEnd} của ${totalRecords}`;
        
        if (paginationWrapper) {
            paginationWrapper.innerHTML = '';
            
            paginationWrapper.innerHTML += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">« Trước</button>`;
            paginationWrapper.innerHTML += `<button class="pagination-btn-active">${currentPage}</button>`;
            paginationWrapper.innerHTML += `<button class="pagination-btn" ${currentPage === totalPages || totalRecords === 0 ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">Sau »</button>`;
        }
    }

    window.goToPage = function (page) {
        const totalPages = Math.ceil(currentFilteredClaims.length / PAGE_SIZE) || 1;
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            renderPaginatedClaims();
        }
    };

    window.editClaim = function (claimID) {
        alert(`Không còn chức năng sửa trực tiếp trên trang này (ID: ${claimID}).`);
    };
    
    const modal = document.getElementById('modalQuanLyChienDich');
    const btnMoForm = document.getElementById('btnMoFormCampaign');
    const closeModalBtns = modal ? modal.querySelectorAll('.campaign__close-button, #campaignCancelBtn') : [];
    
    if(btnMoForm) {
        btnMoForm.addEventListener('click', function() {
            if (modal) modal.style.display = 'flex';
        });
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
        document.getElementById('createResultForm')?.reset();
    }

    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

    window.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
    
    function init() {
        fetchAndMapData();

        document.getElementById('searchCampaignBox')?.addEventListener('input', filterClaims);
        document.getElementById('campaignStatusFilter')?.addEventListener('change', filterClaims); 
        console.log('Warranty Result initialized successfully');
    }

    init();

})();