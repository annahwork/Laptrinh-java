(function () {
    "use strict";

    console.log("SC-Staff Campaign Management (view only) JS loaded");

    // ====== CẤU HÌNH ======
    const API_BASE = "/evm/api/sc-staff/dashboard/campaigns";

    const tbody = document.getElementById("campaignsTbody");

    const searchBox = document.getElementById("searchCampaignBox");
    const statusFilter = document.getElementById("campaignStatusFilter");
    const dateFilter = document.getElementById("campaignDateFilter");

    const paginationInfo = document.getElementById("paginationInfo");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const currentPageSpan = document.getElementById("currentPageSpan");

    // CHỈ XEM NÊN KHÔNG DÙNG FORM/MODAL NỮA

    // state
    let campaigns = [];
    let filteredCampaigns = [];
    let currentPage = 1;
    const PAGE_SIZE = 5; // mỗi trang 5 chiến dịch

    // ====== UTIL ======
    function escapeHtml(str) {
        return String(str ?? "").replace(/[&<>"'`=\/]/g, s => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;",
            "`": "&#x60;",
            "=": "&#x3D;"
        })[s]);
    }

    function normalizeDateForInput(dateStr) {
        if (!dateStr) return "";
        // BE trả "2025-11-20T00:00:00" -> "2025-11-20"
        return String(dateStr).substring(0, 10);
    }

    function formatDateDisplay(dateStr) {
        // input: "2025-11-20" hoặc "2025-11-20T00:00:00"
        if (!dateStr) return "";
        const iso = normalizeDateForInput(dateStr);
        const parts = iso.split("-");
        if (parts.length !== 3) return dateStr;
        const [y, m, d] = parts;
        return `${d}/${m}/${y}`;
    }

    // ====== API (CHỈ GET) ======
    async function apiGetList() {
        const res = await fetch(API_BASE, { credentials: "include" });
        if (!res.ok) throw new Error("Không tải được danh sách chiến dịch");
        return await res.json();
    }

    // ====== RENDER BẢNG + PHÂN TRANG ======
    function renderTablePage() {
        if (!tbody) return;

        tbody.innerHTML = "";

        if (!filteredCampaigns.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="table-placeholder-cell">
                        Không có chiến dịch nào.
                    </td>
                </tr>
            `;
            paginationInfo && (paginationInfo.textContent = "Hiển thị 0 của 0");
            currentPageSpan && (currentPageSpan.textContent = "1");
            if (prevPageBtn) prevPageBtn.disabled = true;
            if (nextPageBtn) nextPageBtn.disabled = true;
            return;
        }

        const total = filteredCampaigns.length;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const pageItems = filteredCampaigns.slice(startIndex, startIndex + PAGE_SIZE);

        // campaignID ở cột đầu tiên như m muốn
        const rowsHtml = pageItems.map(c => `
            <tr>
                <td>${escapeHtml(c.campaignID)}</td>
                <td>${escapeHtml(c.name)}</td>
                <td>${escapeHtml(formatDateDisplay(c.date))}</td>
                <td>${escapeHtml(c.status)}</td>
                <td>${escapeHtml(c.description)}</td>
            </tr>
        `).join("");

        tbody.innerHTML = rowsHtml;

        // text "Hiển thị X-Y của N"
        if (paginationInfo) {
            const startRow = startIndex + 1;
            const endRow = Math.min(startIndex + PAGE_SIZE, total);
            paginationInfo.textContent = `Hiển thị ${startRow}-${endRow} của ${total}`;
        }

        if (currentPageSpan) currentPageSpan.textContent = String(currentPage);

        if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
    }

    // ====== FILTER LOCAL (SEARCH + STATUS + DATE) ======
    function applyFiltersAndRender() {
        let data = Array.isArray(campaigns) ? campaigns.slice() : [];

        const kw = (searchBox?.value || "").toLowerCase().trim();
        const st = statusFilter?.value || "";
        const dt = dateFilter?.value || "";

        if (kw) {
            data = data.filter(c =>
                String(c.campaignID || "").toLowerCase().includes(kw) ||
                String(c.name || "").toLowerCase().includes(kw)
            );
        }

        if (st) {
            data = data.filter(c => String(c.status || "") === st);
        }

        if (dt) {
            data = data.filter(c => normalizeDateForInput(c.date) === dt);
        }

        filteredCampaigns = data;
        currentPage = 1;
        renderTablePage();
    }

    // ====== LOAD LẦN ĐẦU ======
    async function refreshTable() {
        try {
            const list = await apiGetList();
            campaigns = Array.isArray(list) ? list : [];
            applyFiltersAndRender();
        } catch (err) {
            console.error(err);
            alert(err.message || "Lỗi tải danh sách chiến dịch");
        }
    }

    // ====== SỰ KIỆN ======
    searchBox && searchBox.addEventListener("input", applyFiltersAndRender);
    statusFilter && statusFilter.addEventListener("change", applyFiltersAndRender);
    dateFilter && dateFilter.addEventListener("change", applyFiltersAndRender);

    prevPageBtn && prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTablePage();
        }
    });

    nextPageBtn && nextPageBtn.addEventListener("click", () => {
        const total = filteredCampaigns.length;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        if (currentPage < totalPages) {
            currentPage++;
            renderTablePage();
        }
    });

    // KHỞI ĐỘNG
    refreshTable();

})();
