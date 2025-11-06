(function () {
    const btnMo = document.getElementById('btnMoFormAttachSerial');
    const modal = document.getElementById('modalCreate');
    const btnClose = modal.querySelector('.modal-panel__close');
    const btnCancel = modal.querySelector('.modalCancel');
    const form = document.getElementById('modalForm');
    const tableBody = document.getElementById('partsTableBody');

    let parts = [];

    function renderTable() {
        if (!parts.length) {
            tableBody.innerHTML = `<tr><td colspan="5" class="no-data">Chưa có dữ liệu</td></tr>`;
            return;
        }
        tableBody.innerHTML = parts.map(p => `
            <tr>
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>${p.serial}</td>
                <td>${p.date}</td>
                <td>${p.attachedBy}</td>
            </tr>
        `).join('');
    }

    btnMo.addEventListener('click', () => {
        modal.setAttribute('aria-hidden', 'false');
    });

    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        form.reset();
    }

    btnClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);

    form.addEventListener('submit', e => {
        e.preventDefault();
        const part = {
            code: form.partCode.value,
            name: form.nameParts.value,
            serial: form.serialNumber.value,
            date: form.dateAttach.value,
            attachedBy: form.attachedBy.value
        };
        parts.push(part);
        renderTable();
        closeModal();
    });

    renderTable();
})();