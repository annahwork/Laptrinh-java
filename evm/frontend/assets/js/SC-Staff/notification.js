// frontend/js/SC Staff/thongbao.js
// Renderer & realtime sync cho Trang ThongBao (SC Staff)
// - Đồng bộ với "Thông Báo Mới" ở TrangChu
// - Lắng nghe BroadcastChannel 'sc-notifs-channel' + fallback storage event
// - Hỗ trợ "Đánh dấu tất cả" (move to notifications_read) và "Xoá tất cả" (delete)

document.addEventListener('DOMContentLoaded', () => {
  const notifList = document.getElementById('notificationsList'); // main list on ThongBao.html
  const btnMarkAll = document.getElementById('btnMarkAll');
  const btnClearAll = document.getElementById('btnClearAll');
  const bcName = 'sc-notifs-channel';
  let bc = null;
  try { if ('BroadcastChannel' in window) bc = new BroadcastChannel(bcName); } catch (e) { bc = null; }

  function getNotifications() {
    return JSON.parse(localStorage.getItem('notifications')) || [];
  }

  function setNotifications(arr) {
    localStorage.setItem('notifications', JSON.stringify(arr));
  }

  function getReadNotifications() {
    return JSON.parse(localStorage.getItem('notifications_read')) || [];
  }
  function setReadNotifications(arr) {
    localStorage.setItem('notifications_read', JSON.stringify(arr));
  }

  function renderNotifications() {
    if (!notifList) return;
    const notifs = getNotifications();
    notifList.innerHTML = '';
    if (!notifs.length) {
      notifList.innerHTML = '<li class="list-group-item text-muted">Không có thông báo.</li>';
      return;
    }
    notifs.forEach((n, i) => {
      const li = document.createElement('li');
      li.className = 'notif-item list-group-item d-flex justify-content-between align-items-start';
      li.innerHTML = `
        <div>
          <div class="fw-semibold ${n.type ? `text-${n.type}` : ''}">${escapeHtml(n.title)}</div>
          <div class="notif-meta small-muted">${n.customer ? `${escapeHtml(n.customer)} — ` : ''}${escapeHtml(n.date)}</div>
          ${n.note ? `<div class="small mt-1">${escapeHtml(n.note)}</div>` : ''}
        </div>
        <div class="notif-actions d-flex gap-2">
          <button class="btn btn-sm btn-primary btn-view" data-index="${i}">Xem</button>
          <button class="btn btn-sm btn-outline-secondary btn-mark" data-index="${i}">Đánh dấu</button>
          <button class="btn btn-sm btn-outline-danger btn-del" data-index="${i}">Xoá</button>
        </div>
      `;
      notifList.appendChild(li);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
  }

  // Single mark (remove from current list -> move to read)
  function markNotification(index) {
    const notifs = getNotifications();
    if (index < 0 || index >= notifs.length) return;
    const item = notifs.splice(index, 1)[0];
    setNotifications(notifs);

    // append to read history
    const read = getReadNotifications();
    read.unshift({ ...item, readDate: new Date().toISOString().split('T')[0] });
    setReadNotifications(read);

    broadcastStaffNotif({ type: 'staff-notif-updated', payload: { action: 'marked', item } });
    renderNotifications();
  }

  // Single delete (permanent)
  function deleteNotification(index) {
    const notifs = getNotifications();
    if (index < 0 || index >= notifs.length) return;
    const removed = notifs.splice(index, 1)[0];
    setNotifications(notifs);
    broadcastStaffNotif({ type: 'staff-notif-updated', payload: { action: 'deleted', item: removed } });
    renderNotifications();
  }

  // Mark all: move all to notifications_read (keep history), clear notifications
  function markAllNotifications() {
    const notifs = getNotifications();
    if (!notifs.length) return;
    const read = getReadNotifications();
    const moved = notifs.map(n => ({ ...n, readDate: new Date().toISOString().split('T')[0] }));
    const newRead = moved.concat(read);
    setReadNotifications(newRead);
    setNotifications([]); // clear current list
    broadcastStaffNotif({ type: 'staff-notif-updated', payload: { action: 'marked_all', count: moved.length } });
    renderNotifications();
  }

  // Clear all: delete permanently (asks confirm)
  function clearAllNotifications() {
    const notifs = getNotifications();
    if (!notifs.length) return;
    if (!confirm('Xoá tất cả thông báo? Hành động này không thể hoàn tác.')) return;
    setNotifications([]);
    broadcastStaffNotif({ type: 'staff-notif-updated', payload: { action: 'cleared_all', count: notifs.length } });
    renderNotifications();
  }

  // View (open modal or alert)
  function viewNotification(index) {
    const notifs = getNotifications();
    const n = notifs[index];
    if (!n) return;
    const modalEl = document.getElementById('notifModal');
    const modalContent = document.getElementById('modalContent');
    if (modalEl && modalContent && typeof bootstrap !== 'undefined') {
      modalContent.textContent = `${n.title} — ${n.customer ? n.customer + ' — ' : ''}${n.date}\n\n${n.note || ''}`;
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      modalEl.dataset.lastIndex = index;
    } else {
      alert(`${n.title}\n\n${n.note || ''}`);
    }
  }

  // Broadcast helper (staff notifications)
  function broadcastStaffNotif(message) {
    if (bc) {
      try { bc.postMessage(message); } catch (e) { /* ignore */ }
    } else {
      try {
        localStorage.setItem('sc-notif-signal', JSON.stringify({ ts: Date.now(), message }));
        setTimeout(() => localStorage.removeItem('sc-notif-signal'), 500);
      } catch (e) {}
    }
  }

  // Handle incoming broadcast/storage signals
  function handleIncomingMessage(msg) {
    if (!msg || !msg.type) return;
    if (msg.type === 'staff-notif' || msg.type === 'staff-notif-updated' || msg.type === 'repair-complete') {
      // re-render; the underlying localStorage.notifications should already reflect changes
      renderNotifications();
    }
  }

  if (bc) {
    bc.addEventListener('message', ev => {
      try { handleIncomingMessage(ev.data || {}); } catch (e) {}
    });
  }

  window.addEventListener('storage', (ev) => {
    if (!ev.key) return;
    if (ev.key === 'notifications') {
      // notifications array changed
      renderNotifications();
    } else if (ev.key === 'sc-notif-signal' && ev.newValue) {
      try {
        const obj = JSON.parse(ev.newValue);
        if (obj && obj.message) handleIncomingMessage(obj.message);
      } catch(e){}
    }
  });

  // UI delegation for buttons inside list
  if (notifList) {
    notifList.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const idx = parseInt(btn.dataset.index, 10);
      if (btn.classList.contains('btn-view')) viewNotification(idx);
      else if (btn.classList.contains('btn-mark')) markNotification(idx);
      else if (btn.classList.contains('btn-del')) deleteNotification(idx);
    });
  }

  // Modal mark button (if page has modal with id="notifModal" and button id="modalMark")
  const modalMark = document.getElementById('modalMark');
  if (modalMark) {
    modalMark.addEventListener('click', () => {
      const modalEl = document.getElementById('notifModal');
      if (!modalEl) return;
      const idx = parseInt(modalEl.dataset.lastIndex, 10);
      if (!isNaN(idx)) {
        markNotification(idx);
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
    });
  }

  // Hook up bulk buttons
  if (btnMarkAll) {
    btnMarkAll.addEventListener('click', () => {
      if (!getNotifications().length) { alert('Không có thông báo để đánh dấu.'); return; }
      if (confirm('Đánh dấu tất cả là đã đọc?')) {
        markAllNotifications();
      }
    });
  }
  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      clearAllNotifications();
    });
  }

  // initial render
  renderNotifications();

  // expose for debugging / other scripts
  window.SCAN = window.SCAN || {};
  window.SCAN.renderStaffNotifications = renderNotifications;
  window.SCAN.markAllNotifications = markAllNotifications;
  window.SCAN.clearAllNotifications = clearAllNotifications;
});