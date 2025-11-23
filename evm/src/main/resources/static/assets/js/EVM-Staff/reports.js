(function () {
    'use strict';

    // 💡 Hàm tra cứu dịch thuật
    const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

    const API_BASE_URL = (window.contextPath || '/evm/') + 'api/evm_staff/reports';
    const API_GEMINI_URL = (window.contextPath || '/evm/') + 'api/gemini/analyze-claims';
    let currentReportData = [];

    const currencyFormatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });

    function updateCards(data) {
        const cardValues = document.querySelectorAll('.report__card-value');
        const campaignUnit = T('report.card.campaigns_unit', 'chiến dịch');
        const inventoryUnit = T('report.card.inventory_unit', 'bộ');

        if (cardValues.length >= 3) {
            cardValues[0].textContent = (data.totalWarrantyCost != null)
                ? currencyFormatter.format(data.totalWarrantyCost).replace(/\s/g, '')
                : '0 VND';
            cardValues[1].textContent = (data.totalCampaigns != null)
                ? `${data.totalCampaigns} ${campaignUnit}`
                : `0 ${campaignUnit}`;
            cardValues[2].textContent = (data.totalInventory != null)
                ? `${data.totalInventory} ${inventoryUnit}`
                : `0 ${inventoryUnit}`;
        }
    }

    async function loadSummaryReport() {

        const reportTableBody = document.getElementById('reportTableBody');

        if (!reportTableBody) {
            console.error("Lỗi: Không tìm thấy 'reportTableBody'.");
            return;
        }

        // 💡 Dịch: Đang tải báo cáo...
        reportTableBody.innerHTML = `<tr><td colspan="4" class="text-left font-bold text-muted">${T('message.loading_report', 'Đang tải báo cáo...')}</td></tr>`;
        updateCards({ totalWarrantyCost: '...', totalCampaigns: '...', totalInventory: '...' });

        const url = `${API_BASE_URL}/summary`;

        try {
            const response = await fetch(url);

            // 💡 Dịch: Không có quyền truy cập.
            if (response.status === 401) {
                throw new Error(T('report.error.no_permission', "401: Không có quyền truy cập."));
            }

            if (!response.ok) {
                const errorResult = await response.json().catch(() => ({}));
                // 💡 Dịch: Lỗi tải dữ liệu
                throw new Error(errorResult.error || T('report.error.loading_failed', `Lỗi HTTP ${response.status}`));
            }

            const data = await response.json();

            currentReportData = data.tableData || [];

            updateCards(data);
            const tableData = data.tableData;
            let htmlContent = '';

            // Dịch các Header cho dữ liệu nội bộ
            const approvedText = T('export.header.approved', 'Duyệt');
            const rejectedText = T('export.header.rejected', 'Từ chối');

            if (tableData && tableData.length > 0) {
                tableData.forEach(item => {
                    const failureRateColor = item.failureRate && parseFloat(item.failureRate.replace('%', '')) > 0
                        ? 'color:#dc2626;'
                        : 'color:var(--text);';

                    // Note: Cần đảm bảo các trường item.approved và item.rejected tồn tại
                    htmlContent += `
                        <tr>
                            <td class="text-left font-bold">${item.type || 'N/A'}</td>
                            <td class="text-left">${item.name || 'N/A'}</td>
                            <td class="text-right">${item.total || 0} (${approvedText}: ${item.approved || 0} / ${rejectedText}: ${item.rejected || 0})</td>
                            <td class="text-left font-bold" style="${failureRateColor}">${item.failureRate || '0%'}</td>
                        </tr>
                    `;
                });
            }

            if (htmlContent) {
                reportTableBody.innerHTML = htmlContent;
            } else {
                // 💡 Dịch: Không tìm thấy dữ liệu báo cáo.
                reportTableBody.innerHTML = `<tr><td colspan="4" class="text-left text-muted">${T('report.table.no_data', 'Không tìm thấy dữ liệu báo cáo.')}</td></tr>`;
            }

        } catch (err) {
            console.error("Lỗi tải báo cáo:", err);
            currentReportData = [];
            const errorText = T('report.table.loading_error', 'Lỗi tải dữ liệu');
            reportTableBody.innerHTML = `<tr><td colspan="4" class="text-left font-bold" style="color:#dc2626;">${errorText}: ${err.message}</td></tr>`;
            updateCards({ totalWarrantyCost: 'LỖI', totalCampaigns: 'LỖI', totalInventory: 'LỖI' });
        }
    }

    function exportReport() {
        const showMessage = (msg) => {
             console.error(msg);
             alert(msg); // Thêm alert để người dùng thấy
        };

        // 💡 Dịch: Lỗi: Thư viện xuất Excel (xlsx.js) chưa được tải.
        if (typeof XLSX === 'undefined') {
            showMessage(T('export.library_error', 'Lỗi: Thư viện xuất Excel (xlsx.js) chưa được tải.'));
            return;
        }

        // 💡 Dịch: Không có dữ liệu để xuất!
        if (!currentReportData || currentReportData.length === 0) {
            showMessage(T('export.no_data', "Không có dữ liệu để xuất!"));
            return;
        }

        // 💡 Dịch các header xuất khẩu
        const exportHeaders = {
            "Loại báo cáo": T('export.header.type', "Loại báo cáo"),
            "Hạng mục": T('export.header.category', "Hạng mục"),
            "Thống kê (VND)": T('export.header.stats_vnd', "Thống kê (VND)"),
            "Đã duyệt": T('export.header.approved', "Đã duyệt"),
            "Từ chối": T('export.header.rejected', "Từ chối"),
            "Ghi chú / Tỉ lệ lỗi": T('export.header.note_failure_rate', "Ghi chú / Tỉ lệ lỗi")
        };


        const dataToExport = currentReportData.map(item => {
            return {
                [exportHeaders["Loại báo cáo"]]: item.type || '',
                [exportHeaders["Hạng mục"]]: item.name || '',
                [exportHeaders["Thống kê (VND)"]]: item.total || 0,
                [exportHeaders["Đã duyệt"]]: item.approved || 0,
                [exportHeaders["Từ chối"]]: item.rejected || 0,
                [exportHeaders["Ghi chú / Tỉ lệ lỗi"]]: item.failureRate || '0%'
            };
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);

        const wscols = [
            {wch: 20}, {wch: 30}, {wch: 20},
            {wch: 15}, {wch: 15}, {wch: 20}
        ];
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, T('report.export.sheet_name', "BaoCaoTongHop"));

        const fileName = `${T('report.export.filename', "BaoCaoTongHop")}_${new Date().toISOString().split('T')[0]}.xlsx`;

        XLSX.writeFile(wb, fileName);
    }

    function setAIResult(html, isError = false) {
        const resultContent = document.querySelector('.ai-result-content');
        const placeholder = document.querySelector('.ai-placeholder');

        if (isError) {
            // 💡 Dịch: Lỗi Phân Tích Dữ Liệu:
            resultContent.innerHTML = `<div class="ai-insight-item warning"><span class="dot"></span><strong>${T('report.ai.error_data', 'Lỗi Phân Tích Dữ Liệu:')}</strong> ${html}</div>`;
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

        // 💡 Dịch: Yêu cầu phân tích
        const analyzeText = T('button.request_analysis', 'Yêu cầu phân tích');
        // 💡 Dịch: Đang phân tích...
        const loadingText = T('report.ai.loading_text', 'Đang phân tích...');
        // 💡 Dịch: Đang gửi dữ liệu tới AI (có thể mất vài giây)...
        const hintText = T('report.ai.loading_hint', 'Đang gửi dữ liệu tới AI (có thể mất vài giây)...');

        if (isLoading) {
            btn.disabled = true;
            btn.innerHTML = `
                <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="width: 1rem; height: 1rem; margin-right: 0.5rem; animation: spin 1s linear infinite;">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ${loadingText}`;

            if (placeholder) {
                placeholder.style.display = 'none';
            }
            resultContent.style.display = 'block';
            resultContent.innerHTML = `<div class="ai-insight-item info" style="font-weight:600;">${hintText}</div>`;
        } else {
            btn.disabled = false;
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 12z" />
                    <path d="M21 3v9h-9" />
                </svg>
                ${analyzeText}`;
        }
    }

    async function analyzeClaims() {
        setAILoading(true);
        try {
            const response = await fetch(API_GEMINI_URL);

            let rawText = await response.text();
            let result;

            if (!response.ok) {
                let errorDetails = T('report.error.loading_failed', `Lỗi HTTP ${response.status}`);
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
                // 💡 Dịch: Phản hồi không phải JSON hợp lệ
                throw new Error(`${T('report.ai.error_json', 'Phản hồi không phải JSON hợp lệ:')} ${e.message}. Dữ liệu thô: ${rawText.substring(0, 100)}...`);
            }

            if (result.error) {
                throw new Error(result.error);
            }

            if (result.insights && Array.isArray(result.insights)) {
                let html = result.insights.map(insight => {
                    let className = 'info';
                    // Nội dung phân tích AI này thường là Tiếng Anh, nhưng chúng ta giữ nguyên logic phân loại
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
                // 💡 Dịch: Dữ liệu phân tích trả về không đúng định dạng
                throw new Error(T('report.ai.error_format', "Dữ liệu phân tích trả về không đúng định dạng (thiếu trường 'insights' hoặc 'insights' không phải là mảng)."));
            }

        } catch (err) {
            console.error("Lỗi phân tích AI:", err);
            setAIResult(`${T('report.ai.error_loading_display', 'Không thể lấy phân tích. Chi tiết:')} ${err.message}`, true);
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