(function () {
  function initVehicleRecordModal() {
    const btnMo = document.getElementById('btnMoFormVehicleRecordManagement');
    const btnXuat = document.getElementById('btnXuatFileVehicleRecordManagement');
    const modal = document.getElementById('modalVehicleRecord');
    const btnClose = modal ? modal.querySelector('.vehicleRecord__close-button') : null;
    const btnCancel = document.getElementById('vehicleRecordCancelBtn');
    const form = modal ? modal.querySelector('.vehicleRecord__form') : null;

    // === Mở và đóng modal ===
    function openModal() {
  if (!modal) return;
  modal.classList.add('show');
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('show');
  if (form) form.reset();
}


    if (btnMo) btnMo.addEventListener('click', openModal);
    if (btnXuat) btnXuat.addEventListener('click', function () {
      alert('Đã xuất file.');
    });
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    // === Xử lý lưu form ===
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const data = {
          code: document.getElementById('vehicleRecord_code')?.value || '',
          name: document.getElementById('customer_name')?.value || '',
          phone: document.getElementById('customer_phone')?.value || '',
          number: document.getElementById('vehicle_number')?.value || '',
          type: document.getElementById('vehicle_type')?.value || '',
          date: document.getElementById('registration_date')?.value || '',
        };

        try {
          const creator = (function () {
            try {
              const sel = document.querySelector('#userName, .user-name, .profile-name, .sidebar .name, .account-name');
              if (sel && sel.textContent && sel.textContent.trim()) return sel.textContent.trim();
              return 'Bạn';
            } catch {
              return 'Bạn';
            }
          })();

          const title = `Hồ sơ xe "${data.code || data.number}" đã được tạo`;
          const meta = `${creator} • ${new Date().toLocaleString()}`;

          if (window.addNotification) {
            window.addNotification({
              title: title,
              meta: meta,
              body: `Khách hàng: ${data.name}`,
              unread: true,
              creator: creator
            });
          }
        } catch (e) {
          console.warn('Could not create notification', e);
        }

        closeModal();
      });

      // Đóng modal khi click bên ngoài
      window.addEventListener('click', function (e) {
        if (modal && modal.style.display === 'block' && e.target === modal) closeModal();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVehicleRecordModal);
  } else {
    initVehicleRecordModal();
  }
})();

// modal open/close + submit
(function () {
  const modal = document.getElementById('modalCreate');
  const openBtn = document.getElementById('btnMoFormVehicleRecordManagement') || document.getElementById('btnMoFormCampaign');
  const closeBtn = modal ? modal.querySelector('.modal-panel__close') : null;
  const cancelBtn = document.getElementById('modalCancel');
  const form = document.getElementById('modalForm');

  function showModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden','false');
    // focus first input
    setTimeout(()=> modal.querySelector('input, textarea')?.focus(), 80);
  }
  function hideModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden','true');
    if (form) form.reset();
  }

  openBtn?.addEventListener('click', showModal);
  closeBtn?.addEventListener('click', hideModal);
  cancelBtn?.addEventListener('click', hideModal);

  // click backdrop to close
  modal?.addEventListener('click', function (e) {
    if (e.target === modal) hideModal();
  });

  // submit
  form?.addEventListener('submit', function (e) {
    e.preventDefault();
    // collect values (example)
    const data = {
      code: form.code?.value || '',
      name: form.name?.value || '',
      phone: form.phone?.value || '',
      vehicle: form.vehicle?.value || '',
      type: form.type?.value || '',
      regDate: form.registrationDate?.value || form.regDate?.value || ''
    };
    // TODO: save data to localStorage / API / update UI
    console.log('Form submit data:', data);

    // close modal after submit
    hideModal();
    // optional: show a toast/notification
    alert('Đã thêm hồ sơ!');
  });
})();


// liệt kê tất cả script src đang load
Array.from(document.querySelectorAll('script[src]')).map(s => s.src);

// test fetch file script từ browser (path relative to page)
fetch('../../assets/js/SC-Staff/vehicle_record_management.js').then(r=>console.log(r.status)).catch(e=>console.error(e));
