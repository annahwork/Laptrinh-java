(function () {
    'use strict';

    console.log('User Management script loaded');

    window.openUserModal = function() {
        console.log('openUserModal called');
        
        const modal = document.getElementById('userModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('userForm');
        const passwordField = document.getElementById('password');

        if (!modal) {
            console.error('Modal not found!');
            alert('Loi: Khong tim thay modal!');
            return;
        }

        if (form) form.reset();
        
        if (modalTitle) modalTitle.textContent = 'Them nguoi dung moi';
        
        if (passwordField) {
            passwordField.required = true;
            passwordField.placeholder = '';
        }

        modal.style.display = 'flex';
        console.log('Modal opened successfully');
    };

    window.closeUserModal = function() {
        console.log('Closing user modal');
        
        const modal = document.getElementById('userModal');
        if (!modal) return;

        modal.style.display = 'none';
        
        const form = document.getElementById('userForm');
        if (form) form.reset();
    };

    window.openDeleteModal = function() {
        console.log('Opening delete modal');
        
        const modal = document.getElementById('deleteModal');
        if (!modal) return;

        modal.style.display = 'flex';
    };

    window.closeDeleteModal = function() {
        console.log('Closing delete modal');
        
        const modal = document.getElementById('deleteModal');
        if (!modal) return;

        modal.style.display = 'none';
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
        
        console.log('Filters reset');
    };

    setTimeout(function() {
        init();
    }, 300);

    function init() {
        console.log('Initializing User Management...');

        const btnCloseModal = document.getElementById('btnCloseModal');
        const btnCancelModal = document.getElementById('btnCancelModal');
        const btnCloseDeleteModal = document.getElementById('btnCloseDeleteModal');
        const btnCancelDelete = document.getElementById('btnCancelDelete');
        const btnConfirmDelete = document.getElementById('btnConfirmDelete');
        const btnResetFilter = document.getElementById('btnResetFilter');
        const userForm = document.getElementById('userForm');
        const userModal = document.getElementById('userModal');
        const deleteModal = document.getElementById('deleteModal');

        if (btnCloseModal) {
            btnCloseModal.addEventListener('click', window.closeUserModal);
        }

        if (btnCancelModal) {
            btnCancelModal.addEventListener('click', window.closeUserModal);
        }

        if (btnCloseDeleteModal) {
            btnCloseDeleteModal.addEventListener('click', window.closeDeleteModal);
        }

        if (btnCancelDelete) {
            btnCancelDelete.addEventListener('click', window.closeDeleteModal);
        }

        if (btnConfirmDelete) {
            btnConfirmDelete.addEventListener('click', window.handleDelete);
        }

        if (btnResetFilter) {
            btnResetFilter.addEventListener('click', window.resetFilters);
        }

        if (userForm) {
            userForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Form submitted');
                
                const formData = {
                userName: document.getElementById('userName')?.value,
                password: document.getElementById('password')?.value,
                userRole: document.getElementById('userRole')?.value,
                email: document.getElementById('email')?.value,
                phone: document.getElementById('phone')?.value
            };

                console.log('Form data:', formData);
                
                alert('Form submitted! (Chua co backend)\n\nData: ' + JSON.stringify(formData, null, 2));
                
                window.closeUserModal();
            });
        }

        window.addEventListener('click', function (e) {
            if (userModal && e.target === userModal) window.closeUserModal();
            if (deleteModal && e.target === deleteModal) window.closeDeleteModal();
        });

        console.log('User Management initialized successfully');
    }

})();