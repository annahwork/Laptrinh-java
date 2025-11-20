(function () {
    'use strict';
    console.log('Campaigns script loaded with Custom Styles');

    const styleId = 'campaign-custom-css-force';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* Căn giữa các nút trong cột hành động */
            #campaignsTableBody td:last-child {
                display: flex !important;
                gap: 8px !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 10px !important;
            }

            /* Style chung cho nút hành động (Reset style mặc định) */
            #campaignsTableBody .btn-action {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 6px 12px !important;
                font-size: 13px !important;
                font-weight: 600 !important; /* Chữ đậm hơn chút */
                border-radius: 6px !important;
                border: 1px solid transparent !important;
                cursor: pointer !important;
                color: white !important;
                line-height: 1.2 !important;
                box-shadow: 0 1px 2px rgba(0,0,0,0.15) !important;
                transition: all 0.2s ease !important;
                text-decoration: none !important;
                min-width: 60px !important; /* Đảm bảo nút không quá bé */
            }

            /* Nút DUYỆT - Màu Xanh Lá */
            #campaignsTableBody .btn-review { 
                background-color: #10b981 !important; /* Emerald-500 */
            }
            #campaignsTableBody .btn-review:hover { 
                background-color: #059669 !important; /* Emerald-600 */
                transform: translateY(-2px);
                box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3) !important;
            }

            /* Nút XEM - Màu Xám */
            #campaignsTableBody .btn-view { 
                background-color: #6b7280 !important; /* Gray-500 */
            }
            #campaignsTableBody .btn-view:hover { 
                background-color: #4b5563 !important; /* Gray-600 */
                transform: translateY(-2px);
                box-shadow: 0 4px 6px rgba(107, 114, 128, 0.3) !important;
            }

            /* Nút SỬA - Màu Cam Vàng */
            #campaignsTableBody .btn-edit { 
                background-color: #f59e0b !important; /* Amber-500 */
            }
            #campaignsTableBody .btn-edit:hover { 
                background-color: #d97706 !important; /* Amber-600 */
                transform: translateY(-2px);
                box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================================
    // 2. LOGIC JAVASCRIPT CHÍNH
    // ============================================================

    // API Endpoints
    const API_BASE = '/evm/api/evm_staff/campaigns';
    const API_LIST = `${API_BASE}/list`;
    const API_DETAILS = `${API_BASE}/details`;
    const API_CREATE = `${API_BASE}/create`;
    const API_UPDATE = `${API_BASE}/update`;
    const API_APPROVE = `${API_BASE}/approve`;
    const API_REJECT = `${API_BASE}/reject`;
    
    const PAGE_SIZE = 5;

    // Globals
    let allData = [];
    let currentFilteredData = [];
    let currentPage = 1;

    // DOM Elements
    const tableBody = document.getElementById('campaignsTableBody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter'); // Dropdown lọc trạng thái

    // Pagination Elements
    const btnPrev = document.getElementById('btnPrev'); // Nút Trước
    const btnNext = document.getElementById('btnNext'); // Nút Sau
    const btnCurrent = document.getElementById('btnCurrent'); // Nút số trang (nếu có)
    const paginationInfo = document.getElementById('paginationInfo'); // Text hiển thị số trang

    // Create/Edit Modal
    const campaignModal = document.getElementById('campaignModal');
    const campaignModalTitle = document.getElementById('campaignModalTitle');
    const campaignForm = document.getElementById('campaignForm');
    const btnCreateCampaign = document.getElementById('btnCreateCampaign');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const btnCancelModalHeader = document.getElementById('btnCancelModalHeader');
    
    // Approve/Reject Modal
    const approveModal = document.getElementById('approveModal');
    const btnCloseApproveModal = document.getElementById('btnCloseApproveModal');

    // --- Data Fetching & Rendering ---

    async function fetchAllData() {
        if (tableBody)
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Đang tải dữ liệu...</td></tr>`;
        
        try {
            // Lấy tất cả dữ liệu (page=1, pageSize lớn) để xử lý filter ở client
            const response = await fetch(`${API_LIST}?page=1&pageSize=999`); 
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            allData = await response.json();
            currentFilteredData = [...allData];
            currentPage = 1;
            renderPaginatedData();
        } catch (error) {
            console.error('Fetch error:', error);
            if (tableBody)
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red; padding: 20px;">Lỗi: Không thể tải dữ liệu.</td></tr>`;
        }
    }

    function filterData() {
        // Lấy giá trị filter từ dropdown và ô search
        const roleFilter = statusFilter ? statusFilter.value : ''; 
        const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';

        currentFilteredData = allData.filter(item => {
            // Logic lọc: Nếu dropdown chọn "Tất cả" (value rỗng) thì bỏ qua check status
            const matchesStatus = roleFilter === '' || item.status === roleFilter;
            const matchesSearch = searchValue === '' || (item.name && item.name.toLowerCase().includes(searchValue));
            return matchesStatus && matchesSearch;
        });

        currentPage = 1;
        renderPaginatedData();
    }

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

    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        data.forEach(item => {
            const status = item.status || 'UNKNOWN';
            let statusClass = 'badge-secondary'; // Mặc định
            
            // Mapping class badge trạng thái (giữ nguyên logic badge của bạn)
            switch (status.toLowerCase()) {
                case 'active': statusClass = 'badge--success'; break; 
                case 'completed': statusClass = 'badge--info'; break;
                case 'pending': statusClass = 'badge--warning'; break;
                case 'rejected': statusClass = 'badge--danger'; break;
                default: statusClass = 'badge--secondary';
            }

            // Mapping Badge HTML (Giả sử bạn dùng cấu trúc badge trong theme)
            const statusBadgeHtml = `<span class="badge ${statusClass}">${status}</span>`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align:center;">CD-${item.campaignId}</td>
                <td>${item.name || 'N/A'}</td>
                <td style="text-align:center;">${statusBadgeHtml}</td>
                <td style="text-align:center;">${item.startDate || 'N/A'}</td>
                <td style="text-align:center;">${item.createdBy || 'N/A'}</td>
                <td>
                    ${status === 'Pending' ? 
                        `<button class="btn-action btn-review" data-id="${item.campaignId}">Duyệt</button>` : 
                        `<button class="btn-action btn-view" data-id="${item.campaignId}">Xem</button>`
                    }
                    <button class="btn-action btn-edit" data-id="${item.campaignId}">Sửa</button>
                </td>`;
            tableBody.appendChild(row);
        });
        
        // Gán sự kiện click cho các nút vừa render
        tableBody.querySelectorAll('.btn-review, .btn-view').forEach(btn => {
            btn.addEventListener('click', () => openApproveModal(btn.dataset.id));
        });
        tableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });
    }

    function updatePagination(totalRecords) {
        const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
        
        // Cập nhật trạng thái nút Previous/Next
        if (btnPrev) {
            btnPrev.disabled = currentPage <= 1;
            // Thêm style mờ nếu disabled
            btnPrev.style.opacity = currentPage <= 1 ? '0.5' : '1';
        }
        if (btnNext) {
            btnNext.disabled = currentPage >= totalPages;
            btnNext.style.opacity = currentPage >= totalPages ? '0.5' : '1';
        }
        
        // Cập nhật số trang hiện tại (nút màu xanh)
        if (btnCurrent) btnCurrent.textContent = currentPage.toString();

        // Cập nhật dòng text "Hiển thị x - y của z"
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

    // --- 3. Modal Logic (Create / Edit) ---

    function openCreateModal() {
        if (!campaignModal) return;
        campaignForm.reset();
        campaignModalTitle.textContent = 'Tạo chiến dịch mới';
        document.getElementById('campaignId').value = '';
        // Set ngày hôm nay
        document.getElementById('campaignStartDate').value = new Date().toISOString().split('T')[0];
        
        // Hiển thị modal (flex)
        campaignModal.style.display = 'flex'; 
    }

    async function openEditModal(id) {
        if (!campaignModal) return;
        campaignForm.reset();
        campaignModalTitle.textContent = 'Chỉnh sửa chiến dịch';
        
        try {
            const data = await fetchApi(`${API_DETAILS}/${id}`);
            document.getElementById('campaignId').value = data.campaignID;
            document.getElementById('campaignName').value = data.name;
            document.getElementById('campaignDescription').value = data.description;
            if(data.date) {
                document.getElementById('campaignStartDate').value = new Date(data.date).toISOString().split('T')[0];
            }
            campaignModal.style.display = 'flex';
        } catch (error) {
            alert('Lỗi: Không thể tải dữ liệu chiến dịch.');
        }
    }

    function closeCampaignModal() {
        if (campaignModal) campaignModal.style.display = 'none';
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('campaignId').value;
        const isEditing = !!id;

        const formData = {
            name: document.getElementById('campaignName').value,
            description: document.getElementById('campaignDescription').value,
            startDate: document.getElementById('campaignStartDate').value,
        };

        const url = isEditing ? `${API_UPDATE}/${id}` : API_CREATE;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await fetchApi(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            }, true);
            
            closeCampaignModal();
            fetchAllData(); // Refresh bảng
            alert(isEditing ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    }

    // --- 4. Modal Logic (Approve / Reject) ---

    async function openApproveModal(id) {
        if (!approveModal) return;

        try {
            const data = await fetchApi(`${API_DETAILS}/${id}`);
            
            // Fill data
            document.getElementById('modalCampaignId').textContent = `CD-${data.campaignID}`;
            document.getElementById('modalCampaignName').textContent = data.name;
            document.getElementById('modalCampaignStart').textContent = new Date(data.date).toLocaleDateString('vi-VN');
            document.getElementById('modalCampaignStatus').textContent = data.status;
            document.getElementById('modalCampaignDesc').textContent = data.description || '(Không có mô tả)';
            
            const actions = document.getElementById('approveModalActions');
            actions.innerHTML = ''; // Reset nút
            
            // Nếu Pending -> Hiện nút Duyệt/Từ chối
            if (data.status === 'Pending') {
                 actions.innerHTML = `
                    <button type="button" id="btnApprove" style="background:#10b981; color:white; border:none; padding:8px 20px; border-radius:6px; cursor:pointer; font-weight:600; margin-right:10px;">Duyệt</button>
                    <button type="button" id="btnReject" style="background:#ef4444; color:white; border:none; padding:8px 20px; border-radius:6px; cursor:pointer; font-weight:600;">Từ chối</button>
                `;
                document.getElementById('btnApprove').addEventListener('click', () => handleApprove(id));
                document.getElementById('btnReject').addEventListener('click', () => handleReject(id));
            } else {
                // Nếu không phải Pending -> Chỉ hiện nút Đóng
                 actions.innerHTML = `<button type="button" id="btnCloseView" style="background:#e5e7eb; color:#374151; border:none; padding:8px 20px; border-radius:6px; cursor:pointer; font-weight:600;">Đóng</button>`;
                 document.getElementById('btnCloseView').addEventListener('click', closeApproveModal);
            }

            approveModal.style.display = 'flex';
        } catch (error) {
            alert('Lỗi: Không thể tải chi tiết chiến dịch.');
        }
    }

    function closeApproveModal() {
        if (approveModal) approveModal.style.display = 'none';
    }

    async function handleApprove(id) {
        if (!confirm('Xác nhận DUYỆT chiến dịch này?')) return;
        try {
            await fetchApi(`${API_APPROVE}/${id}`, { method: 'PUT' });
            closeApproveModal();
            fetchAllData();
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    }
    
    async function handleReject(id) {
         if (!confirm('Xác nhận TỪ CHỐI chiến dịch này?')) return;
         try {
            await fetchApi(`${API_REJECT}/${id}`, { method: 'PUT' });
            closeApproveModal();
            fetchAllData();
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    }

    // --- 5. Helper & Init ---

    async function fetchApi(url, options = {}, returnRawResponse = false) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }
            if (returnRawResponse) return response;
            return await response.json();
        } catch (error) {
            console.error('FetchApi Error:', error);
            throw error;
        }
    }
    
    function init() {
        // Load data lần đầu
        fetchAllData();

        // Gán sự kiện Filter
        if (statusFilter) statusFilter.addEventListener('change', filterData);
        if (searchInput) searchInput.addEventListener('input', filterData);

        // Gán sự kiện Pagination (Nếu nút tồn tại)
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (currentPage > 1) { currentPage--; renderPaginatedData(); }
            });
        }
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                const totalPages = Math.ceil(currentFilteredData.length / PAGE_SIZE);
                if (currentPage < totalPages) { currentPage++; renderPaginatedData(); }
            });
        }

        // Gán sự kiện Modal Create/Edit
        if (btnCreateCampaign) btnCreateCampaign.addEventListener('click', openCreateModal);
        if (btnCancelModal) btnCancelModal.addEventListener('click', closeCampaignModal);
        if (btnCancelModalHeader) btnCancelModalHeader.addEventListener('click', closeCampaignModal);
        if (campaignForm) campaignForm.addEventListener('submit', handleFormSubmit);
        
        // Gán sự kiện Modal Approve
        if (btnCloseApproveModal) btnCloseApproveModal.addEventListener('click', closeApproveModal);
        
        console.log('Campaigns initialized successfully');
    }

    // Đợi một chút để DOM ổn định rồi chạy init
    setTimeout(init, 100);
})();