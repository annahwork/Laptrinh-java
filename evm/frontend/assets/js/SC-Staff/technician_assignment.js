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

    const btnNewRequest = document.getElementById('btntechnician_assignment');
    const assignForm = document.getElementById('assignForm');
    const techSelect = document.getElementById('techSelect');
    const assignNote = document.getElementById('assignNote');

    if (btnNewRequest) {
        btnNewRequest.addEventListener('click', () => {
            if (assignModal) {
                assignModal.classList.remove('modal-hidden');
                assignModal.style.display = 'flex';
                document.body.classList.add('modal-open');
                document.getElementById('assignClaimCode').innerText = 'Mới';
                assignForm.reset();
            }
        });
    }

    if (assignForm) {
        assignForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const technician = techSelect.value;
            const note = assignNote.value.trim();

            if (!technician) {
                alert('Vui lòng chọn kỹ thuật viên.');
                return;
            }
            console.log('Tạo yêu cầu mới:', {
                technician,
                note
            });
            alert('Yêu cầu đã được lưu thành công!');
            assignForm.reset();
            closeAssignModal();
        });
    }

});
