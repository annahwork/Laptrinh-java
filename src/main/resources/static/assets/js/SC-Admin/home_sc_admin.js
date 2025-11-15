(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const mainContent = document.getElementById('main-content');
        const sidebarLinks = document.querySelectorAll('.sidebar__link');

        if (!mainContent) {
            console.error('Main content not found');
            return;
        }

        function cleanPath(path) {
            return path.replace(/([^:])\/\/+/g, '$1/');
        }

        function loadPageScript(scriptName) {
            const finalScriptName = scriptName.endsWith('.js') ? scriptName : `${scriptName}.js`; 
            const oldScript = document.querySelector(`script[data-page-script="${finalScriptName}"]`);
            if (oldScript) {
                oldScript.remove();
                console.log('Removed old script:', finalScriptName);
            }
            const contextPath = window.contextPath || '/evm/'; 
            const scriptRelativePath = `assets/js/SC-Admin/${finalScriptName}`; 

            const scriptPath = cleanPath(contextPath + scriptRelativePath); 
            console.log('Attempting to load script from (Final path):', scriptPath);

            const script = document.createElement('script');
            script.src = scriptPath;
            script.setAttribute('data-page-script', finalScriptName);

            script.onload = () => {
                console.log(' Script loaded:', finalScriptName);
            };

            script.onerror = () => {
                console.warn('Script not found:', finalScriptName);
            };

            document.body.appendChild(script);
        }
        

        function loadPage(pageName) {

            const endpointName = pageName.replace('.html', ''); 
            const contextPath = window.contextPath || '/evm/';
            const urlToFetch = cleanPath(contextPath + endpointName);

            console.log('Loading page:', urlToFetch);
            
            fetch(urlToFetch)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    const cleanedHtml = cleanPath(html);
                    mainContent.innerHTML = cleanedHtml;

                    console.log('HTML loaded, waiting for render...');

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                console.log(' Now loading script...');
                                const scriptFileName = pageName.replace('.html', '');
                                loadPageScript(scriptFileName);
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


        sidebarLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                sidebarLinks.forEach(l => l.classList.remove('active'));

                this.classList.add('active');

                const pageName = this.getAttribute('data-page');
                if (pageName) {
                    loadPage(pageName);
                }
            });
        });


        const firstLink = sidebarLinks[0];
        if (firstLink) {
            firstLink.classList.add('active');
            loadPage('dashboard.html');
        }

        console.log(' Home SC-Admin loaded');
    });

})();