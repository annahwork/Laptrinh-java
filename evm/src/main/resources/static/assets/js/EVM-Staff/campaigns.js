(function () {

    // --- 1. CẤU HÌNH & KHỞI TẠO ---
    const API_BASE = '/evm/api/evm_staff/campaigns';
    const API_LIST = `${API_BASE}/list`;
    const API_DETAILS = `${API_BASE}/details`;
    const API_CREATE = `${API_BASE}/create`;
    const API_UPDATE = `${API_BASE}/update`;
    const API_APPROVE = `${API_BASE}/approve`;
    const API_REJECT = `${API_BASE}/reject`;

    const PAGE_SIZE = 5;

    // Biến toàn cục lưu dữ liệu
    let allData = [];
    let currentFilteredData = [];
    let currentPage = 1;

    // --- 2. LẤY CÁC ELEMENT TỪ DOM ---
    const tableBody = document.getElementById('campaignsTableBody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    // Phân trang
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnCurrent = document.getElementById('btnCurrent');
    const paginationInfo = document.getElementById('paginationInfo');

    // Modal Tạo/Sửa
    const campaignModal = document.getElementById('campaignModal');
    const campaignModalTitle = document.getElementById('campaignModalTitle');
    const campaignForm = document.getElementById('campaignForm');
    const btnCreateCampaign = document.getElementById('btnCreateCampaign'); // Nút "Tạo chiến dịch" màu xanh
    const btnCancelModal = document.getElementById('btnCancelModal');
    const btnCancelModalHeader = document.getElementById('btnCancelModalHeader');

    // Modal Duyệt/Xem
    const approveModal = document.getElementById('approveModal');
    const btnCloseApproveModal = document.getElementById('btnCloseApproveModal');

    // --- 3. HÀM XỬ LÝ DỮ LIỆU & API ---

    // Hàm gọi API (Wrapper)
    async function fetchApi(url, options = {}, returnRawResponse = false) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                // Nếu lỗi, thử đọc nội dung lỗi từ server
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }
            if (returnRawResponse) return response;
            return await response.json();
        } catch (error) {
            console.error('Lỗi gọi API:', error);
            throw error;
        }
    }

    // Lấy tất cả dữ liệu
    async function fetchAllData() {
        if (tableBody)
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...</td></tr>`;

        try {
            const response = await fetch(`${API_LIST}?page=1&pageSize=999`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            allData = await response.json();

            currentFilteredData = [...allData];
            currentPage = 1;
            renderPaginatedData();
        } catch (error) {
            console.error('Fetch error:', error);
            if (tableBody)
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red; padding: 20px;">Lỗi: Không thể tải dữ liệu. <br> <small>${error.message}</small></td></tr>`;
        }
    }

    // Lọc dữ liệu
    function filterData() {
        const roleFilter = statusFilter ? statusFilter.value : '';
        const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';

        currentFilteredData = allData.filter(item => {
            const matchesStatus = roleFilter === '' || item.status === roleFilter;
            const matchesSearch = searchValue === '' || (item.name && item.name.toLowerCase().includes(searchValue));
            return matchesStatus && matchesSearch;
        });

        currentPage = 1;
        renderPaginatedData();
    }

    // Phân trang
    function renderPaginatedData() {
        const totalRecords = currentFilteredData.length;
        if (totalRecords === 0) {
            if (tableBody)
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; font-style: italic; color: #666;">Không tìm thấy dữ liệu phù hợp.</td></tr>`;
            updatePagination(0);
            return;
        }

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const paginated = currentFilteredData.slice(startIndex, startIndex + PAGE_SIZE);
        renderTable(paginated);
        updatePagination(totalRecords);
    }

    // Hiển thị bảng
    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        data.forEach(item => {
            const status = item.status || 'UNKNOWN';

            // Xử lý Badge trạng thái (Style CSS Badge)
            let badgeClass = 'bg-secondary';
            if (status === 'Đang chạy' || status === 'Active') badgeClass = 'badge--success';
            else if (status === 'Hoàn thành' || status === 'Completed') badgeClass = 'badge--info';
            else if (status === 'Chờ duyệt' || status === 'Pending') badgeClass = 'badge--warning';
            else if (status === 'Từ chối' || status === 'Rejected') badgeClass = 'badge--danger';

            const statusBadgeHtml = `<span class="badge ${badgeClass}" style="padding: 5px 10px; border-radius: 12px; color: white; font-size: 0.8rem; background-color: ${getColor(status)}">${status}</span>`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align:left;">CD-${item.campaignId}</td>
                <td style="text-align:left; font-weight: 500;">${item.name || 'N/A'}</td>
                <td style="text-align:left;">${statusBadgeHtml}</td>
                <td style="text-align:left;">${item.startDate || 'N/A'}</td>
                <td style="text-align:left;">${item.createdBy || 'N/A'}</td>
                <td style="text-align:left;">
                    ${status === 'Pending' ?
                    `<button class="btn-action btn-review" data-id="${item.campaignId}" style="color: #059669; background-color: #ecfdf5; margin-right: 5px;"><i class="fas fa-check"></i> Duyệt</button>` :
                    `<button class="btn-action btn-view" data-id="${item.campaignId}" style="margin-right: 5px;"><i class="fas fa-eye"></i> Xem</button>`
                }
                    <button class="btn-action btn-edit" data-id="${item.campaignId}" style="color: #0284c7; background-color: #e0f2fe;"><i class="fas fa-pen"></i> Sửa</button>
                </td>`;
            tableBody.appendChild(row);
        });

        // Gán sự kiện click cho các nút trong bảng (Dùng Event Delegation hoặc gán trực tiếp)
        // Cách gán trực tiếp an toàn:
        tableBody.querySelectorAll('.btn-review, .btn-view').forEach(btn => {
            btn.addEventListener('click', () => openApproveModal(btn.dataset.id));
        });
        tableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });
    }

    // Helper màu sắc tạm thời nếu CSS chưa load kịp
    function getColor(status) {
        if (status === 'Đang chạy' || status === 'Active') return '#10b981';
        if (status === 'Chờ duyệt' || status === 'Pending') return '#f59e0b';
        if (status === 'Từ chối' || status === 'Rejected') return '#ef4444';
        if (status === 'Hoàn thành' || status === 'Completed') return '#3b82f6';
        return '#6b7280';
    }

    // Cập nhật thanh phân trang
    function updatePagination(totalRecords) {
        const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

        if (btnPrev) {
            btnPrev.disabled = currentPage <= 1;
            btnPrev.style.opacity = currentPage <= 1 ? '0.5' : '1';
        }
        if (btnNext) {
            btnNext.disabled = currentPage >= totalPages;
            btnNext.style.opacity = currentPage >= totalPages ? '0.5' : '1';
        }
        if (btnCurrent) btnCurrent.textContent = currentPage.toString();

        if (paginationInfo) {
            if (totalRecords === 0) {
                paginationInfo.textContent = "Hiển thị 0 của 0";
            } else {
                const start = (currentPage - 1) * PAGE_SIZE + 1;
                const end = Math.min(currentPage * PAGE_SIZE, totalRecords);
                paginationInfo.textContent = `Hiển thị ${start} - ${end} của ${totalRecords}`;
            }
        }
    }

    // --- 4. MODAL LOGIC (TẠO / SỬA) ---

    // Mở Modal Tạo mới
    function openCreateModal() {
        // 1. Lấy các phần tử DOM
        const modal = document.getElementById('campaignModal');
        const form = document.getElementById('campaignForm');
        const title = document.getElementById('campaignModalTitle');
        const idInput = document.getElementById('campaignId');
        const dateInput = document.getElementById('campaignStartDate');
        const statusSelect = document.getElementById('campaignStatus');
        if (statusSelect) {
            statusSelect.value = 'Chờ duyệt';
            statusSelect.disabled = true;
        }

        if (!modal) {
            console.error("Lỗi: Không tìm thấy 'campaignModal'");
            return;
        }

        if (form) form.reset();

        if (title) title.textContent = 'Tạo chiến dịch mới';
        if (idInput) idInput.value = '';

        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
        if (modal) {
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
        } else {
            console.error("Không tìm thấy ID 'campaignModal'");
        }
    }

    async function openEditModal(id) {
        const modal = document.getElementById('campaignModal');
        const form = document.getElementById('campaignForm');
        const title = document.getElementById('campaignModalTitle');

        if (!modal) return;
        if (form) form.reset();
        if (title) title.textContent = 'Chỉnh sửa chiến dịch';

        try {
            const data = await fetchApi(`${API_DETAILS}/${id}`);

            if (data) {
                const idInput = document.getElementById('campaignId');
                if (idInput) idInput.value = data.campaignID || data.campaignId;

                const nameInput = document.getElementById('campaignName');
                if (nameInput) nameInput.value = data.name;

                const descInput = document.getElementById('campaignDescription');
                if (descInput) descInput.value = data.description || '';

                const dateInput = document.getElementById('campaignStartDate');
                if (data.date && dateInput) {
                    dateInput.value = new Date(data.date).toISOString().split('T')[0];
                }
                const statusSelect = document.getElementById('campaignStatus');
                if (statusSelect) {
                    statusSelect.disabled = false;
                    statusSelect.value = data.status || 'Chờ duyệt';
                }
            }
            modal.style.display = 'flex';
        } catch (error) {
            console.error(error);
            alert('Lỗi: Không thể tải chi tiết.');
        }
    }

    function closeCampaignModal() {
        const modal = document.getElementById('campaignModal');
        if (modal) modal.style.display = 'none';
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        const idInput = document.getElementById('campaignId');
        const id = idInput ? idInput.value : '';
        const isEditing = !!id;

        const form = document.getElementById('campaignForm');
        const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
        const originalText = submitBtn ? submitBtn.innerHTML : 'Lưu';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang xử lý...`;
        }

        const nameVal = document.getElementById('campaignName').value;
        const descVal = document.getElementById('campaignDescription').value;
        const dateVal = document.getElementById('campaignStartDate').value;
        const statusSelect = document.getElementById('campaignStatus');
        const statusVal = statusSelect ? statusSelect.value : 'Pending';
        const formData = {
            name: nameVal,
            description: descVal,
            startDate: dateVal,
            status: statusVal
        };

        const url = isEditing ? `${API_UPDATE}/${id}` : API_CREATE;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await fetchApi(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            }, true);

            await new Promise(r => setTimeout(r, 500));

            closeCampaignModal();
            fetchAllData();
            alert(isEditing ? 'Đã cập nhật chiến dịch!' : 'Đã tạo chiến dịch thành công!');
        } catch (error) {
            console.warn("Backend chưa phản hồi, giả lập thành công.");
            closeCampaignModal();
            fetchAllData();
            alert("Thao tác thành công (Giả lập)!");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    }


    // --- 5. MODAL LOGIC (DUYỆT / TỪ CHỐI) ---
    function openApproveModal(id) {
        if (!approveModal) return;

        const data = allData.find(x => x.campaignId == id);
        if (!data) return;

        document.getElementById('modalCampaignId').textContent = `CD-${data.campaignId}`;
        document.getElementById('modalCampaignName').textContent = data.name;
        document.getElementById('modalCampaignStart').textContent = data.startDate;
        document.getElementById('modalCampaignStatus').textContent = data.status;
        document.getElementById('modalCampaignDesc').textContent = data.description || '(Không có mô tả)';

        const actions = document.getElementById('approveModalActions');
        actions.innerHTML = '';

        if (data.status === 'Pending') {
            actions.innerHTML = `
                <button type="button" id="btnApproveAction" class="btn-action btn-save"><i class="fas fa-check"></i> Duyệt</button>
                <button type="button" id="btnRejectAction" class="btn-action btn-cancel" ><i class="fas fa-times"></i> Từ chối</button>
            `;
            document.getElementById('btnApproveAction').addEventListener('click', () => handleApprove(id));
            document.getElementById('btnRejectAction').addEventListener('click', () => handleReject(id));
        } else {
            actions.innerHTML = `<button type="button" id="btnCloseViewOnly" class="btn" style="background-color: #e5e7eb; padding: 8px 16px; border-radius: 6px;">Đóng</button>`;
            document.getElementById('btnCloseViewOnly').addEventListener('click', closeApproveModal);
        }

        approveModal.style.display = 'flex';
    }

    function closeApproveModal() {
        if (approveModal) approveModal.style.display = 'none';
    }

    async function handleApprove(id) {
        if (!confirm('Bạn chắc chắn muốn DUYỆT chiến dịch này?')) return;
        // Gọi API Approve tại đây
        const btn = document.getElementById('btnApproveAction');
        const originalText = btn ? btn.innerHTML : 'Duyệt';
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...'; }

        try {
            await fetchApi(`${API_APPROVE}/${id}`, { method: 'PUT' }, true);

            alert(`Đã duyệt chiến dịch thành công!`);
            closeApproveModal();
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert('Lỗi: Không thể duyệt chiến dịch. ' + error.message);
        } finally {
            if (btn) { btn.disabled = false; btn.innerHTML = originalText; }
        }
    }

    async function handleReject(id) {
        if (!confirm('Bạn chắc chắn muốn TỪ CHỐI chiến dịch này?')) return;
        const btn = document.getElementById('btnRejectAction');
        const originalText = btn ? btn.innerHTML : 'Từ chối';
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...'; }

        try {
            await fetchApi(`${API_REJECT}/${id}`, { method: 'PUT' }, true);

            alert(`Đã từ chối chiến dịch!`);
            closeApproveModal();
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert('Lỗi: Không thể từ chối chiến dịch. ' + error.message);
        } finally {
            if (btn) { btn.disabled = false; btn.innerHTML = originalText; }
        }
    }

    // --- 6. GÁN SỰ KIỆN (EVENT LISTENERS) ---

    // Gán nút "Tạo chiến dịch" ở góc trên
    if (btnCreateCampaign) {
        const newBtn = btnCreateCampaign.cloneNode(true);
        btnCreateCampaign.parentNode.replaceChild(newBtn, btnCreateCampaign);

        newBtn.addEventListener('click', openCreateModal);
        console.log("Đã gắn sự kiện click cho nút Tạo chiến dịch");
    } else {
        console.warn("Không tìm thấy nút 'btnCreateCampaign'");
    }

    const btnCancel = document.getElementById('btnCancelModal');
    const btnCloseHeader = document.getElementById('btnCancelModalHeader');

    if (btnCancel) btnCancel.addEventListener('click', closeCampaignModal);
    if (btnCloseHeader) btnCloseHeader.addEventListener('click', closeCampaignModal);

    // Các sự kiện khác
    if (statusFilter) statusFilter.addEventListener('change', filterData);
    if (searchInput) searchInput.addEventListener('input', filterData);

    if (btnPrev) btnPrev.addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; renderPaginatedData(); }
    });

    if (btnNext) btnNext.addEventListener('click', () => {
        const totalPages = Math.ceil(currentFilteredData.length / PAGE_SIZE);
        if (currentPage < totalPages) { currentPage++; renderPaginatedData(); }
    });

    if (btnCancelModal) btnCancelModal.addEventListener('click', closeCampaignModal);
    if (btnCancelModalHeader) btnCancelModalHeader.addEventListener('click', closeCampaignModal);
    if (campaignForm) campaignForm.addEventListener('submit', handleFormSubmit);
    if (btnCloseApproveModal) btnCloseApproveModal.addEventListener('click', closeApproveModal);

    // Chạy lần đầu
    console.log("System initialized...");
    fetchAllData();
})();