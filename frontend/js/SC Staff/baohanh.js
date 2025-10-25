// frontend/js/SC Staff/baohanh.js
// Script cho Trang BaoHanh.html — giữ nguyên logic gốc + gửi signal realtime tới SC Staff

document.addEventListener('DOMContentLoaded', () => {
  // helper
  const $ = id => document.getElementById(id);
  if ($('year')) $('year').textContent = new Date().getFullYear();

  const warrantyForm = $('warranty-form');
  if (!warrantyForm) return;

  // Init data from localStorage
  let warrantyRequests = JSON.parse(localStorage.getItem('warrantyRequests')) || [];
  let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

  // BroadcastChannel setup (realtime) & fallback
  const BC_NAME = 'sc-notifs-channel';
  let bc = null;
  try {
    if ('BroadcastChannel' in window) bc = new BroadcastChannel(BC_NAME);
  } catch (e) {
    bc = null;
  }

  function sendRealtimeToStaff(message) {
    // message: { type: 'staff-notif', payload: {...} }
    if (bc) {
      try { bc.postMessage(message); } catch (e) { /* ignore */ }
    } else {
      // fallback: set a temporary localStorage key to trigger storage event
      try {
        localStorage.setItem('sc-notif-signal', JSON.stringify({ ts: Date.now(), message }));
        // cleanup shortly after
        setTimeout(() => localStorage.removeItem('sc-notif-signal'), 500);
      } catch (e) { /* ignore */ }
    }
  }

  // Validate warranty form (cải tiến so sánh ngày bằng chuỗi YYYY-MM-DD)
  function validateWarrantyForm(data) {
    // quick required check
    if (!data.id || !data.customer || !data.desc) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return false;
    }

    // duplicate id check
    if (warrantyRequests.some(req => req.id === data.id)) {
      alert('Mã yêu cầu đã tồn tại!');
      return false;
    }

    // date presence & not future (compare YYYY-MM-DD lexicographically)
    if (!data.date || typeof data.date !== 'string' || !data.date.trim()) {
      alert('Ngày tạo không hợp lệ! Vui lòng chọn một ngày.');
      return false;
    }
    const selectedDateStr = data.date.trim();
    const now = new Date();
    const tzOffsetMs = now.getTimezoneOffset() * 60000;
    const localISODate = new Date(Date.now() - tzOffsetMs).toISOString().split('T')[0];
    if (selectedDateStr > localISODate) {
      alert('Ngày tạo không được ở tương lai!');
      return false;
    }

    return true;
  }

  // Handle warranty form submission
  warrantyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
      id: document.getElementById('wr-id').value.trim(),
      customer: document.getElementById('wr-customer').value.trim(),
      date: document.getElementById('wr-date').value, // expecting YYYY-MM-DD
      desc: document.getElementById('wr-desc').value.trim(),
      parts: document.getElementById('wr-parts').value.trim(),
      note: document.getElementById('wr-note').value.trim(),
      status: 'Mới'
    };

    if (validateWarrantyForm(data)) {
      // push request
      warrantyRequests.unshift(data); // put newest first
      localStorage.setItem('warrantyRequests', JSON.stringify(warrantyRequests));

      // create staff notification (so SC Staff page shows it)
      const staffNotif = {
        title: `Yêu cầu bảo hành mới (${data.id})`,
        date: new Date().toISOString().split('T')[0],
        type: 'danger',
        customer: data.customer
      };
      notifications.unshift(staffNotif);
      localStorage.setItem('notifications', JSON.stringify(notifications));

      // --- Send realtime signal so SC Staff pages (TrangChu.html) update immediately ---
      sendRealtimeToStaff({ type: 'staff-notif', payload: staffNotif });

      // Also, if this request should go to technicians, you can dispatch to technician here:
      // (uncomment to also send to technician immediately)
      // if (window.dispatchToTechnician) {
      //   window.dispatchToTechnician(data.id, data.desc || data.note, data.customer);
      // }

      alert('Yêu cầu bảo hành đã được gửi đi!');
      this.reset();
    }
  });

  // clear button
  const btnClear = document.getElementById('btnClear');
  if (btnClear) btnClear.addEventListener('click', () => warrantyForm.reset());
});
