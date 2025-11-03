function initWarrantyModal() {
    const btnMoForm = document.getElementById('btnMoFormYeuCau');
    const modal = document.getElementById('modalYeuCauBaoHanh');
    const btnDongModal = modal ? modal.querySelector('.warranty-claim__close-button') : null;
    const btnHuyYeuCau = document.getElementById('warrantyCancelBtn');
    const form = modal ? modal.querySelector('.warranty-claim__form') : null;

    function hienModal() {
        if (modal) modal.style.display = 'block';
    }

    function anModal() {
        if (modal) {
            modal.style.display = 'none';
            if (form) form.reset();
        }
    }

    if (btnMoForm) btnMoForm.addEventListener('click', function () { hienModal(); });
    if (btnDongModal) btnDongModal.addEventListener('click', anModal);
    if (btnHuyYeuCau) btnHuyYeuCau.addEventListener('click', anModal);

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const warrantyCode = document.getElementById('warranty_code')?.value || '';
            const vin = document.getElementById('warranty_vin')?.value || '';
            const date = document.getElementById('warranty_date')?.value || '';
            const status = document.getElementById('warranty_status')?.value || '';
            const description = document.getElementById('warranty_desc')?.value || '';

            const creator = (function () {
                try {
                    const sel = document.querySelector('#userName, .user-name, .profile-name, .sidebar .name, .account-name');
                    if (sel && sel.textContent && sel.textContent.trim()) return sel.textContent.trim();
                } catch (e) { }
                return 'Bạn';
            })();

            const title = `Yêu cầu bảo hành "${warrantyCode || vin}" đã được tạo`;
            const meta = `${creator} • ${new Date().toLocaleString()}`;

            try {
                if (window.addNotification) {
                    window.addNotification({ title: title, meta: meta, body: description || '', unread: true, creator: creator });
                }
            } catch (e) { console.warn('Could not create notification', e); }

            anModal();
        });
    }

    window.addEventListener('click', function (event) {
        if (modal && modal.style.display === 'block' && event.target === modal) anModal();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWarrantyModal);
} else {
    initWarrantyModal();
}