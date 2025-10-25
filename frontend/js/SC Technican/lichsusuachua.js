// frontend/js/SC Technican/lichsusuachua.js
// Fallback renderer + interaction for SC Technican LichSuSuaChua.html
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('repairTableBody');
  if (!tbody) return;

  const BC_NAME = 'sc-notifs-channel';
  let bc = null;
  try { if ('BroadcastChannel' in window) bc = new BroadcastChannel(BC_NAME); } catch (e) { bc = null; }

  const safeLS = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } };
  const setLS = (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };

  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

  function renderTable() {
    // if SC_TECH provider exists, prefer it
    if (window.SC_TECH && typeof window.SC_TECH.renderRepairTable === 'function') {
      try { window.SC_TECH.renderRepairTable(); return; } catch(e) {}
    }

    const repairs = safeLS('repair_history');
    tbody.innerHTML = '';
    if (!repairs.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-muted">Chưa có công việc sửa chữa.</td></tr>';
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
      tbody.appendChild(tr);
    });
  }

  // Mark complete handler: update repair_history, notify staff
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-complete');
    if (!btn) return;
    const idx = parseInt(btn.dataset.index, 10);
    const repairs = safeLS('repair_history');
    if (!repairs[idx]) return;

    // update
    repairs[idx].status = 'Hoàn tất';
    repairs[idx].completedDate = new Date().toISOString().split('T')[0];
    setLS('repair_history', repairs);

    // staff notification persist
    const staffNotifs = safeLS('notifications');
    staffNotifs.unshift({
      title: `Công việc ${repairs[idx].sourceRequestId || repairs[idx].id} đã hoàn thành`,
      date: repairs[idx].completedDate,
      type: 'success',
      customer: repairs[idx].customer || ''
    });
    setLS('notifications', staffNotifs);

    // Broadcast repair-complete
    const payload = { id: repairs[idx].id, sourceRequestId: repairs[idx].sourceRequestId, date: repairs[idx].completedDate, customer: repairs[idx].customer || '', title: staffNotifs[0].title };
    try {
      if (bc) bc.postMessage({ type: 'repair-complete', payload });
      else localStorage.setItem('sc-notif-signal', JSON.stringify({ ts: Date.now(), message: { type:'repair-complete', payload } }));
    } catch (e) {}
    setTimeout(() => { try { localStorage.removeItem('sc-notif-signal'); } catch(e){} }, 700);

    // re-render table
    renderTable();
  });

  // Listen for incoming signals (repair-created or changes to repair_history)
  function handleIncoming(msg) {
    if (!msg || !msg.type) return;
    if (msg.type === 'repair-created' || msg.type === 'tech-notif' || msg.type === 'repair-accepted' || msg.type === 'repair-complete') {
      // read from localStorage and render
      renderTable();
    }
  }

  if (bc) {
    bc.addEventListener('message', ev => { try { handleIncoming(ev.data || {}); } catch(e){} });
  } else {
    window.addEventListener('storage', ev => {
      if (!ev.key) return;
      if (ev.key === 'sc-notif-signal' && ev.newValue) {
        try {
          const obj = JSON.parse(ev.newValue);
          if (obj && obj.message) handleIncoming(obj.message);
        } catch(e){}
      }
      if (ev.key === 'repair_history' || ev.key === 'notifications_technican' || ev.key === 'notifications') {
        renderTable();
      }
    });
  }

  // initial
  renderTable();
});
