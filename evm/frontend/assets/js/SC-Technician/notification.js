(function () {
  function initNotifications() {
    const filterSelect = document.getElementById("filterSelect");
    const markAllBtn = document.getElementById("btnMarkAllRead");
    const container = document.getElementById("notificationContainer");

    // Đánh dấu đã đọc toàn bộ
    if (markAllBtn) {
      markAllBtn.addEventListener("click", () => {
        container.querySelectorAll(".notification-card").forEach(card => {
          card.classList.remove("unread");
          card.classList.add("read");
          const icon = card.querySelector(".notify-icon");
          if (icon) icon.textContent = "⚪";
        });
      });
    }

    // Bộ lọc thông báo
    if (filterSelect) {
      filterSelect.addEventListener("change", () => {
        const filter = filterSelect.value;
        container.querySelectorAll(".notification-card").forEach(card => {
          card.style.display =
            filter === "all" ||
            (filter === "unread" && card.classList.contains("unread")) ||
            (filter === "read" && card.classList.contains("read"))
              ? "flex"
              : "none";
        });
      });
    }

    // Gắn sự kiện cho từng nút
    container.querySelectorAll(".btnMarkRead").forEach(btn => {
      btn.addEventListener("click", e => {
        const card = e.target.closest(".notification-card");
        if (card) {
          card.classList.remove("unread");
          card.classList.add("read");
          const icon = card.querySelector(".notify-icon");
          if (icon) icon.textContent = "⚪";
        }
      });
    });

    container.querySelectorAll(".btnDelete").forEach(btn => {
      btn.addEventListener("click", e => {
        const card = e.target.closest(".notification-card");
        if (card) card.remove();
      });
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initNotifications);
  else initNotifications();
})();
