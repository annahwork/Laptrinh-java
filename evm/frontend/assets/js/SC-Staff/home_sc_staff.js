// Home SC Staff - Load pages from footer links

document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");

    // Xử lý click vào link trong footer
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('footer-page-link')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');

            // Bỏ active class khỏi sidebar links
            const sidebarLinks = document.querySelectorAll(".sidebar__link[data-page]");
            sidebarLinks.forEach(l => l.classList.remove("active"));

            // Hiển thị loading
            mainContent.innerHTML = `<p style="color: gray; text-align: center; padding: 2rem;">⏳ Đang tải ${page}...</p>`;

            try {
                // Load nội dung trang
                const res = await fetch(`Section/${page}`);
                if (!res.ok) throw new Error(`Không thể tải ${page}`);
                const html = await res.text();

                // Parse HTML để tách CSS và nội dung
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Load CSS files
                const linkTags = doc.querySelectorAll('link[rel="stylesheet"]');
                linkTags.forEach(link => {
                    const href = link.getAttribute('href');
                    const existingLink = document.querySelector(`link[href="${href}"]`);
                    if (!existingLink) {
                        const newLink = document.createElement('link');
                        newLink.rel = 'stylesheet';
                        newLink.href = href;
                        document.head.appendChild(newLink);
                    }
                });

                // Load nội dung vào main-content
                mainContent.innerHTML = html;

                // Execute scripts trong trang vừa load
                const scripts = mainContent.querySelectorAll("script");
                scripts.forEach(oldScript => {
                    const newScript = document.createElement("script");
                    if (oldScript.src) {
                        newScript.src = oldScript.src;
                    } else {
                        newScript.textContent = oldScript.textContent;
                    }
                    document.body.appendChild(newScript);
                });

            } catch (err) {
                console.error('Error loading page:', err);
                mainContent.innerHTML = `<p style="color:red; text-align: center; padding: 2rem;">❌ Không tải được trang: ${page}</p>`;
            }
        }
    });
});
