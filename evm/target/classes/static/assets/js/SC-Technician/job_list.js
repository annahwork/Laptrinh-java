// ...existing code...
document.addEventListener('DOMContentLoaded', function () {
    console.log('job_list.js loaded');

    const btnOpen = document.getElementById('btnOpenForm');
    const modal = document.getElementById('formModal');
    const modalContent = modal?.querySelector('.modal-content');
    const btnClose = document.getElementById('btnCloseForm');
    const btnCancel = document.getElementById('btnCancelForm');
    const form = document.getElementById('createWarrantyForm');

    function openModal() {
        if (!modal) return;
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        // focus first input
        const first = form?.querySelector('input, select, textarea');
        if (first) first.focus();
    }
    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    if (btnOpen) btnOpen.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (btnClose) btnClose.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });
    if (btnCancel) btnCancel.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });

    // click outside modal-content closes modal
    window.addEventListener('click', (e) => {
        if (!modal) return;
        if (e.target === modal) closeModal();
    });

    // Esc closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            // basic validation example
            const vin = form.querySelector('#vin')?.value?.trim();
            const customer = form.querySelector('#customerName')?.value?.trim();
            const receiveDate = form.querySelector('#receiveDate')?.value;

            if (!vin || !customer || !receiveDate) {
                alert('Vui lòng điền VIN, Tên khách hàng và Ngày tiếp nhận.');
                return;
            }

            const payload = new FormData(form);
            // TODO: gửi payload lên API. Hiện demo: log và đóng modal
            console.log('Gửi yêu cầu bảo hành (demo):', Object.fromEntries(payload.entries()));

            // giả lập thành công
            closeModal();
            form.reset();
            alert('Yêu cầu được tạo (demo).');
        });
    }

    console.log('job_list modal handlers initialized', { btnOpen, modal, form });
});
// ...existing code...