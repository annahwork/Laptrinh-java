
(function () {
    'use strict';
    
    const API_BASE_URL = '/evm/api/evm_staff/reports';


    const reportTableBody = document.getElementById('reportTableBody');
    const loadingMessage = document.getElementById('loadingMessage');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const monthPicker = document.querySelector('.report__month-picker');
    const reportTypeFilter = document.getElementById('reportTypeFilter');
    

    const totalWarrantyCostCard = document.getElementById('totalWarrantyCost');
    const totalCampaignsCard = document.getElementById('totalCampaigns');
    const totalInventoryCard = document.getElementById('totalInventory');

    function updateCards(data) {
        totalWarrantyCostCard.textContent = data.totalWarrantyCost 
            ? new Intl.NumberFormat('vi-VN').format(data.totalWarrantyCost) + ' VND' 
            : 'N/A';
        totalCampaignsCard.textContent = data.totalCampaigns || 0;
        totalInventoryCard.textContent = data.totalInventory || 0;
    }

    async function loadSummaryReport() {
        
        reportTableBody.innerHTML = '<tr><td colspan="4" class="report__td" style="font-weight:600;">Đang tải báo cáo...</td></tr>'
        updateCards({ totalWarrantyCost: 'Đang tải...', totalCampaigns: 'Đang tải...', totalInventory: 'Đang tải...' });

        const monthValue = monthPicker.value;
        const typeValue = reportTypeFilter.value;

        const url = `${API_BASE_URL}/summary?month=${monthValue}&type=${typeValue}`;
        
        try {
            const response = await fetch(url);
            
            if (response.status === 401) {
                throw new Error("401: Không có quyền truy cập. Vui lòng đăng nhập lại.");
            }

            if (!response.ok) {
                let errorMessage = `Lỗi HTTP ${response.status}.`;
                try {

                    const errorResult = await response.json();
                    errorMessage = errorResult.error || errorMessage;
                } catch (e) {

                    errorMessage = await response.text();
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();

            updateCards(data);

            let htmlContent = '';
            const failureRate = data.failureRate;
            if (failureRate && failureRate.total > 0) {
                htmlContent += `
                    <tr class="report__tr">
                        <td class="report__td">Tổng số Claim</td>
                        <td class="report__td">${failureRate.total}</td>
                        <td class="report__td">N/A</td>
                        <td class="report__td">Claims đã gửi đến hệ thống</td>
                    </tr>
                    <tr class="report__tr">
                        <td class="report__td">Claim được Duyệt (Approved)</td>
                        <td class="report__td">${failureRate.approved}</td>
                        <td class="report__td">Tỷ lệ: ${failureRate.successRate}</td>
                        <td class="report__td">Thành công</td>
                    </tr>
                    <tr class="report__tr">
                        <td class="report__td">Claim bị Từ chối (Rejected)</td>
                        <td class="report__td">${failureRate.rejected}</td>
                        <td class="report__td">Tỷ lệ: ${failureRate.failureRate}</td>
                        <td class="report__td">Tỷ lệ lỗi</td>
                    </tr>
                `;
            }

            const commonFailures = data.commonFailures;
            if (commonFailures && commonFailures.length > 0) {
                commonFailures.forEach(item => {
                    htmlContent += `
                        <tr class="report__tr" style="background:#f1f5f9;">
                            <td class="report__td" style="font-weight:600;">Top ${item.rank} Lỗi</td>
                            <td class="report__td">${item.count} claim</td>
                            <td class="report__td">Phụ tùng: ${item.partName}</td>
                            <td class="report__td">Chi tiết lỗi thường gặp</td>
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
            
        } finally {
        }
    }


    document.addEventListener('DOMContentLoaded', function() {
        updateCards({ totalWarrantyCost: 'Đang tải...', totalCampaigns: 'Đang tải...', totalInventory: 'Đang tải...' });
        
        generateReportBtn?.addEventListener('click', loadSummaryReport);

        loadSummaryReport();
    });

})();