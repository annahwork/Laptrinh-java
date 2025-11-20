document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    const sidebarLinks = document.querySelectorAll(".sidebar__link[data-page]");

    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const page = link.getAttribute("data-page");

            // Highlight menu
            document.querySelectorAll(".sidebar__item").forEach(item => {
                item.classList.remove("sidebar__item--active");
            });
            link.parentElement.classList.add("sidebar__item--active");

            // Load trang con
            fetch(page)
                .then(res => {
                    if (!res.ok) throw new Error(`Không thể tải ${page}`);
                    return res.text();
                })
                .then(html => {
                    mainContent.innerHTML = html;
                })
                .catch(err => {
                    console.error(err);
                    mainContent.innerHTML = `<p style="color:red;">Không tải được trang: ${page}</p>`;
                });
        });
    });
});
