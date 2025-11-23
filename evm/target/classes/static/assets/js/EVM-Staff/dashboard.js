(function() {
    console.log("dashboard.js đã thực thi, bắt đầu tải dữ liệu...");

    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/dashboard';

    // 💡 Hàm tra cứu dịch thuật: Lấy giá trị từ window.messages hoặc sử dụng giá trị mặc định (fallback)
    const T = (key, fallbackText) => {
        // Kiểm tra nếu window.messages tồn tại và có chứa key đó
        if (window.messages && window.messages[key]) {
            return window.messages[key];
        }
        // Trả về giá trị mặc định nếu không tìm thấy
        return fallbackText;
    };


    async function loadOverviewStats() {
        // Lưu ý: Các chuỗi lỗi console.error không cần phải được dịch qua T()
        // nhưng chúng ta giữ nguyên các giá trị 'N/A' cho các số liệu.
        try {
            const res = await fetch(`${API_BASE}/overview`, { credentials: 'same-origin' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            document.getElementById("stat-total-parts").textContent = data.totalParts ?? '0';
            document.getElementById("stat-active-requests").textContent = data.activeRequests ?? '0';
            document.getElementById("stat-campaigns").textContent = data.activeCampaigns ?? '0';
            document.getElementById("stat-low-stock").textContent = data.lowStock ?? '0';
        } catch (e) {
            console.error("Lỗi tải dữ liệu tổng quan:", e);
            document.getElementById("stat-total-parts").textContent = "N/A";
            document.getElementById("stat-active-requests").textContent = "N/A";
            document.getElementById("stat-campaigns").textContent = "N/A";
            document.getElementById("stat-low-stock").textContent = "N/A";
        }
    }


    async function loadRecentAllocations() {
        try {
            const res = await fetch(`${API_BASE}/recent-allocations`, { credentials: 'same-origin' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const tbody = document.querySelector(".dashboard__table .dashboard__table-body");
            if (!tbody) return;
            tbody.innerHTML = "";

            if (data.length === 0) {
                // 💡 Sử dụng T() với khóa dịch dashboard.table.no_data
                const noDataText = T('dashboard.table.no_data', 'Không có dữ liệu cấp phát gần đây.');
                tbody.innerHTML = `
                    <tr class="dashboard__table-row">
                        <td colspan="5" class="dashboard__table-cell dashboard__table-cell--center">
                            ${noDataText}
                        </td>
                    </tr>`;
                return;
            }

            data.forEach(row => {
                const tr = document.createElement("tr");
                tr.className = "dashboard__table-row";
                tr.innerHTML = `
                    <td class="dashboard__table-cell">${row.requestCode}</td>
                    <td class="dashboard__table-cell">${row.partName}</td>
                    <td class="dashboard__table-cell">${row.quantity}</td>
                    <td class="dashboard__table-cell">${row.date}</td>
                    <td class="dashboard__table-cell">
                        <span class="status-tag ${row.statusClass}">${row.status}</span>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // 💡 Sử dụng T() với khóa dịch button.more
            const seeMoreText = T('button.more', 'Xem thêm');
            tbody.innerHTML += `
                <tr class="dashboard__table-row dashboard__table-row--more">
                    <td colspan="5" class="dashboard__table-cell dashboard__table-cell--center">
                        <button class="dashboard__btn-more">${seeMoreText}</button>
                    </td>
                </tr>
            `;

        } catch (error) {
            console.error("Lỗi tải lịch sử cấp phát:", error);
            const tbody = document.querySelector(".dashboard__table .dashboard__table-body");
            if (tbody) {
                // 💡 Sử dụng T() với khóa dịch error.load_data
                const errorDataText = T('error.load_data', 'Lỗi tải dữ liệu.');
                tbody.innerHTML = `
                    <tr class="dashboard__table-row">
                        <td colspan="5" class="dashboard__table-cell dashboard__table-cell--center" style="color: red;">
                            ${errorDataText}
                        </td>
                    </tr>`;
            }
        }
    }

    async function loadNotifications() {
        try {
            const res = await fetch(`${API_BASE}/notifications`, { credentials: 'same-origin' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const list = document.querySelector(".dashboard__reminder-list");
            if (!list) return;
            list.innerHTML = "";

            if (data.length === 0) {
                // 💡 Sử dụng T() với khóa dịch dashboard.notifications.no_new
                const noNotificationText = T('dashboard.notifications.no_new', 'Không có thông báo mới.');
                list.innerHTML = `<li class="dashboard__reminder-item">${noNotificationText}</li>`;
                return;
            }

            data.forEach(n => {
                const li = document.createElement("li");
                li.className = "dashboard__reminder-item";
                li.textContent = n.message;
                list.appendChild(li);
            });
        } catch (error) {
            console.error("Lỗi tải thông báo:", error);
            const list = document.querySelector(".dashboard__reminder-list");
            if (list) {
                // 💡 Sử dụng T() với khóa dịch error.load_notifications_display
                const errorNotificationText = T('error.load_notifications_display', 'Lỗi tải thông báo.');
                list.innerHTML = `<li class="dashboard__reminder-item" style="color: red;">${errorNotificationText}</li>`;
            }
        }
    }

    loadOverviewStats();
    loadRecentAllocations();
    loadNotifications();

})();