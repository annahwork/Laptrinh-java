(function () {
    function initCampaignModal() {
        const btnOpen = document.getElementById('btnMoFormCampaign');
        const modal = document.getElementById('modalQuanLyChienDich');
        const btnClose = modal ? modal.querySelector('.campaign__close-button') : null;
        const btnCancel = document.getElementById('campaignCancelBtn');
        const form = modal ? modal.querySelector('.campaign__form') : null;



        function openModal() { if (modal) modal.style.display = 'block'; }
        function closeModal() { if (modal) { modal.style.display = 'none'; if (form) form.reset(); } }

        if (btnOpen) btnOpen.addEventListener('click', function () { openModal(); });
        if (btnClose) btnClose.addEventListener('click', closeModal);
        if (btnCancel) btnCancel.addEventListener('click', closeModal);

        if (form) form.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = {
                code: document.getElementById('campaign_code')?.value || '',
                name: document.getElementById('campaign_name')?.value || '',
                start: document.getElementById('campaign_start')?.value || '',
                end: document.getElementById('campaign_end')?.value || '',
                status: document.getElementById('campaign_status')?.value || '',
                desc: document.getElementById('campaign_desc')?.value || ''
            };

            try {
                const creator = (function () {
                    try {
                        const sel = document.querySelector('#userName, .user-name, .profile-name, .sidebar .name, .account-name');
                        if (sel && sel.textContent && sel.textContent.trim()) return sel.textContent.trim();
                    } catch (e) { }
                    return 'Bạn';
                })();
                const title = `Chiến dịch "${data.name || data.code}" đã được tạo`;
                const meta = `${creator} • ${new Date().toLocaleString()}`;
                if (window.addNotification) {
                    window.addNotification({ title: title, meta: meta, body: data.desc || '', unread: true, creator: creator });
                }
            } catch (e) { console.warn('Could not create notification', e); }

            closeModal();
        });

        window.addEventListener('click', function (e) { if (modal && modal.style.display === 'block' && e.target == modal) closeModal(); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCampaignModal); else initCampaignModal();
})();