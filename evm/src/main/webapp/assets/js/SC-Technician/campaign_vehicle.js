    (function () {
    function initVehicleModal() {
        const btnOpen = document.getElementById('btnOpenVehicleForm');
        const modal = document.getElementById('modalAddVehicle');
        const btnClose = modal ? modal.querySelector('.campaign__close-button') : null;
        const btnCancel = document.getElementById('vehicleCancelBtn');
        const form = modal ? modal.querySelector('.campaign__form') : null;

        function openModal() {
        if (modal) modal.style.display = 'flex';
        }

        function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            if (form) form.reset();
        }
        }

        if (btnOpen) btnOpen.addEventListener('click', openModal);
        if (btnClose) btnClose.addEventListener('click', closeModal);
        if (btnCancel) btnCancel.addEventListener('click', closeModal);

        window.addEventListener('click', function (e) {
        if (modal && modal.style.display === 'flex' && e.target === modal) closeModal();
        });

        if (form) form.addEventListener('submit', function (e) {
        e.preventDefault();

        const data = {
            vin: document.getElementById('vehicle_vin')?.value.trim() || '',
            customer: document.getElementById('vehicle_customer')?.value.trim() || '',
            campaign: document.getElementById('vehicle_campaign')?.value.trim() || '',
            tech: document.getElementById('vehicle_tech')?.value.trim() || '',
            status: document.getElementById('vehicle_status')?.value || '',
            note: document.getElementById('vehicle_note')?.value.trim() || ''
        };

        const creator = (() => {
            const sel = document.querySelector('#userName, .user-name, .sidebar .name');
            if (sel && sel.textContent.trim()) return sel.textContent.trim();
            return 'Bạn';
        })();

        const title = `Xe ${data.vin || 'mới'} đã được thêm vào chiến dịch ${data.campaign}`;
        const meta = `${creator} • ${new Date().toLocaleString()}`;

        if (window.addNotification) {
            window.addNotification({
            title: title,
            meta: meta,
            body: data.note || '',
            unread: true,
            creator: creator
            });
        } else {
            alert(`✅ ${title}\n${meta}`);
        }

        closeModal();
        });
    }

    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', initVehicleModal);
    else
        initVehicleModal();
    })();
