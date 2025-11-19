// ===== SIDEBAR RESIZE =====
document.addEventListener('DOMContentLoaded', function () {

    const sidebar = document.getElementById('sidebar');
    const contentWrapper = document.getElementById('innerContent');
    const resizer = document.getElementById('sidebarResizer');
    if (sidebar && resizer && contentWrapper) {
        let isResizing = false, startX = 0, startWidth = 0;
        const minWidth = 200, maxWidth = 400;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = parseInt(window.getComputedStyle(sidebar).width, 10);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const w = startWidth + e.clientX - startX;
            if (w >= minWidth && w <= maxWidth) {
                sidebar.style.width = w + 'px';
                contentWrapper.style.marginLeft = w + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }


    const searchBox = document.getElementById('searchBox');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const tbody = document.getElementById('claimsTbody');

    function filterTable() {
        const search = searchBox.value.toLowerCase();
        const status = statusFilter.value;
        const date = dateFilter.value;

        [...tbody.querySelectorAll('tr')].forEach(row => {
            if (row.id === 'placeholderRow') return;
            const text = row.innerText.toLowerCase();
            const matchesSearch = text.includes(search);
            const matchesStatus = !status || row.dataset.status === status;
            const matchesDate = !date || row.dataset.date === date;
            row.style.display = (matchesSearch && matchesStatus && matchesDate) ? '' : 'none';
        });
    }

    if (searchBox) searchBox.addEventListener('input', filterTable);
    if (statusFilter) statusFilter.addEventListener('change', filterTable);
    if (dateFilter) dateFilter.addEventListener('change', filterTable);


    const assignModal = document.getElementById('assignModal');
    const assignModalClose = document.getElementById('assignModalClose');
    const assignCancelBtn = document.getElementById('assignCancelBtn');

    window.openAssignModal = function (id, code) {
        if (assignModal) {
            assignModal.classList.remove('modal-hidden');
            assignModal.style.display = 'flex';
            document.body.classList.add('modal-open');
            document.getElementById('assignClaimCode').innerText = code;
        }
    };

    function closeAssignModal() {
        if (assignModal) {
            assignModal.classList.add('modal-hidden');
            assignModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    if (assignModalClose) assignModalClose.addEventListener('click', closeAssignModal);
    if (assignCancelBtn) assignCancelBtn.addEventListener('click', e => {
        e.preventDefault();
        closeAssignModal();
    });

    window.addEventListener('click', e => {
        if (e.target === assignModal) closeAssignModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeAssignModal();
    });

}); // Kết thúc DOMContentLoaded cho phần sidebar và assign modal

// ===== MODAL TẠO YÊU CẦU MỚI (modalYeuCauDieuPhoi) =====
// Phần này KHÔNG wrap trong DOMContentLoaded vì trang load động
(function () {
    console.log('[MODAL] Script loaded!');

    function initNewRequestModal() {
        console.log('[MODAL] Init function called');
        console.log('[MODAL] Document ready state:', document.readyState);

        const btnOpenModal = document.getElementById('btntechnician_assignment');
        const modal = document.getElementById('modalYeuCauDieuPhoi');

        console.log('[MODAL] Button found:', !!btnOpenModal);
        console.log('[MODAL] Modal found:', !!modal);

        if (!btnOpenModal) {
            console.error('[MODAL] Button with id=btntechnician_assignment NOT FOUND!');
            console.log('[MODAL] Available buttons:', document.querySelectorAll('button'));
            return;
        }

        if (!modal) {
            console.error('[MODAL] Modal with id=modalYeuCauDieuPhoi NOT FOUND!');
            return;
        }

        const closeBtn = modal.querySelector('.technician-assign__close-button');
        const cancelBtn = document.getElementById('assignCancelBtnModal');
        const form = modal.querySelector('.technician-assign__form');

        console.log('[MODAL] Setting up click event listener on button');

        // Xóa event listeners cũ nếu có (tránh trùng lặp)
        const newBtn = btnOpenModal.cloneNode(true);
        btnOpenModal.parentNode.replaceChild(newBtn, btnOpenModal);

        // Thêm event listener mới
        newBtn.addEventListener('click', (e) => {
            console.log('[MODAL] *** BUTTON CLICKED ***');
            console.log('[MODAL] Modal display before:', modal.style.display);
            modal.style.display = 'block';
            console.log('[MODAL] Modal display after:', modal.style.display);
            console.log('[MODAL] Modal element:', modal);
        });

        // Đóng modal
        function closeModal() {
            if (modal) {
                modal.style.display = 'none';
            }
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }

        // Click outside modal để đóng
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Submit form
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const formData = {
                    code: document.getElementById('assign_code')?.value,
                    vin: document.getElementById('vehicle_vin')?.value,
                    date: document.getElementById('assign_date')?.value,
                    technician: document.getElementById('technician_name')?.value,
                    location: document.getElementById('assign_location')?.value,
                    description: document.getElementById('assign_desc')?.value,
                    status: document.getElementById('assign_status')?.value
                };

                console.log('Tạo yêu cầu điều phối:', formData);

                // TODO: Gửi data lên server

                alert('Yêu cầu đã được tạo thành công!');
                form.reset();
                closeModal();
            });
        }
    }

    // Khởi tạo modal - đợi lâu hơn cho trang load động
    console.log('[MODAL] Scheduling init...');
    if (document.readyState === 'loading') {
        console.log('[MODAL] DOM is loading, adding DOMContentLoaded listener');
        document.addEventListener('DOMContentLoaded', initNewRequestModal);
    } else {
        console.log('[MODAL] DOM already loaded, using setTimeout');
        // Đợi 500ms để đảm bảo HTML đã được inject vào DOM
        setTimeout(() => {
            console.log('[MODAL] Timeout fired, calling init');
            initNewRequestModal();
        }, 500);
    }

})(); // Kết thúc IIFE cho modal