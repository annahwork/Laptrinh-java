(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const mainContent = document.getElementById('main-content');
        const sidebarLinks = document.querySelectorAll('.sidebar__link');

        if (!mainContent) {
            console.error('Lỗi: Không tìm thấy #main-content.');
            return;
        }

        /**
         * Dọn dẹp các dấu gạch chéo (slash) thừa trong đường dẫn.
         */
        function cleanPath(path) {
            return path.replace(/([^:])\/\/+/g, '$1/');
        }

        /**
         * Tải động file script JS cho trang vừa được load.
         */
        function loadPageScript(scriptName) {
            const finalScriptName = scriptName.endsWith('.js') ? scriptName : `${scriptName}.js`;
            
            // Xóa script cũ (nếu có) để tránh xung đột
            const oldScript = document.querySelector(`script[data-page-script="${finalScriptName}"]`);
            if (oldScript) {
                oldScript.remove();
                console.log('Đã xóa script cũ:', finalScriptName);
            }

            const contextPath = window.contextPath || '/evm/';
            // THAY ĐỔI: Đường dẫn script cho EVM-Staff
            const scriptPath = cleanPath(`${contextPath}assets/js/EVM-Staff/${finalScriptName}`);

            const script = document.createElement('script');
            script.src = scriptPath;
            script.setAttribute('data-page-script', finalScriptName);

            script.onload = () => console.log('Script đã tải:', finalScriptName);
            script.onerror = () => console.warn('Không tìm thấy script:', finalScriptName);

            document.body.appendChild(script);
        }

        /**
         * Tải nội dung HTML của một trang vào #main-content.
         */
        function loadPage(pageName) {
            // THAY ĐỔI: pageMap cho EVM-Staff
            const pageMap = {
                'dashboard.html': '/dashboardEVM',
                'allocate_parts.html': '/allocate_parts',
                'manage_ev_parts.html': '/manage_ev_parts',
                'attach_serial.html': '/attach_serial',
                'inventory.html': '/inventoryEVM', // Đổi tên để tránh trùng lặp
                'claim_requests.html': '/claim_requests',
                'claim_tracking.html': '/claim_tracking',
                'warranty_cost.html': '/warranty_cost',
                'campaigns.html': '/campaigns',
                'warranty_policy.html': '/warranty_policy',
                'statistics.html': '/statistics',
                'reports.html': '/reports',
                'settings.html': '/settings'
            };

            const endpoint = pageMap[pageName];
            if (!endpoint) {
                console.error('Không có endpoint nào được map cho trang:', pageName);
                return;
            }

            const contextPath = window.contextPath || '/evm/';
            const urlToFetch = cleanPath(contextPath + endpoint);

            console.log('🔹 Đang tải trang EVM-Staff:', urlToFetch);

            fetch(urlToFetch)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.text();
                })
                .then(html => {
                    mainContent.innerHTML = cleanPath(html);

                    console.log('HTML đã tải, đang chuẩn bị script...');
                    const scriptFileName = pageName.replace('.html', '');
                    setTimeout(() => loadPageScript(scriptFileName), 300);
                })
                .catch(err => {
                    console.error('Lỗi tải trang:', err);
                    mainContent.innerHTML = `
                        <div style="text-align: center; padding: 3rem; color: #d32f2f;">
                            <h2>Không tải được trang: ${pageName}</h2>
                            <p>Vui lòng kiểm tra đường dẫn hoặc thử lại sau.</p>
                            <p style="font-size:0.9rem;color:#999">Error: ${err.message}</p>
                        </div>`;
                });
        }

        // Gắn sự kiện cho các link tải trang
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                const pageName = this.getAttribute('data-page');
                if (pageName) loadPage(pageName);
            });
        });

        // Gắn sự kiện cho các menu xổ xuống
        function bindMenuToggle() {
            const toggles = document.querySelectorAll('.menu-group-toggle');
            toggles.forEach(toggle => { 
                toggle.addEventListener('click', function () {
                    const li = this.closest('.menu-group'); 
                    if (li) {
                        li.classList.toggle('open');
                    }
                });
            });
        }

        bindMenuToggle(); 

        // Tải trang mặc định khi vừa vào
        const firstLink = sidebarLinks[0];
        if (firstLink) {
            firstLink.classList.add('active');
            const firstPage = firstLink.getAttribute('data-page') || 'dashboard.html';
            loadPage(firstPage);
        }

        console.log('Khởi tạo home_evm_staff.js thành công');
    });
})();