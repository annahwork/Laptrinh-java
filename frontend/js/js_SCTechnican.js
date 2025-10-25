    // jsSCTechnican.js
    // ------------------------------
    // Script dành riêng cho giao diện SC Technician
    // ------------------------------

    document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ jsSCTechnican.js đã được load!");

    const mainContent = document.getElementById("main-content");
    const sidebarLinks = document.querySelectorAll(".sidebar__link[data-page]");

    // ----------------------------
    // Load footer template
    // ----------------------------
    fetch("../../partials/footer.html")
        .then(res => {
        if (!res.ok) throw new Error("Không tải được footer");
        return res.text();
        })
        .then(html => {
        document.getElementById("footer-placeholder").innerHTML = html;
        })
        .catch(err => console.error("⚠️ Lỗi load footer:", err));

    // ----------------------------
    // Xử lý click sidebar để load trang con
    // ----------------------------
    sidebarLinks.forEach(link => {
        link.addEventListener("click", e => {
        e.preventDefault();
        const page = link.getAttribute("data-page");

        // Xóa active cũ, set active mới
        document.querySelectorAll(".sidebar__item").forEach(item => {
            item.classList.remove("sidebar__item--active");
        });
        link.parentElement.classList.add("sidebar__item--active");

        // Hiển thị trạng thái loading
        mainContent.innerHTML = `
            <div style="text-align:center; margin-top:150px; font-size:1.1rem;">
            ⏳ Đang tải <b>${page}</b>...
            </div>`;

        // ----------------------------
        // Load file HTML tương ứng
        // ----------------------------
        fetch(page)
            .then(res => {
            if (!res.ok) throw new Error(`Không thể tải trang: ${page}`);
            return res.text();
            })
            .then(html => {
            // Fade-in effect
            mainContent.style.opacity = 0;
            mainContent.innerHTML = html;
            mainContent.style.transition = "opacity 0.4s ease";
            setTimeout(() => (mainContent.style.opacity = 1), 50);
            console.log(`✅ Trang ${page} đã được load thành công.`);
            })
            .catch(err => {
            console.error("❌ Lỗi:", err);
            mainContent.innerHTML = `
                <p style="color:red; text-align:center; margin-top:150px;">
                ⚠️ Không tải được trang: ${page}<br>${err.message}
                </p>`;
            });
        });
    });
    });
