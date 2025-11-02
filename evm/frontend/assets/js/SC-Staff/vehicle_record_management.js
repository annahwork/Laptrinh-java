(function () {
  function initVehicleModal() {
    const btnOpen = document.getElementById('btnMoFormVehicle');
    const modal = document.getElementById('modalQuanLyVehicle');
    const btnClose = modal ? modal.querySelector('.vehicle__close-button') : null;
    const btnCancel = document.getElementById('vehicleCancelBtn');
    const form = modal ? modal.querySelector('.vehicle__form') : null;

    function openModal() { if (modal) modal.style.display = 'block'; }
    function closeModal() { if (modal) { modal.style.display = 'none'; if (form) form.reset(); } }

    if (btnOpen) btnOpen.addEventListener('click', function () { openModal(); });
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = {
        plate: document.getElementById('vehicle_plate')?.value || '',
        customer: document.getElementById('vehicle_customer')?.value || '',
        phone: document.getElementById('vehicle_phone')?.value || '',
        type: document.getElementById('vehicle_type')?.value || '',
        status: document.getElementById('vehicle_status')?.value || '',
        notes: document.getElementById('vehicle_notes')?.value || ''
      };

      try {
        const creator = (function () {
          try {
            const sel = document.querySelector('#userName, .user-name, .profile-name, .sidebar .name, .account-name');
            if (sel && sel.textContent && sel.textContent.trim()) return sel.textContent.trim();
          } catch (e) { }
          return 'Bạn';
        })();
        const title = `Hồ sơ xe "${data.plate}" đã được thêm`;
        const meta = `${creator} • ${new Date().toLocaleString()}`;
        if (window.addNotification) {
          window.addNotification({ title: title, meta: meta, body: `Khách hàng: ${data.customer}`, unread: true, creator: creator });
        }
      } catch (e) { console.warn('Could not create notification', e); }

      closeModal();
    });

    window.addEventListener('click', function (e) { if (modal && modal.style.display === 'block' && e.target == modal) closeModal(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initVehicleModal); else initVehicleModal();
})();
