(function () {
    'use strict';

    console.log('Report script loaded');

    const API_URL = '/evm/api/report';
    const PAGE_SIZE = 9999;
    let currentPage = 1;
    
    let allCampaigns = []; 
    let currentFilteredData = []; 

    const btnExport = document.getElementById("btnExportReport");
    const filter = document.getElementById("reportFilter");
    const container = document.getElementById("reportContainer");

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; 
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }

    function renderReports(reportDataList) {
        if (!container) return;
        container.innerHTML = '';

        currentFilteredData = reportDataList;

        if (!reportDataList || reportDataList.length === 0) {
            container.innerHTML = '<p style="width: 100%; text-align: center; padding: 2rem;">Không tìm thấy dữ liệu báo cáo nào cho bộ lọc này.</p>';
            return;
        }

        reportDataList.forEach(row => {
            const campaignId = row[0];
            const campaignName = row[1] || 'N/A';
            const campaignDate = row[2]; 
            const total = parseInt(row[3] || 0);      
            const completed = parseInt(row[4] || 0);  
            const inProgress = parseInt(row[5] || 0);
            
            const rate = (total > 0) ? Math.round((completed / total) * 100) : 0;

            const card = document.createElement('div');
            card.className = 'data-card';
            card.setAttribute('data-campaign-id', campaignId);

            card.innerHTML = `
                <div class="card-header">
                    <h3>Chiến dịch: <span>${campaignName}</span></h3>
                </div>
                <div class="card-body">
                    <p><strong>Ngày bắt đầu:</strong> <span>${formatDate(campaignDate)}</span></p>
                    <p><strong>Tổng số xe:</strong> <span>${total}</span></p>
                    <p><strong>Đã hoàn tất:</strong> <span>${completed}</span></p>
                    <p><strong>Đang xử lý:</strong> <span>${inProgress}</span></p>
                    <p><strong>Tỷ lệ hoàn thành:</strong> <span class="${rate >= 70 ? 'text-success' : 'text-warning'}">${rate}%</span></p>
                </div>`;
            
            container.appendChild(card);
        });
    }

    async function fetchAllReports() {
        if (!container) return;
        
        container.innerHTML = `<div class="loading-data" style="width: 100%; text-align: center; padding: 2rem;">Đang tải dữ liệu báo cáo...</div>`;
        
        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('pageSize', PAGE_SIZE.toString());

            const response = await fetch(`${API_URL}?${params.toString()}`);
            if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);

            const reportDataList = await response.json();
            
            allCampaigns = reportDataList; 
            
            applyFiltersAndRender();

        } catch (err) {
            console.error("Lỗi khi tải báo cáo:", err);
            container.innerHTML = `<div class="error-data" style="width: 100%; text-align: center; padding: 2rem;">${err.message}</div>`;
        }
    }

    function applyFiltersAndRender() {
        let dataToRender = allCampaigns;
        
        if (filter) {
            const filterValue = filter.value;
            const now = new Date();
            const currentYear = now.getFullYear(); 
            const currentMonth = now.getMonth();   

            dataToRender = allCampaigns.filter(row => {
                const campaignDateStr = row[2]; 
                if (!campaignDateStr) return false;

                const parts = campaignDateStr.split('T')[0].split('-');
                const campaignDate = new Date(parts[0], parts[1] - 1, parts[2]); 

                if (isNaN(campaignDate.getTime())) return false;

                const campaignYear = campaignDate.getFullYear();
                const campaignMonth = campaignDate.getMonth();

                if (filterValue === "all") {
                    return true;
                }

                if (filterValue === "this-month") {
                    return campaignYear === currentYear && campaignMonth === currentMonth;
                }

                if (filterValue === "last-month") {
  
                    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    const lastMonthYear = lastMonthDate.getFullYear();
                    const lastMonth = lastMonthDate.getMonth();
                    
                    return campaignYear === lastMonthYear && campaignMonth === lastMonth;
                }
                return false;
            });
        }
        
        renderReports(dataToRender);
    }

    function handleFilterChange() {
        console.log("Đang lọc (phía Frontend) theo:", filter.value);
        applyFiltersAndRender(); 
    }

    function exportReport() {
        if (typeof XLSX === 'undefined') {
            alert('Lỗi: Thư viện xuất Excel (xlsx.js) chưa được tải. Vui lòng thêm <script> vào file HTML.');
            console.error("Vui lòng thêm: <script src=\"https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js\"></script>");
            return;
        }
        
        if (!currentFilteredData || currentFilteredData.length === 0) {
            alert("Không có dữ liệu (đã lọc) để xuất!");
            return;
        }

        const dataToExport = currentFilteredData.map(row => {
            const total = parseInt(row[3] || 0);
            const completed = parseInt(row[4] || 0);
            const rate = (total > 0) ? Math.round((completed / total) * 100) : 0;

            return {
                "Mã Chiến Dịch": row[0],
                "Tên Chiến Dịch": row[1],
                "Ngày Bắt Đầu": formatDate(row[2]),
                "Tổng Số Xe": total,
                "Đã Hoàn Tất": completed,
                "Đang Xử Lý": parseInt(row[5] || 0),
                "Tỷ Lệ Hoàn Thành (%)": rate
            };
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, ws, "BaoCaoChienDich");

        const range = filter ? filter.value : 'all';
        const fileName = `BaoCaoChienDich_${range}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    }

    function init() {
        if (btnExport) btnExport.addEventListener("click", exportReport);
        if (filter) filter.addEventListener("change", handleFilterChange);
        
        fetchAllReports(); 
        
        console.log('Report Page initialized successfully');
    }

    setTimeout(init, 300);

})();