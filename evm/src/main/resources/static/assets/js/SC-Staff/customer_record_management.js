(function () {
  'use strict';

  // ====== STATE PHÂN TRANG & CACHE ======
  let customersCache = [];      // dữ liệu khách hàng lấy từ BE
  let currentPage = 1;          // trang hiện tại
  const PAGE_SIZE = 5;          // mỗi trang hiển thị 5 khách
  let currentSearchTerm = '';   // từ khóa search hiện tại

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
      // lấy nhiều 1 lần, paginate ở client
      const res = await fetch(`/evm/api/sc-staff/dashboard/customers?page=1&pageSize=1000`);
      if (!res.ok) throw new Error(`Server trả về ${res.status}`);

      const customers = await res.json();
      customersCache = Array.isArray(customers) ? customers : [];
      currentPage = 1;
      renderCustomers();
    } catch (err) {
      console.error('Lỗi khi load customers:', err);
      const tbody = document.getElementById('customersTbody');
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell">Lỗi tải dữ liệu</td></tr>`;
      }
      const infoEl = document.querySelector('.pagination-info');
      if (infoEl) infoEl.textContent = 'Lỗi tải dữ liệu';
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
      throw new Error(text || `Server trả về ${res.status}`);
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
      throw new Error(text || `Server trả về ${res.status}`);
    }
    return true;
  }

  async function deleteCustomer(id) {
    const res = await fetch(`/evm/api/sc-staff/dashboard/customer/delete/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Server trả về ${res.status}`);
    }
    return true;
  }

  async function fetchCustomer(id) {
    const res = await fetch(`/evm/api/sc-staff/dashboard/customer/get/${id}`);
    if (!res.ok) throw new Error(`Không lấy được khách hàng (${res.status})`);
    return await res.json();
  }

  // ====== RENDER TABLE + PHÂN TRANG ======
  function renderCustomers() {
    console.log('renderCustomers pagination', { currentPage, PAGE_SIZE, cacheLen: customersCache.length });

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
      infoEl.textContent = `Hiển thị ${pageItems.length} của ${total} khách hàng`;
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
      tbody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell">Không có khách hàng nào.</td></tr>`;
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
            <button class="btn-action btn-edit" data-id="${id}">Sửa</button>
            <button class="btn-action btn-delete" data-id="${id}">Xóa</button>
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

    function getForm() {
      return modal ? modal.querySelector('.customer__form') : null;
    }

    function ensureFormExists() {
      const formEl = getForm();
      if (formEl) return formEl;
      if (!modal) return null;

      const created = document.createElement('form');
      created.className = 'customer__form';
      created.innerHTML = `
        <input type="hidden" id="customer_id" />
        <div class="customer__form-group">
          <label>Tên</label>
          <input id="customer_name" name="Name" type="text" required />
        </div>
        <div class="customer__form-group">
          <label>Số điện thoại</label>
          <input id="customer_phone" name="Phone" type="text" />
        </div>
        <div class="customer__form-group">
          <label>Email</label>
          <input id="customer_email" name="Email" type="email" />
        </div>
        <div class="customer__form-group">
          <label>Địa chỉ</label>
          <input id="customer_address" name="Address" type="text" />
        </div>
        <div class="customer__button-group">
          <button type="submit" id="customerSubmitBtn">Lưu</button>
          <button type="button" id="customerCancelBtn">Hủy</button>
        </div>
      `;
      const content = modal.querySelector('.customer__modal-content') || modal;
      content.appendChild(created);
      return created;
    }

    function openModalForCreate() {
      if (!modal) return;
      const f = ensureFormExists();
      if (f) {
        f.reset();
        delete f.dataset.editingId;
        const idInp = f.querySelector('#customer_id');
        if (idInp) idInp.value = '';
      }
      modal.style.display = 'block';
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
      modal.addEventListener('click', function (e) {
        if (e.target.closest('.customer__close-button')) { closeModal(); return; }
        if (e.target.closest('#customerCancelBtn')) { closeModal(); return; }
      });

      window.addEventListener('click', function (e) {
        if (!modal) return;
        if (e.target === modal) closeModal();
      });

      modal.addEventListener('submit', async function (e) {
        const formEl = e.target.closest('.customer__form');
        if (!formEl) return;
        e.preventDefault();

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
            alert('Cập nhật khách hàng thành công!');
          } else {
            await addCustomer(data);
            alert('Thêm khách hàng thành công!');
          }
          await loadCustomers();
          closeModal();
        } catch (err) {
          alert(`Lỗi khi lưu khách hàng: ${err.message}`);
        }
      });
    }

    if (tbody) {
      tbody.addEventListener('click', async function (e) {
        const delBtn = e.target.closest('.btn-delete');
        if (delBtn) {
          const id = delBtn.dataset.id;
          if (!id) return;
          if (!confirm('Bạn có chắc muốn xóa khách hàng này?')) return;
          try {
            await deleteCustomer(id);
            alert('Xóa khách hàng thành công!');
            await loadCustomers();
          } catch (err) {
            alert('Lỗi khi xóa khách hàng: ' + err.message);
          }
          return;
        }

        const editBtn = e.target.closest('.btn-edit');
        if (editBtn) {
          const id = editBtn.dataset.id;
          if (!id) return;
          try {
            const c = await fetchCustomer(id);
            const formEl = ensureFormExists();
            if (!formEl) {
              alert('Form quản lý khách hàng không tìm thấy.');
              return;
            }
            formEl.dataset.editingId = id;
            const idEl = formEl.querySelector('#customer_id');
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
            alert('Lỗi khi tải thông tin khách hàng: ' + err.message);
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
        currentPage--;
        renderCustomers();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        currentPage++;
        renderCustomers();
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
