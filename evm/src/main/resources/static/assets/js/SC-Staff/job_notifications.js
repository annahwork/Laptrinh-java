(function () {
    'use strict';

    console.log('[SC-Staff] job_notifications.js loaded');

    // ====== CONFIG ======
    const API_BASE = '/evm/api/sc-staff/notifications';
    const CURRENT_SC_STAFF_ID = 2; // TODO: nếu cần thì lấy userID từ server render xuống

    const PAGE_SIZE = 5;

    // ====== DOM ======
    const searchInput = document.getElementById('searchNotifications');
    const listEl = document.getElementById('notificationsList');

    const infoEl = document.getElementById('notificationsPaginationInfo');
    const prevBtn = document.getElementById('notificationsPrevBtn');
    const nextBtn = document.getElementById('notificationsNextBtn');
    const pageNumberEl = document.getElementById('notificationsPageNumber');

    // ====== STATE ======
    let notificationsCache = [];
    let filteredList = [];
    let currentPage = 1;

    // ====== UTIL ======
    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"'`=\/]/g, function (c) {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
            })[c];
        });
    }

    function formatDateVi(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return String(dateStr);
        return d.toLocaleString('vi-VN');
    }

    // ====== API ======
    async function fetchNotifications() {
        // dùng endpoint: GET /api/sc-staff/notifications/user?userID=...
        const url = `${API_BASE}/user?userID=${encodeURIComponent(CURRENT_SC_STAFF_ID)}`;
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) {
            throw new Error('Lỗi tải dữ liệu: HTTP ' + res.status);
        }
        return await res.json();
    }

    async function markNotificationRead(id) {
        const url = `${API_BASE}/${id}/read`;
        const res = await fetch(url, {
            method: 'PUT',
            credentials: 'include'
        });
        const text = await res.text().catch(() => '');
        if (!res.ok) {
            throw new Error(text || 'Đánh dấu đã đọc thất bại');
        }
        return text || 'Đã đánh dấu đã đọc';
    }

    // ====== RENDER ======
    function renderPage() {
        if (!listEl) return;

        listEl.innerHTML = '';

        if (!filteredList.length) {
            listEl.innerHTML = `
                <li class="notification-item notification-empty">
                    Không có thông báo nào.
                </li>
            `;
            if (infoEl) infoEl.textContent = 'Hiển thị 0 của 0';
            if (pageNumberEl) pageNumberEl.textContent = '1';
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            return;
        }

        const total = filteredList.length;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = Math.min(startIndex + PAGE_SIZE, total);
        const pageItems = filteredList.slice(startIndex, endIndex);

        const html = pageItems.map(n => {
            const id = n.notificationID || n.id;
            const title = n.title || 'Thông báo';
            const message = n.message || n.content || '';
            const date = n.date || n.createdAt || n.createdDate;
            const isRead = !!(n.read || n.isRead || n.readFlag);

            return `
                <li class="notification-item ${isRead ? 'notification-item--read' : 'notification-item--unread'}" data-id="${id}">
                    <div class="notification-main">
                        <div class="notification-title">${escapeHtml(title)}</div>
                        <div class="notification-message">${escapeHtml(message)}</div>
                        <div class="notification-meta">
                            <span class="notification-date">${escapeHtml(formatDateVi(date))}</span>
                            ${isRead ? '<span class="notification-status-badge">Đã đọc</span>' : ''}
                        </div>
                    </div>
                    <div class="notification-actions">
                        ${!isRead ? `<button class="btn-mark-read" data-id="${id}">Đã đọc</button>` : ''}
                    </div>
                </li>
            `;
        }).join('');

        listEl.innerHTML = html;

        if (infoEl) {
            infoEl.textContent = `Hiển thị ${startIndex + 1}-${endIndex} của ${total}`;
        }
        if (pageNumberEl) pageNumberEl.textContent = String(currentPage);

        if (prevBtn) prevBtn.disabled = currentPage <= 1;
        if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    }

    function applyFilterAndRender() {
        const kw = (searchInput?.value || '').trim().toLowerCase();

        let data = [...notificationsCache];

        if (kw) {
            data = data.filter(n => {
                const title = (n.title || '').toLowerCase();
                const msg = (n.message || n.content || '').toLowerCase();
                const idStr = String(n.notificationID || n.id || '').toLowerCase();
                return title.includes(kw) || msg.includes(kw) || idStr.includes(kw);
            });
        }

        filteredList = data;
        currentPage = 1;
        renderPage();
    }

    // ====== EVENT ======
    function initEvents() {
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                applyFilterAndRender();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                if (currentPage > 1) {
                    currentPage--;
                    renderPage();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                const total = filteredList.length;
                const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
                if (currentPage < totalPages) {
                    currentPage++;
                    renderPage();
                }
            });
        }

        if (listEl) {
            listEl.addEventListener('click', async function (e) {
                const btn = e.target.closest('.btn-mark-read');
                if (!btn) return;

                const id = btn.dataset.id;
                if (!id) return;

                try {
                    const msg = await markNotificationRead(id);
                    console.log('[Notification] mark as read OK:', msg);

                    // update cache
                    notificationsCache = notificationsCache.map(n => {
                        const nid = n.notificationID || n.id;
                        if (String(nid) === String(id)) {
                            return {
                                ...n,
                                read: true,
                                isRead: true,
                                readFlag: true
                            };
                        }
                        return n;
                    });

                    applyFilterAndRender();
                } catch (err) {
                    console.error('[Notification] mark as read error:', err);
                    alert(err.message || 'Không thể đánh dấu đã đọc.');
                }
            });
        }
    }

    // ====== INIT ======
    async function init() {
        if (!listEl) {
            console.warn('[SC-Staff] notificationsList not found');
            return;
        }

        try {
            listEl.innerHTML = `
                <li class="notification-item notification-loading">
                    Đang tải thông báo...
                </li>
            `;
            const data = await fetchNotifications();
            notificationsCache = Array.isArray(data) ? data : [];
            applyFilterAndRender();
        } catch (err) {
            console.error('[Notification] load error:', err);
            if (listEl) {
                listEl.innerHTML = `
                    <li class="notification-item notification-error">
                        Lỗi tải dữ liệu: ${escapeHtml(err.message || 'Không xác định')}
                    </li>
                `;
            }
            if (infoEl) infoEl.textContent = 'Hiển thị 0 của 0';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initEvents();
            init();
        });
    } else {
        initEvents();
        init();
    }

})();
