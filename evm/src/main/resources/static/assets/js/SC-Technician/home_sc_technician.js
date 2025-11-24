(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const mainContent = document.getElementById('main-content');
        const sidebar = document.getElementById('sidebar');
        // Thêm dòng này để lấy cái lớp phủ đen
        const overlay = document.getElementById('sidebar-overlay'); 
        const sidebarLinks = document.querySelectorAll('.sidebar__link');

        if (!mainContent) {
            console.error('Main content not found');
            return;
        }

        // --- HÀM HỖ TRỢ ĐÓNG MENU MOBILE (THÊM MỚI) ---
        function closeMobileMenu() {
            // Kiểm tra nếu đang ở màn hình nhỏ (dưới 768px)
            if (window.innerWidth <= 768) {
                // Xóa class hiển thị để menu trượt vào trong
                if (sidebar) sidebar.classList.remove('show-sidebar');
                if (overlay) overlay.classList.remove('show-overlay');
            }
        }
        // ----------------------------------------------

        function cleanPath(path) {
            return path.replace(/([^:])\/\/+/g, '$1/');
        }

        function loadPageScript(scriptName) {
            const finalScriptName = scriptName.endsWith('.js') ? scriptName : `${scriptName}.js`;
            const oldScript = document.querySelector(`script[data-page-script="${finalScriptName}"]`);
            if (oldScript) oldScript.remove();

            const contextPath = window.contextPath || '/evm/';
            const scriptPath = cleanPath(`${contextPath}assets/js/SC-Technician/${finalScriptName}`);

            const script = document.createElement('script');
            script.src = scriptPath;
            script.setAttribute('data-page-script', finalScriptName);

            script.onload = () => console.log('Script loaded:', finalScriptName);
            script.onerror = () => console.warn('Script not found:', finalScriptName);

            document.body.appendChild(script);
        }

        function loadPage(pageName) {
            const pageMap = {
                'dashboard.html': '/dashboardSCTech',
                'job_list.html': '/job_list',
                'campaign_list.html': '/campaign_list',
                'campaign_report.html': '/campaign_report',
                'campaign_vehicle.html': '/campaign_vehicle',
                'notification.html': '/notification',
                'performance.html': '/performance',
                'spare_part.html': '/spare_part',
                'technical_documents.html': '/technical_documents',
                'warranty_result.html': '/warranty_result',
                'work_schedule.html': '/work_schedule',
                'account_sctechnician.html': '/account_sctechnician',
            };

            const endpoint = pageMap[pageName];
            if (!endpoint) {
                console.error('No endpoint mapped for page:', pageName);
                return;
            }

            const contextPath = window.contextPath || '/evm/';
            const urlToFetch = cleanPath(contextPath + endpoint);

            console.log('🔹 Loading SCTechnician page:', urlToFetch);

            fetch(urlToFetch)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.text();
                })
                .then(html => {
                    mainContent.innerHTML = cleanPath(html);

                    console.log('HTML loaded, preparing script...');
                    const scriptFileName = pageName.replace('.html', '');
                    setTimeout(() => loadPageScript(scriptFileName), 300);
                })
                .catch(err => {
                    console.error('Error loading page:', err);
                    mainContent.innerHTML = `
                        <div style="text-align: center; padding: 3rem; color: #d32f2f;">
                            <h2>Không tải được trang: ${pageName}</h2>
                            <p>Vui lòng kiểm tra đường dẫn hoặc thử lại sau.</p>
                            <p style="font-size:0.9rem;color:#999">Error: ${err.message}</p>
                        </div>`;
                });
        }

        sidebarLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                // --- GỌI HÀM ĐÓNG MENU Ở ĐÂY ---
                closeMobileMenu(); 
                // -------------------------------

                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                const pageName = this.getAttribute('data-page');
                if (pageName) loadPage(pageName);
            });
        });

        function bindMenuToggle() {
            const toggles = document.querySelectorAll('.menu-group-toggle');
            toggles.forEach(toggle => {
                toggle.addEventListener('click', function () {
                    const li = this.closest('.menu-group');
                    if (!li) return;

                    li.classList.toggle('open');
                });
            });
        }

        bindMenuToggle();

        const firstLink = sidebarLinks[0];
        if (firstLink) {
            firstLink.classList.add('active');
            const firstPage = firstLink.getAttribute('data-page') || 'dashboard.html';
            loadPage(firstPage);
        }

        console.log('Home SCTechnician initialized');
    });
})();