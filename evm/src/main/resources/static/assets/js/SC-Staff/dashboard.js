(function () {
    console.log("SC-Staff Dashboard script loaded");

    function getContextPath() {
        return (window.contextPath || '/evm').replace(/\/$/, '');
    }

    const contextPath = getContextPath();
    const apiBase = `${contextPath}/api/sc-staff/dashboard`;

    loadSummary();
    loadCampaigns();
    loadSchedule();
    loadNotifications();

    async function loadSummary() {
        try {
            const res = await fetch(`${apiBase}/summary`);
            if (!res.ok) throw new Error("Failed to load summary");

            const data = await res.json();

            setText("total-vehicles", data.totalVehicles ?? 0);
            setText("total-customers", data.totalCustomers ?? 0);
            setText("total-warranty", data.totalWarranty ?? 0);
            setText("total-campaigns", data.totalCampaigns ?? 0);
        } catch (e) {
            console.error("Lỗi load summary:", e);
            setText("total-vehicles", "--");
            setText("total-customers", "--");
            setText("total-warranty", "--");
            setText("total-campaigns", "--");
        }
    }

    async function loadCampaigns() {
        const tbody = document.getElementById("campaigns-tbody");
        if (!tbody) {
            console.warn("Không tìm thấy #campaigns-tbody");
            return;
        }

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="table-placeholder-cell">
                    <em>Đang tải dữ liệu...</em>
                </td>
            </tr>
        `;

        try {
            const res = await fetch(`${apiBase}/campaigns`);
            if (!res.ok) throw new Error("Failed to load campaigns");

            const campaigns = await res.json();

            if (!campaigns || campaigns.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="table-placeholder-cell">
                            <em>Không có chiến dịch đang tham gia</em>
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = "";

            campaigns.forEach(c => {
                const tr = document.createElement("tr");

                const code = c.id ?? c.campaignID ?? "";
                const category = c.name ?? c.description ?? "";
                const relatedVehicles = Array.isArray(c.vehiclesInCampaign) ? c.vehiclesInCampaign.length : "";
                const progress = c.status ?? "";

                tr.innerHTML = `
                    <td>${escapeHtml(code)}</td>
                    <td>${escapeHtml(category)}</td>
                    <td>${escapeHtml(relatedVehicles)}</td>
                    <td>${escapeHtml(progress)}</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (e) {
            console.error("Lỗi load campaigns:", e);
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="table-placeholder-cell">
                        <em>Lỗi tải dữ liệu chiến dịch</em>
                    </td>
                </tr>
            `;
        }
    }

    async function loadSchedule() {
        const tbody = document.getElementById("schedule-tbody");
        if (!tbody) {
            console.warn("Không tìm thấy #schedule-tbody");
            return;
        }

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="table-placeholder-cell">
                    <em>Đang tải dữ liệu...</em>
                </td>
            </tr>
        `;

        try {
            const res = await fetch(`${apiBase}/schedule-today`);
            if (!res.ok) throw new Error("Failed to load schedule");

            const schedules = await res.json();

            if (!schedules || schedules.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="table-placeholder-cell">
                            <em>Hôm nay chưa có lịch làm việc</em>
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = "";

            schedules.forEach(s => {
                const tr = document.createElement("tr");

                const time = formatDateTime(s.date);
                const vin = s.vehicle && s.vehicle.vin ? s.vehicle.vin : "--";
                const customerName =
                    s.customer && (s.customer.name || s.customer.fullName || s.customer.customerName)
                        ? (s.customer.name || s.customer.fullName || s.customer.customerName)
                        : "";
                const content =
                    (s.recallCampaign && (s.recallCampaign.name || s.recallCampaign.description)) ||
                    s.note ||
                    "";
                const status = "Đã lên lịch";

                tr.innerHTML = `
                    <td>${escapeHtml(time)}</td>
                    <td>${escapeHtml(vin)}</td>
                    <td>${escapeHtml(customerName)}</td>
                    <td>${escapeHtml(content)}</td>
                    <td>${escapeHtml(status)}</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (e) {
            console.error("Lỗi load schedule:", e);
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="table-placeholder-cell">
                        <em>Lỗi tải lịch làm việc</em>
                    </td>
                </tr>
            `;
        }
    }

    async function loadNotifications() {
        const container = document.getElementById("notifications-container");
        if (!container) {
            console.warn("Không tìm thấy #notifications-container");
            return;
        }

        container.innerHTML = `<p class="empty-message">Đang tải thông báo...</p>`;

        try {
            const res = await fetch(`${apiBase}/notifications`);
            if (!res.ok) throw new Error("Failed to load notifications");

            const notifications = await res.json();

            if (!notifications || notifications.length === 0) {
                container.innerHTML = `<p class="empty-message">Chưa có thông báo mới</p>`;
                return;
            }

            container.innerHTML = "";

            notifications.forEach(n => {
                const div = document.createElement("div");
                div.classList.add("notification-item");

                const title = n.title ?? "Thông báo";
                const message = n.message ?? "";
                const createdAt = n.createdAt ? formatDateTime(n.createdAt) : "";

                div.innerHTML = `
                    <div class="notification-title">${escapeHtml(title)}</div>
                    <div class="notification-meta">${escapeHtml(createdAt)}</div>
                    <div class="notification-content">${escapeHtml(message)}</div>
                `;
                container.appendChild(div);
            });
        } catch (e) {
            console.error("Lỗi load notifications:", e);
            container.innerHTML = `<p class="empty-message">Lỗi tải thông báo</p>`;
        }
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function formatDateTime(value) {
        if (!value) return "";
        try {
            const d = new Date(value);
            if (isNaN(d.getTime())) return value;

            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            const hour = String(d.getHours()).padStart(2, "0");
            const minute = String(d.getMinutes()).padStart(2, "0");

            return `${day}/${month}/${year} ${hour}:${minute}`;
        } catch (e) {
            console.error("Lỗi format datetime:", e);
            return value;
        }
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

})();
