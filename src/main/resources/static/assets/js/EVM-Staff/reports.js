(function () {
    'use strict';
    
    const API_BASE_URL = (window.contextPath || '/evm/') + 'api/evm_staff/reports';

    const currencyFormatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });


    function updateCards(data) {
        const cardValues = document.querySelectorAll('.report__card-value');
        
        if (cardValues.length >= 3) {
            cardValues[0].textContent = (data.totalWarrantyCost != null) 
                ? currencyFormatter.format(data.totalWarrantyCost).replace(/\s/g, '')
                : '0 VND';
            cardValues[1].textContent = (data.totalCampaigns != null)
                ? data.totalCampaigns + ' chiến dịch'
                : '0 chiến dịch';
            cardValues[2].textContent = (data.totalInventory != null)
                ? data.totalInventory + ' bộ'
                : '0 bộ';
        }
    }

    /**
     * Tải báo cáo chính
     */
    async function loadSummaryReport() {
        
        const reportTableBody = document.getElementById('reportTableBody');
        const monthPicker = document.querySelector('.report__month-picker');
        const reportTypeFilter = document.querySelector('.report__select');

        if (!reportTableBody) {
            console.error("Lỗi: Không tìm thấy 'reportTableBody'.");
            return;
        }

        reportTableBody.innerHTML = '<tr><td colspan="4" class="report__td" style="font-weight:600;">Đang tải báo cáo...</td></tr>';
        updateCards({ totalWarrantyCost: '...', totalCampaigns: '...', totalInventory: '...' });

        const monthValue = monthPicker ? monthPicker.value : "";
        const typeValue = reportTypeFilter ? reportTypeFilter.value : "";
        
        const url = `${API_BASE_URL}/summary?month=${monthValue}&type=${typeValue}`;
        
        try {
            const response = await fetch(url);
            
            if (response.status === 401) {
                throw new Error("401: Không có quyền truy cập.");
            }

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.error || `Lỗi HTTP ${response.status}`);
            }
            
            const data = await response.json();

            updateCards(data);
            const tableData = data.tableData;
            let htmlContent = '';

            if (tableData && tableData.length > 0) {
                tableData.forEach(item => {
                    htmlContent += `
                        <tr class="report__tr">
                            <td class="report__td" style="font-weight:600;">${item.type || 'N/A'}</td>
                            <td class="report__td">${item.name || 'N/A'}</td>
                            <td class="report__td" style="text-align:right;">${item.total || 0} (Duyệt: ${item.approved} / Từ chối: ${item.rejected})</td>
                            <td class="report__td" style="color:#dc2626; font-weight:600;">${item.failureRate || '0%'}</td>
                        </tr>
                    `;
                });
            }
            
            if (htmlContent) {
                reportTableBody.innerHTML = htmlContent;
            } else {
                reportTableBody.innerHTML = '<tr><td colspan="4" class="report__td">Không tìm thấy dữ liệu báo cáo nào cho bộ lọc này.</td></tr>';
            }

        } catch (err) {
            console.error("Lỗi tải báo cáo:", err);
            reportTableBody.innerHTML = `<tr><td colspan="4" class="report__td" style="color:#dc2626; font-weight:600;">Lỗi tải dữ liệu: ${err.message}</td></tr>`;
            updateCards({ totalWarrantyCost: 'LỖI', totalCampaigns: 'LỖI', totalInventory: 'LỖI' });
        } 
    }

    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('report__btn--generate')) {
            loadSummaryReport();
        }
    });

    setTimeout(loadSummaryReport, 100); 

})();