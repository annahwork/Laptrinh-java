// frontend/js/SC Technican/sc-technican.js
document.addEventListener('DOMContentLoaded', () => {
  const notifListEl = document.getElementById('notifList'); // technician inbox (ThongBao.html)
  const repairTableBody = document.getElementById('repairTableBody'); // LichSuSuaChua.html

  const BC_NAME = 'sc-notifs-channel';
  let bc = null;
  try { if ('BroadcastChannel' in window) bc = new BroadcastChannel(BC_NAME); } catch (e) { bc = null; }

  function safeLS(key, def) {
    try { return JSON.parse(localStorage.getItem(key)) || def; } catch (e) { return def; }
  }
  function setLS(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} }

  function getTechNotifications() { return safeLS('notifications_technican', []); }
  function setTechNotifications(arr) { setLS('notifications_technican', arr); }
  function getRepairHistory() { return safeLS('repair_history', []); }
  function setRepairHistory(arr) { setLS('repair_history', arr); }

  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

  function renderNotifications() {
    if (!notifListEl) return;
    const notifs = getTechNotifications();
    notifListEl.innerHTML = '';
    if (notifs.length === 0) {
      notifListEl.innerHTML = '<li class="list-group-item text-muted">Không có thông báo mới.</li>';
      return;
    }
    notifs.forEach((n, i) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-start';
      li.innerHTML = `
        <div>
          <div class="fw-semibold">${escapeHtml(n.title)}</div>
          <div class="small-muted">${n.customer ? escapeHtml(n.customer) + ' — ' : ''}${escapeHtml(n.date)}</div>
          ${n.note ? `<div class="small mt-1">${escapeHtml(n.note)}</div>` : ''}
        </div>
        <div class="btns d-flex gap-2">
          <button class="btn btn-sm btn-primary btn-accept" data-index="${i}">Nhận sửa</button>
          <button class="btn btn-sm btn-outline-secondary btn-ignore" data-index="${i}">Bỏ qua</button>
        </div>
      `;
      notifListEl.appendChild(li);
    });
  }

  function renderRepairTable() {
    if (!repairTableBody) return;
    const repairs = getRepairHistory();
    repairTableBody.innerHTML = '';
    if (repairs.length === 0) {
      repairTableBody.innerHTML = '<tr><td colspan="5" class="text-muted">Chưa có công việc sửa chữa.</td></tr>';
      return;
    }
    repairs.forEach((r, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(r.sourceRequestId || r.id)}</td>
        <td>${escapeHtml(r.title)}</td>
        <td>${escapeHtml(r.date)}</td>
        <td><span class="${r.status === 'Hoàn tất' ? 'badge bg-success' : 'badge bg-warning'}">${escapeHtml(r.status)}</span></td>
        <td>
          ${r.status !== 'Hoàn tất' ? `<button class="btn btn-sm btn-success btn-complete" data-index="${i}">Hoàn tất</button>` : `<button class="btn btn-sm btn-outline-secondary btn-view" data-index="${i}">Xem</button>`}
        </td>
      `;
      repairTableBody.appendChild(tr);
    });
  }

  function acceptNotification(index) {
    const notifs = getTechNotifications();
    const n = notifs[index];
    if (!n) return;
    const repairs = getRepairHistory();
    const newRepair = {
      id: `R${Date.now()}`,
      title: n.title,
      date: new Date().toISOString().split('T')[0],
      status: 'Đang sửa',
      customer: n.customer || '',
      note: n.note || '',
      sourceRequestId: n.sourceRequestId || n.id
    };
    repairs.unshift(newRepair);
    setRepairHistory(repairs);

    // remove from inbox
    notifs.splice(index,1);
    setTechNotifications(notifs);

    renderNotifications();
    renderRepairTable();

    // notify staff via broadcast + localStorage
    const payload = { id: newRepair.id, sourceRequestId: newRepair.sourceRequestId, date: newRepair.date, customer: newRepair.customer, title: `Công việc ${newRepair.sourceRequestId || newRepair.id} đã được kỹ thuật nhận` };
    try {
      if (bc) bc.postMessage({ type: 'repair-accepted', payload });
      else localStorage.setItem('sc-notif-signal', JSON.stringify({ ts: Date.now(), message: { type:'repair-accepted', payload } }));
      setTimeout(()=> localStorage.removeItem('sc-notif-signal'),800);
    } catch (e) { console.warn(e); }

    // also add staff notification persistently
    const staffNotifs = safeLS('notifications', []);
    staffNotifs.unshift({ title: payload.title, date: payload.date, type: 'info', customer: payload.customer || '' });
    setLS('notifications', staffNotifs);
  }

  function ignoreNotification(index) {
    const notifs = getTechNotifications();
    notifs.splice(index,1);
    setTechNotifs(notifs);
    renderNotifications();
  }

  function completeRepair(index) {
    const repairs = getRepairHistory();
    if (!repairs[index]) return;
    repairs[index].status = 'Hoàn tất';
    repairs[index].completedDate = new Date().toISOString().split('T')[0];
    setRepairHistory(repairs);

    const title = `Công việc ${repairs[index].sourceRequestId || repairs[index].id} đã hoàn thành`;
    // notify staff persistently + broadcast
    const staffNotifs = safeLS('notifications', []);
    staffNotifs.unshift({ title, date: repairs[index].completedDate, type: 'success', customer: repairs[index].customer || '' });
    setLS('notifications', staffNotifs);

    const payload = { id: repairs[index].id, sourceRequestId: repairs[index].sourceRequestId, date: repairs[index].completedDate, customer: repairs[index].customer || '', title };
    try {
      if (bc) bc.postMessage({ type: 'repair-complete', payload });
      else localStorage.setItem('sc-notif-signal', JSON.stringify({ ts: Date.now(), message: { type:'repair-complete', payload } }));
      setTimeout(()=> localStorage.removeItem('sc-notif-signal'),800);
    } catch (e) { console.warn(e); }

    renderRepairTable();
  }

  // handle incoming messages from staff (tech-notif, repair-created, repair-accepted/complete)
  function handleIncoming(m) {
    if (!m || !m.type) return;
    if (m.type === 'tech-notif') {
      const list = getTechNotifications();
      if (!list.some(x => x.id === m.payload.id)) {
        list.unshift(m.payload);
        setTechNotifs(list);
        renderNotifications();
      }
    } else if (m.type === 'repair-created') {
      const repairs = getRepairHistory();
      if (!repairs.some(r => r.sourceRequestId === m.payload.sourceRequestId && r.title === m.payload.title)) {
        repairs.unshift(m.payload);
        setRepairHistory(repairs);
        renderRepairTable();
      }
    } else if (m.type === 'repair-accepted' || m.type === 'repair-complete') {
      // refresh local views (they read from localStorage)
      renderRepairTable();
      renderNotifications();
    }
  }

  // Listen via BroadcastChannel
  if (bc) {
    bc.addEventListener('message', ev => {
      try { handleIncoming(ev.data || {}); } catch(e) {}
    });
  } else {
    window.addEventListener('storage', ev => {
      if (!ev.key) return;
      if (ev.key === 'sc-notif-signal' && ev.newValue) {
        try {
          const obj = JSON.parse(ev.newValue);
          if (obj && obj.message) handleIncoming(obj.message);
        } catch(e) {}
      }
      if (ev.key === 'notifications_technican') renderNotifications();
      if (ev.key === 'repair_history') renderRepairTable();
      if (ev.key === 'notifications') renderNotifications(); // staff-notifs visible in tech UI if needed
    });
  }

  // UI event delegation
  document.addEventListener('click', e => {
    const a = e.target.closest('.btn-accept');
    if (a) {
      const idx = parseInt(a.dataset.index,10);
      acceptNotification(idx);
      return;
    }
    const b = e.target.closest('.btn-ignore');
    if (b) {
      const idx = parseInt(b.dataset.index,10);
      ignoreNotification(idx);
      return;
    }
    const c = e.target.closest('.btn-complete');
    if (c) {
      const idx = parseInt(c.dataset.index,10);
      if (confirm('Đánh dấu công việc là Hoàn tất?')) completeRepair(idx);
      return;
    }
  });

  // expose API
  window.SC_TECH = { renderNotifications, renderRepairTable, acceptNotification, completeRepair };

  // initial render
  renderNotifications();
  renderRepairTable();
});
