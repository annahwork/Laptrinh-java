(function () {
    console.log("dashboard.js đã thực thi, bắt đầu tải dữ liệu...");

    const API_BASE = (window.contextPath || '/evm/') + 'api/evm_staff/dashboard';

    let allocPage = 1;
    const allocPageSize = 5;

    // Lấy các element phân trang
    const btnPrev = document.getElementById('allocBtnPrev');
    const btnNext = document.getElementById('allocBtnNext');
    const btnCurrent = document.getElementById('allocBtnCurrent');
    const paginationInfo = document.getElementById('allocPaginationInfo');
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


    async function loadRecentAllocations(page) {
        try {
            allocPage = page;

            const res = await fetch(`${API_BASE}/recent-allocations?page=${page}&pageSize=${allocPageSize}`, { credentials: 'same-origin' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const tbody = document.querySelector(".dashboard__table .dashboard__table-body");
            if (!tbody) return;
            tbody.innerHTML = "";

            if (data.length === 0) {
                tbody.innerHTML = `
                    <tr class="dashboard__table-row">
                        <td colspan="5" class="dashboard__table-cell dashboard__table-cell--center">
                            Không có dữ liệu cấp phát.
                        </td>
                    </tr>`;
                updatePaginationButtons(0);
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

            updatePaginationButtons(data.length);

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

    function updatePaginationButtons(itemCount) {
        if (btnCurrent) btnCurrent.textContent = allocPage;
        if (paginationInfo) {
            const start = (allocPage - 1) * allocPageSize + 1;
            const end = Math.max(start, start + (itemCount ? itemCount - 1 : 0));
            // Best-effort: backend may not provide totalRecords here, so we show start-end. If total becomes available, consider appending 'của N'.
            if (itemCount === 0) {
                paginationInfo.textContent = 'Hiển thị 0 của 0';
            } else {
                paginationInfo.textContent = `Hiển thị ${start} - ${end}`;
            }
        }

        if (btnPrev) {
            btnPrev.disabled = allocPage <= 1;
            btnPrev.style.opacity = allocPage <= 1 ? '0.5' : '1';
        }

        if (btnNext) {
            const isLastPage = itemCount < allocPageSize;
            btnNext.disabled = isLastPage;
            btnNext.style.opacity = isLastPage ? '0.5' : '1';
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
                list.innerHTML = `<li class="dashboard__reminder-item">Không có thông báo mới.</li>`;
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
                list.innerHTML = `<li class="dashboard__reminder-item" style="color: red;">Lỗi tải thông báo.</li>`;
            }
        }
    }
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (allocPage > 1) {
                loadRecentAllocations(allocPage - 1);
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (!btnNext.disabled) {
                loadRecentAllocations(allocPage + 1);
            }
        });
    }

    loadOverviewStats();
    loadRecentAllocations(1);
    loadNotifications();

})();
