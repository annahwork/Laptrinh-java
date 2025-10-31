    document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    const sidebarLinks = document.querySelectorAll(".sidebar__link[data-page]");
    const menuGroups = document.querySelectorAll(".menu-group-toggle");


    menuGroups.forEach(toggle => {
    toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const parent = toggle.closest(".menu-group");
    parent.classList.toggle("open");
    });
});


    sidebarLinks.forEach(link => {
        link.addEventListener("click", async (e) => {
        e.preventDefault();
        const page = link.getAttribute("data-page");

        sidebarLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        mainContent.innerHTML = `<p style="color: gray;">⏳ Đang tải ${page}...</p>`;

        try {
            const res = await fetch(`section/${page}`);
            if (!res.ok) throw new Error(`Không thể tải ${page}`);
            const html = await res.text();


            mainContent.innerHTML = html;

            const scripts = mainContent.querySelectorAll("script");
            scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            if (oldScript.src) newScript.src = oldScript.src;
            else newScript.textContent = oldScript.textContent;
            document.body.appendChild(newScript);
            });


        } catch (err) {
            console.error(err);
            mainContent.innerHTML = `<p style="color:red;">❌ Không tải được trang: ${page}</p>`;
        }
        });
    });
    });
