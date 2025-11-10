(function () {
    'use strict';

    console.log('User Management script loaded');

    const API_USER_LIST = '/evm/api/users';
    const API_USER_ADD = '/evm/api/add-user';

    let allUsers = [];
    let currentFilteredUsers = [];
    let currentPage = 1;
    const pageSize = 5;

    function formatRole(roleValue) {
        switch (roleValue) {
            case 'ADMIN': return 'Admin';
            case 'SC_STAFF': return 'SC Staff';
            case 'SC_TECHNICIAN': return 'SC Technician';
            case 'EVM_STAFF': return 'EVM Staff';
            default: return roleValue;
        }
    }

    function renderUsers(users) {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        if (!users || users.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">
                        <p>Không có dữ liệu người dùng nào.</p>
                    </td>
                </tr>
            `;
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
                <td>
                    <span class="role-tag role-${roleValue.toLowerCase().replace('_', '-')}">
                        ${formatRole(roleValue)}
                    </span>
                </td>
                <td>
                    <button class="btn-action btn-edit" onclick="openUserModal('${user.userID}')">Sửa</button>
                    <button class="btn-action btn-delete" onclick="openDeleteModal('${user.userID}')">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    async function fetchAllUsers() {
        console.log('Fetching all users from API...');
        const tableBody = document.getElementById('usersTableBody');
        if (tableBody) tableBody.innerHTML = `<tr><td colspan="7" class="loading-data">Đang tải dữ liệu...</td></tr>`;

        try {
            const response = await fetch(API_USER_LIST);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            allUsers = Array.isArray(data) ? data : data.data || [];
            currentFilteredUsers = [...allUsers];
            renderPaginatedUsers();
        } catch (error) {
            console.error('Fetch error:', error);
            if (tableBody) {
                tableBody.innerHTML = `<tr><td colspan="7" class="error-data"><p>Lỗi: Không thể tải dữ liệu người dùng.</p></td></tr>`;
            }
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
        const startIndex = (currentPage - 1) * pageSize;
        const paginated = currentFilteredUsers.slice(startIndex, startIndex + pageSize);
        renderUsers(paginated);
        updatePagination(totalRecords);
    }

    function updatePagination(totalRecords) {
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const btnCurrent = document.getElementById('btnCurrent');

        const totalPages = Math.ceil(totalRecords / pageSize);
        if (btnPrev) btnPrev.disabled = currentPage <= 1;
        if (btnNext) btnNext.disabled = currentPage >= totalPages;
        if (btnCurrent) btnCurrent.textContent = currentPage.toString();

        const paginationInfo = document.getElementById('paginationInfo');
        if (paginationInfo)
            paginationInfo.textContent = `Hiển thị ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalRecords)} của ${totalRecords}`;
    }

    async function fetchUserById(userId) {
        try {
            const response = await fetch(`/evm/api/users/profile/${userId}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const user = await response.json();

            document.getElementById('userName').value = user.userName || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('userRole').value = user.User_Role || '';
            document.getElementById('userId').value = user.userID || '';
        } catch (err) {
            console.error('Error fetching user profile:', err);
            alert('Không thể tải dữ liệu user.');
        }
    }

    window.openUserModal = function (userId = null) {
        const modal = document.getElementById('userModal');
        const deleteModal = document.getElementById('deleteModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('userForm');
        const passwordField = document.getElementById('password');
        const userIdHidden = document.getElementById('userId');

        if (deleteModal) deleteModal.classList.remove('modal-open');

        if (!modal) return;
        if (form) form.reset();

        if (userId === null) {
            if (modalTitle) modalTitle.textContent = 'Thêm người dùng mới';
            if (passwordField) passwordField.required = true;
            if (userIdHidden) userIdHidden.value = '';
        } else {
            if (modalTitle) modalTitle.textContent = 'Chỉnh sửa người dùng';
            if (passwordField) {
                passwordField.required = false;
                passwordField.placeholder = 'Bỏ trống nếu không đổi mật khẩu';
            }
            fetchUserById(userId);
        }

        modal.classList.add('modal-open');
    };

    window.closeUserModal = function () {
        const modal = document.getElementById('userModal');
        const form = document.getElementById('userForm');
        if (modal) modal.classList.remove('modal-open');
        if (form) form.reset();
    };

    window.openDeleteModal = function (userId) {
    const deleteModal = document.getElementById('deleteModal');
    const userModal = document.getElementById('userModal');
    const confirmBtn = document.getElementById('btnConfirmDelete');
    if (!deleteModal) return;

    if (userModal) userModal.classList.remove('modal-open');

    if (confirmBtn) confirmBtn.setAttribute('data-user-id', userId);
    deleteModal.classList.add('modal-open');
};

    window.closeDeleteModal = function () {
        const modal = document.getElementById('deleteModal');
        if (modal) modal.classList.remove('modal-open');
    };

    window.handleDelete = async function (e) {
        const userId = e.target.getAttribute('data-user-id');

        try {
            const response = await fetch(`/evm/api/users/delete/${userId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            alert('Xóa người dùng thành công!');
            closeDeleteModal();
            fetchAllUsers().then(filterUsers);
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
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            fetchAllUsers().then(filterUsers);
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
            if (currentPage > 1) {
                currentPage--;
                renderPaginatedUsers();
            }
        });
        document.getElementById('btnNext')?.addEventListener('click', () => {
            if (currentPage * pageSize < currentFilteredUsers.length) {
                currentPage++;
                renderPaginatedUsers();
            }
        });

        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const formData = {
                    UserName: document.getElementById('userName')?.value,
                    Password: document.getElementById('password')?.value,
                    UserRole: document.getElementById('userRole')?.value,
                    Email: document.getElementById('email')?.value,
                    Phone: document.getElementById('phone')?.value
                };
                const userId = document.getElementById('userId')?.value || null;
                window.submitUserForm(formData, userId);
                window.closeUserModal();
            });
        }

        document.getElementById('btnCancelModal')?.addEventListener('click', window.closeUserModal);
        document.getElementById('btnCancelDelete')?.addEventListener('click', window.closeDeleteModal);
        document.getElementById('btnConfirmDelete')?.addEventListener('click', e => window.handleDelete(e));

        window.addEventListener('click', function (e) {
            if (e.target === document.getElementById('userModal')) window.closeUserModal();
            if (e.target === document.getElementById('deleteModal')) window.closeDeleteModal();
        });

        console.log('User Management initialized successfully');
    }

    setTimeout(init, 300);
})();
