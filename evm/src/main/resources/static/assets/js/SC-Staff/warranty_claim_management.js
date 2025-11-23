(function () {
    'use strict';

    // 💡 Hàm tra cứu dịch thuật (giả định)
    const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

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

    let currentEditingId = null;

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
        // 💡 Dịch các trạng thái hiển thị
        if (!status) return T('general.na', 'N/A');
        const s = status.toLowerCase();
        switch (s) {
            case 'pending': return T('claim.status.pending_display', 'Chờ xử lý');
            case 'approved': return T('claim.status.approved_display', 'Đã duyệt');
            case 'assigned': return T('claim.status.assigned_display', 'Đã xác nhận');
            case 'completed': return T('claim.status.completed_display', 'Đã hoàn thành');
            default: return status;
        }
    }

    // (Giữ nguyên các hàm xử lý date)
    function parseDateFromDdmmyyyy(str) { /* ... */ }
    function parseDateFromInput(str) { /* ... */ }
    function isSameDate(d1, d2) { /* ... */ }

    // ========== API: LOAD LIST ==========
    async function loadClaims() {
        const tbody = document.getElementById('claimsTbody');
        if (tbody) {
            // 💡 Dịch: Đang tải dữ liệu...
            tbody.innerHTML = `
        <tr>
          <td colspan="6" class="table-placeholder-cell">
            ${T('message.loading_data', 'Đang tải dữ liệu...')}
          </td>
        </tr>`;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/all`);
            // 💡 Dịch: Lỗi server trả về
            if (!res.ok) throw new Error(T('claim.error.server_default', `Server trả về ${res.status}`));

            const claims = await res.json();
            claimsCache = Array.isArray(claims) ? claims : [];
            currentPage = 1;
            renderClaims();
        } catch (err) {
            console.error('Lỗi khi load warranty claims:', err);
            if (tbody) {
                // 💡 Dịch: Lỗi tải dữ liệu
                tbody.innerHTML = `
          <tr>
            <td colspan="6" class="table-placeholder-cell">
              ${T('error.load_data', 'Lỗi tải dữ liệu')}: ${escapeHtml(err.message)}
            </td>
          </tr>`;
            }
            const infoEl = document.querySelector('.pagination-info');
            if (infoEl) infoEl.textContent = T('error.load_data', 'Lỗi tải dữ liệu');
        }
    }

    // ========== RENDER + PHÂN TRANG ==========
    function renderClaims() {
        const tbody = document.getElementById('claimsTbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        let list = Array.isArray(claimsCache) ? claimsCache.slice() : [];

        // --- filter logic (Giữ nguyên) ---

        const term = String(currentSearchTerm || '').trim().toLowerCase();
        if (term) { /* ... */ }
        if (currentStatusFilter) { /* ... */ }
        if (currentDateFilter) { /* ... */ }

        // --- end filter logic ---

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
            // 💡 Dịch: Hiển thị X của Y yêu cầu
            infoEl.textContent = T('claim.pagination.info', `Hiển thị %s của %s yêu cầu`)
                                    .replace('%s', pageItems.length)
                                    .replace('%s', total);
        }

        // pagination buttons (Giữ nguyên logic)
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
            // 💡 Dịch: Không có yêu cầu bảo hành nào.
            tbody.innerHTML = `
        <tr>
          <td colspan="6" class="table-placeholder-cell">
            ${T('claim.table.no_data', 'Không có yêu cầu bảo hành nào.')}
          </td>
        </tr>`;
            return;
        }

        // 💡 Dịch: Nhãn nút
        const viewBtnText = T('button.view_details', 'Xem');
        const editBtnText = T('button.edit', 'Sửa');
        const deleteBtnText = T('button.delete', 'Xóa');


        const rows = pageItems.map(c => {
            const id = c.claimId ?? '';
            const vin = c.vin ?? T('general.na', 'N/A');
            const desc = c.description ?? '';
            const date = c.date ?? T('general.na', 'N/A');
            const status = c.status ?? T('general.na', 'N/A');

            return `
        <tr data-id="${id}">
          <td>${escapeHtml(String(id))}</td>
          <td>${escapeHtml(vin)}</td>
          <td>${escapeHtml(desc)}</td>
          <td>${escapeHtml(date)}</td>
          <td>${escapeHtml(mapStatus(status))}</td>
          <td>
            <button class="btn-action btn-view btn-claim-view" data-id="${id}">${viewBtnText}</button>
            <button class="btn-action btn-edit btn-claim-edit" data-id="${id}">${editBtnText}</button>
            <button class="btn-action btn-delete btn-claim-delete" data-id="${id}">${deleteBtnText}</button>
          </td>
        </tr>
      `;
        }).join('');

        tbody.innerHTML = rows;
    }

    // (Giữ nguyên các hàm init ClaimPagination, ClaimSearchAndFilter, initClaimTableActions)

    // ========== MODAL TẠO YÊU CẦU ==========
    function initClaimModal() {
        const btnOpen = document.getElementById('btnMoFormYeuCau');
        const modal = document.getElementById('modalYeuCauBaoHanh');
        const closeBtn = modal ? modal.querySelector('.close-button') : null;
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
            // 💡 Dịch: Tiêu đề modal
            const titleEl = modal.querySelector('.warranty-claim__modal-title');
            if (titleEl) titleEl.textContent = T('claim.modal.title_create', 'Tạo yêu cầu bảo hành mới');

            modal.style.display = 'block';
        }

        function closeModal() { /* ... */ }

        if (btnOpen) {
            btnOpen.addEventListener('click', openModalForCreate);
        }
        // ... (Giữ nguyên các event listeners cho modal)

        if (form) {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const vinInput = document.getElementById('warranty_vin');
                const descInput = document.getElementById('warranty_desc');
                const statusInput = document.getElementById('warranty_status');

                const vin = vinInput?.value?.trim() || '';
                const description = descInput?.value?.trim() || '';
                const status = statusInput?.value || 'pending';

                // 💡 Dịch: Validation
                if (!vin) {
                    alert(T('claim.alert.vin_required', 'Vui lòng nhập Biển số / VIN'));
                    return;
                }
                if (!description) {
                    alert(T('claim.alert.desc_required', 'Vui lòng nhập mô tả vấn đề'));
                    return;
                }

                const payload = { /* ... */ };

                try {
                    // 💡 Dịch: Nhãn nút đang xử lý
                    e.target.querySelector('#warrantySubmitBtn').textContent = T('form.processing', 'Đang xử lý...');

                    const res = await fetch(`${API_BASE_URL}/create`, { /* ... */ });

                    // 💡 Dịch: Lỗi tạo yêu cầu
                    if (!res.ok) {
                        const text = await res.text().catch(() => '');
                        throw new Error(text || T('claim.error.create_fail', `Server trả về ${res.status}`));
                    }

                    // 💡 Dịch: Thành công
                    alert(T('claim.alert.create_success', 'Tạo yêu cầu bảo hành thành công!'));
                    closeModal();
                    await loadClaims();
                } catch (err) {
                    console.error('Lỗi tạo yêu cầu bảo hành:', err);
                    alert(`${T('general.error', 'Lỗi')}: ${err.message}`);
                } finally {
                    e.target.querySelector('#warrantySubmitBtn').textContent = T('button.create', 'Tạo');
                }
            });
        }
    }

})();