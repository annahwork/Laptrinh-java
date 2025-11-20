(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const mainContent = document.getElementById('main-content');
        const sidebar = document.getElementById('sidebar');
        const sidebarLinks = document.querySelectorAll('.sidebar__link'); 

        if (!mainContent) {
            console.error('Main content not found');
            return;
        }

        function cleanPath(path) {
            return path.replace(/([^:])\/\/+/g, '$1/');
        }

        function getContextPath() {
            return (window.contextPath || '/evm').replace(/\/$/, '');
        }

        function loadPageScript(scriptName) {
            const finalScriptName = scriptName.endsWith('.js') ? scriptName : `${scriptName}.js`;
            const oldScript = document.querySelector(`script[data-page-script="${finalScriptName}"]`);
            if (oldScript) oldScript.remove();

            const contextPath = getContextPath();
            const scriptPath = cleanPath(`${contextPath}/assets/js/SC-Staff/${finalScriptName}`);
            const script = document.createElement('script');
            script.src = scriptPath;
            script.setAttribute('data-page-script', finalScriptName);

            script.onload = () => console.log('Script loaded:', finalScriptName);
            script.onerror = () => console.warn('Script not found:', finalScriptName);

            document.body.appendChild(script);
        }

        function loadPage(pageName) {
            const pageMap = {
                'account.html': '/scstaff/account',
                'campaign_management.html': '/scstaff/campaign_management',
                'customer_record_management.html': '/scstaff/customer_record_management',
                'dashboard.html': '/scstaff/dashboard',
                'job_notifications.html': '/scstaff/job_notifications',
                'technician_assignment.html': '/scstaff/technician_assignment',
                'privacy_policy.html': '/scstaff/privacy_policy',
                'terms_of_service.html': '/scstaff/terms_of_service',
                'vehicle_record_management.html': '/scstaff/vehicle_record_management',
                'warranty_claim_management.html': '/scstaff/warranty_claim_management',
                'account_scstaff.html': '/account_scstaff',
            };

            const endpoint = pageMap[pageName];
            if (!endpoint) {
                console.error('No endpoint mapped for page:', pageName);
                return;
            }

            const contextPath = getContextPath();

            function ensurePageCss(cssPath) {
                if (!document.querySelector(`link[href="${cssPath}"]`)) {
                    const l = document.createElement('link');
                    l.rel = 'stylesheet';
                    l.href = cssPath;
                    document.head.appendChild(l);
                    console.log('Injected page CSS:', cssPath);
                }
            }

            const cssFile = pageName.replace('.html', '.css');
            ensurePageCss(`${contextPath}/assets/css/SC-Staff/${cssFile}`);

            const urlToFetch = cleanPath(contextPath + endpoint);

            console.log('Loading SC-Staff page:', urlToFetch);

            fetch(urlToFetch)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.text();
                })
                .then(html => {
                    mainContent.innerHTML = html;

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

        console.log('Home SC-Staff initialized');
    });

})();
