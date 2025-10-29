document.addEventListener('DOMContentLoaded', function () {
  const $ = id => document.getElementById(id);
  if ($('year')) $('year').textContent = new Date().getFullYear();

  const requestModalEl = $('requestModal');
  const requestModal = requestModalEl ? new bootstrap.Modal(requestModalEl) : null;
  const requestsTbody = $('requests-tbody');
  const notificationsList = $('notifications-list');
  let currentRequestId = null;

  let warrantyRequests = JSON.parse(localStorage.getItem('warrantyRequests')) || [];
  let partsOrders = JSON.parse(localStorage.getItem('partsOrders')) || [];
  let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

  const BC_NAME = 'sc-notifs-channel';
  let bc = null;
  try { if ('BroadcastChannel' in window) bc = new BroadcastChannel(BC_NAME); } catch (e) { bc = null; }

  function safe(obj, key, def='') { return (obj && obj[key] !== undefined && obj[key] !== null) ? obj[key] : def; }

  function broadcast(message) {
    try {
      if (bc) {
        bc.postMessage(message);
      } else {
        localStorage.setItem('sc-notif-signal', JSON.stringify({ ts: Date.now(), message }));
        // keep briefly so other tabs receive storage event
        setTimeout(() => localStorage.removeItem('sc-notif-signal'), 800);
      }
    } catch (e) { console.error('broadcast error', e); }
  }

  // Technician inbox helpers
  function getTechNotifs() {
    return JSON.parse(localStorage.getItem('notifications_technican')) || [];
  }
  function setTechNotifs(arr) {
    localStorage.setItem('notifications_technican', JSON.stringify(arr));
  }

  function getRepairHistory() {
    return JSON.parse(localStorage.getItem('repair_history')) || [];
  }
  function setRepairHistory(arr) {
    localStorage.setItem('repair_history', JSON.stringify(arr));
  }

  // Dispatch from a warranty request: create tech inbox notif + repair entry (Chờ sửa) and broadcast both
  function dispatchToTechnicianFromRequest(req) {
    const sourceId = safe(req, 'id', safe(req, 'sourceRequestId', 'UNKNOWN'));
    const title = `WR ${sourceId} — ${safe(req, 'desc', '') || safe(req, 'note', '') || 'Yêu cầu kỹ thuật'}`;
    const notif = {
      id: `TECH-${Date.now()}`,
      sourceRequestId: sourceId,
      title,
      date: new Date().toISOString().split('T')[0],
      type: 'tech',
      customer: safe(req, 'customer', ''),
      note: safe(req, 'note', '') || safe(req, 'parts', '') || ''
    };

    // push to notifications_technican (avoid dup by sourceRequestId+title)
    const techNotifs = getTechNotifs();
    if (!techNotifs.some(n => n.sourceRequestId === notif.sourceRequestId && n.title === notif.title)) {
      techNotifs.unshift(notif);
      setTechNotifs(techNotifs);
    }

    // create repair entry with status 'Chờ sửa' to display immediately in Lịch Sử
    const repairs = getRepairHistory();
    const repairEntry = {
      id: `R${Date.now()}`,
      sourceRequestId: sourceId,
      title: notif.title,
      date: new Date().toISOString().split('T')[0],
      status: 'Chờ sửa',
      customer: notif.customer,
      note: notif.note
    };
    if (!repairs.some(r => r.sourceRequestId === repairEntry.sourceRequestId && r.title === repairEntry.title)) {
      repairs.unshift(repairEntry);
      setRepairHistory(repairs);
    }

    // Also add a staff-visible notification that dispatch happened
    notifications.unshift({
      title: `Yêu cầu ${sourceId} đã được phân phối cho kỹ thuật.`,
      date: new Date().toISOString().split('T')[0],
      type: 'info',
      customer: notif.customer || ''
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));

    // Broadcast both a tech-notif and a repair-created event
    broadcast({ type: 'tech-notif', payload: notif });
    broadcast({ type: 'repair-created', payload: repairEntry });

    // ensure other tabs see direct localStorage changes (some browsers may not trigger storage event for same key changes)
    try { localStorage.setItem('notifications_technican', JSON.stringify(getTechNotifs())); } catch(e){}
    try { localStorage.setItem('repair_history', JSON.stringify(getRepairHistory())); } catch(e){}
    try { localStorage.setItem('notifications', JSON.stringify(notifications)); } catch(e){}

    return { notif, repairEntry };
  }

  window.dispatchToTechnicianFromRequest = dispatchToTechnicianFromRequest;

  // Render and UI
  function updateSummary() {
    const newRequests = warrantyRequests.filter(req => req.status === 'Mới').length;
    const processingRequests = warrantyRequests.filter(req => req.status === 'Đang xử lý').length;
    const completedThisMonth = warrantyRequests.filter(req => {
      const reqDate = new Date(safe(req,'date','1970-01-01'));
      const now = new Date();
      return req.status === 'Hoàn thành' && reqDate.getMonth() === now.getMonth() && reqDate.getFullYear() === now.getFullYear();
    }).length;
    const pendingParts = partsOrders.filter(order => order.status === 'Chờ duyệt').length;
    if ($('new-requests-count')) $('new-requests-count').textContent = newRequests;
    if ($('processing-requests-count')) $('processing-requests-count').textContent = processingRequests;
    if ($('completed-requests-count')) $('completed-requests-count').textContent = completedThisMonth;
    if ($('pending-parts-count')) $('pending-parts-count').textContent = pendingParts;
  }

  function renderRequests() {
    if (!requestsTbody) return;
    requestsTbody.innerHTML = '';
    warrantyRequests.forEach(req => {
      const row = document.createElement('tr');
      row.classList.add('clickable-row');
      row.dataset.wr = JSON.stringify(req);
      const badgeType = req.status === 'Hoàn thành' ? 'success' : req.status === 'Đang xử lý' ? 'warning' : req.status === 'Từ chối' ? 'danger' : 'info';
      row.innerHTML = `
        <td class="fw-semibold">${safe(req,'id','-')}</td>
        <td>${safe(req,'customer','-')}</td>
        <td>${safe(req,'date','-')}</td>
        <td><span class="badge badge--soft-${badgeType}">${safe(req,'status','-')}</span></td>
        <td>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary btn-view"><i class="bi bi-eye"></i> Xem</button>
            <button class="btn btn-sm btn-outline-success btn-dispatch"><i class="bi bi-truck"></i> Phân phối</button>
          </div>
        </td>
      `;
      // dispatch listener using closure req (safe)
      const dispatchBtn = row.querySelector('.btn-dispatch');
      dispatchBtn.addEventListener('click', () => {
        try {
          const result = dispatchToTechnicianFromRequest(req);
          alert(`Đã phân phối công việc tới SC Technican: ${safe(result.notif,'title','(no title)')}`);
          renderNotifications(); // update staff UI
        } catch (err) {
          console.error('dispatch error', err);
          alert('Lỗi khi phân phối (xem console).');
        }
      });

      // view button handled by table click handler below
      requestsTbody.appendChild(row);
    });
  }

  function renderNotifications() {
    if (!notificationsList) return;
    notificationsList.innerHTML = '';
    notifications = JSON.parse(localStorage.getItem('notifications')) || notifications;
    notifications.slice(0,2).forEach(notif => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.innerHTML = `
        <div class="d-flex align-items-center">
          <i class="bi bi-${notif.type === 'danger' ? 'patch-exclamation-fill' : 'check-circle-fill'} notification-icon text-${notif.type}"></i>
          <div>
            <div class="fw-semibold text-${notif.type}">${safe(notif,'title','(no title)')}</div>
            <div class="small-muted">${safe(notif,'customer','')}${notif.customer ? ' — ' : ''}${safe(notif,'date','')}</div>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-secondary btn-mark"><i class="bi bi-check-lg"></i></button>
      `;
      notificationsList.appendChild(li);
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  function showRequestDetails(wrData) {
    if ($('modalWrId')) $('modalWrId').textContent = safe(wrData,'id','-');
    if ($('modalCustomer')) $('modalCustomer').textContent = safe(wrData,'customer','-');
    if ($('modalDate')) $('modalDate').textContent = safe(wrData,'date','-');
    const statusSelect = $('statusSelect');
    if (statusSelect) {
      statusSelect.value = safe(wrData,'status','Mới');
      statusSelect.className = `form-select status-${statusSelect.value.replace(/\s+/g, '-').toLowerCase()}`;
    }
    if ($('modalDesc')) $('modalDesc').textContent = safe(wrData,'desc','');
    if ($('modalParts')) $('modalParts').textContent = safe(wrData,'parts','Không có');
    if ($('modalNote')) $('modalNote').textContent = safe(wrData,'note','Không có');
    currentRequestId = safe(wrData,'id','');
    if (requestModal) requestModal.show();
  }

  // table click handlers
  if (requestsTbody) {
    requestsTbody.addEventListener('click', (e) => {
      const row = e.target.closest('.clickable-row');
      if (!row) return;
      const wrData = JSON.parse(row.dataset.wr || '{}');
      if (e.target.closest('.btn-view')) {
        showRequestDetails(wrData);
      }
    });
    requestsTbody.addEventListener('dblclick', (e) => {
      const row = e.target.closest('.clickable-row');
      if (row) {
        const wrData = JSON.parse(row.dataset.wr || '{}');
        showRequestDetails(wrData);
      }
    });
  }

  if (notificationsList) {
    notificationsList.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-mark');
      if (!btn) return;
      const li = btn.closest('.list-group-item');
      const index = Array.from(notificationsList.children).indexOf(li);
      if (index >= 0 && index < notifications.length) {
        notifications.splice(index,1);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        renderNotifications();
      }
    });
  }

  const updateStatusBtn = $('updateStatusBtn');
  if (updateStatusBtn) {
    updateStatusBtn.addEventListener('click', () => {
      const newStatus = $('statusSelect') ? $('statusSelect').value : null;
      const requestIndex = warrantyRequests.findIndex(r => r.id === currentRequestId);
      if (requestIndex !== -1 && newStatus) {
        warrantyRequests[requestIndex].status = newStatus;
        localStorage.setItem('warrantyRequests', JSON.stringify(warrantyRequests));
        renderRequests();
        updateSummary();
        if (requestModal) requestModal.hide();

        if (newStatus === 'Phân phối') {
          // dispatch
          try {
            const res = dispatchToTechnicianFromRequest(warrantyRequests[requestIndex]);
            alert(`Đã phân phối tới SC Technican: ${safe(res.notif,'title','(no title)')}`);
          } catch (e) { console.error(e); }
        } else {
          notifications.unshift({
            title: `Yêu cầu ${currentRequestId} cập nhật trạng thái: ${newStatus}`,
            date: new Date().toISOString().split('T')[0],
            type: newStatus === 'Hoàn thành' ? 'success' : newStatus === 'Từ chối' ? 'danger' : 'info',
            customer: warrantyRequests[requestIndex].customer || ''
          });
          localStorage.setItem('notifications', JSON.stringify(notifications));
          renderNotifications();
        }
      }
    });
  }

  // select color handler
  const statusSelectEl = $('statusSelect');
  if (statusSelectEl) {
    statusSelectEl.addEventListener('change', (e) => {
      const status = e.target.value;
      e.target.className = `form-select status-${status.replace(/\s+/g, '-').toLowerCase()}`;
    });
  }

  // handle incoming messages from technicians
  function handleIncomingMessage(msg) {
    if (!msg || !msg.type) return;
    if (msg.type === 'repair-accepted' || msg.type === 'repair-complete') {
      // push to staff notifications
      notifications = JSON.parse(localStorage.getItem('notifications')) || notifications;
      notifications.unshift({
        title: msg.payload.title || `Công việc ${msg.payload.sourceRequestId || msg.payload.id} cập nhật`,
        date: msg.payload.date || new Date().toISOString().split('T')[0],
        type: msg.type === 'repair-complete' ? 'success' : 'info',
        customer: msg.payload.customer || ''
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
      renderNotifications();
    }
  }

  if (bc) {
    bc.addEventListener('message', ev => {
      try { handleIncomingMessage(ev.data || {}); } catch (e) {}
    });
  } else {
    window.addEventListener('storage', ev => {
      if (!ev.key) return;
      if (ev.key === 'sc-notif-signal' && ev.newValue) {
        try {
          const obj = JSON.parse(ev.newValue);
          if (obj.message) handleIncomingMessage(obj.message);
        } catch(e) {}
      }
      if (ev.key === 'notifications') {
        notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        renderNotifications();
      }
      if (ev.key === 'warrantyRequests') {
        warrantyRequests = JSON.parse(localStorage.getItem('warrantyRequests')) || [];
        renderRequests();
        updateSummary();
      }
    });
  }

  // initial render
  renderRequests();
  renderNotifications();
  updateSummary();

  // expose
  window.SC_STAFF = { dispatchToTechnicianFromRequest, broadcast };
});