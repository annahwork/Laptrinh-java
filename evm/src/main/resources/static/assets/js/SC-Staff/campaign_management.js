(function () {
    "use strict";

    console.log("SC-Staff Campaign Management JS loaded");

    // ================== API BASE ==================
    const API_BASE = "/evm/api/scstaff/campaigns";

    // ================== DOM ==================
    const tbody = document.getElementById("campaignsTbody");

    const btnOpenForm = document.getElementById("btnMoFormCampaign");
    const modal = document.getElementById("modalQuanLyChienDich");
    const btnClose = document.getElementById("campaignCloseBtn");
    const btnCancel = document.getElementById("campaignCancelBtn");
    const form = document.getElementById("campaignForm");
    const modalTitle = document.getElementById("modalTitle");
    const submitBtn = document.getElementById("campaignSubmitBtn");

    const searchBox = document.getElementById("searchCampaignBox");
    const statusFilter = document.getElementById("campaignStatusFilter");
    const dateFilter = document.getElementById("campaignDateFilter");

    const paginationInfo = document.getElementById("paginationInfo");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const currentPageSpan = document.getElementById("currentPageSpan");

    // ================== STATE ==================
    let campaigns = [];
    let filteredCampaigns = [];
    let currentPage = 1;
    const pageSize = 6;
    let currentEditId = null;

    // ================== HELPER ==================
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

    function showMessage(msg) {
        alert(msg);
    }

    // yyyy-MM-dd → giữ nguyên yyyy-MM-dd
    function normalizeDateForInput(dateStr) {
        if (!dateStr) return "";
        return String(dateStr).substring(0, 10);
    }

    // yyyy-MM-dd → dd/MM/yyyy
    function formatDateDisplay(dateStr) {
        if (!dateStr) return "";
        const parts = String(dateStr).split("-");
        if (parts.length !== 3) return dateStr;
        const [y, m, d] = parts;
        return `${d}/${m}/${y}`;
    }

    // ================== API ==================
    async function apiGetList() {
        const res = await fetch(`${API_BASE}/list`, { credentials: "include" });
        if (!res.ok) throw new Error("Không tải được danh sách chiến dịch");
        return await res.json();
    }

    async function apiGetDetail(id) {
        const res = await fetch(`${API_BASE}/details/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Không tải được chi tiết chiến dịch");
        return await res.json();
    }

    async function apiCreate(payload) {
        const res = await fetch(`${API_BASE}/create`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            let err = null;
            try { err = await res.json(); } catch { }
            throw new Error(err?.message || "Tạo chiến dịch thất bại");
        }
        return await res.json();
    }

    async function apiUpdate(id, payload) {
        const res = await fetch(`${API_BASE}/update/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            let err = null;
            try { err = await res.json(); } catch { }
            throw new Error(err?.message || "Cập nhật chiến dịch thất bại");
        }
        return await res.json();
    }

    async function apiDelete(id) {
        const res = await fetch(`${API_BASE}/delete/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (!res.ok) {
            let err = null;
            try { err = await res.json(); } catch { }
            throw new Error(err?.message || "Xóa chiến dịch thất bại");
        }
        return await res.json();
    }

    // ================== RENDER ==================
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
            prevPageBtn && (prevPageBtn.disabled = true);
            nextPageBtn && (nextPageBtn.disabled = true);
            return;
        }

        const total = filteredCampaigns.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * pageSize;
        const pageItems = filteredCampaigns.slice(start, start + pageSize);

        tbody.innerHTML = pageItems.map(c => `
            <tr>
                <td>${escapeHtml(c.name)}</td>
                <td>${escapeHtml(formatDateDisplay(c.date))}</td>
                <td>${escapeHtml(c.status)}</td>
                <td>${escapeHtml(c.description)}</td>
                <td>
                    <button class="btn-edit" data-id="${c.campaignID}">
                        Sửa
                    </button>
                    <button class="btn-delete" data-id="${c.campaignID}" style="margin-left:6px;color:#b00000;">
                        Xóa
                    </button>
                </td>
            </tr>
        `).join("");

        if (paginationInfo) {
            const startRow = start + 1;
            const endRow = Math.min(start + pageSize, total);
            paginationInfo.textContent = `Hiển thị ${startRow}-${endRow} của ${total}`;
        }

        if (currentPageSpan) currentPageSpan.textContent = String(currentPage);

        prevPageBtn && (prevPageBtn.disabled = currentPage <= 1);
        nextPageBtn && (nextPageBtn.disabled = currentPage >= totalPages);
    }

    function applyFiltersAndRender() {
        let data = [...campaigns];

        const kw = (searchBox?.value || "").toLowerCase().trim();
        const st = statusFilter?.value || "";
        const dt = dateFilter?.value || "";

        if (kw) {
            data = data.filter(c =>
                (c.name || "").toLowerCase().includes(kw) ||
                String(c.campaignID || "").toLowerCase().includes(kw)
            );
        }

        if (st) {
            data = data.filter(c => (c.status || "") === st);
        }

        if (dt) {
            data = data.filter(c => normalizeDateForInput(c.date) === dt);
        }

        filteredCampaigns = data;
        currentPage = 1;
        renderTablePage();
    }

    async function refreshTable() {
        try {
            const list = await apiGetList();
            campaigns = Array.isArray(list) ? list : [];
            applyFiltersAndRender();
        } catch (e) {
            console.error(e);
            showMessage(e.message);
        }
    }

    // ================== MODAL ==================
    function openCreateModal() {
        currentEditId = null;
        if (!form || !modal) return;

        form.reset();
        form["CampaignID"] && (form["CampaignID"].value = "");

        if (modalTitle) modalTitle.textContent = "Tạo Chiến Dịch Mới";
        if (submitBtn) submitBtn.textContent = "Tạo";

        modal.style.display = "block";
        document.body.classList.add("modal-open");
    }

    async function openEditModal(id) {
        currentEditId = id;
        if (!form || !modal) return;

        try {
            const c = await apiGetDetail(id);

            form["CampaignID"] && (form["CampaignID"].value = c.campaignID);
            form["Name"].value = c.name || "";
            form["Date"].value = normalizeDateForInput(c.date);
            form["Status"].value = c.status || "planned";
            form["Description"].value = c.description || "";

            if (modalTitle) modalTitle.textContent = "Cập Nhật Chiến Dịch";
            if (submitBtn) submitBtn.textContent = "Lưu";

            modal.style.display = "block";
            document.body.classList.add("modal-open");
        } catch (e) {
            console.error(e);
            showMessage(e.message);
        }
    }

    function closeModal() {
        if (!modal || !form) return;
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
        form.reset();
        currentEditId = null;
    }

    // ================== EVENTS ==================
    // mở form tạo
    btnOpenForm && btnOpenForm.addEventListener("click", openCreateModal);

    // đóng / huỷ
    btnClose && btnClose.addEventListener("click", closeModal);
    btnCancel && btnCancel.addEventListener("click", closeModal);

    // click outside modal để đóng
    modal && modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // submit form (tạo / cập nhật)
    form && form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!form) return;

        const payload = {
            name: form["Name"].value?.trim(),
            date: form["Date"].value || "",
            status: form["Status"].value || "planned",
            description: form["Description"].value?.trim()
        };

        if (!payload.name) {
            showMessage("Tên chiến dịch không được để trống!");
            return;
        }

        try {
            if (currentEditId) {
                await apiUpdate(currentEditId, payload);
                showMessage("Cập nhật chiến dịch thành công!");
            } else {
                await apiCreate(payload);
                showMessage("Tạo chiến dịch thành công!");
            }
            closeModal();
            refreshTable();
        } catch (err) {
            console.error(err);
            showMessage(err.message);
        }
    });

    // click Sửa / Xóa
    tbody && tbody.addEventListener("click", async (e) => {
        const editBtn = e.target.closest(".btn-edit");
        const deleteBtn = e.target.closest(".btn-delete");

        if (editBtn) {
            const id = editBtn.dataset.id;
            if (id) openEditModal(id);
            return;
        }

        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            if (!id) return;

            if (!confirm("Bạn có chắc muốn xóa chiến dịch này không?")) return;

            try {
                await apiDelete(id);
                showMessage("Xóa chiến dịch thành công!");
                refreshTable();
            } catch (err) {
                console.error(err);
                showMessage(err.message);
            }
        }
    });

    // search + filter
    searchBox && searchBox.addEventListener("input", applyFiltersAndRender);
    statusFilter && statusFilter.addEventListener("change", applyFiltersAndRender);
    dateFilter && dateFilter.addEventListener("change", applyFiltersAndRender);

    // phân trang
    prevPageBtn && prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTablePage();
        }
    });

    nextPageBtn && nextPageBtn.addEventListener("click", () => {
        const total = filteredCampaigns.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (currentPage < totalPages) {
            currentPage++;
            renderTablePage();
        }
    });

    // ================== INIT ==================
    refreshTable();

})();
