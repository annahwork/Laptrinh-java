(function () {
    function initEvPartsManagement() {
        const btnMo = document.getElementById('btnMoFormManageEvParts');
        const modal = document.getElementById('modalCreate');
        const btnClose = modal ? modal.querySelector('.modal-panel__close') : null;

        const form = document.getElementById('modalForm') || (modal ? modal.querySelector('.modal-panel__form') : null);

        const btnCancel = modal ? modal.querySelector('.modalCancel, .modal-panel__cancel, .modalCancelBtn') : null;
        const btnSubmit = modal ? modal.querySelector('.modalSubmit') : null;

        // === Mở và đóng modal ===
        function openModal() {
            if (!modal) return;
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
        }
        function closeModal() {
            if (!modal) return;
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            if (form && typeof form.reset === 'function') form.reset();
        }
        
        if (btnMo) btnMo.addEventListener('click', openModal);
        if (btnClose) btnClose.addEventListener('click', closeModal);
        if (btnCancel) btnCancel.addEventListener('click', closeModal);
        
        if (btnSubmit && !form) {
            btnSubmit.addEventListener('click', function (e) {
                e.preventDefault();
                closeModal();
            });
        }

        // === Xử lý lưu form ===
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                // ĐÃ CHỈNH: dùng đúng ID trong HTML
                const data = {
                    partCode: document.getElementById('code')?.value || '',
                    partName: document.getElementById('name')?.value || '',
                    partType: document.getElementById('partType')?.value || '',
                    partQuantity: document.getElementById('quantity')?.value || '',
                    partLocation: document.getElementById('location')?.value || '',
                };

                try {
                    const creator = (function () {
                        try {
                            const sel = document.querySelector('#userName, .user-name, .profile-name, .sidebar .name, .account-name');
                            if (sel && sel.textContent && sel.textContent.trim()) return sel.textContent.trim();
                            return 'Ngày tạo';
                        } catch {
                            return 'Ngày tạo';
                        }
                    })();

                    const title = `Phụ tùng "${data.partName || data.partCode || '—'}" đã được tạo`;
                    const timestamp = new Date().toLocaleString();
                    const message = `
            <p>Phụ tùng mới đã được thêm bởi <strong>${creator}</strong> vào lúc <em>${timestamp}</em>.</p>
            <ul>
              <li><strong>Mã phụ tùng:</strong> ${data.partCode || '—'}</li>
              <li><strong>Tên phụ tùng:</strong> ${data.partName || '—'}</li>
              <li><strong>Loại:</strong> ${data.partType || '—'}</li>
              <li><strong>Số lượng:</strong> ${data.partQuantity || '—'}</li>
              <li><strong>Vị trí kho:</strong> ${data.partLocation || '—'}</li>
            </ul>
          `;

                    alert(`${title}\n\n${message.replace(/<[^>]+>/g, '')}`);
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

    // === SỬA LỖI: gọi đúng tên hàm ===
    initEvPartsManagement();

    // === DEBUG: giữ nguyên như yêu cầu ===
    console.log('Các script đang load:', Array.from(document.querySelectorAll('script[src]')).map(s => s.src));
    fetch('../../assets/js/EVM-Staff/manage_ev_parts.js')
        .then(r => console.log('Fetch status:', r.status))
        .catch(err => console.error('Fetch error:', err));
})();