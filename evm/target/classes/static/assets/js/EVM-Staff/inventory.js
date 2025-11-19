(function () {
    function initInventory() {
        // === Lấy các phần tử ===
        const btnMo = document.getElementById('btnMoFormInventory'); // nút mở modal
        const modal = document.getElementById('modalCreate'); // modal
        const btnClose = modal ? modal.querySelector('.modal-panel__close') : null; // nút đóng modal
        
        
        const form = document.getElementById('modalInventoryForm') || (modal ? modal.querySelector('.modal-panel__form') : null);
        
        const btnCancel = modal ? modal.querySelector('.modalCancel, .modal-panel__cancel, .modalCancelBtn') : null; // nút hủy
        const btnSubmit = modal ? modal.querySelector('.modalSubmit') : null; // nút lưu

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
            if (form && typeof form.reset === 'function') form.reset(); // reset form khi đóng
        }

        if (btnMo) btnMo.addEventListener('click', openModal);
        if (btnClose) btnClose.addEventListener('click', closeModal);
        if (btnCancel) btnCancel.addEventListener('click', closeModal);

        if (btnSubmit && !form) {
            btnSubmit.addEventListener('click', function (e) {
                e.preventDefault();
                closeModal();
            });

        // === Xử lý submit form ===
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const data = {
                    partCode: document.getElementById('partCode')?.value || '',
                    partName: document.getElementById('partName')?.value || '',
                    partQuantity: document.getElementById('quantity')?.value || '',
                    partUnit: document.getElementById('unit')?.value || '',
                };

                try {
                    const creator = (function () {
                        const sel = document.querySelector('#userName, .user-name, .profile-name, .sidebar .name, .account-name');
                        return sel?.textContent?.trim() || 'Người dùng';
                    })();

                    const title = `Phụ tùng "${data.partName || data.partCode || '—'}" đã được thêm`;
                    const timestamp = new Date().toLocaleString();
                    const message = `
<p>Phụ tùng mới đã được thêm bởi <strong>${creator}</strong> vào lúc <em>${timestamp}</em>.</p>
<ul>
  <li><strong>Mã phụ tùng:</strong> ${data.partCode || '—'}</li>
  <li><strong>Tên phụ tùng:</strong> ${data.partName || '—'}</li>
  <li><strong>Số lượng:</strong> ${data.partQuantity || '—'}</li>
  <li><strong>Đơn vị:</strong> ${data.partUnit || '—'}</li>
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
            console.error('Không tìm thấy form (id="modalInventoryForm").');
        }
    }

    initInventory();


// === DEBUG ===
    console.log('Các script đang load:', Array.from(document.querySelectorAll('script[src]')).map(s => s.src));
    fetch('../../assets/js/EVM-Staff/inventory.js')
        .then(r => console.log('Fetch status:', r.status))
        .catch(err => console.error('Fetch error:', err));
})();