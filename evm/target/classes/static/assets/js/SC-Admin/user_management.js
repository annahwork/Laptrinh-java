(function () {
    'use strict';

    console.log('User Management script loaded');

    const API_USER_LIST = '/evm/api/users';
    const API_USER_ADD = '/evm/api/add-user';
    const PAGE_SIZE = 5;

    let allUsers = [];
    let currentFilteredUsers = [];
    let currentPage = 1;

    function formatRole(roleValue) {
        switch (roleValue) {
            case 'ADMIN': return 'Admin';
            case 'SC_STAFF': return 'SC Staff';
            case 'SC_TECHNICIAN': return 'SC Technician';
            case 'EVM_STAFF': return 'EVM Staff';
            default: return roleValue || 'N/A';
        }
    }

    function renderUsers(users) {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        if (!users || users.length === 0) {
            tableBody.innerHTML = `
                <tr><td colspan="7" class="no-data">
                    <p>Không có dữ liệu người dùng nào.</p>
                </td></tr>`;
            return;
        }

        users.forEach(user => {
            const roleValue = user.User_Role || 'UNKNOWN';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.userID || ''}</td>
                <td>${user.userName || 'N/A'}</td>
                <td>${user.name || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.phone || 'N/A'}</td>
                <td><span class="role-tag role-${roleValue.toLowerCase().replace('_', '-')}">
                    ${formatRole(roleValue)}</span></td>
                <td>
                    <button class="btn-action btn-edit" onclick="openUserModal('${user.userID}')">Sửa</button>
                    <button class="btn-action btn-delete" onclick="openDeleteModal('${user.userID}')">Xóa</button>
                </td>`;
            tableBody.appendChild(row);
        });
    }

    async function fetchAllUsers() {
        console.log('Fetching all users...');
        const tableBody = document.getElementById('usersTableBody');
        if (tableBody)
            tableBody.innerHTML = `<tr><td colspan="7" class="loading-data">Đang tải dữ liệu...</td></tr>`;

        try {
            const response = await fetch(API_USER_LIST);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            allUsers = Array.isArray(data) ? data : data.data || [];
            currentFilteredUsers = [...allUsers];
            renderPaginatedUsers();
        } catch (error) {
            console.error('Fetch error:', error);
            if (tableBody)
                tableBody.innerHTML = `<tr><td colspan="7" class="error-data"><p>Lỗi: Không thể tải dữ liệu.</p></td></tr>`;
        }
    }

    function filterUsers() {
        const roleFilter = document.getElementById('roleFilter')?.value || '';
        const searchValue = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';

        currentFilteredUsers = allUsers.filter(user => {
            const matchesRole = roleFilter ? user.User_Role === roleFilter : true;
            const matchesSearch = searchValue
                ? (user.userName?.toLowerCase().includes(searchValue) ||
                   user.email?.toLowerCase().includes(searchValue) ||
                   user.phone?.toLowerCase().includes(searchValue))
                : true;
            return matchesRole && matchesSearch;
        });

        currentPage = 1;
        renderPaginatedUsers();
    }

    function renderPaginatedUsers() {
        const totalRecords = currentFilteredUsers.length;
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const paginated = currentFilteredUsers.slice(startIndex, startIndex + PAGE_SIZE);
        renderUsers(paginated);
        updatePagination(totalRecords);
    }

    function updatePagination(totalRecords) {
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const btnCurrent = document.getElementById('btnCurrent');
        const paginationInfo = document.getElementById('paginationInfo');

        const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
        if (btnPrev) btnPrev.disabled = currentPage <= 1;
        if (btnNext) btnNext.disabled = currentPage >= totalPages;
        if (btnCurrent) btnCurrent.textContent = currentPage.toString();

        if (paginationInfo)
            paginationInfo.textContent = `Hiển thị ${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, totalRecords)} của ${totalRecords}`;
    }

    window.openUserModal = function (userId = null) {
        const modal = document.getElementById('userModal');
        const modalTitle = document.getElementById('modalTitle');
        const passwordField = document.getElementById('password');
        const form = document.getElementById('userForm');
        const userIdHidden = document.getElementById('userId');

        if (form) form.reset();

        if (userId === null) {
            modalTitle.textContent = 'Thêm người dùng mới';
            passwordField.required = true;
            userIdHidden.value = '';
        } else {
            modalTitle.textContent = 'Chỉnh sửa người dùng';
            passwordField.required = false;
            passwordField.placeholder = 'Bỏ trống nếu không đổi mật khẩu';
            fetchUserById(userId);
        }

        modal.classList.add('modal-open');
    };

    window.closeUserModal = function () {
        const modal = document.getElementById('userModal');
        modal.classList.remove('modal-open');
    };

    async function fetchUserById(userId) {
        try {
            const response = await fetch(`/evm/api/users/profile/${userId}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const user = await response.json();

            document.getElementById('userName').value = user.userName || '';
            document.getElementById('name').value = user.name || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('userRole').value = user.User_Role || '';
            document.getElementById('userId').value = user.userID || '';
        } catch (err) {
            console.error('Error fetching user:', err);
            alert('Không thể tải dữ liệu người dùng.');
        }
    }

    window.openDeleteModal = function (userId) {
        const modal = document.getElementById('deleteModal');
        const btnConfirm = document.getElementById('btnConfirmDelete');
        btnConfirm.setAttribute('data-user-id', userId);
        modal.classList.add('modal-open');
    };

    window.closeDeleteModal = function () {
        document.getElementById('deleteModal').classList.remove('modal-open');
    };

    window.handleDelete = async function (e) {
        const userId = e.target.getAttribute('data-user-id');
        try {
            const response = await fetch(`/evm/api/users/delete/${userId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            closeDeleteModal();
            fetchAllUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Lỗi khi xóa người dùng.');
        }
    };

    window.submitUserForm = async function (formData, userId = null) {
        try {
            const url = userId ? `/evm/api/users/update/${userId}` : API_USER_ADD;
            const method = userId ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error(await response.text());
            fetchAllUsers();
        } catch (err) {
            console.error('Error saving user:', err);
            alert('Lỗi khi lưu người dùng.');
        }
    };

    function init() {
        fetchAllUsers();
        document.getElementById('roleFilter')?.addEventListener('change', filterUsers);
        document.getElementById('searchInput')?.addEventListener('input', filterUsers);
        document.getElementById('btnPrev')?.addEventListener('click', () => {
            if (currentPage > 1) { currentPage--; renderPaginatedUsers(); }
        });
        document.getElementById('btnNext')?.addEventListener('click', () => {
            if (currentPage * PAGE_SIZE < currentFilteredUsers.length) { currentPage++; renderPaginatedUsers(); }
        });

        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', e => {
                e.preventDefault();
                const formData = {
                    UserName: document.getElementById('userName').value,
                    Name: document.getElementById('name').value,
                    Password: document.getElementById('password').value,
                    UserRole: document.getElementById('userRole').value,
                    Email: document.getElementById('email').value,
                    Phone: document.getElementById('phone').value
                };
                const userId = document.getElementById('userId').value || null;
                submitUserForm(formData, userId);
                closeUserModal();
            });
        }

        document.getElementById('btnCancelModal')?.addEventListener('click', closeUserModal);
        document.getElementById('btnCancelDelete')?.addEventListener('click', closeDeleteModal);
        document.getElementById('btnConfirmDelete')?.addEventListener('click', e => handleDelete(e));

        console.log('User Management initialized successfully');
    }

    setTimeout(init, 300);
})();
