(function () {
  function initCustomerRecordModal() {
    const btnMo = document.getElementById('btnMoFormCustomerRecordManagement');
    const btnXuat = document.getElementById('btnXuatFileCustomerRecordManagement');
    const modal = document.getElementById('modalCreate');
    const btnClose = modal ? modal.querySelector('.modal-panel__close') : null;
    // Ghi chú: form có id="modalForm" trong HTML, nên lấy bằng id
    const form = document.getElementById('modalForm') || (modal ? modal.querySelector('.modal-panel__form') : null);
    // Hủy trong modal có class="modalCancel" (theo HTML)
    const btnCancel = modal ? modal.querySelector('.modalCancel, .modal-panel__cancel, .modalCancelBtn') : null;
    const btnSubmit = modal ? modal.querySelector('.modalSubmit') : null;

    // === Mở và đóng modal ===
    function openModal() {
      if (!modal) return;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false'); // cập nhật attribute để hỗ trợ a11y
    }
    function closeModal() {
      if (!modal) return;
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      if (form && typeof form.reset === 'function') form.reset();
    }

    if (btnMo) btnMo.addEventListener('click', openModal);
    if (btnXuat) btnXuat.addEventListener('click', function () {
      // placeholder: hành động xuất file
      alert('Đã xuất file.');
    });
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    // Nếu còn muốn nút submit xử lý riêng (không rely vào form submit), có thể lắng nghe btnSubmit
    if (btnSubmit && !form) {
      btnSubmit.addEventListener('click', function (e) {
        e.preventDefault();
        // fallback: submit qua JS nếu form không tồn tại
        closeModal();
      });
    }

    // === Xử lý lưu form ===
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Lấy giá trị từ các input thực tế trong HTML.
        // HTML mẫu có id: code, name, email, phone, type... điều chỉnh theo form của bạn.
        const data = {
          code: document.getElementById('code')?.value || '',
          name: document.getElementById('name')?.value || '',
          email: document.getElementById('email')?.value || '',
          phone: document.getElementById('phone')?.value || '',
          type: document.getElementById('type')?.value || '',
        };

        try {
          // Lấy tên người tạo (nhiều selector thử qua)
          const creator = (function () {
            try {
              const sel = document.querySelector('#userName, .user-name, .profile-name, .sidebar .name, .account-name');
              if (sel && sel.textContent && sel.textContent.trim()) return sel.textContent.trim();
              return 'Ngày tạo';
            } catch {
              return 'Ngày tạo';
            }
          })();

          const title = `Hồ sơ khách hàng "${data.name || data.code || '—'}" đã được tạo`;
          const meta = `${creator} • ${new Date().toLocaleString()}`;

          if (window.addNotification) {
            window.addNotification({
              title: title,
              meta: meta,
              type: 'success',
            });
          } else {
            alert(`${title}\n${meta}`);
          }

          // nếu cần: đẩy dữ liệu lên server ở đây (fetch/axios)
          // fetch('/api/customer', { method: 'POST', body: JSON.stringify(data), headers: {...} })

          closeModal();
        } catch (error) {
          console.error('Lỗi khi xử lý form:', error);
          alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
      });
    } else {
      console.error('Không tìm thấy form (id="modalForm").');
    }
  }

  // Khởi tạo khi script load
  initCustomerRecordModal();

  // --- tiện ích debug: liệt kê script src đang load (in ra console) ---
  console.log('Các script đang load:', Array.from(document.querySelectorAll('script[src]')).map(s => s.src));

  // --- thử fetch file script (chỉ để debug xem file có load được không) ---
  fetch('../../assets/js/SC-Staff/customer_record_management.js')
    .then(r => console.log('Fetch status:', r.status))
    .catch(err => console.error('Fetch error:', err));
})();
