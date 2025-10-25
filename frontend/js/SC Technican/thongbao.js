// frontend/js/SC Technican/thongbao.js
// Fallback renderer + interaction for SC Technican ThongBao.html
document.addEventListener('DOMContentLoaded', () => {
  const notifList = document.getElementById('notifList');
  if (!notifList) return;

  const BC_NAME = 'sc-notifs-channel';
  let bc = null;
  try { if ('BroadcastChannel' in window) bc = new BroadcastChannel(BC_NAME); } catch (e) { bc = null; }

  // Safe helpers
  const safeLS = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } };
  const setLS = (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };

  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

  function render() {
    // If sc-technican already provides renderer, call it
    if (window.SC_TECH && typeof window.SC_TECH.renderNotifications === 'function') {
      try { window.SC_TECH.renderNotifications(); return; } catch(e) {}
    }

    const list = safeLS('notifications_technican');
    notifList.innerHTML = '';
    if (!list.length) {
      notifList.innerHTML = '<li class="list-group-item text-muted">Không có thông báo mới.</li>';
      return;
    }

    list.forEach((n, i) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-start';
      li.innerHTML = `
        <div>
          <div class="fw-semibold">${escapeHtml(n.title)}</div>
          <div class="small-muted">${escapeHtml(n.customer || '')}${n.customer ? ' — ' : ''}${escapeHtml(n.date || '')}</div>
          ${n.note ? `<div class="small mt-1">${escapeHtml(n.note)}</div>` : ''}
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-primary btn-accept" data-index="${i}">Nhận sửa</button>
          <button class="btn btn-sm btn-outline-secondary btn-ignore" data-index="${i}">Bỏ qua</button>
        </div>
      `;
      notifList.appendChild(li);
    });
  }

  // Accept: move notification -> repair_history (Đang sửa), notify staff
  function acceptNotification(index) {
    const list = safeLS('notifications_technican');
    const item = list[index];
    if (!item) return;

    // create repair entry
    const repairs = safeLS('repair_history');
    const newRepair = {
      id: `R${Date.now()}`,
      title: item.title,
      date: new Date().toISOString().split('T')[0],
      status: 'Đang sửa',
      customer: item.customer || '',
      note: item.note || '',
      sourceRequestId: item.sourceRequestId || item.id || ''
    };
    repairs.unshift(newRepair);
    setLS('repair_history', repairs);

    // remove from inbox
    list.splice(index, 1);
    setLS('notifications_technican', list);

    // notify staff persistently
    const staffNotifs = safeLS('notifications');
    staffNotifs.unshift({ title: `Công việc ${newRepair.sourceRequestId || newRepair.id} đã được kỹ thuật nhận`, date: newRepair.date, type: 'info', customer: newRepair.customer || '' });
    setLS('notifications', staffNotifs);

    // broadcast repair-accepted
    const payload = { id: newRepair.id, sourceRequestId: newRepair.sourceRequestId, date: newRepair.date, customer: newRepair.customer, title: staffNotifs[0].title };
    try {
      if (bc) bc.postMessage({ type: 'repair-accepted', payload });
      else localStorage.setItem('sc-notif-signal', JSON.stringify({ ts: Date.now(), message: { type: 'repair-accepted', payload } }));
    } catch (e) {}
    // cleanup signal key quickly
    setTimeout(() => { try { localStorage.removeItem('sc-notif-signal'); } catch(e){} }, 700);

    // re-render
    render();
    // also try to notify repair page to re-render (it listens storage key)
    // (repair page will update from repair_history change)
  }

  function ignoreNotification(index) {
    const list = safeLS('notifications_technican');
    list.splice(index, 1);
    setLS('notifications_technican', list);
    render();
  }

  // UI delegation
  notifList.addEventListener('click', (e) => {
    const a = e.target.closest('.btn-accept');
    if (a) { const idx = parseInt(a.dataset.index,10); acceptNotification(idx); return; }
    const b = e.target.closest('.btn-ignore');
    if (b) { const idx = parseInt(b.dataset.index,10); ignoreNotification(idx); return; }
  });

  // Listen for BroadcastChannel messages or storage signals
  function handleIncoming(msg) {
    if (!msg || !msg.type) return;
    if (msg.type === 'tech-notif' || msg.type === 'repair-created') {
      // render from localStorage (SC Staff already wrote the LS keys)
      render();
    } else if (msg.type === 'repair-accepted' || msg.type === 'repair-complete') {
      // show it (staff notified via notifications too)
      render();
    }
  }

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
      if (ev.key === 'notifications_technican' || ev.key === 'repair_history' || ev.key === 'notifications') {
        // re-render inbox when relevant LS keys change
        render();
      }
    });
  }

  // initial render
  render();
});
