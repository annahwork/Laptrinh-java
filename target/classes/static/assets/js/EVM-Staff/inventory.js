(function () {
    'use strict'; 

    function initInventory() {
        const btnMo = document.getElementById('btnMoFormInventory');
        const modal = document.getElementById('modalCreate');
        const btnClose = modal ? modal.querySelector('.modal-panel__close') : null;
        
        const form = document.getElementById('modalInventoryForm') || (modal ? modal.querySelector('.modal-panel__form') : null);
        
        const btnCancel = modal ? modal.querySelector('.modalCancel, .modal-panel__cancel, .modalCancelBtn') : null; 
        const btnSubmit = modal ? modal.querySelector('.modalSubmit') : null; 

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

        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const data = {
                    partCode: document.getElementById('partCode')?.value || '',
                    partName: document.getElementById('partName')?.value || '',
                    partQuantity: parseInt(document.getElementById('quantity')?.value) || 0,  
                    partUnit: document.getElementById('unit')?.value || '',
                };
                
                const contextPath = window.contextPath || '/evm';
                const apiUrl = `${contextPath}/api/inventory/add`; 

                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(errData => {
                           throw new Error(errData.message || `Lỗi HTTP: ${res.status}`);
                        });
                    }
                    return res.json();
                })
                .then(responseData => {
                    alert(`Đã thêm ${data.partQuantity} ${data.partUnit} ${data.partName} vào kho thành công!`);
                    closeModal();
                })
                .catch(error => {
                    console.error('Lỗi khi gửi form kho:', error);
                    alert(`Lỗi khi thêm vào kho: ${error.message}`);
                });
            });
        } else {
            console.error('Không tìm thấy form (id="modalInventoryForm").');
        }
    }

    initInventory();

    const contextPath = '/evm'; 
    console.log('Các script đang load:', Array.from(document.querySelectorAll('script[src]')).map(s => s.src));
    
    fetch(`${contextPath}/assets/js/EVM-Staff/inventory.js`)
        .then(r => console.log('Fetch status:', r.status))
        .catch(err => console.error('Fetch error:', err));
})();