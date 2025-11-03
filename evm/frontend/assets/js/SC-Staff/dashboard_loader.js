// Dashboard Loader - Auto load dashboard when page is empty
(function () {
    function loadDefaultDashboard() {
        const mainContent = document.getElementById('main-content');

        // Debug log
        console.log('Dashboard Loader: Checking main-content...', {
            exists: !!mainContent,
            isEmpty: mainContent ? mainContent.innerHTML.trim() === '' : false,
            content: mainContent ? mainContent.innerHTML : 'null'
        });

        // Chỉ load dashboard nếu main-content trống hoặc chỉ có khoảng trắng
        if (mainContent && mainContent.innerHTML.trim() === '') {
            console.log('Dashboard Loader: Loading dashboard.html...');

            fetch('Section/dashboard.html')
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Cannot load dashboard: ${res.status} ${res.statusText}`);
                    }
                    return res.text();
                })
                .then(html => {
                    console.log('Dashboard Loader: Dashboard loaded successfully');

                    // Parse HTML để tách CSS
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    // Load CSS files nếu có
                    const linkTags = doc.querySelectorAll('link[rel="stylesheet"]');
                    linkTags.forEach(link => {
                        const href = link.getAttribute('href');
                        const existingLink = document.querySelector(`link[href="${href}"]`);
                        if (!existingLink) {
                            const newLink = document.createElement('link');
                            newLink.rel = 'stylesheet';
                            newLink.href = href;
                            document.head.appendChild(newLink);
                            console.log('Dashboard Loader: CSS loaded -', href);
                        }
                    });

                    // Load nội dung
                    mainContent.innerHTML = html;
                })
                .catch(err => {
                    console.error('Dashboard load error:', err);
                    mainContent.innerHTML = '<p style="text-align:center; color:#666; padding:2rem;"> Không thể tải dashboard. Vui lòng thử lại.</p>';
                });
        } else {
            console.log('Dashboard Loader: Skipped (main-content not empty)');
        }
    }

    // Chạy khi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadDefaultDashboard);
    } else {
        loadDefaultDashboard();
    }
})();
