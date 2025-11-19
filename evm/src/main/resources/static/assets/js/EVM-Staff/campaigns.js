(function () {
    'use strict';
    console.log('Campaigns script loaded');

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
    const statusFilter = document.getElementById('statusFilter');

    // Pagination Elements
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnCurrent = document.getElementById('btnCurrent');
    const paginationInfo = document.getElementById('paginationInfo');

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

    // --- 1. Data Fetching & Rendering ---

    /**
     * Tải dữ liệu chính từ API
     */
    async function fetchAllData() {
        if (tableBody)
            tableBody.innerHTML = `<tr><td colspan="6" class="loading-data">Đang tải dữ liệu...</td></tr>`;
        
        try {
            // Tạm thời bỏ qua phân trang của API để JS xử lý filter
            const response = await fetch(`${API_LIST}?page=1&pageSize=999`); 
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            allData = await response.json();
            currentFilteredData = [...allData];
            currentPage = 1;
            renderPaginatedData();
        } catch (error) {
            console.error('Fetch error:', error);
            if (tableBody)
                tableBody.innerHTML = `<tr><td colspan="6" class="error-data"><p>Lỗi: Không thể tải dữ liệu.</p></td></tr>`;
        }
    }

    /**
     * Lọc dữ liệu dựa trên input
     */
    function filterData() {
        const roleFilter = statusFilter?.value || '';
        const searchValue = searchInput?.value.trim().toLowerCase() || '';

        currentFilteredData = allData.filter(item => {
            const matchesStatus = roleFilter ? item.status === roleFilter : true;
            const matchesSearch = searchValue ? (item.name?.toLowerCase().includes(searchValue)) : true;
            return matchesStatus && matchesSearch;
        });

        currentPage = 1;
        renderPaginatedData();
    }

    /**
     * Hiển thị dữ liệu đã phân trang
     */
    function renderPaginatedData() {
        const totalRecords = currentFilteredData.length;
        if (totalRecords === 0) {
             if (tableBody)
                tableBody.innerHTML = `<tr><td colspan="6" class="no-data"><p>Không tìm thấy dữ liệu.</p></td></tr>`;
            updatePagination(0);
            return;
        }

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const paginated = currentFilteredData.slice(startIndex, startIndex + PAGE_SIZE);
        renderTable(paginated);
        updatePagination(totalRecords);
    }

    /**
     * Render các hàng của bảng
     */
    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = ''; // Xóa sạch

        data.forEach(item => {
            const status = item.status || 'UNKNOWN';
            let statusClass = '';
            
            // SỬA Ở ĐÂY: Ánh xạ status sang class của campaigns.css
            switch (status.toLowerCase()) {
                case 'active':
                    statusClass = 'inprogress'; // Giả sử 'inprogress' là cho 'Active'
                    break;
                case 'completed':
                    statusClass = 'done';
                    break;
                case 'pending':
                    statusClass = 'pending';
                    break;
                case 'rejected':
                    statusClass = 'rejected'; // Bạn có thể thêm class 'rejected' vào CSS
                    break;
                default:
                    statusClass = 'pending';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>CD-${item.campaignId}</td>
                <td>${item.name || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>${item.startDate || 'N/A'}</td>
                <td>${item.createdBy || 'N/A'}</td>
                <td>
                    ${status === 'Pending' ? 
                        `<button class="btn-action btn-review" data-id="${item.campaignId}">Duyệt</button>` : 
                        `<button class="btn-action btn-view" data-id="${item.campaignId}">Xem</button>`
                    }
                    <button class="btn-action btn-edit" data-id="${item.campaignId}">Sửa</button>
                </td>`;
            tableBody.appendChild(row);
        });
        
        // Gắn sự kiện cho các nút mới
        tableBody.querySelectorAll('.btn-review, .btn-view').forEach(btn => {
            btn.addEventListener('click', () => openApproveModal(btn.dataset.id));
        });
        tableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });
    }

    /**
     * Cập nhật thông tin phân trang
     */
    function updatePagination(totalRecords) {
        const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
        if (btnPrev) btnPrev.disabled = currentPage <= 1;
        if (btnNext) btnNext.disabled = currentPage >= totalPages;
        if (btnCurrent) btnCurrent.textContent = currentPage.toString();

        if (paginationInfo) {
            if (totalRecords === 0) {
                paginationInfo.textContent = "Hiển thị 0 của 0";
            } else {
                paginationInfo.textContent = `Hiển thị ${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, totalRecords)} của ${totalRecords}`;
            }
        }
    }

    // --- 2. Create/Edit Modal ---

    function openCreateModal() {
        if (!campaignModal) return;
        campaignForm.reset();
        campaignModalTitle.textContent = 'Tạo chiến dịch mới';
        document.getElementById('campaignId').value = '';
        // Đặt ngày mặc định là hôm nay
        document.getElementById('campaignStartDate').value = new Date().toISOString().split('T')[0];
        campaignModal.style.display = 'flex'; // Sửa: Dùng style.display
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
            // Chuyển đổi Date (nếu có) sang yyyy-MM-dd
            if(data.date) {
                document.getElementById('campaignStartDate').value = new Date(data.date).toISOString().split('T')[0];
            }
            campaignModal.style.display = 'flex'; // Sửa: Dùng style.display
        } catch (error) {
            alert('Lỗi: Không thể tải dữ liệu chiến dịch.');
        }
    }

    function closeCampaignModal() {
        if (campaignModal) campaignModal.style.display = 'none'; // Sửa: Dùng style.display
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
            }, true); // true = raw response
            
            closeCampaignModal();
            fetchAllData(); // Tải lại bảng
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    }

    // --- 3. Approve/Reject Modal ---

    async function openApproveModal(id) {
        if (!approveModal) return;

        try {
            const data = await fetchApi(`${API_DETAILS}/${id}`);
            
            // Điền dữ liệu
            document.getElementById('modalCampaignId').textContent = `CD-${data.campaignID}`;
            document.getElementById('modalCampaignName').textContent = data.name;
            document.getElementById('modalCampaignStart').textContent = new Date(data.date).toLocaleDateString('vi-VN');
            document.getElementById('modalCampaignStatus').textContent = data.status;
            document.getElementById('modalCampaignDesc').textContent = data.description || '(Không có mô tả)';
            
            // Thêm nút
            const actions = document.getElementById('approveModalActions');
            actions.innerHTML = ''; // Xóa nút cũ
            
            if (data.status === 'Pending') {
                 actions.innerHTML = `
                    <button class="campaign__button campaign__button--submit" id="btnApprove">Duyệt</button>
                    <button class="campaign__button campaign__button--cancel" id="btnReject">Từ chối</button>
                `;
                // Gắn sự kiện cho nút mới
                document.getElementById('btnApprove').addEventListener('click', () => handleApprove(id));
                document.getElementById('btnReject').addEventListener('click', () => handleReject(id));
            } else {
                 actions.innerHTML = `<button type="button" class="campaign__button campaign__button--cancel" id="btnCloseView">Đóng</button>`;
                 document.getElementById('btnCloseView').addEventListener('click', closeApproveModal);
            }

            approveModal.style.display = 'flex'; // Sửa: Dùng style.display
        } catch (error) {
            alert('Lỗi: Không thể tải chi tiết chiến dịch.');
        }
    }

    function closeApproveModal() {
        if (approveModal) approveModal.style.display = 'none'; // Sửa: Dùng style.display
    }

    async function handleApprove(id) {
        if (!confirm('Bạn có chắc chắn muốn DUYỆT chiến dịch này?')) return;
        try {
            await fetchApi(`${API_APPROVE}/${id}`, { method: 'PUT' });
            closeApproveModal();
            fetchAllData();
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    }
    
    async function handleReject(id) {
         if (!confirm('Bạn có chắc chắn muốn TỪ CHỐI chiến dịch này?')) return;
         try {
            await fetchApi(`${API_REJECT}/${id}`, { method: 'PUT' });
            closeApproveModal();
            fetchAllData();
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    }


    // --- 4. Helper & Init ---

    /**
     * Hàm fetch API chung
     */
    async function fetchApi(url, options = {}, returnRawResponse = false) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }
            if (returnRawResponse) return response; // Trả về response (cho POST, PUT)
            return await response.json(); // Trả về JSON (cho GET)
        } catch (error) {
            console.error('FetchApi Error:', error);
            throw error; // Ném lỗi ra ngoài
        }
    }
    
    /**
     * Gắn các sự kiện ban đầu
     */
    function init() {
        // Tải dữ liệu ban đầu
        fetchAllData();

        // Lọc
        statusFilter?.addEventListener('change', filterData);
        searchInput?.addEventListener('input', filterData);

        // Phân trang
        btnPrev?.addEventListener('click', () => {
            if (currentPage > 1) { currentPage--; renderPaginatedData(); }
        });
        btnNext?.addEventListener('click', () => {
            if (currentPage * PAGE_SIZE < currentFilteredData.length) { currentPage++; renderPaginatedData(); }
        });

        // Modals
        btnCreateCampaign?.addEventListener('click', openCreateModal);
        btnCancelModal?.addEventListener('click', closeCampaignModal);
        btnCancelModalHeader?.addEventListener('click', closeCampaignModal); // Sửa: Nút đóng mới
        campaignForm?.addEventListener('submit', handleFormSubmit);
        
        btnCloseApproveModal?.addEventListener('click', closeApproveModal);
        
        console.log('Campaigns initialized successfully');
    }

    setTimeout(init, 300); // Đợi 300ms để DOM kịp render (nếu cần)
})();