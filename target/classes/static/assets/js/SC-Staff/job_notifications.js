(function () {
    const STORAGE_KEY = 'evm_notifications_v1';

    function loadNotifications() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }

    function saveNotifications(arr) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) { }
    }

    function renderNotifications(list) {
        const arr = loadNotifications();
        if (!list) return;
        if (!arr || arr.length === 0) {
            list.innerHTML = '<li class="notification-item"><div class="notification__title">Chưa có thông báo</div></li>';
            return;
        }
        list.innerHTML = arr.map(n => {
            const unreadClass = n.unread ? ' notification--unread' : '';
            return `<li class="notification-item${unreadClass}" data-id="${n.id}"><div class="notification__title">${n.title}</div><div class="notification__meta">${n.meta}</div></li>`;
        }).join('');
    }

    window.addNotification = function (notification) {
        const arr = loadNotifications();
        const n = Object.assign({ id: Date.now(), title: '', meta: '', body: '', unread: true }, notification);
        arr.unshift(n);
        saveNotifications(arr);
        const list = document.getElementById('notificationsList');
        if (list) renderNotifications(list);
        return n.id;
    };

    function detectCurrentUserName() {
        const selectors = ['#userName', '.user-name', '.profile-name', '.sidebar .name', '.account-name'];
        for (let sel of selectors) {
            try {
                const el = document.querySelector(sel);
                if (el && el.textContent.trim()) return el.textContent.trim();
            } catch (e) { }
        }
        return null;
    }

    function initNotifications() {
        const list = document.getElementById('notificationsList');
        const modal = document.getElementById('modalNotification');
        const closeBtn = modal ? modal.querySelector('.notification__close-button') : null;
        const closeBtn2 = document.getElementById('notifCloseBtn');
        const markReadBtn = document.getElementById('notifMarkRead');
        const markAllBtn = document.getElementById('btnMarkAllRead');
        const deleteReadBtn = document.getElementById('btnDeleteRead');
        const createBtn = document.getElementById('btnCreateNotification');
        const createModal = document.getElementById('modalCreateNotification');
        const createForm = createModal ? createModal.querySelector('.notification-create__form') : null;
        const createCancel = document.getElementById('createNotifCancel');

        function openNotification(item) {
            if (!modal) return;
            const title = item.querySelector('.notification__title')?.innerText || '';
            const meta = item.querySelector('.notification__meta')?.innerText || '';
            const body = 'Đây là nội dung chi tiết của thông báo (demo), id=' + item.dataset.id;
            document.getElementById('notifTitle').innerText = title;
            document.getElementById('notifMeta').innerText = meta;
            document.getElementById('notifBody').innerText = body;
            modal.style.display = 'block';

            const arr = loadNotifications();
            const id = Number(item.dataset.id);
            arr.forEach(n => { if (n.id === id) n.unread = false; });
            saveNotifications(arr);
            if (list) renderNotifications(list);
        }

        if (list) {
            renderNotifications(list);

            list.addEventListener('click', function (e) {
                let li = e.target;
                while (li && li !== list && !li.classList.contains('notification-item')) li = li.parentNode;
                if (li && li.classList && li.classList.contains('notification-item')) {
                    openNotification(li);
                }
            });
        }

        if (closeBtn) closeBtn.addEventListener('click', function () { modal.style.display = 'none'; });
        if (closeBtn2) closeBtn2.addEventListener('click', function () { modal.style.display = 'none'; });
        if (markReadBtn) markReadBtn.addEventListener('click', function () {
            const title = document.getElementById('notifTitle').innerText;
            const arr = loadNotifications(); arr.forEach(n => { if (n.title === title) n.unread = false; }); saveNotifications(arr); if (list) renderNotifications(list);
        });
        if (markAllBtn) markAllBtn.addEventListener('click', function () { const arr = loadNotifications(); arr.forEach(n => n.unread = false); saveNotifications(arr); if (list) renderNotifications(list); });
        if (deleteReadBtn) deleteReadBtn.addEventListener('click', function () { let arr = loadNotifications(); arr = arr.filter(n => n.unread); saveNotifications(arr); if (list) renderNotifications(list); });
        if (createBtn) createBtn.addEventListener('click', function () {
            if (createModal) createModal.style.display = 'block';
            if (createForm) createForm.reset();
            const first = document.getElementById('create_notif_title'); if (first) first.focus();
        });

        const createModalCloseBtn = createModal ? createModal.querySelector('.notification__close-button') : null;
        if (createModalCloseBtn) {
            createModalCloseBtn.addEventListener('click', function() {
                if (createModal) createModal.style.display = 'none';
            });
        }

        if (createForm) {
            createForm.addEventListener('submit', function (ev) {
                ev.preventDefault();
                try {
                    const titleEl = document.getElementById('create_notif_title');
                    const bodyEl = document.getElementById('create_notif_body');
                    const title = titleEl ? titleEl.value.trim() : '';
                    const body = bodyEl ? bodyEl.value.trim() : '';
                    if (!title) return;
                    const creator = detectCurrentUserName() || 'Bạn';
                    const meta = `${creator} • ${new Date().toLocaleString()}`;
                    if (window.addNotification) {
                        window.addNotification({ title: title, meta: meta, body: body, unread: true, creator: creator });
                    }
                    if (list) renderNotifications(list);
                    if (createModal) createModal.style.display = 'none';
                } catch (e) { console.warn('Error creating notification', e); }
            });
        }

        if (createCancel) createCancel.addEventListener('click', function () { if (createModal) createModal.style.display = 'none'; });
        window.addEventListener('click', function (e) { if (modal && modal.style.display === 'block' && e.target == modal) modal.style.display = 'none'; });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initNotifications); else initNotifications();
})();
