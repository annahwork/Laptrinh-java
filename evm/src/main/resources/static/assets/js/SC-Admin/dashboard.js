(function () {
    'use strict';

    // 💡 Hàm tra cứu dịch thuật (giả định)
    const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

    console.log('Dashboard loaded - Ready for backend integration');

    const API_STATS = '/evm/api/user/stats';
    const API_TECH_LIST = '/evm/api/technicians';

    let allTechnicians = [];
    let currentTechPage = 1;
    const techPageSize = 5;

    async function loadDashboardStats() {
        try {
            const response = await fetch(API_STATS);
            if (!response.ok) throw new Error(T('error.fetch_stats_failed', 'Failed to fetch stats'));
            const data = await response.json();

            document.getElementById('total-employees').textContent = data.totalEmployees || 0;
            document.getElementById('total-vehicles').textContent = data.totalVehicles || 0;
            document.getElementById('total-customers').textContent = data.totalCustomers || 0;
            document.getElementById('total-warrantyclaims').textContent = data.totalWarrantyClaims || 0;

            const roles = data.roles || {};
            document.getElementById('role-admin-count').textContent = roles.ADMIN || 0;
            document.getElementById('role-scstaff-count').textContent = roles.SC_STAFF || 0;
            document.getElementById('role-sctech-count').textContent = roles.SC_TECHNICIAN || 0;
            document.getElementById('role-evm-count').textContent = roles.EVM_STAFF || 0;
        } catch (err) {
            console.error('Error loading dashboard stats:', err);
        }
    }

    async function fetchAllTechnicians() {
        const tableBody = document.getElementById('techniciansTableBody');
        if (tableBody)
            // 💡 Dịch: Đang tải dữ liệu...
            tableBody.innerHTML = `<tr><td colspan="3" class="loading-data">${T('message.loading_data', 'Đang tải dữ liệu...')}</td></tr>`;

        try {
            const response = await fetch(API_TECH_LIST);
            if (!response.ok) throw new Error(T('error.http_failed', `HTTP error! Status: ${response.status}`));
            const data = await response.json();

            allTechnicians = Array.isArray(data) ? data : [];
            renderPaginatedTechnicians();
        } catch (error) {
            // 💡 Dịch: Không thể tải dữ liệu.
            console.error('Fetch technicians error:', error);
            if (tableBody)
                tableBody.innerHTML = `<tr><td colspan="3" class="error-data">${T('error.load_data', 'Không thể tải dữ liệu.')}</td></tr>`;
        }
    }

    function renderTechnicians(users) {
        const tableBody = document.getElementById('techniciansTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        if (!users || users.length === 0) {
            // 💡 Dịch: Không có kỹ thuật viên nào.
            tableBody.innerHTML = `<tr><td colspan="3" class="no-data">${T('dashboard.sc_admin.no_techs', 'Không có kỹ thuật viên nào.')}</td></tr>`;
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.userID || ''}</td>
                <td>${user.name || 'N/A'}</td>
                <td>${user.currentTask || ''}</td>`;
            tableBody.appendChild(row);
        });
    }

    function renderPaginatedTechnicians() {
        const totalRecords = allTechnicians.length;
        const startIndex = (currentTechPage - 1) * techPageSize;
        const paginated = allTechnicians.slice(startIndex, startIndex + techPageSize);

        renderTechnicians(paginated);
        updateTechPagination(totalRecords);
    }

    function updateTechPagination(totalRecords) {
        const btnPrev = document.getElementById('techBtnPrev');
        const btnNext = document.getElementById('techBtnNext');
        const btnCurrent = document.getElementById('techBtnCurrent');
        const paginationInfo = document.getElementById('techPaginationInfo');

        const totalPages = Math.ceil(totalRecords / techPageSize);

        if (btnPrev) btnPrev.disabled = currentTechPage <= 1;
        if (btnNext) btnNext.disabled = (currentTechPage >= totalPages || totalRecords === 0);
        if (btnCurrent) btnCurrent.textContent = currentTechPage.toString();

        if (paginationInfo) {
            if (totalRecords === 0) {
                // 💡 Dịch: Hiển thị 0 của 0
                paginationInfo.textContent = T('pagination.display_info', "Hiển thị 0 của 0");
            } else {
                const start = (currentTechPage - 1) * techPageSize + 1;
                const end = Math.min(currentTechPage * techPageSize, totalRecords);
                // 💡 Dịch: Hiển thị [start] - [end] của [totalRecords]
                paginationInfo.textContent = T('pagination.display_info_of_tracking', `Hiển thị %s của %s`)
                                                .replace('%s', `${start} - ${end}`)
                                                .replace('%s', totalRecords);
            }
        }
    }

    function init() {
        loadDashboardStats();
        fetchAllTechnicians();

        document.getElementById('techBtnPrev')?.addEventListener('click', () => {
            if (currentTechPage > 1) {
                currentTechPage--;
                renderPaginatedTechnicians();
            }
        });

        document.getElementById('techBtnNext')?.addEventListener('click', () => {
            if (currentTechPage * techPageSize < allTechnicians.length) {
                currentTechPage++;
                renderPaginatedTechnicians();
            }
        });
    }

    init();

})();