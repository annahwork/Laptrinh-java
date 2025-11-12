(function() {
    console.log("dashboard.js đã thực thi, bắt đầu tải dữ liệu...");

    // URL API (dùng contextPath nếu có)
    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/dashboard';

    /**
     * Tải dữ liệu cho 4 thẻ thống kê
     */
    async function loadOverviewStats() {
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

    /**
     * Tải dữ liệu cho bảng "Cấp phát phụ tùng gần đây"
     */
    async function loadRecentAllocations() {
        try {
            const res = await fetch(`${API_BASE}/recent-allocations`, { credentials: 'same-origin' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const tbody = document.querySelector(".dashboard__table .dashboard__table-body");
            if (!tbody) return;
            tbody.innerHTML = ""; // Xóa các hàng static

            if (data.length === 0) {
                tbody.innerHTML = `
                    <tr class="dashboard__table-row">
                        <td colspan="5" class="dashboard__table-cell dashboard__table-cell--center">
                            Không có dữ liệu cấp phát gần đây.
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

            // Thêm nút "Xem thêm"
            tbody.innerHTML += `
                <tr class="dashboard__table-row dashboard__table-row--more">
                    <td colspan="5" class="dashboard__table-cell dashboard__table-cell--center">
                        <button class="dashboard__btn-more">Xem thêm</button>
                    </td>
                </tr>
            `;

        } catch (error) {
            console.error("Lỗi tải lịch sử cấp phát:", error);
            const tbody = document.querySelector(".dashboard__table .dashboard__table-body");
            if (tbody) {
                tbody.innerHTML = `
                    <tr class="dashboard__table-row">
                        <td colspan="5" class="dashboard__table-cell dashboard__table-cell--center" style="color: red;">
                            Lỗi tải dữ liệu.
                        </td>
                    </tr>`;
            }
        }
    }

    /**
     * Tải dữ liệu cho danh sách "Thông báo & nhắc việc"
     */
    async function loadNotifications() {
        try {
            const res = await fetch(`${API_BASE}/notifications`, { credentials: 'same-origin' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const list = document.querySelector(".dashboard__reminder-list");
            if (!list) return;
            list.innerHTML = ""; // Xóa các thông báo static

            if (data.length === 0) {
                list.innerHTML = `<li class="dashboard__reminder-item">Không có thông báo mới.</li>`;
                return;
            }

            data.forEach(n => {
                const li = document.createElement("li");
                li.className = "dashboard__reminder-item";
                li.textContent = n.message; // API trả về message đã có icon
                list.appendChild(li);
            });
        } catch (error) {
            console.error("Lỗi tải thông báo:", error);
            const list = document.querySelector(".dashboard__reminder-list");
            if (list) {
                list.innerHTML = `<li class="dashboard__reminder-item" style="color: red;">Lỗi tải thông báo.</li>`;
            }
        }
    }

    // Gọi trực tiếp khi file được load động
    loadOverviewStats();
    loadRecentAllocations();
    loadNotifications();

})();
