document.addEventListener('DOMContentLoaded', function() {
    
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
            // GỌI API THỰC TẾ (Bỏ comment dòng dưới khi có backend)
            // const response = await fetch(`${API_LIST}?page=1&pageSize=999`);
            // if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            // allData = await response.json();

            // --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ĐỂ TEST GIAO DIỆN ---
            // (Xóa đoạn này khi chạy thật)
            await new Promise(r => setTimeout(r, 800)); // Giả vờ load 0.8s
            allData = [
                { campaignId: 101, name: "Chiến dịch Mùa Hè", status: "Active", startDate: "2025-06-01", createdBy: "Admin", description: "Khuyến mãi lớn" },
                { campaignId: 102, name: "Tri ân khách hàng", status: "Pending", startDate: "2025-07-15", createdBy: "Manager", description: "Gửi quà tặng" },
                { campaignId: 103, name: "Xả kho cuối năm", status: "Rejected", startDate: "2025-12-01", createdBy: "Staff 1", description: "Giảm giá 50%" },
                { campaignId: 104, name: "Ra mắt sản phẩm mới", status: "Completed", startDate: "2025-01-10", createdBy: "Admin", description: "Sự kiện launch" },
                { campaignId: 105, name: "Black Friday", status: "Active", startDate: "2025-11-25", createdBy: "Marketing", description: "Sale sập sàn" },
                { campaignId: 106, name: "Giáng sinh an lành", status: "Pending", startDate: "2025-12-24", createdBy: "HR", description: "Tiệc công ty" }
            ];
            // -----------------------------------------------------

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
            if (status === 'Active') badgeClass = 'badge--success'; // Xanh lá
            else if (status === 'Completed') badgeClass = 'badge--info'; // Xanh dương
            else if (status === 'Pending') badgeClass = 'badge--warning'; // Vàng
            else if (status === 'Rejected') badgeClass = 'badge--danger'; // Đỏ

            // Vì code CSS của bạn dùng .badge--success, ta dùng span class tương ứng
            // Nếu bạn dùng Bootstrap thì đổi thành badge bg-success v.v.
            // Ở đây mình map theo style mẫu badge của bạn:
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
        if (status === 'Active') return '#10b981';
        if (status === 'Pending') return '#f59e0b';
        if (status === 'Rejected') return '#ef4444';
        if (status === 'Completed') return '#3b82f6';
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
        if (!campaignModal) return;
        campaignForm.reset();
        campaignModalTitle.textContent = 'Tạo chiến dịch mới';
        
        // Reset ID ẩn (để biết là đang tạo mới)
        const idInput = document.getElementById('campaignId');
        if (idInput) idInput.value = '';
        
        // Set ngày mặc định là hôm nay
        const dateInput = document.getElementById('campaignStartDate');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

        campaignModal.style.display = 'flex';
    }

    // Mở Modal Sửa
    async function openEditModal(id) {
        if (!campaignModal) return;
        campaignForm.reset();
        campaignModalTitle.textContent = 'Chỉnh sửa chiến dịch';

        try {
            // Mock data lookup (Thay bằng gọi API details thật)
            const data = allData.find(x => x.campaignId == id);
            
            if (data) {
                const idInput = document.getElementById('campaignId');
                if (idInput) idInput.value = data.campaignId;
                
                document.getElementById('campaignName').value = data.name;
                document.getElementById('campaignDescription').value = data.description || '';
                
                const dateInput = document.getElementById('campaignStartDate');
                if (data.startDate) {
                    dateInput.value = new Date(data.startDate).toISOString().split('T')[0];
                }
            }
            campaignModal.style.display = 'flex';
        } catch (error) {
            alert('Lỗi: Không thể tải chi tiết.');
        }
    }

    function closeCampaignModal() {
        if (campaignModal) campaignModal.style.display = 'none';
    }

    // Xử lý Submit Form
    async function handleFormSubmit(e) {
        e.preventDefault();

        const idInput = document.getElementById('campaignId');
        const id = idInput ? idInput.value : '';
        const isEditing = !!id;

        // Lấy nút submit để tạo hiệu ứng loading
        const submitBtn = campaignForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Lưu';
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang xử lý...`;
        }

        const formData = {
            name: document.getElementById('campaignName').value,
            description: document.getElementById('campaignDescription').value,
            startDate: document.getElementById('campaignStartDate').value,
        };

        const url = isEditing ? `${API_UPDATE}/${id}` : API_CREATE;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            // Gọi API (có returnRawResponse=true để test lỗi)
            await fetchApi(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            }, true);

            // Giả lập delay 1 xíu để thấy hiệu ứng loading
            await new Promise(r => setTimeout(r, 500));

            closeCampaignModal();
            fetchAllData(); // Load lại bảng
            alert(isEditing ? 'Đã cập nhật chiến dịch!' : 'Đã tạo chiến dịch thành công!');
        } catch (error) {
            // Tạm thời alert thành công để test UI (vì chưa có backend)
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
        alert(`Đã duyệt chiến dịch ${id} (Giả lập)`);
        closeApproveModal();
        fetchAllData();
    }

    async function handleReject(id) {
        if (!confirm('Bạn chắc chắn muốn TỪ CHỐI chiến dịch này?')) return;
        // Gọi API Reject tại đây
        alert(`Đã từ chối chiến dịch ${id} (Giả lập)`);
        closeApproveModal();
        fetchAllData();
    }

    // --- 6. GÁN SỰ KIỆN (EVENT LISTENERS) ---
    
    // Gán nút "Tạo chiến dịch" ở góc trên
    if (btnCreateCampaign) {
        btnCreateCampaign.addEventListener('click', function() {
            // Thêm hiệu ứng loading nhẹ cho nút này trước khi mở modal
            const originalHtml = this.innerHTML;
            const originalWidth = this.offsetWidth;
            
            // Giữ chiều rộng nút để không bị giật
            this.style.width = `${originalWidth}px`;
            this.disabled = true;
            this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang tải...`;

            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = originalHtml;
                this.style.width = ''; // Reset width
                openCreateModal(); // Mở modal sau 300ms
            }, 300);
        });
    }

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
});