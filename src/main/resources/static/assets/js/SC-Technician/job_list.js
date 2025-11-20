(function () {
    'use strict';

    console.log('job_list.js loaded');

    const API_GET_JOBS_LIST = '/evm/api/claimServiceDetails'; 
    
    const API_CREATE_JOB = '/evm/api/warranty-claims'; 

    let allJobs = [];
    let currentFilteredJobs = []; 

    const modal = document.getElementById('formModal');
    const form = document.getElementById('createWarrantyForm');
    const jobGrid = document.getElementById('jobGrid');
    
    const btnOpen = document.getElementById('btnOpenForm');
    const btnClose = document.getElementById('btnCloseForm');
    const btnCancel = document.getElementById('btnCancelForm');
    const submitButton = form?.querySelector('button[type="submit"]');

    const searchInput = document.getElementById('jobSearchInput');
    const statusFilter = document.getElementById('jobStatusFilter');

    function openModal() {
        if (!modal) return;
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        const first = form?.querySelector('input, select, textarea');
        if (first) first.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (form) form.reset(); 
    }

    function formatStatus(status) {
        const lowerStatus = status?.toLowerCase() || '';
        
        if (lowerStatus.includes('hoàn tất')) {
            return { text: 'Hoàn tất', class: 'done' };
        }
        
        if (lowerStatus.includes('đang thực hiện') || lowerStatus.includes('đang xử lý')) {
            return { text: 'Đang thực hiện', class: 'inprogress' };
        }
        
        if (lowerStatus.includes('chờ duyệt')) {
            return { text: 'Chờ duyệt', class: 'waiting' };
        }
        
        return { text: status || 'Không rõ', class: 'default' };
    }

    function renderJobs(jobs) {
        if (!jobGrid) return;
        jobGrid.innerHTML = ''; 

        if (!jobs || jobs.length === 0) {
            jobGrid.innerHTML = `
                <div class="no-data" style="text-align:center; width:100%; padding:2rem;">
                    <p>Không có yêu cầu bảo hành nào.</p>
                </div>`;
            return;
        }

        jobs.forEach(job => {
            const statusInfo = formatStatus(job.result); 
            const card = document.createElement('div');
            card.className = 'data-card';
            
            card.innerHTML = `
                <div class="card-header">
                    <h3>ID: <span>${job.claimServID || 'N/A'}</span></h3>
                    <span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>
                </div>
                <div class="card-body">
                    <p><strong>VIN:</strong> ${job.vin || 'N/A'}</p>
                    <p><strong>Khách hàng:</strong> ${job.customerName || 'N/A'}</p>
                    <p><strong>Ghi chú:</strong> ${job.note || 'Không có ghi chú'}</p>
                </div>
            `;
            
            jobGrid.appendChild(card);
        });
    }

    async function fetchAllJobs() {
        if (jobGrid)
            jobGrid.innerHTML = `<div class="loading-data" style="text-align:center; width:100%; padding:2rem;">Đang tải dữ liệu...</div>`;

        try {
            const res = await fetch(API_GET_JOBS_LIST);
            
            if (!res.ok) {
                 if (res.status === 401) {
                     throw new Error('Không có quyền truy cập. Vui lòng đăng nhập.');
                 }
                 throw new Error(`HTTP error! Status: ${res.status}`);
            }
            
            const data = await res.json(); 
            
            allJobs = data.map(row => ({
                claimServID: row[0],
                vin: row[1],
                customerName: row[2],
                result: row[3], 
                note: row[4]    
            }));

            currentFilteredJobs = [...allJobs];
            renderJobs(currentFilteredJobs);
        } catch (err) {
            console.error('Fetch error:', err);
            if (jobGrid)
                jobGrid.innerHTML = `<div class="error-data" style="text-align:center; width:100%; padding:2rem;">Lỗi: Không thể tải dữ liệu. ${err.message}</div>`;
        }
    }


    function filterJobs() {
        const searchValue = searchInput?.value.trim().toLowerCase() || '';
        const statusValue = statusFilter?.value || '';

        currentFilteredJobs = allJobs.filter(job => {
            const matchesSearch = searchValue ? (job.vin?.toLowerCase().includes(searchValue) || job.claimServID?.toString().toLowerCase().includes(searchValue)) : true;
            
            const matchesStatus = statusValue ? (job.result === statusValue)  : true;
                
            return matchesSearch && matchesStatus;
        });

        renderJobs(currentFilteredJobs);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const vin = form.querySelector('#vin')?.value?.trim();
        const customer = form.querySelector('#customerName')?.value?.trim();
        const receiveDate = form.querySelector('#receiveDate')?.value;

        if (!vin || !customer || !receiveDate) {
            alert('Vui lòng điền VIN, Tên khách hàng và Ngày tiếp nhận.');
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Đang gửi...';
        }

        const payload = new FormData(form);

        console.warn(`ĐANG GỬI TỚI ENDPOINT (VÍ DỤ): ${API_CREATE_JOB}. Bạn cần tạo endpoint này trong Controller.`);
        
        try {
            const res = await fetch(API_CREATE_JOB, {
                method: 'POST',
                body: payload
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Lỗi ${res.status}`);
            }

            alert('Yêu cầu đã được tạo thành công!');
            closeModal();
            await fetchAllJobs(); 

        } catch (err) {
            console.error('Submit error:', err);
            alert(`Lỗi: Không thể tạo yêu cầu.\n${err.message}`);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Gửi yêu cầu';
            }
        }
    }

    function init() {
        fetchAllJobs();

        if (btnOpen) btnOpen.addEventListener('click', openModal);
        if (btnClose) btnClose.addEventListener('click', closeModal);
        if (btnCancel) btnCancel.addEventListener('click', closeModal);
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        if (searchInput) {
            searchInput.addEventListener('input', filterJobs);
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', filterJobs);
        }

        console.log('job_list modal and filters initialized');
    }

    init();
})();