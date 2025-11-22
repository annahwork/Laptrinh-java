(function () {
    'use strict';
    
    const API_BASE_URL = (window.contextPath || '/evm/') + 'api/evm_staff/reports';
    const API_GEMINI_URL = (window.contextPath || '/evm/') + 'api/gemini/analyze-claims';
    let currentReportData = [];

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

    async function loadSummaryReport() {
        
        const reportTableBody = document.getElementById('reportTableBody');

        if (!reportTableBody) {
            console.error("Lỗi: Không tìm thấy 'reportTableBody'.");
            return;
        }

        reportTableBody.innerHTML = '<tr><td colspan="4" class="text-left font-bold text-muted">Đang tải báo cáo...</td></tr>';
        updateCards({ totalWarrantyCost: 'Đang tải', totalCampaigns: 'Đang tải', totalInventory: 'Đang tải' });
        
        const url = `${API_BASE_URL}/summary`;
        
        try {
            const response = await fetch(url);
            
            if (response.status === 401) {
                throw new Error("401: Không có quyền truy cập.");
            }

            if (!response.ok) {
                const errorResult = await response.json().catch(() => ({})); 
                throw new Error(errorResult.error || `Lỗi HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            currentReportData = data.tableData || [];

            updateCards(data);
            const tableData = data.tableData;
            let htmlContent = '';

            if (tableData && tableData.length > 0) {
                tableData.forEach(item => {
                    const failureRateColor = item.failureRate && parseFloat(item.failureRate.replace('%', '')) > 0 
                        ? 'color:#dc2626;' 
                        : 'color:var(--text);'; 
                        
                    htmlContent += `
                        <tr>
                            <td class="text-left font-bold">${item.type || 'N/A'}</td>
                            <td class="text-left">${item.name || 'N/A'}</td>
                            <td class="text-right">${item.total || 0} (Duyệt: ${item.approved} / Từ chối: ${item.rejected})</td>
                            <td class="text-right font-bold" style="${failureRateColor}">${item.failureRate || '0%'}</td>
                        </tr>
                    `;
                });
            }
            
            if (htmlContent) {
                reportTableBody.innerHTML = htmlContent;
            } else {
                reportTableBody.innerHTML = '<tr><td colspan="4" class="text-left text-muted">Không tìm thấy dữ liệu báo cáo.</td></tr>';
            }

        } catch (err) {
            console.error("Lỗi tải báo cáo:", err);
            currentReportData = [];
            reportTableBody.innerHTML = `<tr><td colspan="4" class="text-left font-bold" style="color:#dc2626;">Lỗi tải dữ liệu: ${err.message}</td></tr>`;
            updateCards({ totalWarrantyCost: 'LỖI', totalCampaigns: 'LỖI', totalInventory: 'LỖI' });
        } 
    }

    function exportReport() {
        const showMessage = (msg) => {
             console.error(msg); 
        };

        if (typeof XLSX === 'undefined') {
            showMessage('Lỗi: Thư viện xuất Excel (xlsx.js) chưa được tải.');
            return;
        }
        
        if (!currentReportData || currentReportData.length === 0) {
            showMessage("Không có dữ liệu để xuất!");
            return;
        }

        const dataToExport = currentReportData.map(item => {
            return {
                "Loại báo cáo": item.type || '',
                "Hạng mục": item.name || '',
                "Thống kê (VND)": item.total || 0,
                "Đã duyệt": item.approved || 0,
                "Từ chối": item.rejected || 0,
                "Ghi chú / Tỉ lệ lỗi": item.failureRate || '0%'
            };
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        
        const wscols = [
            {wch: 20},
            {wch: 30}, 
            {wch: 20}, 
            {wch: 15}, 
            {wch: 15}, 
            {wch: 20}  
        ];
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, "BaoCaoTongHop");

        const fileName = `BaoCaoTongHop_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        XLSX.writeFile(wb, fileName);
    }
    
    function setAIResult(html, isError = false) {
        const resultContent = document.querySelector('.ai-result-content');
        const placeholder = document.querySelector('.ai-placeholder');

        if (isError) {
            resultContent.innerHTML = `<div class="ai-insight-item warning"><span class="dot"></span><strong>Lỗi Phân Tích Dữ Liệu:</strong> ${html}</div>`;
        } else {
            resultContent.innerHTML = html;
        }
        
        resultContent.style.display = 'block';
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    }

    function setAILoading(isLoading) {
        const btn = document.querySelector('.btn-add');
        const resultContent = document.querySelector('.ai-result-content');
        const placeholder = document.querySelector('.ai-placeholder');
        
        if (isLoading) {
            btn.disabled = true;
            btn.innerHTML = `
                <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="width: 1rem; height: 1rem; margin-right: 0.5rem; animation: spin 1s linear infinite;">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang phân tích...`;
            
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            resultContent.style.display = 'block';
            resultContent.innerHTML = '<div class="ai-insight-item info" style="font-weight:600;">Đang gửi dữ liệu tới AI (có thể mất vài giây)...</div>';
        } else {
            btn.disabled = false;
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 12z" />
                    <path d="M21 3v9h-9" />
                </svg>
                Yêu cầu phân tích`;
        }
    }

    async function analyzeClaims() {
        setAILoading(true);
        try {
            const response = await fetch(API_GEMINI_URL);

            let rawText = await response.text(); 
            let result;

            if (!response.ok) {
                let errorDetails = `Lỗi HTTP ${response.status}`;
                try {
                    const errorJson = JSON.parse(rawText);
                    errorDetails = errorJson.error || errorDetails;
                } catch (e) {
                    errorDetails = rawText || errorDetails;
                }
                throw new Error(errorDetails);
            }

            if (rawText.startsWith('```')) {
                rawText = rawText.replace(/(^```json\s*)|(\s*```$)/gi, '').trim();
            }

            try {
                result = JSON.parse(rawText); 
            } catch (e) {
                throw new Error(`Phản hồi không phải JSON hợp lệ: ${e.message}. Dữ liệu thô: ${rawText.substring(0, 100)}...`);
            }
            
            if (result.error) {
                throw new Error(result.error);
            }

            if (result.insights && Array.isArray(result.insights)) {
                let html = result.insights.map(insight => {
                    let className = 'info'; 
                    if (/(rủi ro|cảnh báo|lỗi|thất bại)/i.test(insight.title)) {
                        className = 'warning';
                    } else if (/(tối ưu|hiệu suất|thành công|đề xuất)/i.test(insight.title)) {
                        className = 'success';
                    } else if (/(dự báo|xu hướng|thống kê)/i.test(insight.title)) {
                        className = 'info';
                    }
                    
                    return `
                        <div class="ai-insight-item ${className}">
                            <span class="dot"></span>
                            <div><strong>${insight.title}:</strong> ${insight.content}</div>
                        </div>
                    `;
                }).join('');
                setAIResult(html);
            } else {
                throw new Error("Dữ liệu phân tích trả về không đúng định dạng (thiếu trường 'insights' hoặc 'insights' không phải là mảng).");
            }

        } catch (err) {
            console.error("Lỗi phân tích AI:", err);
            setAIResult(`Không thể lấy phân tích. Chi tiết: ${err.message}`, true);
        } finally {
            setAILoading(false);
        }
    }
    
    const btnExport = document.querySelector(".report__btn--export");
    if (btnExport) {
        btnExport.addEventListener("click", exportReport);
    }
    
    const btnAnalyze = document.querySelector(".btn-add");
    if (btnAnalyze) {
        btnAnalyze.addEventListener("click", analyzeClaims);
    }

    setTimeout(loadSummaryReport, 100); 

})();