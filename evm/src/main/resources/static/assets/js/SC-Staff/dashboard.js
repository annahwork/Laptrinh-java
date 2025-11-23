(function () {
    console.log("SC-Staff Dashboard script loaded");

    // 💡 Hàm tra cứu dịch thuật (giả định)
    const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

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
            // 💡 Dịch: Failed to load summary
            if (!res.ok) throw new Error(T('error.load_summary_failed', "Failed to load summary"));

            const data = await res.json();

            setText("total-vehicles", data.totalVehicles ?? 0);
            setText("total-customers", data.totalCustomers ?? 0);
            setText("total-warranty", data.totalWarranty ?? 0);
            setText("total-campaigns", data.totalCampaigns ?? 0);
        } catch (e) {
            console.error(T('error.load_summary_failed', "Lỗi load summary:"), e);
            setText("total-vehicles", "--");
            setText("total-customers", "--");
            setText("total-warranty", "--");
            setText("total-campaigns", "--");
        }
    }

    async function loadCampaigns() {
        const tbody = document.getElementById("campaigns-tbody");
        const loadingText = T('message.loading_data', 'Đang tải dữ liệu...');

        if (!tbody) {
            console.warn("Không tìm thấy #campaigns-tbody");
            return;
        }

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="table-placeholder-cell">
                    <em>${loadingText}</em>
                </td>
            </tr>
        `;

        try {
            const res = await fetch(`${apiBase}/campaigns`);
            if (!res.ok) throw new Error(T('campaign.error.load_list', "Failed to load campaigns"));

            const campaigns = await res.json();

            if (!campaigns || campaigns.length === 0) {
                // 💡 Dịch: Không có chiến dịch đang tham gia
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="table-placeholder-cell">
                            <em>${T('dashboard.sc_staff.no_campaigns', 'Không có chiến dịch đang tham gia')}</em>
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
                    <td>${escapeHtml(T(`status.${progress.toLowerCase()}`, progress))}</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (e) {
            console.error(T('campaign.error.load_list', "Lỗi load campaigns:"), e);
            // 💡 Dịch: Lỗi tải dữ liệu chiến dịch
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="table-placeholder-cell">
                        <em>${T('campaign.error.load_data', 'Lỗi tải dữ liệu chiến dịch')}</em>
                    </td>
                </tr>
            `;
        }
    }

    async function loadSchedule() {
        const tbody = document.getElementById("schedule-tbody");
        const loadingText = T('message.loading_data', 'Đang tải dữ liệu...');

        if (!tbody) {
            console.warn("Không tìm thấy #schedule-tbody");
            return;
        }

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="table-placeholder-cell">
                    <em>${loadingText}</em>
                </td>
            </tr>
        `;

        try {
            const res = await fetch(`${apiBase}/schedule-today`);
            if (!res.ok) throw new Error(T('schedule.error.load', "Failed to load schedule"));

            const schedules = await res.json();

            if (!schedules || schedules.length === 0) {
                // 💡 Dịch: Hôm nay chưa có lịch làm việc
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="table-placeholder-cell">
                            <em>${T('schedule.no_data_today', 'Hôm nay chưa có lịch làm việc')}</em>
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = "";
            const scheduledStatus = T('status.scheduled', 'Đã lên lịch');

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
                const status = scheduledStatus; // Sử dụng chuỗi dịch

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
            console.error(T('schedule.error.load', "Lỗi load schedule:"), e);
            // 💡 Dịch: Lỗi tải lịch làm việc
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="table-placeholder-cell">
                        <em>${T('schedule.error.load_data', 'Lỗi tải lịch làm việc')}</em>
                    </td>
                </tr>
            `;
        }
    }

    async function loadNotifications() {
        const container = document.getElementById("notifications-container");
        const loadingText = T('notification.loading', 'Đang tải thông báo...');

        if (!container) {
            console.warn("Không tìm thấy #notifications-container");
            return;
        }

        container.innerHTML = `<p class="empty-message">${loadingText}</p>`;

        try {
            const res = await fetch(`${apiBase}/notifications`);
            if (!res.ok) throw new Error(T('notification.error.load', "Failed to load notifications"));

            const notifications = await res.json();

            if (!notifications || notifications.length === 0) {
                // 💡 Dịch: Chưa có thông báo mới
                container.innerHTML = `<p class="empty-message">${T('notification.empty_message', 'Chưa có thông báo mới')}</p>`;
                return;
            }

            container.innerHTML = "";

            const notificationTitle = T('notification.title_default', 'Thông báo');

            notifications.forEach(n => {
                const div = document.createElement("div");
                div.classList.add("notification-item");

                const title = n.title ?? notificationTitle;
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
            console.error(T('notification.error.load', "Lỗi load notifications:"), e);
            // 💡 Dịch: Lỗi tải thông báo
            container.innerHTML = `<p class="empty-message">${T('notification.error.load_data', 'Lỗi tải thông báo')}</p>`;
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