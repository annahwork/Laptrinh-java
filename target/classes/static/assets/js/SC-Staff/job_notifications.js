(function () {
    "use strict";
    const userId = window.currentUserId || 2; 
    let cachedNotifications = [];

    const notifListDOM = document.getElementById("notificationsList");
    const createBtn = document.getElementById("btnCreateNotification");
    const createForm = document.querySelector(".notification-create__form");
    const editForm = document.querySelector(".notification-edit__form");
    const searchInput = document.getElementById("searchNotifications");

    async function fetchAllNotifications(userId) {
        try {
            const res = await fetch(`/evm/api/notifications/user?userID=${userId}`);
            if (!res.ok) throw new Error(await res.text());
            return await res.json();
        } catch (e) {
            alert("Không lấy được danh sách thông báo: " + e);
            return [];
        }
    }

    async function createNotification(userId, title, message) {
        try {
            const params = new URLSearchParams({ userID: userId, title, message });
            const res = await fetch("/evm/api/notifications/create", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params
            });
            if (!res.ok) throw new Error(await res.text());
            return await res.text();
        } catch (e) {
            alert("Không tạo được thông báo: " + e);
        }
    }

    async function updateNotification(notificationId, title, message) {
        try {
            const params = new URLSearchParams({ title, message });
            const res = await fetch(`/evm/api/notifications/${notificationId}/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params
            });
            if (!res.ok) throw new Error(await res.text());
            return await res.text();
        } catch (e) {
            alert("Không cập nhật được thông báo: " + e);
        }
    }

    async function deleteNotification(notificationId) {
        try {
            const res = await fetch(`/evm/api/notifications/${notificationId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error(await res.text());
            return await res.text();
        } catch (e) {
            alert("Không xóa được thông báo: " + e);
        }
    }

    async function markNotificationAsRead(notificationId) {
        try {
            const res = await fetch(`/evm/api/notifications/${notificationId}/read`, {
                method: "PUT"
            });
            if (!res.ok) throw new Error(await res.text());
            return await res.text();
        } catch (e) {
            alert("Không đánh dấu đã đọc: " + e);
        }
    }

    async function fetchNotificationById(notificationId) {
        try {
            const res = await fetch(`/evm/api/notifications/${notificationId}`);
            if (!res.ok) throw new Error(await res.text());
            return await res.json();
        } catch (e) {
            alert("Không lấy được chi tiết thông báo: " + e);
        }
    }

    async function renderNotifications(listElem, notifications) {
        if (!Array.isArray(notifications) || notifications.length === 0) {
            listElem.innerHTML = '<li class="notification-item">Chưa có thông báo nào.</li>';
            return;
        }
        listElem.innerHTML = notifications.map(n => `
            <li class="notification-item${!n.isRead ? ' notification--unread' : ''}" data-id="${n.notificationID}">
                <div class="notification__title">${n.title}</div>
                <div class="notification__meta">${n.message}</div>
                <div class="notification__actions">
                    <button class="btn-markread" data-id="${n.notificationID}">Đã đọc</button>
                </div>
            </li>
        `).join('');
    }

    async function refreshNotifications() {
        let notis = await fetchAllNotifications(userId);
        cachedNotifications = notis;
        if (notifListDOM) await renderNotifications(notifListDOM, notis);
    }

    if (createForm && createBtn) {
        createBtn.addEventListener("click", () => {
            document.getElementById("modalCreateNotification").style.display = "block";
        });
        createForm.addEventListener("submit", async function (ev) {
            ev.preventDefault();
            const title = document.getElementById("create_notif_title").value || "";
            const message = document.getElementById("create_notif_body").value || "";
            if (!title) { alert("Nhập tiêu đề!"); return; }
            await createNotification(userId, title, message);
            await refreshNotifications();
            document.getElementById("modalCreateNotification").style.display = "none";
            createForm.reset();
        });
        document.getElementById("createNotifCancel")?.addEventListener("click", function () {
            document.getElementById("modalCreateNotification").style.display = "none";
        });
    }

    if (editForm) {
        editForm.addEventListener("submit", async function (ev) {
            ev.preventDefault();
            const id = document.getElementById("edit_notif_id").value;
            const title = document.getElementById("edit_notif_title").value;
            const body = document.getElementById("edit_notif_body").value;
            if (!title) { alert("Nhập tiêu đề!"); return; }
            await updateNotification(id, title, body);
            await refreshNotifications();
            document.getElementById("modalEditNotification").style.display = "none";
            editForm.reset();
        });
        document.getElementById("editNotifCancel")?.addEventListener("click", function () {
            document.getElementById("modalEditNotification").style.display = "none";
        });
    }

    if (notifListDOM) {
        notifListDOM.addEventListener("click", async function (e) {
            let target = e.target;
            const id = target.dataset.id;

            if (target.classList.contains("btn-delete")) {
                if (confirm("Bạn chắc chắn muốn xóa thông báo này?")) {
                    await deleteNotification(id);
                    await refreshNotifications();
                }
                return;
            }
            if (target.classList.contains("btn-edit")) {
                let notif = cachedNotifications.find(n => n.notificationID == id) || await fetchNotificationById(id);
                if (notif) {
                    document.getElementById("edit_notif_id").value = notif.notificationID;
                    document.getElementById("edit_notif_title").value = notif.title;
                    document.getElementById("edit_notif_body").value = notif.message;
                    document.getElementById("modalEditNotification").style.display = "block";
                }
                return;
            }
            if (target.classList.contains("btn-markread")) {
                await markNotificationAsRead(id);
                await refreshNotifications();
                return;
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const value = this.value.trim().toLowerCase();
            const filtered = cachedNotifications.filter(n =>
                (n.title && n.title.toLowerCase().includes(value)) ||
                (n.message && n.message.toLowerCase().includes(value))
            );
            renderNotifications(notifListDOM, filtered);
        });
    }

    document.querySelectorAll(".notification__close-button").forEach(btn => {
        btn.addEventListener("click", function () {
            btn.closest(".notification-modal")?.style?.setProperty("display", "none");
        });
    });

    refreshNotifications();

})();