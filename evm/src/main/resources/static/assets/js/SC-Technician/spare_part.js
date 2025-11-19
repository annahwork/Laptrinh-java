(function () {
    'use strict';

    console.log('Warranty Part tracking script loaded');

    const API_WARRANTY_PART = '/evm/api/warrantyPart'; 
    
    let allPartsData = []; 
    
    const dataGrid = document.querySelector('.data-grid');
    const searchInput = document.querySelector('.page-header input[type="text"]'); 
    const statusFilter = document.getElementById('status-filter'); 

    const detailModal = document.getElementById('modalChiTiet');
    const detailCloseBtn = document.getElementById('detailCloseBtn');
    const detailTitle = document.getElementById('detailTitle');
    const detailDescription = document.getElementById('detailDescription'); 

    function formatStatus(status) {
        const lowerStatus = status?.toLowerCase() || '';
        switch (lowerStatus) {
            case 'shipped': 
                return { text: 'Đang giao', class: 'shipped' };
            case 'received': 
                return { text: 'Đã nhận', class: 'received' };
            case 'pending': 
                return { text: 'Đang chờ', class: 'pending' };
            case 'active': 
            default:
                return { text: status || 'Chưa rõ', class: 'default' }; 
        }
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    function closeModal() {
        if (detailModal) {
            detailModal.style.display = 'none';
        }
    }

    function openModal(partData) {
            if (!detailModal || !detailTitle || !detailDescription) 
                return;

            const detailContent = `
                <p><strong>Serial Number:</strong> ${partData.serialNumber || 'N/A'}</p>
                <p><strong>Mã linh kiện:</strong> ${partData.vehiclePartID || 'N/A'}</p>
                <p><strong>Trạng thái:</strong> ${partData.status || 'N/A'}</p>
                <p><strong>Ngày lắp:</strong> ${formatDate(partData.installDate)}</p>
                <p><strong>Ngày gỡ:</strong> ${formatDate(partData.removeDate)}</p>
            `;

            detailTitle.style.display = 'block'; 
            detailTitle.textContent = `Chi tiết phụ tùng`;
            detailDescription.innerHTML = detailContent;
            detailModal.style.display = 'flex'; 
    }

    function renderParts(parts) {
        if (!dataGrid) return;

        dataGrid.innerHTML = '';
        
        if (parts.length === 0) {
            dataGrid.innerHTML = `<p class="no-results" style="text-align:center; width:100%; padding:2rem;">Không tìm thấy phụ tùng nào phù hợp.</p>`;
            return;
        }

        parts.forEach(part => {
            const partInfo = {
                name: part.serialNumber || 'N/A', 
                code: part.vehiclePartID || 'N/A', 
                vehicle: part.serialNumber?.split('-')[2]?.substring(0, 12) || 'N/A',
                statusDB: part.status || 'N/A'
            };

            const statusFormatted = formatStatus(partInfo.statusDB);

            const partCard = document.createElement('div');
            partCard.classList.add('data-card'); 
            
            partCard.dataset.partJson = JSON.stringify(part); 

            partCard.innerHTML = `
                <div class="card-header">
                    <h3>Mã: ${partInfo.code}</h3>
                    
                    <span class="status-badge ${statusFormatted.class}">${statusFormatted.text}</span>
                </div>
                <div class="card-body">
                    <p><strong>Tên:</strong> ${partInfo.name}</p>
                    <p><strong>Xe liên quan:</strong> ${partInfo.vehicle}</p>
                </div>
                <div class="card-footer">
                    <button class="btn-outline btn-detail">Chi tiết</button> 
                </div>`;
            
            const detailButton = partCard.querySelector('.btn-detail'); 

            if (detailButton) {
                detailButton.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    const fullPartData = JSON.parse(partCard.dataset.partJson);
                    openModal(fullPartData);
                });
            }
            
            dataGrid.appendChild(partCard);
        });
    }

    function filterAndSearch() {
        const keyword = searchInput?.value.toLowerCase().trim() || '';
        
        const filteredParts = allPartsData.filter(part => {
            const serialNumber = part.serialNumber?.toLowerCase() || '';
            const vehiclePartID = part.vehiclePartID?.toString().toLowerCase() || '';            
            const matchesSearch = keyword === '' || 
                                     serialNumber.includes(keyword) ||
                                     vehiclePartID.includes(keyword);
            
            return matchesSearch; 
        });

        renderParts(filteredParts);
    }

    async function fetchWarrantyParts() {
        if (dataGrid)
            dataGrid.innerHTML = `<div class="loading-data" style="text-align:center; width:100%; padding:2rem;">Đang tải dữ liệu phụ tùng...</div>`;
        
        try {
            const response = await fetch(API_WARRANTY_PART); 
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            allPartsData = Array.isArray(data) ? data : []; 

            renderParts(allPartsData);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu phụ tùng:", error);
            if (dataGrid)
                dataGrid.innerHTML = `<p class="error-message" style="text-align:center; width:100%; padding:2rem;">Lỗi: Không thể tải dữ liệu phụ tùng bảo hành.</p>`;
        }
    }

    function init() {
        if (searchInput) {
            searchInput.addEventListener('input', filterAndSearch);
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', filterAndSearch);
        }

        if (detailCloseBtn) {
            detailCloseBtn.addEventListener('click', closeModal);
        }

        window.addEventListener('click', (event) => {
            if (event.target === detailModal) {
                closeModal();
            }
        });

        fetchWarrantyParts();
    }

    init();

})();