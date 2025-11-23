(function () {
    console.log("SC-Staff Dashboard script loaded");

    function getContextPath() {
        return (window.contextPath || '/evm').replace(/\/$/, '');
    }

    const contextPath = getContextPath();
    const apiBase = `${contextPath}/api/sc-staff/dashboard`;
    const loginPath = contextPath + '/login';

    // Run loads after DOM is ready so elements exist (prevents early return)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadSummary();
            loadCampaigns();
            loadSchedule();
            loadNotifications();
        });
    } else {
        loadSummary();
        loadCampaigns();
        loadSchedule();
        loadNotifications();
    }

    async function loadSummary() {
        try {
            const res = await fetch(`${apiBase}/summary`, { credentials: 'same-origin' });
            if (res.status === 401 || res.status === 403) {
                // not authorized for SCStaff -> redirect to login
                window.location.href = loginPath;
                return;
            }
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

    // Pagination-enabled campaigns loader: fetch once, then render 5 rows/page
    async function loadCampaigns() {
        const tbody = document.getElementById("campaigns-tbody");
        const infoEl = document.getElementById('campaignsPaginationInfo');
        const prevBtn = document.getElementById('campaignsPrevBtn');
        const nextBtn = document.getElementById('campaignsNextBtn');
        const pageNumberEl = document.getElementById('campaignsPageNumber');

        if (!tbody) {
            console.warn("Không tìm thấy #campaigns-tbody");
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
            const res = await fetch(`${apiBase}/campaigns`, { credentials: 'same-origin' });
            if (res.status === 401 || res.status === 403) {
                window.location.href = loginPath;
                return;
            }
            if (!res.ok) throw new Error("Failed to load campaigns");

            const allCampaigns = await res.json();
            const campaigns = Array.isArray(allCampaigns) ? allCampaigns : [];

            const PAGE_SIZE = 5;
            let currentPage = 1;

            function renderPage() {
                const total = campaigns.length;
                const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
                if (currentPage < 1) currentPage = 1;
                if (currentPage > totalPages) currentPage = totalPages;

                const start = (currentPage - 1) * PAGE_SIZE;
                const pageItems = campaigns.slice(start, start + PAGE_SIZE);

                if (!pageItems.length) {
                    tbody.innerHTML = `\n                        <tr>\n                            <td colspan="5" class="table-placeholder-cell">Không có chiến dịch đang tham gia</td>\n                        </tr>\n                    `;
                } else {
                    // Render same columns as campaign_management: campaignID, name, date, status, description
                    function formatDateDisplay(dateStr) {
                        if (!dateStr) return "";
                        try {
                            const iso = String(dateStr).substring(0, 10);
                            const parts = iso.split('-');
                            if (parts.length !== 3) return dateStr;
                            return `${parts[2]}/${parts[1]}/${parts[0]}`;
                        } catch (e) {
                            return dateStr;
                        }
                    }

                    tbody.innerHTML = pageItems.map(c => {
                        const code = c.campaignID ?? c.id ?? '';
                        const name = c.name ?? c.title ?? c.description ?? '';
                        const date = formatDateDisplay(c.date ?? c.createdAt ?? c.createdDate);
                        const status = c.status ?? c.progress ?? '';
                        const desc = c.description ?? '';
                        return `
                            <tr>
                                <td>${escapeHtml(code)}</td>
                                <td>${escapeHtml(name)}</td>
                                <td>${escapeHtml(date)}</td>
                                <td>${escapeHtml(status)}</td>
                                <td>${escapeHtml(desc)}</td>
                            </tr>
                        `;
                    }).join('');
                }

                // Show range like: "Hiển thị 1-5 của 20" when paging
                if (infoEl) {
                    if (total === 0) {
                        infoEl.textContent = 'Hiển thị 0 của 0';
                    } else {
                        const startIndex = (currentPage - 1) * PAGE_SIZE;
                        const displayStart = startIndex + 1;
                        const displayEnd = Math.min(total, startIndex + pageItems.length);
                        infoEl.textContent = `Hiển thị ${displayStart}-${displayEnd} của ${total}`;
                    }
                }
                if (pageNumberEl) pageNumberEl.textContent = String(currentPage);
                if (prevBtn) prevBtn.disabled = currentPage <= 1;
                if (nextBtn) nextBtn.disabled = currentPage >= Math.max(1, Math.ceil(campaigns.length / PAGE_SIZE));
            }

            if (prevBtn) prevBtn.addEventListener('click', function () { if (currentPage > 1) { currentPage--; renderPage(); } });
            if (nextBtn) nextBtn.addEventListener('click', function () { const totalPages = Math.max(1, Math.ceil(campaigns.length / PAGE_SIZE)); if (currentPage < totalPages) { currentPage++; renderPage(); } });

            // initial render
            renderPage();

        } catch (e) {
            console.error("Lỗi load campaigns:", e);
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="table-placeholder-cell">
                        <em>Lỗi tải dữ liệu chiến dịch</em>
                    </td>
                </tr>
            `;
            if (infoEl) infoEl.textContent = 'Hiển thị 0 của 0';
            if (pageNumberEl) pageNumberEl.textContent = '1';
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
            const res = await fetch(`${apiBase}/schedule-today`, { credentials: 'same-origin' });
            if (res.status === 401 || res.status === 403) {
                window.location.href = loginPath;
                return;
            }
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
            const res = await fetch(`${apiBase}/notifications`, { credentials: 'same-origin' });
            if (res.status === 401 || res.status === 403) {
                window.location.href = loginPath;
                return;
            }
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
