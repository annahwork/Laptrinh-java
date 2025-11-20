
(function () {
    'use strict';

    console.log('Performance script loaded');


    const API_PERFORMANCE = '/evm/api/performance';

    let statusChartInstance = null;

    const totalClaimsValueEl = document.getElementById('totalClaimsValue');
    const totalClaimsLabelEl = document.getElementById('totalClaimsLabel');
    const completedClaimsValueEl = document.getElementById('completedClaimsValue');
    const completedClaimsLabelEl = document.getElementById('completedClaimsLabel');
    const pendingClaimsValueEl = document.getElementById('pendingClaimsValue');
    const pendingClaimsLabelEl = document.getElementById('pendingClaimsLabel');
    const filterRangeEl = document.getElementById('filterRange');
    const chartCanvas = document.getElementById('statusChart');

    function getRangeText(range) {
        switch (range) {
            case 'week': return 'trong tuần';
            case 'month': return 'trong tháng';
            case 'quarter': return 'trong quý';
            default: return 'trong kỳ';
        }
    }

    function renderPerformanceData(data) {
        const total = data.totalClaims || 0;
        const completed = data.completedClaims || 0;
        const pending = total - completed; 
        const percentage = (total > 0) ? (completed / total) * 100 : 0;

        const range = filterRangeEl ? filterRangeEl.value : 'week';
        const rangeText = getRangeText(range);

        if (totalClaimsValueEl) totalClaimsValueEl.textContent = total;
        if (totalClaimsLabelEl) totalClaimsLabelEl.textContent = `Tất cả công việc ${rangeText}`;

        if (completedClaimsValueEl) completedClaimsValueEl.textContent = completed;
        if (completedClaimsLabelEl) completedClaimsLabelEl.textContent = `Chiếm ${percentage.toFixed(1)}%`;

        if (pendingClaimsValueEl) pendingClaimsValueEl.textContent = pending < 0 ? 0 : pending;
        if (pendingClaimsLabelEl) pendingClaimsLabelEl.textContent = `Còn lại ${rangeText}`;
    }

    function renderStatusChart(data) {
        if (!chartCanvas) return;
        
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded. Cannot render chart.');
            chartCanvas.getContext('2d').fillText('Không thể tải biểu đồ. (Thiếu Chart.js)', 10, 50);
            return;
        }

        const total = data.totalClaims || 0;
        const completed = data.completedClaims || 0;
        const pending = total - completed < 0 ? 0 : total - completed;

        const chartData = {
            labels: ['Đã hoàn tất', 'Đang xử lý'],
            datasets: [{
                data: [completed, pending],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.8)',
                    'rgba(23, 162, 184, 0.8)'  
                ],
                borderColor: [
                    '#28a745',
                    '#17a2b8'
                ],
                borderWidth: 1
            }]
        };

        if (statusChartInstance) {
            statusChartInstance.destroy();
        }

        statusChartInstance = new Chart(chartCanvas.getContext('2d'), {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed;
                                }
                                return label;
                            }
                        }
                    }
                },
                cutout: '70%' 
            }
        });
    }

    function showLoading(isLoading) {
        if (isLoading) {
            if (totalClaimsValueEl) totalClaimsValueEl.textContent = '...';
            if (completedClaimsValueEl) completedClaimsValueEl.textContent = '...';
            if (pendingClaimsValueEl) pendingClaimsValueEl.textContent = '...';
            if (completedClaimsLabelEl) completedClaimsLabelEl.textContent = 'Đang tải...';
        } 
    }

    async function fetchPerformanceData() {
        const range = filterRangeEl ? filterRangeEl.value : 'week';
        showLoading(true);

        try {

            const res = await fetch(`${API_PERFORMANCE}?range=${range}`);
            
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const responseData = await res.json();
            let data;

            if (Array.isArray(responseData)) {
                data = {
                    totalClaims: responseData[0] || 0,
                    completedClaims: responseData[1] || 0
                };
            } else {
                data = responseData;
            }

            renderPerformanceData(data);
            renderStatusChart(data);

        } catch (err) {
            console.error('Fetch error:', err);
            if (totalClaimsValueEl) totalClaimsValueEl.textContent = 'Lỗi';
            if (completedClaimsValueEl) completedClaimsValueEl.textContent = 'Lỗi';
            if (pendingClaimsValueEl) pendingClaimsValueEl.textContent = 'Lỗi';
            if (completedClaimsLabelEl) completedClaimsLabelEl.textContent = 'Không thể tải dữ liệu';
        }
    }
    function init() {
        if (!document.querySelector('.performance-page')) {
            return;
        }
        
        console.log('Initializing Performance Page...');

        if (filterRangeEl) {
            filterRangeEl.addEventListener('change', fetchPerformanceData);
        }

        fetchPerformanceData();
    }

    setTimeout(init, 300);

})();