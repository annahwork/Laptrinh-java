

(function () {
    'use strict';

    // Đợi DOM load xong
    document.addEventListener('DOMContentLoaded', function () {
        const mainContent = document.getElementById('main-content');
        const sidebarLinks = document.querySelectorAll('.sidebar__link');

        if (!mainContent) {
            console.error('Main content not found');
            return;
        }

        // ==================== LOAD PAGE FUNCTION ====================

        function loadPage(pageName) {
            const pagePath = `./Secsion/${pageName}`;

            console.log('Loading page:', pageName);

            // Fetch HTML
            fetch(pagePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    // Load HTML vào main content
                    mainContent.innerHTML = html;

                    console.log('✅ HTML loaded, waiting for render...');

                    // Đợi browser render xong HTML - tăng thời gian chờ
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                console.log(' Now loading script...');
                                // Load JavaScript tương ứng
                                const scriptName = pageName.replace('.html', '.js');
                                loadPageScript(scriptName);
                            }, 300);
                        });
                    });
                })
                .catch(error => {
                    console.error('Error loading page:', error);
                    mainContent.innerHTML = `
                        <div style="text-align: center; padding: 3rem; color: #d32f2f;">
                            <h2>Không tải được trang: ${pageName}</h2>
                            <p style="color: #666; margin-top: 1rem;">
                                Vui lòng kiểm tra đường dẫn file hoặc thử lại sau.
                            </p>
                            <p style="color: #999; font-size: 0.9rem; margin-top: 0.5rem;">
                                Error: ${error.message}
                            </p>
                        </div>
                    `;
                });
        }

        // ==================== LOAD SCRIPT FUNCTION ====================

        function loadPageScript(scriptName) {
            // Xóa script cũ nếu có
            const oldScript = document.querySelector(`script[data-page-script="${scriptName}"]`);
            if (oldScript) {
                oldScript.remove();
                console.log('Removed old script:', scriptName);
            }

            // Tạo script mới
            const script = document.createElement('script');
            script.src = `../../assets/js/SC-Admin/${scriptName}`;
            script.setAttribute('data-page-script', scriptName);

            script.onload = () => {
                console.log(' Script loaded:', scriptName);
            };

            script.onerror = () => {
                console.warn('Script not found:', scriptName);
            };

            document.body.appendChild(script);
        }

        // ==================== SIDEBAR NAVIGATION ====================

        sidebarLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                // Xóa active class khỏi tất cả links
                sidebarLinks.forEach(l => l.classList.remove('active'));

                // Thêm active class vào link được click
                this.classList.add('active');

                // Load trang tương ứng
                const pageName = this.getAttribute('data-page');
                if (pageName) {
                    loadPage(pageName);
                }
            });
        });

        // ==================== AUTO LOAD DASHBOARD ====================

        // Tự động load dashboard khi vào trang
        const firstLink = sidebarLinks[0];
        if (firstLink) {
            firstLink.classList.add('active');
            loadPage('dashboard.html');
        }

        console.log(' Home SC-Admin loaded');
    });

})();
