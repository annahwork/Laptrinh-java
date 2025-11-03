(function () {
    function loadDefaultDashboard() {
        const mainContent = document.getElementById('main-content');

        console.log('Dashboard Loader: Checking main-content...', {
            exists: !!mainContent,
            isEmpty: mainContent ? mainContent.innerHTML.trim() === '' : false,
            content: mainContent ? mainContent.innerHTML : 'null'
        });

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

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

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

                    mainContent.innerHTML = html;
                })
                .catch(err => {
                    console.error('Dashboard load error:', err);
                    mainContent.innerHTML = '<p style="text-align:center; color:#666; padding:2rem;">Không thể tải dashboard. Vui lòng thử lại.</p>';
                });
        } else {
            console.log('Dashboard Loader: Skipped (main-content not empty)');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadDefaultDashboard);
    } else {
        loadDefaultDashboard();
    }
})();
