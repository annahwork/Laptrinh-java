(function () {
    'use strict';

    console.log('Dashboard script loaded');

    const API_CAMPAIGNS = '/evm/api/recall'; 
    const API_SCHEDULE = '/evm/api/schedulevehicle'; 
    const API_NOTICES = '/evm/api/latestNotification'; 

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }

    function formatTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit', minute: '2-digit'
        });
    }

    function formatScheduleStatus(status) {
        const lowerStatus = status?.toLowerCase() || 'pending';
        switch (lowerStatus) {
            case 'completed': return { text: 'Hoàn tất', class: 'completed' };
            case 'inprogress': return { text: 'Đang sửa', class: 'inprogress' };
            case 'pending':
            default:
                return { text: 'Chờ xử lý', class: 'pending' };
        }
    }

    function renderCampaigns(campaignData) {
        const tbody = document.querySelector("#campaign-table tbody");
        if (!tbody) return;
        tbody.innerHTML = "";
        if (!campaignData || campaignData.length === 0) {
            tbody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Không có chiến dịch nào đang tham gia.</td></tr>";
            return;
        }
        
        campaignData.forEach(rv => {
            const tr = document.createElement("tr");
            
            const maChienDich = rv.campaignCode || 'N/A';
            const hangMuc = rv.recallCampaign?.name || 'N/A';
            const xeLienQuan = rv.vin || 'N/A';
            const tienDo = formatScheduleStatus(rv.status).text; 

            tr.innerHTML = `
                <td>${maChienDich}</td>
                <td>${hangMuc}</td>
                <td>${xeLienQuan}</td>
                <td>${tienDo}</td> 
            `;
            tbody.appendChild(tr);
        });
    }

    function renderSchedule(scheduleData) {
        const tbody = document.querySelector("#schedule-table tbody");
        if (!tbody) return;
        tbody.innerHTML = ""; 

        if (!scheduleData || scheduleData.length === 0) {
            tbody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>Không có lịch làm việc hôm nay.</td></tr>";
            return;
        }
        
        scheduleData.forEach(row => {
            const tr = document.createElement("tr");
            const statusInfo = formatScheduleStatus(row[4]); 
            
            tr.innerHTML = `
                <td>${formatTime(row[0])}</td>  <td>${row[1] || 'N/A'}</td>   <td>${row[2] || 'N/A'}</td>   <td>${row[3] || 'N/A'}</td>   <td><span class="status ${statusInfo.class}">${statusInfo.text}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderNotices(noticeData) {
        const list = document.getElementById("notice-list");
        if (!list) return;
        list.innerHTML = ""; 

        if (!noticeData || !noticeData.notificationID) { 
            list.innerHTML = "<p style='text-align:center; padding:1rem;'>Không có thông báo mới.</p>";
            return;
        }

        const n = noticeData;
        const item = document.createElement("div");
        item.className = "notice-item";
        item.innerHTML = `
            <p>
                <strong>${n.title || 'Thông báo mới'}</strong>
                <span>(${formatDate(n.timestamp || new Date())})</span>
            </p>
            <p>${n.message || 'Không có nội dung.'}</p>
        `;
        list.appendChild(item);
    }

    async function fetchCampaigns() {
        const tbody = document.querySelector("#campaign-table tbody");
        if (tbody) tbody.innerHTML = `<tr><td colspan='4' class="loading-data" style="text-align:center;">Đang tải...</td></tr>`;
        try {
            const res = await fetch(API_CAMPAIGNS);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            renderCampaigns(data);
        } catch (err) {
            console.error("Lỗi tải chiến dịch:", err);
            if (tbody) tbody.innerHTML = `<tr><td colspan='4' class="error-data" style="text-align:center;">Lỗi tải chiến dịch.</td></tr>`;
        }
    }

    async function fetchSchedule() {
        const tbody = document.querySelector("#schedule-table tbody");
        if (tbody) tbody.innerHTML = `<tr><td colspan='5' class="loading-data" style="text-align:center;">Đang tải...</td></tr>`;
        try {
            const res = await fetch(API_SCHEDULE);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            renderSchedule(data);
        } catch (err) {
            console.error("Lỗi tải lịch làm việc:", err);
            if (tbody) tbody.innerHTML = `<tr><td colspan='5' class="error-data" style="text-align:center;">Lỗi tải lịch.</td></tr>`;
        }
    }

    async function fetchNotices() {
        const list = document.getElementById("notice-list");
        if (list) list.innerHTML = `<div class="loading-data" style="padding: 1rem; text-align: center;">Đang tải...</div>`;
        try {
            const res = await fetch(API_NOTICES);
            if (!res.ok) {
                if (res.status === 404) {
                    renderNotices(null);
                    return;
                }
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            renderNotices(data);
        } catch (err) {
            console.error("Lỗi tải thông báo:", err);
            if (list) list.innerHTML = `<div class="error-data" style="padding: 1rem; text-align: center;">Lỗi tải thông báo.</div>`;
        }
    }
    
    
    function init() {
        fetchSchedule();
        fetchCampaigns();
        fetchNotices();
        
        console.log('Dashboard initialized successfully');
    }

    setTimeout(init, 300);

})();