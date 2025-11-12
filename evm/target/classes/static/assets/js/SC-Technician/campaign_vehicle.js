(function () {
    'use strict';

    console.log('Campaign Vehicle script loaded (Filter-Only Version)');

    const API_BASE = '/evm/api/recallvehicles'; 
    const PAGE_SIZE = 9999;
    let currentPage = 1;

    let allVehicles = []; 

    const vehicleGrid = document.querySelector('.data-grid'); 
    const vinFilterInput = document.getElementById('vinFilterInput'); 
    const statusFilterSelect = document.getElementById('statusFilterSelect');

    function formatStatus(status) {
        const lowerStatus = status?.toLowerCase() || '';
        switch (lowerStatus) {
            case 'inprogress': return { text: 'Đang sửa', class: 'inprogress' };
            case 'done': 
            case 'completed': return { text: 'Hoàn tất', class: 'completed' };
            case 'pending': return { text: 'Chờ xử lý', class: 'pending' };
            default: return { text: status || 'Không rõ', class: 'default' };
        }
    }
    
    function formatDateDisplay(date) {
        if (!date) return 'N/A';
        const dateObj = (date instanceof Date) ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return 'N/A';
        return dateObj.toLocaleDateString('vi-VN');
    }
    
    function renderRecallVehicles(vehicleList) {
        if (!vehicleGrid) return console.error('Lỗi: Không tìm thấy phần tử .data-grid');
        
        vehicleGrid.innerHTML = ''; 

        if (!vehicleList || vehicleList.length === 0) {
            vehicleGrid.innerHTML = '<p style="width: 100%; text-align: center; padding: 2rem;">Không tìm thấy xe nào phù hợp.</p>';
            return;
        }

        vehicleList.forEach(v => {
            const statusInfo = formatStatus(v.status);
            const vin = v.vin || 'N/A';
            const campaignCode = v.campaignCode || 'N/A';
            const customerName = v.customerName || 'N/A';
            const StaffName = v.campaignCreatedByStaffName || 'N/A';
            const card = document.createElement('div');
            card.className = 'data-card';
            
            card.innerHTML = `
                <div class="card-header">
                    <h3>ID: <span>${v.recallVehicleID || 'N/A'}</span></h3>
                    <span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>
                </div>
                <div class="card-body">
                    <p><strong>Mã chiến dịch:</strong> ${campaignCode}</p> 
                    <p><strong>VIN:</strong> ${vin}</p> 
                    <p><strong>Khách hàng:</strong> ${customerName}</p> 
                    <p><strong>Người phụ trách:</strong> ${StaffName}</p>
                    <p><strong>Ngày hẹn:</strong> ${formatDateDisplay(v.appointmentDate)}</p>
                </div>`;
            vehicleGrid.appendChild(card);
        });
    }
        
    function applyFiltersAndRender() {
        const keyword = vinFilterInput ? vinFilterInput.value.toLowerCase().trim() : '';
        
        const status = statusFilterSelect ? statusFilterSelect.value.toLowerCase() : 'all'; 

        console.log(`Lọc (frontend): Keyword=${keyword}, Status=${status}`);

        const filteredVehicles = allVehicles.filter(v => {
            const statusMatch = status === 'all' 
                ? true 
                : v.status?.toLowerCase() === status;

            const keywordMatch = keyword === '' 
                ? true 
                : (v.vin?.toLowerCase().includes(keyword) || 
                v.campaignCode?.toString().toLowerCase().includes(keyword) ||
                v.customerName?.toLowerCase().includes(keyword)); 
            
            return statusMatch && keywordMatch;
        });

        renderRecallVehicles(filteredVehicles);
    }

    async function fetchAllVehicles() {
        console.log(`Fetching ALL vehicles...`);
        if (vehicleGrid) vehicleGrid.innerHTML = `<div class="loading-data" style="width: 100%; text-align: center; padding: 2rem;">Đang tải dữ liệu...</div>`;
        
        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('pageSize', PAGE_SIZE.toString()); 
            
            const url = `${API_BASE}?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            
            const data = await res.json();
            
            const vehicleList = Array.isArray(data) ? data : (data.vehicles || []); 

            allVehicles = vehicleList;

            applyFiltersAndRender(); 
            
        } catch (err) {
            console.error('Fetch error:', err);
            if (vehicleGrid) vehicleGrid.innerHTML = `<div class="error-data" style="width: 100%; text-align: center; padding: 2rem;">Lỗi: Không thể tải danh sách xe.</div>`;
        }
    }
    
    function init() {
        if (vinFilterInput) vinFilterInput.addEventListener('input', applyFiltersAndRender);
        if (statusFilterSelect) statusFilterSelect.addEventListener('change', applyFiltersAndRender);

        fetchAllVehicles();
        
        console.log('Campaign Vehicle initialized successfully (Filter-Only Mode)');
    }

    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', init);
    else
        init();
})();