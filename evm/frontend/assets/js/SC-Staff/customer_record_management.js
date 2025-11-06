(function () {
  function initCustomerModal() {
    const btnOpen = document.getElementById('btnMoFormCustomer');
    const modal = document.getElementById('modalQuanLyCustomer');
    const btnClose = modal ? modal.querySelector('.customer__close-button') : null;
    const btnCancel = document.getElementById('customerCancelBtn');
    const form = modal ? modal.querySelector('.customer__form') : null;

    function openModal() { if (modal) modal.style.display = 'block'; }
    function closeModal() { if (modal) { modal.style.display = 'none'; if (form) form.reset(); } }

    if (btnOpen) btnOpen.addEventListener('click', function () { openModal(); });
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = {
        code: document.getElementById('customer_code')?.value || '',
        name: document.getElementById('customer_name')?.value || '',
        phone: document.getElementById('customer_phone')?.value || '',
        email: document.getElementById('customer_email')?.value || '',
        status: document.getElementById('customer_status')?.value || '',
        notes: document.getElementById('customer_notes')?.value || ''
      };

      try {
        const creator = (function () {
          try {
            const sel = document.querySelector('#userName, .user-name, .profile-name, .sidebar .name, .account-name');
            if (sel && sel.textContent && sel.textContent.trim()) return sel.textContent.trim();
          } catch (e) { }
          return 'Bạn';
        })();
        const title = `Khách hàng "${data.name}" đã được thêm`;
        const meta = `${creator} • ${new Date().toLocaleString()}`;
        if (window.addNotification) {
          window.addNotification({ title: title, meta: meta, body: `SĐT: ${data.phone}`, unread: true, creator: creator });
        }
      } catch (e) { console.warn('Could not create notification', e); }

      closeModal();
    });

    window.addEventListener('click', function (e) { if (modal && modal.style.display === 'block' && e.target == modal) closeModal(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCustomerModal); else initCustomerModal();
})();
