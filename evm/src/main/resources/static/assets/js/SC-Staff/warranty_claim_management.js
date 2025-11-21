(function () {
    'use strict';

    const API_BASE_URL = "/evm/api/warranty-claims";

    const CURRENT_SC_STAFF_ID = 2;      // id SC-Staff hiện tại (tạm)
    const DEFAULT_PART_ID = 1;          // id phụ tùng mặc định (tạm)
    const DEFAULT_ATTACHMENT_URL = "";  // tạm không upload file

    // ========== STATE ==========
    let claimsCache = [];
    let currentPage = 1;
    const PAGE_SIZE = 5;
    let currentSearchTerm = '';
    let currentStatusFilter = '';
    let currentDateFilter = '';

    let currentEditingId = null; // sau này muốn sửa claim thì xài

    // ========== UTIL ==========
    function debounce(fn, wait = 300) {
        let t;
        return function (...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"'`=\/]/g, function (c) {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
            })[c];
        });
    }

    function mapStatus(status) {
        if (!status) return 'N/A';
        const s = status.toLowerCase();
        switch (s) {
            case 'pending': return 'Chờ xử lý';
            case 'approved': return 'Đã duyệt';
            case 'assigned': return 'Đã xác nhận';
            case 'completed': return 'Đã hoàn thành';
            default: return status;
        }
    }

    // "dd/MM/yyyy" -> Date
    function parseDateFromDdmmyyyy(str) {
        if (!str) return null;
        const parts = str.split('/');
        if (parts.length !== 3) return null;
        const [d, m, y] = parts.map(Number);
        if (!d || !m || !y) return null;
        return new Date(y, m - 1, d);
    }

    // "yyyy-MM-dd" -> Date
    function parseDateFromInput(str) {
        if (!str) return null;
        const parts = str.split('-');
        if (parts.length !== 3) return null;
        const [y, m, d] = parts.map(Number);
        if (!d || !m || !y) return null;
        return new Date(y, m - 1, d);
    }

    function isSameDate(d1, d2) {
        if (!d1 || !d2) return false;
        return d1.getFullYear() === d2.getFullYear()
            && d1.getMonth() === d2.getMonth()
            && d1.getDate() === d2.getDate();
    }

    // ========== API: LOAD LIST ==========
    async function loadClaims() {
        const tbody = document.getElementById('claimsTbody');
        if (tbody) {
            tbody.innerHTML = `
        <tr>
          <td colspan="6" class="table-placeholder-cell">
            Đang tải dữ liệu...
          </td>
        </tr>`;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/all`);
            if (!res.ok) throw new Error(`Server trả về ${res.status}`);

            const claims = await res.json();
            claimsCache = Array.isArray(claims) ? claims : [];
            currentPage = 1;
            renderClaims();
        } catch (err) {
            console.error('Lỗi khi load warranty claims:', err);
            if (tbody) {
                tbody.innerHTML = `
          <tr>
            <td colspan="6" class="table-placeholder-cell">
              Lỗi tải dữ liệu: ${escapeHtml(err.message)}
            </td>
          </tr>`;
            }
            const infoEl = document.querySelector('.pagination-info');
            if (infoEl) infoEl.textContent = 'Lỗi tải dữ liệu';
        }
    }

    // ========== RENDER + PHÂN TRANG ==========
    function renderClaims() {
        console.log('renderClaims pagination', { currentPage, PAGE_SIZE, cacheLen: claimsCache.length });

        const tbody = document.getElementById('claimsTbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        let list = Array.isArray(claimsCache) ? claimsCache.slice() : [];

        // search: mã yêu cầu, VIN, mô tả
        const term = String(currentSearchTerm || '').trim().toLowerCase();
        if (term) {
            list = list.filter(c => {
                const idStr = String(c.claimId ?? '').toLowerCase();
                const vin = String(c.vin ?? '').toLowerCase();
                const desc = String(c.description ?? '').toLowerCase();
                return idStr.includes(term) || vin.includes(term) || desc.includes(term);
            });
        }

        // filter status
        if (currentStatusFilter) {
            const st = currentStatusFilter.toLowerCase();
            list = list.filter(c => String(c.status ?? '').toLowerCase() === st);
        }

        // filter ngày
        if (currentDateFilter) {
            const filterDate = parseDateFromInput(currentDateFilter);
            if (filterDate) {
                list = list.filter(c => {
                    const claimDate = parseDateFromDdmmyyyy(c.date);
                    return isSameDate(claimDate, filterDate);
                });
            }
        }

        const total = list.length;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const pageItems = list.slice(startIndex, endIndex);

        // info
        const infoEl = document.querySelector('.pagination-info');
        if (infoEl) {
            infoEl.textContent = `Hiển thị ${pageItems.length} của ${total} yêu cầu`;
        }

        // pagination buttons: « Trước | 1 | Sau »
        const paginationWrapper = document.querySelector('.pagination-wrapper');
        let prevBtn = null, pageBtn = null, nextBtn = null;
        if (paginationWrapper) {
            const btns = paginationWrapper.querySelectorAll('button');
            if (btns.length >= 3) {
                prevBtn = btns[0];
                pageBtn = btns[1];
                nextBtn = btns[2];
            }
        }

        if (pageBtn) {
            pageBtn.textContent = String(currentPage);
        }
        if (prevBtn) prevBtn.disabled = currentPage <= 1;
        if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

        if (!pageItems.length) {
            tbody.innerHTML = `
        <tr>
          <td colspan="6" class="table-placeholder-cell">
            Không có yêu cầu bảo hành nào.
          </td>
        </tr>`;
            return;
        }

        const rows = pageItems.map(c => {
            const id = c.claimId ?? '';
            const vin = c.vin ?? 'N/A';
            const desc = c.description ?? '';
            const date = c.date ?? 'N/A';
            const status = c.status ?? 'N/A';

            return `
        <tr data-id="${id}">
          <td>${escapeHtml(String(id))}</td>
          <td>${escapeHtml(vin)}</td>
          <td>${escapeHtml(desc)}</td>
          <td>${escapeHtml(date)}</td>
          <td>${escapeHtml(mapStatus(status))}</td>
          <td>
            <button class="btn-action btn-view" data-id="${id}">Xem</button>
            <button class="btn-action btn-edit" data-id="${id}">Sửa</button>
            <button class="btn-action btn-delete" data-id="${id}">Xóa</button>
          </td>
        </tr>
      `;
        }).join('');

        tbody.innerHTML = rows;
    }

    // ========== PAGINATION BUTTONS ==========
    function initClaimPagination() {
        const paginationWrapper = document.querySelector('.pagination-wrapper');
        if (!paginationWrapper) return;

        const btns = paginationWrapper.querySelectorAll('button');
        if (btns.length < 3) return;

        const prevBtn = btns[0];
        const pageBtn = btns[1];
        const nextBtn = btns[2];

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                if (currentPage > 1) {
                    currentPage--;
                    renderClaims();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                currentPage++;
                renderClaims();
            });
        }

        // hiện tại click số trang cho về trang 1
        if (pageBtn) {
            pageBtn.addEventListener('click', function () {
                currentPage = 1;
                renderClaims();
            });
        }
    }

    // ========== SEARCH + FILTER ==========
    function initClaimSearchAndFilter() {
        const searchInput = document.getElementById('searchBox');
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('dateFilter');

        if (searchInput) {
            const handler = debounce(function (ev) {
                currentSearchTerm = ev.target.value;
                currentPage = 1;
                renderClaims();
            }, 250);
            searchInput.addEventListener('input', handler);
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', function (ev) {
                currentStatusFilter = ev.target.value || '';
                currentPage = 1;
                renderClaims();
            });
        }

        if (dateFilter) {
            dateFilter.addEventListener('change', function (ev) {
                currentDateFilter = ev.target.value || '';
                currentPage = 1;
                renderClaims();
            });
        }
    }

    // ========== MODAL TẠO YÊU CẦU ==========
    function initClaimModal() {
        const btnOpen = document.getElementById('btnMoFormYeuCau');
        const modal = document.getElementById('modalYeuCauBaoHanh');
        const closeBtn = modal ? modal.querySelector('.warranty-claim__close-button') : null;
        const cancelBtn = document.getElementById('warrantyCancelBtn');
        const form = modal ? modal.querySelector('.warranty-claim__form') : null;

        function resetForm() {
            if (!form) return;
            form.reset();
            currentEditingId = null;
            const codeInput = document.getElementById('warranty_code');
            if (codeInput) codeInput.readOnly = false;
        }

        function openModalForCreate() {
            if (!modal) return;
            resetForm();
            const titleEl = modal.querySelector('.warranty-claim__modal-title');
            if (titleEl) titleEl.textContent = 'Tạo yêu cầu bảo hành mới';
            modal.style.display = 'block';
        }

        function closeModal() {
            if (!modal) return;
            modal.style.display = 'none';
            resetForm();
        }

        if (btnOpen) {
            btnOpen.addEventListener('click', openModalForCreate);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }

        window.addEventListener('click', function (e) {
            if (modal && e.target === modal) {
                closeModal();
            }
        });

        if (form) {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const vinInput = document.getElementById('warranty_vin');
                const descInput = document.getElementById('warranty_desc');
                const statusInput = document.getElementById('warranty_status');

                const vin = vinInput?.value?.trim() || '';
                const description = descInput?.value?.trim() || '';
                const status = statusInput?.value || 'pending';

                if (!vin) {
                    alert('Vui lòng nhập Biển số / VIN');
                    return;
                }
                if (!description) {
                    alert('Vui lòng nhập mô tả vấn đề');
                    return;
                }

                const payload = {
                    scStaffId: CURRENT_SC_STAFF_ID,
                    vehiclePartId: DEFAULT_PART_ID,
                    vin: vin,
                    description: description,
                    status: status,
                    attachmentUrl: DEFAULT_ATTACHMENT_URL
                };

                try {
                    const res = await fetch(`${API_BASE_URL}/create`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!res.ok) {
                        const text = await res.text().catch(() => '');
                        throw new Error(text || `Server trả về ${res.status}`);
                    }

                    alert('Tạo yêu cầu bảo hành thành công!');
                    closeModal();
                    await loadClaims();
                } catch (err) {
                    console.error('Lỗi tạo yêu cầu bảo hành:', err);
                    alert('Lỗi khi tạo yêu cầu bảo hành: ' + err.message);
                }
            });
        }
    }

    // ========== ACTION BUTTONS TRONG BẢNG ==========
    function initClaimTableActions() {
        const tbody = document.getElementById('claimsTbody');
        if (!tbody) return;

        tbody.addEventListener('click', async function (e) {
            const viewBtn = e.target.closest('.btn-claim-view');
            const editBtn = e.target.closest('.btn-claim-edit');
            const delBtn = e.target.closest('.btn-claim-delete');

            if (viewBtn) {
                const id = viewBtn.dataset.id;
                if (!id) return;
                console.log('Xem chi tiết claim', id);
                // TODO: sau này m gọi GET /api/warranty-claims/getbyID/{id} rồi hiện modal
                return;
            }

            if (editBtn) {
                const id = editBtn.dataset.id;
                if (!id) return;
                console.log('Sửa claim', id);
                // TODO: sau này m fetch chi tiết, fill form, rồi gọi PUT /update/{id}
                return;
            }

            if (delBtn) {
                const id = delBtn.dataset.id;
                if (!id) return;
                if (!confirm('Bạn có chắc muốn xóa yêu cầu bảo hành này?')) return;

                try {
                    const res = await fetch(`${API_BASE_URL}/delete/${id}`, {
                        method: 'DELETE'
                    });
                    if (!res.ok) {
                        const text = await res.text().catch(() => '');
                        throw new Error(text || `Server trả về ${res.status}`);
                    }
                    alert('Xóa yêu cầu thành công!');
                    await loadClaims();
                } catch (err) {
                    alert('Lỗi khi xóa yêu cầu: ' + err.message);
                }
            }
        });
    }

    // ========== BOOTSTRAP ==========
    function init() {
        initClaimPagination();
        initClaimSearchAndFilter();
        initClaimModal();
        initClaimTableActions();
        loadClaims();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
