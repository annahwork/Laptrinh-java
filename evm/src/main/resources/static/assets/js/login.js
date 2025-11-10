(function () {
    'use strict';

    console.log('Login script loaded');

    // API endpoint
    const API_LOGIN = '/evm/api/login/authenticate';

    function redirectUserBasedOnRole(userRole) {
        console.log('Redirecting for role:', userRole);
        switch (userRole) {
            case 'ADMIN':
            case 'EVM_STAFF':
                window.location.href = 'evm/dashboard'; //đường dẫn test
                break;
            case 'SC_STAFF':
            case 'SC_TECHNICIAN':
                window.location.href = 'evm/home'; //đường dẫn test
                break;
            default:
                console.warn('Unknown user role, redirecting to default home.');
                window.location.href = '/';
        }
    }


    async function handleLoginSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;
        const userTypeRadio = document.querySelector('input[name="userType"]:checked');
        const userType = userTypeRadio ? userTypeRadio.value : null;

        if (!username || !password || !userType) {
            alert('Vui lòng nhập tên đăng nhập, mật khẩu và chọn loại tài khoản.');
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Đang xử lý...';

        try {
            const response = await fetch(API_LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    userType: userType
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `HTTP error! Status: ${response.status}`);
            }

            console.log('Login successful:', result);
            redirectUserBasedOnRole(result.User_Role);

        } catch (error) {
            console.error('Login error:', error);
            alert(`Đăng nhập thất bại: ${error.message}`);
            
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    }

    function setupPasswordToggle() {
        const toggleButton = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        if (!toggleButton || !passwordInput) return;

        // Thiết lập icon ban đầu (giả sử là "hiện")
        toggleButton.innerHTML = '🙈'; // Hoặc dùng icon/SVG

        toggleButton.addEventListener('click', function () {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleButton.innerHTML = '👁️';
                toggleButton.setAttribute('aria-label', 'Ẩn mật khẩu');
            } else {
                passwordInput.type = 'password';
                toggleButton.innerHTML = '🙈';
                toggleButton.setAttribute('aria-label', 'Hiện mật khẩu');
            }
        });
    }

    /**
     * Hàm khởi tạo chính
     */
    function init() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
        } else {
            console.error('Login form not found!');
        }

        setupPasswordToggle();
    }

    // Chạy hàm init khi tài liệu đã tải xong
    document.addEventListener('DOMContentLoaded', init);

})();