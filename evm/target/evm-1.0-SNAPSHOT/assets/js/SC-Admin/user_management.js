(function () {
    'use strict';

    console.log('User Management script loaded (Phiên bản đầy đủ)');

    // =================================================================
    // PHẦN CODE MODAL VÀ FORM CŨ CỦA BẠN (GIỮ NGUYÊN)
    // =================================================================

    window.openUserModal = function() {
        console.log('openUserModal called');
        const modal = document.getElementById('userModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('userForm');
        // ... (phần code modal của bạn) ...
        modal.style.display = 'flex';
    };

    window.closeUserModal = function() {
        console.log('Closing user modal');
        const modal = document.getElementById('userModal');
        if (modal) modal.style.display = 'none';
        const form = document.getElementById('userForm');
        if (form) form.reset();
    };

    window.openDeleteModal = function() {
        console.log('Opening delete modal');
        const modal = document.getElementById('deleteModal');
        if (modal) modal.style.display = 'flex';
    };

    window.closeDeleteModal = function() {
        console.log('Closing delete modal');
        const modal = document.getElementById('deleteModal');
        if (modal) modal.style.display = 'none';
    };

    window.handleDelete = function() {
        console.log('Delete confirmed');
        alert('User deleted! (Chua co backend)');
        closeDeleteModal();
    };

    window.resetFilters = function() {
        console.log('Resetting filters');
        const searchInput = document.getElementById('searchInput');
        const roleFilter = document.getElementById('roleFilter');
        if (searchInput) searchInput.value = '';
        if (roleFilter) roleFilter.value = '';
        
        // Sau khi reset, tải lại dữ liệu
        fetchAndDisplayUsers(1); 
    };

    // Chạy hàm init() ngay lập tức
    // File home_sc_admin.js sẽ tải script này sau khi HTML được render
    init();

    function init() {
        console.log('Initializing User Management...');

        // Gán sự kiện cho các nút (code cũ của bạn)
        const btnCloseModal = document.getElementById('btnCloseModal');
        const btnCancelModal = document.getElementById('btnCancelModal');
        const btnCloseDeleteModal = document.getElementById('btnCloseDeleteModal');
        const btnCancelDelete = document.getElementById('btnCancelDelete');
        const btnConfirmDelete = document.getElementById('btnConfirmDelete');
        const btnResetFilter = document.getElementById('btnResetFilter');
        const userForm = document.getElementById('userForm');
        const userModal = document.getElementById('userModal');
        const deleteModal = document.getElementById('deleteModal');

        if (btnCloseModal) btnCloseModal.addEventListener('click', window.closeUserModal);
        if (btnCancelModal) btnCancelModal.addEventListener('click', window.closeUserModal);
        if (btnCloseDeleteModal) btnCloseDeleteModal.addEventListener('click', window.closeDeleteModal);
        if (btnCancelDelete) btnCancelDelete.addEventListener('click', window.closeDeleteModal);
        if (btnConfirmDelete) btnConfirmDelete.addEventListener('click', window.handleDelete);
        if (btnResetFilter) btnResetFilter.addEventListener('click', window.resetFilters);

        if (userForm) {
            userForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Form submitted');
                // (Logic gọi API POST/PUT sẽ ở đây)
                alert('Form submitted! (Chua co backend)');
                window.closeUserModal();
            });
        }

        window.addEventListener('click', function (e) {
            if (userModal && e.target === userModal) window.closeUserModal();
            if (deleteModal && e.target === deleteModal) window.closeDeleteModal();
        });

        // =================================================================
        // PHẦN CODE MỚI BỊ THIẾU ĐỂ LẤY DỮ LIỆU
        // =================================================================

        console.log('Calling fetchAndDisplayUsers for the first time...');
        // 1. GỌI HÀM ĐỂ TẢI DỮ LIỆU NGAY KHI TRANG ĐƯỢC KHỞI TẠO
        fetchAndDisplayUsers(1); 

        console.log('User Management initialized successfully');
    }

    // =================================================================
    // CÁC HÀM MỚI ĐỂ LẤY VÀ HIỂN THỊ DỮ LIỆU
    // =================================================================

    /**
     * Hàm chính: Gọi API backend để lấy danh sách user và hiển thị
     */
    async function fetchAndDisplayUsers(page, pageSize = 10) {
        console.log(`Fetching users: page ${page}, pageSize ${pageSize}`);

        // Đường dẫn API (khớp với UserServlet.java và web.xml)
        const API_URL = `/evm/api/users?page=${page}&pageSize=${pageSize}`;

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                // Nếu gặp lỗi 500 ("Lỗi server nội bộ"), ném ra lỗi
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.message}`);
            }

            const users = await response.json(); 
            
            // Gọi hàm để "vẽ" lại bảng
            renderUserTable(users); 
            
            updatePaginationInfo(users, page, pageSize);

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu người dùng:', error);
            const tableBody = document.getElementById('usersTableBody');
            if (tableBody) {
                tableBody.innerHTML = `<tr><td colspan="7" class="no-data error">Có lỗi xảy ra khi tải dữ liệu. (Chi tiết: ${error.message})</td></tr>`;
            }
        }
    }

    /**
     * "Vẽ" các hàng dữ liệu vào bảng
     */
    function renderUserTable(users) {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) {
            console.error('Không tìm thấy #usersTableBody!');
            return;
        }

        tableBody.innerHTML = ''; // Xóa dòng "Chua co du lieu"

        if (!users || users.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="no-data">Không tìm thấy người dùng nào.</td></tr>`;
            return;
        }

        users.forEach(user => {
            // Lấy vai trò (role) - Bạn PHẢI thêm @Expose vào trường User_Role
            const role = user.User_Role || 'Unknown';
            
            const row = `
                <tr>
                    <td>${user.UserID}</td>
                    <td>${user.UserName}</td>
                    <td>${user.Name}</td>
                    <td>${user.Email || ''}</td>
                    <td>${user.Phone || ''}</td>
                    <td><span class="role-badge role-${role.toLowerCase()}">${role}</span></td>
                    <td class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editUser(${user.UserID})">Sửa</button>
                        <button class="btn-action btn-delete" onclick="deleteUser(${user.UserID})">Xóa</button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    /**
     * Cập nhật thông tin phân trang (Phiên bản đơn giản)
     */
    function updatePaginationInfo(users, page, pageSize) {
        const startRecord = document.getElementById('startRecord');
        const endRecord = document.getElementById('endRecord');
        const totalRecords = document.getElementById('totalRecords');

        const totalFetched = users.length;
        if (totalFetched > 0) {
            if (startRecord) startRecord.textContent = (page - 1) * pageSize + 1;
            if (endRecord) endRecord.textContent = (page - 1) * pageSize + totalFetched;
        } else {
            if (startRecord) startRecord.textContent = 0;
            if (endRecord) endRecord.textContent = 0;
        }
        
        if (totalRecords) totalRecords.textContent = '???'; // Không thể biết tổng số
    }

    // Thêm các hàm này vào global scope (window) để HTML có thể gọi
    window.editUser = function(userId) {
        console.log('Edit user:', userId);
        alert('Chức năng Sửa chưa được cài đặt');
    }

    window.deleteUser = function(userId) {
        console.log('Delete user:', userId);
        window.openDeleteModal(); 
    }

})();