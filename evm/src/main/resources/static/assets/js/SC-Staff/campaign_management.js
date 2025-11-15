(function () {
    // ========== Cấu hình biến ==========
    const apiBase = "/evm/api/campaigns";
    const tbody = document.getElementById("campaignsTbody"); // <tbody> danh sách chiến dịch
    const btnCreate = document.getElementById("btnMoFormCampaign");   // ĐÃ CHỈNH LẠI ID Ở ĐÂY
    console.log("Nút tạo chiến dịch:", btnCreate);
    if (btnCreate) btnCreate.addEventListener("click", function () {
        console.log("Click nút tạo CHẠY!");        // khi bấm phải ra dòng này
        openModal();
    });
    const modal = document.getElementById("modalCampaign");
    const form = document.getElementById("campaignForm");
    const msgBox = document.getElementById("messageBox");

    let currentEditId = null;

    // ========== Helper ==========
    function escapeHtml(str) {
        return String(str ?? "").replace(/[&<>"'`=\/]/g, s => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
            "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
        })[s]);
    }
    function showMessage(msg, isError = false) {
        if (!msgBox) { alert(msg); return; }
        msgBox.innerText = msg;
        msgBox.style.display = "block";
        msgBox.style.background = isError ? "#e57777" : "#d4edda";
        setTimeout(() => { msgBox.style.display = "none"; }, 2300);
    }

    // ========== CRUD ==========
    async function fetchCampaigns() {
        const url = `${apiBase}/list`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Lỗi tải danh sách: " + res.status);
        return await res.json();
    }

    async function fetchCampaignDetail(id) {
        const url = `${apiBase}/details/${id}`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Không lấy được chi tiết");
        return await res.json();
    }

    async function createCampaign(data) {
        const url = `${apiBase}/create`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error((await res.json())?.message || "Lỗi tạo chiến dịch");
        return await res.json();
    }

    async function updateCampaign(id, data) {
        const url = `${apiBase}/update/${id}`;
        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error((await res.json())?.message || "Lỗi cập nhật");
        return await res.json();
    }

    // ========== Render ==========
    function renderTable(campaigns) {
        tbody.innerHTML = "";
        if (!campaigns || !campaigns.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Không có chiến dịch.</td></tr>`;
            return;
        }
        tbody.innerHTML = campaigns.map(c => `
            <tr>
                <td>${c.campaignID ?? ""}</td>
                <td>${escapeHtml(c.name)}</td>
                <td>${escapeHtml(c.status)}</td>
                <td>${escapeHtml(c.date)}</td>
                <td>${escapeHtml(c.createdBy)}</td>
                <td>
                    <button class="btn-edit" data-id="${c.campaignID}">Sửa</button>
                </td>
            </tr>
        `).join('');
    }

    async function refreshTable() {
        try {
            const data = await fetchCampaigns();
            renderTable(data);
        } catch (e) {
            showMessage(e.message, true);
        }
    }

    // ========== Modal/FORM ==========
    function openModal(editId = null) {
        currentEditId = editId;
        if (!modal) return;
        modal.style.display = "block";
        if (!form) return;
        if (!editId) {
            form.reset();
            form["name"].value = "";
            form["status"].value = "";
            form["date"].value = "";
            form["description"].value = "";
        } else {
            // edit mode
            fetchCampaignDetail(editId)
                .then(c => {
                    form["name"].value = c.name || "";
                    form["status"].value = c.status || "";
                    form["date"].value = c.date || "";
                    form["description"].value = c.description || "";
                })
                .catch(e => showMessage("Lỗi lấy chi tiết: " + e.message, true));
        }
    }
    function closeModal() {
        if (modal) modal.style.display = "none";
        currentEditId = null;
        if (form) form.reset();
    }

    // ========== Sự kiện ==========
    if (btnCreate) btnCreate.addEventListener("click", () => openModal());
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal || e.target.classList.contains("modal-close")) closeModal();
        });
    }
    if (form) {
        form.addEventListener("submit", async (ev) => {
            ev.preventDefault();
            const data = {
                name: form["name"].value,
                status: form["status"].value,
                date: form["date"].value,
                description: form["description"].value
            };
            try {
                if (!data.name) { showMessage("Nhập tên chiến dịch!", true); return; }
                if (currentEditId) {
                    await updateCampaign(currentEditId, data);
                    showMessage("Cập nhật thành công!");
                } else {
                    await createCampaign(data);
                    showMessage("Tạo mới thành công!");
                }
                closeModal();
                await refreshTable();
            } catch (e) {
                showMessage(e.message, true);
            }
        });
    }
    if (tbody) {
        tbody.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-edit");
            if (btn) {
                openModal(btn.dataset.id);
            }
        });
    }

    // ========== Lần đầu khi vào trang ==========
    refreshTable();
})();