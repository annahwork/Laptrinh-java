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
                <tr>
                    <td colspan="7" class="no-data">
                        <p>Không có dữ liệu người dùng nào.</p>
                    </td>
                </tr>`;
            return;
        }

        users.forEach(user => {
            const roleValue = user.User_Role || user.role || 'UNKNOWN'; 
            const userId = user.userID || user.id || '';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userId}</td>
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
                    <button type="button" class="btn-action btn-edit" onclick="window.openUserModal('${userId}')">Sửa</button>
                    <button type="button" class="btn-action btn-delete" onclick="window.openDeleteModal('${userId}')">Xóa</button>
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
            allUsers = Array.isArray(data) ? data : (data.data || []);
            
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
        const searchInput = document.getElementById('searchInput');
        const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';

        currentFilteredUsers = allUsers.filter(user => {
            const userRole = user.User_Role || user.role || '';
            const uName = user.userName || '';
            const uEmail = user.email || '';
            const uPhone = user.phone || '';

            const matchesRole = roleFilter ? userRole === roleFilter : true;
            const matchesSearch = searchValue
                ? (uName.toLowerCase().includes(searchValue) ||
                   uEmail.toLowerCase().includes(searchValue) ||
                   uPhone.toLowerCase().includes(searchValue))
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

        const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));

        if (btnPrev) btnPrev.disabled = currentPage <= 1;
        if (btnNext) btnNext.disabled = currentPage >= totalPages;
        if (btnCurrent) btnCurrent.textContent = currentPage.toString();

        if (paginationInfo) {
            const start = totalRecords === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
            const end = Math.min(currentPage * PAGE_SIZE, totalRecords);
            paginationInfo.textContent = `Hiển thị ${start} - ${end} của ${totalRecords}`;
        }
    }

    window.openUserModal = function (userId = null) {
        const modal = document.getElementById('userModal');
        const modalTitle = document.getElementById('modalTitle'); 
        const passwordField = document.getElementById('password');
        const form = document.getElementById('userForm');
        const userIdHidden = document.getElementById('userId');

        if (form) form.reset();

        if (userId === null || userId === '') {
            if (modalTitle) modalTitle.textContent = 'Thêm người dùng mới';
            if (passwordField) {
                passwordField.required = true;
                passwordField.placeholder = '';
                passwordField.disabled = false;
            }
            if (userIdHidden) userIdHidden.value = '';
        } else {
            if (modalTitle) modalTitle.textContent = 'Chỉnh sửa người dùng';
            if (passwordField) {
                passwordField.required = false;
                passwordField.placeholder = 'Bỏ trống nếu không đổi mật khẩu';
            }
            fetchUserById(userId); 
        }

        if (modal) {
            modal.classList.add('modal-open');
            modal.style.display = 'block'; 
        }
    };

    window.closeUserModal = function () {
        const modal = document.getElementById('userModal');
        if (modal) {
            modal.classList.remove('modal-open');
            modal.style.display = 'none';
        }
    };

    async function fetchUserById(userId) {
        try {
            const cachedUser = allUsers.find(u => (u.userID == userId || u.id == userId));
            
            if (cachedUser) {
                fillForm(cachedUser);
            } else {
                const response = await fetch(`/evm/api/users/profile/${userId}`);
                if (!response.ok) throw new Error('Lỗi tải thông tin user');
                const user = await response.json();
                fillForm(user);
            }
        } catch (err) {
            console.error('Error fetching user:', err);
            alert('Không thể tải dữ liệu người dùng.');
        }
    }

    function fillForm(user) {
        document.getElementById('userName').value = user.userName || '';
        document.getElementById('name').value = user.name || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('userRole').value = user.User_Role || user.role || '';
        document.getElementById('userId').value = user.userID || user.id || '';
    }

    window.openDeleteModal = function (userId) {
        const modal = document.getElementById('deleteModal');
        const btnConfirm = document.getElementById('btnConfirmDelete');
        if (btnConfirm) btnConfirm.setAttribute('data-user-id', userId);
        
        if (modal) {
            modal.classList.add('modal-open');
            modal.style.display = 'block';
        }
    };

    window.closeDeleteModal = function () {
        const modal = document.getElementById('deleteModal');
        if (modal) {
            modal.classList.remove('modal-open');
            modal.style.display = 'none';
        }
    };

    window.handleDelete = async function (e) {
        const target = e.target || e.currentTarget; 
        const userId = target.getAttribute('data-user-id');
        
        if (!userId) return;

        try {
            const response = await fetch(`/evm/api/users/delete/${userId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            closeDeleteModal();
            alert('Xóa thành công!');
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
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Lỗi server');
            }

            closeUserModal();
            alert(userId ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
            fetchAllUsers();
        } catch (err) {
            console.error('Error saving user:', err);
            alert('Lỗi: ' + err.message);
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
            const totalPages = Math.ceil(currentFilteredUsers.length / PAGE_SIZE);
            if (currentPage < totalPages) { currentPage++; renderPaginatedUsers(); }
        });

        document.getElementById('btnAddUser')?.addEventListener('click', () => {
            window.openUserModal(null);
        });

        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', e => {
                e.preventDefault();
                
                const userId = document.getElementById('userId').value || null;
                
                const formData = {
                    UserName: document.getElementById('userName').value,
                    Name: document.getElementById('name').value,
                    UserRole: document.getElementById('userRole').value,
                    Email: document.getElementById('email').value,
                    Phone: document.getElementById('phone').value
                };

                const password = document.getElementById('password').value;
                if (!userId || password) {
                    formData.Password = password;
                }

                submitUserForm(formData, userId);
            });
        }

        console.log('User Management initialized successfully');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();