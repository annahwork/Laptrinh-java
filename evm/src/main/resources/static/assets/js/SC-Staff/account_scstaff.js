(function () {
    'use strict';

    console.log('Account script loaded');

    const CONTEXT_PATH = (() => {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        return pathParts.length > 0 ? `/${pathParts[0]}` : '/evm';
    })();
    console.log('Detected context path for account page:', CONTEXT_PATH);

    const modal = document.getElementById('password-change-modal');
    const trigger = document.getElementById('change-password-trigger');
    const closeBtn = modal ? modal.querySelector('.close-btn') : null;
    const form = document.getElementById('change-password-form');
    const messageArea = document.getElementById('password-message');

    const editInfoModal = document.getElementById('edit-info-modal');
    const editInfoTrigger = document.getElementById('edit-info-trigger');
    const editInfoCloseBtn = editInfoModal ? editInfoModal.querySelector('.close-btn') : null;
    const editInfoForm = document.getElementById('edit-info-form');
    const editInfoMessageArea = document.getElementById('edit-info-message');
    const userNameElement = document.querySelector('.user-name');

    async function fetchUserInfo() {
        try {
            const response = await fetch(`${CONTEXT_PATH}/api/account/user-info`);
            if (!response.ok) {
                console.error('Failed to fetch user info:', response.statusText);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    }

    function updateUserInfo(userInfo) {
        if (!userInfo) {
            console.log('No user info to update.');
            return;
        }

        const userNameElement = document.querySelector('.user-name');
        const userRoleElement = document.querySelector('.user-role');

        if (userNameElement && userInfo.fullName) {
            userNameElement.textContent = userInfo.fullName;
        } else if (userNameElement) {
            console.log('User full name not available in user info.');
        }

        if (userRoleElement && userInfo.roleName) {
            userRoleElement.textContent = userInfo.roleName;
        } else if (userRoleElement) {
            console.log('User role name not available in user info.');
        }
    }

    async function handleLogout(e) {
        e.preventDefault();

        try {
            console.log('Calling logout API...');
            await fetch(`${CONTEXT_PATH}/api/login/logout`, { method: 'GET' });

            console.log('Redirecting to login page...');
            window.location.href = CONTEXT_PATH + '/login';

        } catch (error) {
            console.error('An error occurred during logout, redirecting anyway:', error);
            window.location.href = CONTEXT_PATH + '/login';
        }
    }

    function toggleModal(show) {
        if (modal) {
            modal.style.display = show ? 'flex' : 'none';
            if (!show && form) {
                form.reset();
                messageArea.textContent = '';
                messageArea.style.color = 'red';
            }
        }
    }

    async function handlePasswordChange(e) {
        e.preventDefault();
        messageArea.textContent = 'Đang xử lý...';
        messageArea.style.color = '#007bff';

        const oldPassword = form.querySelector('#oldPassword').value;
        const newPassword = form.querySelector('#newPassword').value;
        const confirmPassword = form.querySelector('#confirmPassword').value;

        try {
            const response = await fetch(`${CONTEXT_PATH}/api/account/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
            });

            const result = await response.json();

            if (response.ok) {
                messageArea.textContent = result.message || 'Đổi mật khẩu thành công. Đang đăng xuất...';
                messageArea.style.color = '#28a745';

                setTimeout(() => {
                    toggleModal(false);
                    window.location.href = CONTEXT_PATH + '/login';
                }, 1500);

            } else {
                messageArea.textContent = result.message || 'Lỗi: Không thể đổi mật khẩu.';
                messageArea.style.color = 'red';
            }

        } catch (error) {
            console.error('Error during password change:', error);
            messageArea.textContent = 'Lỗi kết nối mạng. Vui lòng thử lại.';
            messageArea.style.color = 'red';
        }
    }

    function toggleEditInfoModal(show) {
        if (editInfoModal) {
            editInfoModal.style.display = show ? 'flex' : 'none';
            if (!show && editInfoForm) {
                editInfoForm.reset();
                if (editInfoMessageArea) {
                    editInfoMessageArea.textContent = '';
                    editInfoMessageArea.style.color = 'red';
                }
            }
        }
    }
    async function handleInfoChange(e) {
        e.preventDefault();
        if (!editInfoMessageArea) return;

        editInfoMessageArea.textContent = 'Đang xử lý...';
        editInfoMessageArea.style.color = '#007bff';

        const newFullName = editInfoForm.querySelector('#fullName').value;

        try {
            const response = await fetch(`${CONTEXT_PATH}/api/account/update-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName: newFullName })
            });

            const result = await response.json();

            if (response.ok) {
                editInfoMessageArea.textContent = result.message || 'Cập nhật thông tin thành công!';
                editInfoMessageArea.style.color = '#28a745';

                if (userNameElement) {
                    userNameElement.textContent = newFullName;
                }

                setTimeout(() => {
                    toggleEditInfoModal(false);
                }, 1500);

            } else {
                editInfoMessageArea.textContent = result.message || 'Lỗi: Không thể cập nhật.';
                editInfoMessageArea.style.color = 'red';
            }

        } catch (error) {
            console.error('Error during info update:', error);
            editInfoMessageArea.textContent = 'Lỗi kết nối mạng. Vui lòng thử lại.';
            editInfoMessageArea.style.color = 'red';
        }
    }

    async function init() {
        const logoutButton = document.querySelector('.logout-button');

        if (logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        } else {
            console.error('Logout button (.logout-button) not found!');
        }

        if (trigger && modal && closeBtn && form) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                toggleModal(true);
            });

            closeBtn.addEventListener('click', () => toggleModal(false));

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    toggleModal(false);
                }
            });

            form.addEventListener('submit', handlePasswordChange);
        } else {
            console.error('One or more modal/form elements not found. Check HTML IDs.');
        }
        if (editInfoTrigger && editInfoModal && editInfoCloseBtn && editInfoForm) {
            editInfoTrigger.addEventListener('click', (e) => {
                e.preventDefault();

                const currentName = userNameElement ? userNameElement.textContent : '';
                const fullNameInput = editInfoForm.querySelector('#fullName');
                if (fullNameInput) {
                    fullNameInput.value = currentName;
                }

                toggleEditInfoModal(true);
            });

            editInfoCloseBtn.addEventListener('click', () => toggleEditInfoModal(false));

            window.addEventListener('click', (e) => {
                if (e.target === editInfoModal) {
                    toggleEditInfoModal(false);
                }
            });

            editInfoForm.addEventListener('submit', handleInfoChange);
        } else {
            console.error('One or more edit info modal elements not found.');
        }


        const userInfo = await fetchUserInfo();
        updateUserInfo(userInfo);
    }

    init();

})();