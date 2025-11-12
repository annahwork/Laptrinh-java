(function () {
    'useS trict';

    console.log('Campaign List script loaded');

    const API_CAMPAIGN_LIST = '/evm/api/campaigns';
    const PAGE_SIZE = 5;

    let allCampaigns = [];
    let currentFilteredCampaigns = [];
    let currentPage = 1;

    function formatStatus(status) {
        const lowerStatus = status?.toLowerCase() || '';
        switch (lowerStatus) {
            case 'active': return { text: 'Đang diễn ra', class: 'active' };
            case 'completed': return { text: 'Đã hoàn thành', class: 'completed' };
            case 'planned': return { text: 'Đã lên kế hoạch', class: 'planned' };
            case 'pending': return { text: 'Đang chờ', class: 'default' };
            default: return { text: status || 'Không xác định', class: 'default' };
        }
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }

    function renderCampaigns(campaigns) {
        const grid = document.getElementById('campaignGrid');
        if (!grid) return;
        grid.innerHTML = '';

        if (!campaigns || campaigns.length === 0) {
            grid.innerHTML = `
                <div class="no-data" style="text-align:center; width:100%; padding:2rem;">
                    <p>Không có dữ liệu chiến dịch nào.</p>
                </div>`;
            return;
        }

        campaigns.forEach(c => {
            const statusInfo = formatStatus(c.status);
            const card = document.createElement('div');
            card.className = 'data-card';
            
            card.innerHTML = `
                <div class="card-header">
                    <h3>Mã: <span>${c.campaignID || 'N/A'}</span></h3> 
                    <span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>
                </div>
                <div class="card-body">
                    <p><strong>Tên:</strong> ${c.name || 'N/A'}</p>
                    <p><strong>Ngày bắt đầu:</strong> ${formatDate(c.date)}</p>
                </div>
                <div class="card-footer">
                    <button class="btn-outline" onclick="openCampaignDetail('${c.campaignID}')">Chi tiết</button>
                    <button class="btn-light" onclick="openEditCampaign('${c.campaignID}')">Cập nhật</button>
                </div>`;
            grid.appendChild(card);
        });
    }
    async function fetchAllCampaigns() {
        const grid = document.getElementById('campaignGrid');
        if (grid)
            grid.innerHTML = `<div class="loading-data" style="text-align:center; width:100%; padding:2rem;">Đang tải dữ liệu...</div>`;

        try {
            const res = await fetch(API_CAMPAIGN_LIST);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            allCampaigns = Array.isArray(data) ? data : data.data || [];
            currentFilteredCampaigns = [...allCampaigns];
            renderPaginatedCampaigns();
        } catch (err) {
            console.error('Fetch error:', err);
            if (grid)
                grid.innerHTML = `<div class="error-data" style="text-align:center; width:100%; padding:2rem;">Lỗi: Không thể tải dữ liệu chiến dịch.</div>`;
        }
    }

    function filterCampaigns() {
        const searchValue = document.getElementById('campaignSearchInput')?.value.trim().toLowerCase() || '';
        const statusFilter = document.getElementById('campaignStatusFilter')?.value || '';

        currentFilteredCampaigns = allCampaigns.filter(c => {
            const matchesSearch = searchValue
                ? (c.name?.toLowerCase().includes(searchValue) ||
                   c.campaignID?.toString().toLowerCase().includes(searchValue)) // Sửa
                : true;
            
            const matchesStatus = statusFilter 
                ? c.status?.toLowerCase() === statusFilter 
                : true;
            
            return matchesSearch && matchesStatus;
        });

        currentPage = 1;
        renderPaginatedCampaigns();
    }

    function renderPaginatedCampaigns() {
        const totalRecords = currentFilteredCampaigns.length;
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const paginated = currentFilteredCampaigns.slice(startIndex, startIndex + PAGE_SIZE);
        renderCampaigns(paginated);
        updatePagination(totalRecords);
    }

    function updatePagination(totalRecords) {
        const totalPages = Math.ceil(totalRecords / PAGE_SIZE) || 1;
        console.log(`Trang ${currentPage}/${totalPages} (${totalRecords} chiến dịch)`);
    }

    window.openCampaignDetail = function (id) {
        const campaign = allCampaigns.find(c => c.campaignID.toString() === id.toString());
        if (!campaign) return;

        const modal = document.getElementById('modalChiTiet');
        if (!modal) return;

        document.getElementById('detailTitle').textContent = `Chi tiết: ${campaign.name || 'N/A'}`;
        document.getElementById('detailDescription').textContent = campaign.description || 'Không có mô tả.';
        
        modal.style.display = 'flex';
    };

    window.closeCampaignDetail = function () {
        const modal = document.getElementById('modalChiTiet');
        if (modal) modal.style.display = 'none';
    };

    function init() {
        fetchAllCampaigns();

        document.getElementById('campaignStatusFilter')?.addEventListener('change', filterCampaigns);
        document.getElementById('campaignSearchInput')?.addEventListener('input', filterCampaigns);

        document.getElementById('btnOpenForm')?.addEventListener('click', openCampaignModal);

        document.getElementById('campaignCancelBtn')?.addEventListener('click', closeCampaignModal);
        document.getElementById('campaignCloseBtn')?.addEventListener('click', closeCampaignModal);

        document.getElementById('detailCloseBtn')?.addEventListener('click', closeCampaignDetail);

        window.addEventListener('click', e => {
            const modalDetail = document.getElementById('modalChiTiet');
            
            if (e.target === modalDetail) closeCampaignDetail();
        });

        const campaignForm = document.getElementById('campaignForm');
        if (campaignForm) {
            campaignForm.addEventListener('submit', e => {
                e.preventDefault();
                
                const formData = {
                    campaignCode: document.getElementById('campaign_code').value.trim(),
                    name: document.getElementById('campaign_name').value.trim(),
                    startDate: document.getElementById('campaign_start').value,
                    status: document.getElementById('campaign_status').value,
                    description: document.getElementById('campaign_desc').value.trim()
                };

                if (isEditMode) {
                    updateCampaign(currentEditId, formData);
                } else {
                    submitCampaignForm(formData);
                }
            });
        }
        console.log('Campaign List initialized successfully');
    }

    setTimeout(init, 300);

})();