(function () {
  'use strict';

  // 💡 Hàm tra cứu dịch thuật (giả định)
  const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

  console.log("SC-Staff Customer Management (view only) JS loaded");

  // ====== STATE PHÂN TRANG & CACHE ======
  let customersCache = [];      // dữ liệu khách hàng lấy từ BE
  let currentPage = 1;          // trang hiện tại
  const PAGE_SIZE = 5;          // mỗi trang hiển thị 5 khách
  let currentSearchTerm = '';   // từ khóa search hiện tại

  // 💡 Dịch: Nhãn nút Sửa/Xóa (Cần được định nghĩa trong messages)
  const EDIT_TEXT = T('button.edit', 'Sửa');
  const DELETE_TEXT = T('button.delete', 'Xóa');

  // ====== UTIL ======
  function debounce(fn, wait = 300) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function getId(c) {
    return c.customerID ?? c.id ?? '';
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

  // ====== API CALLS ======
  async function loadCustomers() {
    try {
      const res = await fetch(`/evm/api/sc-staff/dashboard/customers?page=1&pageSize=1000`);
      // 💡 Dịch: Không tải được danh sách khách hàng
      if (!res.ok) throw new Error(T('customer.error.load_list', `Server trả về ${res.status}`));

      const customers = await res.json();
      customersCache = Array.isArray(customers) ? customers : [];
      currentPage = 1;
      renderCustomers();
    } catch (err) {
      // 💡 Dịch: Lỗi tải dữ liệu
      console.error('Lỗi khi load customers:', err);
      const tbody = document.getElementById('customersTbody');
      const infoEl = document.querySelector('.pagination-info');
      const errorText = T('error.load_data', 'Lỗi tải dữ liệu');
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell">${errorText}</td></tr>`;
      }
      if (infoEl) infoEl.textContent = errorText;
    }
  }

  async function addCustomer(data) {
    const res = await fetch('/evm/api/sc-staff/dashboard/customer/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      // 💡 Dịch: Lỗi server
      throw new Error(text || T('error.server_default', `Server trả về ${res.status}`));
    }
    return true;
  }

  async function updateCustomer(id, data) {
    const res = await fetch(`/evm/api/sc-staff/dashboard/customer/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      // 💡 Dịch: Lỗi server
      throw new Error(text || T('error.server_default', `Server trả về ${res.status}`));
    }
    return true;
  }

  async function deleteCustomer(id) {
    const res = await fetch(`/evm/api/sc-staff/dashboard/customer/delete/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      // 💡 Dịch: Lỗi server
      throw new Error(text || T('error.server_default', `Server trả về ${res.status}`));
    }
    return true;
  }

  async function fetchCustomer(id) {
    const res = await fetch(`/evm/api/sc-staff/dashboard/customer/get/${id}`);
    // 💡 Dịch: Không lấy được khách hàng
    if (!res.ok) throw new Error(T('customer.error.fetch_one', `Không lấy được khách hàng (${res.status})`));
    return await res.json();
  }

  // ====== RENDER TABLE + PHÂN TRANG ======
  function renderCustomers() {
    const tbody = document.getElementById('customersTbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let list = Array.isArray(customersCache) ? customersCache.slice() : [];

    // filter theo search
    const term = String(currentSearchTerm || '').trim().toLowerCase();
    if (term) {
      list = list.filter(c => {
        const id = String(getId(c)).toLowerCase();
        const name = String(c.name ?? '').toLowerCase();
        const phone = String(c.phone ?? '').toLowerCase();
        return id.includes(term) || name.includes(term) || phone.includes(term);
      });
    }

    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageItems = list.slice(startIndex, endIndex);

    // info "Hiển thị X của Y"
    const infoEl = document.querySelector('.pagination-info');
    if (infoEl) {
        // 💡 Dịch: Hiển thị X của Y khách hàng
      infoEl.textContent = T('customer.pagination.info', `Hiển thị %s của %s khách hàng`)
                                .replace('%s', pageItems.length)
                                .replace('%s', total);
    }

    // số trang & nút trước/sau
    const pageLabel = document.getElementById('customerPageNumber');
    if (pageLabel) {
      pageLabel.textContent = currentPage.toString();
    }
    const prevBtn = document.getElementById('customerPrevBtn');
    const nextBtn = document.getElementById('customerNextBtn');
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

    if (!pageItems.length) {
        // 💡 Dịch: Không có khách hàng nào.
      tbody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell">${T('customer.table.no_data', 'Không có khách hàng nào.')}</td></tr>`;
      return;
    }

    const rows = pageItems.map(c => {
      const id = getId(c);
      const name = c.name ?? '';
      const phone = c.phone ?? '';
      const email = c.email ?? '';
      const address = c.address ?? '';
      return `
        <tr data-id="${id}">
          <td>${id}</td>
          <td>${escapeHtml(name)}</td>
          <td>${escapeHtml(phone)}</td>
          <td>${escapeHtml(email)}</td>
          <td>${escapeHtml(address)}</td>
          <td>
            <button class="btn-action btn-edit" data-id="${id}">${EDIT_TEXT}</button>
            <button class="btn-action btn-delete" data-id="${id}">${DELETE_TEXT}</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rows;
  }

  // ====== INIT MODAL, CRUD, SEARCH ======
  function initCustomerModal() {
    const btnOpen = document.getElementById('btnMoFormCustomer');
    const modal = document.getElementById('modalQuanLyCustomer');
    const tbody = document.getElementById('customersTbody');
    const searchInput = document.getElementById('searchCustomerBox');

    // 💡 Dịch: Các chuỗi trong form (được gọi từ JS)
    const alertCreateSuccess = T('customer.alert.add_success', 'Thêm khách hàng thành công!');
    const alertUpdateSuccess = T('customer.alert.update_success', 'Cập nhật khách hàng thành công!');
    const alertSaveError = T('customer.alert.save_error', 'Lỗi khi lưu khách hàng:');
    const alertDeleteConfirm = T('customer.alert.confirm_delete', 'Bạn có chắc muốn xóa khách hàng này?');
    const alertDeleteError = T('customer.alert.delete_error', 'Lỗi khi xóa khách hàng:');
    const alertLoadInfoError = T('customer.error.fetch_info', 'Lỗi khi tải thông tin khách hàng:');
    const alertLoadFormError = T('customer.alert.form_load_error', 'Form quản lý khách hàng không tìm thấy.');


    function getForm() {
      return modal ? modal.querySelector('.customer__form') : null;
    }

    function ensureFormExists() {
      const formEl = getForm();
      if (formEl) return formEl;
      if (!modal) return null;

      // Giữ nguyên logic tạo form nếu cần (tùy thuộc vào cấu trúc backend)
      return null;
    }

    function openModalForCreate() {
      if (!modal) return;
      const f = getForm(); // Dùng getForm() thay vì ensureFormExists() nếu form là tĩnh
      if (f) {
        f.reset();
        delete f.dataset.editingId;
        const idInp = f.querySelector('#customer_code');
        if (idInp) idInp.value = '';
        // 💡 Dịch: Đặt tiêu đề thành Thêm mới
        modal.querySelector('.customer__modal-title').textContent = T('customer.modal.add_title', 'Thêm khách hàng mới');
      }
      modal.style.display = 'block';
    }

    // 💡 Dịch: Đặt tiêu đề thành Sửa
    function openModalForEdit(id) {
        if (!modal) return;
        const titleEl = modal.querySelector('.customer__modal-title');
        if (titleEl) titleEl.textContent = T('customer.modal.edit_title', 'Chỉnh sửa khách hàng');
        // Logic tải dữ liệu và mở modal sẽ nằm trong event listener của tbody
    }

    function closeModal() {
      if (!modal) return;
      modal.style.display = 'none';
      const f = getForm();
      if (f) {
        f.reset();
        delete f.dataset.editingId;
      }
    }

    if (btnOpen) btnOpen.addEventListener('click', openModalForCreate);

    if (modal) {
      // Logic đóng modal
      modal.addEventListener('click', function (e) {
        if (e.target.closest('.close-button')) { closeModal(); return; }
        if (e.target.closest('#customerCancelBtn')) { closeModal(); return; }
      });

      window.addEventListener('click', function (e) {
        if (!modal) return;
        if (e.target === modal) closeModal();
      });

      // Logic Submit
      modal.addEventListener('submit', async function (e) {
        const formEl = e.target.closest('.customer__form');
        if (!formEl) return;
        e.preventDefault();

        // 💡 Dịch: Tải nhãn nút Lưu để hiển thị trạng thái
        const submitBtn = formEl.querySelector('#customerSubmitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = T('form.processing', 'Đang xử lý...');

        const id = formEl.dataset.editingId;
        const data = {
          name: formEl.querySelector('#customer_name')?.value || '',
          phone: formEl.querySelector('#customer_phone')?.value || '',
          email: formEl.querySelector('#customer_email')?.value || '',
          address: formEl.querySelector('#customer_address')?.value || ''
        };

        try {
          if (id) {
            await updateCustomer(id, data);
            alert(alertUpdateSuccess);
          } else {
            await addCustomer(data);
            alert(alertCreateSuccess);
          }
          await loadCustomers();
          closeModal();
        } catch (err) {
          alert(`${alertSaveError} ${err.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
      });
    }

    if (tbody) {
      tbody.addEventListener('click', async function (e) {
        const delBtn = e.target.closest('.btn-delete');
        if (delBtn) {
          const id = delBtn.dataset.id;
          if (!id) return;
          if (!confirm(alertDeleteConfirm)) return;
          try {
            await deleteCustomer(id);
            alert(T('customer.alert.delete_success', 'Xóa thành công!'));
            await loadCustomers();
          } catch (err) {
            alert(`${alertDeleteError} ${err.message}`);
          }
          return;
        }

        const editBtn = e.target.closest('.btn-edit');
        if (editBtn) {
          const id = editBtn.dataset.id;
          if (!id) return;
          try {
            const c = await fetchCustomer(id);
            const formEl = getForm(); // Sửa thành getForm()
            if (!formEl) {
              alert(alertLoadFormError);
              return;
            }
            // 💡 Dịch: Đặt tiêu đề thành Sửa
            modal.querySelector('.customer__modal-title').textContent = T('customer.modal.edit_title', 'Chỉnh sửa khách hàng');

            formEl.dataset.editingId = id;
            const idEl = formEl.querySelector('#customer_code');
            const nameEl = formEl.querySelector('#customer_name');
            const phoneEl = formEl.querySelector('#customer_phone');
            const emailEl = formEl.querySelector('#customer_email');
            const addrEl = formEl.querySelector('#customer_address');

            if (idEl) idEl.value = id;
            if (nameEl) nameEl.value = c.name ?? '';
            if (phoneEl) phoneEl.value = c.phone ?? '';
            if (emailEl) emailEl.value = c.email ?? '';
            if (addrEl) addrEl.value = c.address ?? '';

            if (modal) modal.style.display = 'block';
          } catch (err) {
            alert(`${alertLoadInfoError} ${err.message}`);
          }
        }
      });
    }

    if (searchInput) {
      const handler = debounce(function (ev) {
        currentSearchTerm = ev.target.value;
        currentPage = 1;
        renderCustomers();
      }, 250);
      searchInput.addEventListener('input', handler);
    }

    (function addSearchIcon() {
      const wrapper = document.querySelector('.search-box-wrapper');
      if (!wrapper) return;
      if (wrapper.querySelector('.search-icon')) return;
      const icon = document.createElement('i');
      icon.className = 'fas fa-search search-icon';
      wrapper.insertBefore(icon, wrapper.firstChild);
    })();
  }

  // ====== INIT PAGINATION BUTTONS ======
  function initCustomerPagination() {
    const prevBtn = document.getElementById('customerPrevBtn');
    const nextBtn = document.getElementById('customerNextBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            renderCustomers();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        const total = filteredCampaigns.length;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        if (currentPage < totalPages) {
            currentPage++;
            renderCustomers();
        }
      });
    }
  }

  // ====== BOOTSTRAP ======
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initCustomerModal();
      initCustomerPagination();
      loadCustomers();
    });
  } else {
    initCustomerModal();
    initCustomerPagination();
    loadCustomers();
  }
})();