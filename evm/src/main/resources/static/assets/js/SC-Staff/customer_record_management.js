// ...existing code...
(function () {
  // Debounce helper
  function debounce(fn, wait = 300) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Utility: safe get id from server object
  function getId(c) {
    return c.customerID ?? c.id ?? '';
  }

  // Load customers from server and optionally filter client-side
  async function loadCustomers(page = 1, pageSize = 1000, search = '') {
    try {
      const res = await fetch(`/evm/api/customers?page=${page}&pageSize=${pageSize}`);
      if (!res.ok) throw new Error(`Server trả về ${res.status}`);
      const customers = await res.json();
      renderCustomers(customers || [], search);
    } catch (err) {
      console.error('Lỗi khi load customers:', err);
      const tbody = document.getElementById('customersTbody');
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell">Lỗi tải dữ liệu</td></tr>`;
      const infoEl = document.querySelector('.pagination-info');
      if (infoEl) infoEl.textContent = 'Lỗi tải dữ liệu';
    }
  }

  // Render customers into table, include Edit/Delete buttons
  function renderCustomers(customers, search = '') {
    const tbody = document.getElementById('customersTbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let list = Array.isArray(customers) ? customers.slice() : [];
    const term = String(search || '').trim().toLowerCase();
    if (term) {
      list = list.filter(c => {
        const id = String(getId(c)).toLowerCase();
        const name = String(c.name ?? '').toLowerCase();
        const phone = String(c.phone ?? '').toLowerCase();
        return id.includes(term) || name.includes(term) || phone.includes(term);
      });
    }

    if (!list || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="table-placeholder-cell">Không có khách hàng nào.</td></tr>`;
    } else {
      const rows = list.map(c => {
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
              <button class="btn-edit" data-id="${id}">Sửa</button>
              <button class="btn-delete" data-id="${id}">Xóa</button>
            </td>
          </tr>
        `;
      }).join('');
      tbody.innerHTML = rows;
    }

    const infoEl = document.querySelector('.pagination-info');
    if (infoEl) infoEl.textContent = `Hiển thị ${list.length} khách hàng`;
  }

  // Basic escaping to avoid injecting raw markup
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

  // Create customer
  async function addCustomer(data) {
    try {
      const res = await fetch('/evm/api/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Server trả về ${res.status}`);
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  // Update customer
  async function updateCustomer(id, data) {
    try {
      const res = await fetch(`/evm/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Server trả về ${res.status}`);
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  // Delete customer
  async function deleteCustomer(id) {
    try {
      const res = await fetch(`/evm/api/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Server trả về ${res.status}`);
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  // Fetch single customer by id
  async function fetchCustomer(id) {
    const res = await fetch(`/evm/api/customers/${id}`);
    if (!res.ok) throw new Error(`Không lấy được khách hàng (${res.status})`);
    return await res.json();
  }

  // Modal and form logic (robust: always query form from DOM when needed)
  function initCustomerModal() {
    const btnOpen = document.getElementById('btnMoFormCustomer'); // optional
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
      // append into modal content
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

    // open button (if exists)
    if (btnOpen) btnOpen.addEventListener('click', openModalForCreate);

    // delegate clicks inside modal (close/cancel)
    if (modal) {
      modal.addEventListener('click', function (e) {
        // close button
        if (e.target.closest('.customer__close-button')) { closeModal(); return; }
        // cancel button inside form
        if (e.target.closest('#customerCancelBtn')) { closeModal(); return; }
        // click outside content closes (handled below as well)
      });

      // close when click outside modal content
      window.addEventListener('click', function (e) {
        if (!modal) return;
        if (e.target === modal) closeModal();
      });

      // form submit handled via modal submit listener (works even if form created later)
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
          loadCustomers(); // reload
          closeModal();
        } catch (err) {
          alert(`Lỗi khi lưu khách hàng: ${err.message}`);
        }
      });
    }

    // Event delegation for edit/delete buttons in tbody
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
            loadCustomers();
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

    // Search input: debounce, filter by id/name/phone client-side
    if (searchInput) {
      const handler = debounce(function (ev) {
        loadCustomers(1, 1000, ev.target.value);
      }, 250);
      searchInput.addEventListener('input', handler);
    }

    // Add small search icon if not present (adds class to parent wrapper if exists)
    (function addSearchIcon() {
      const wrapper = document.querySelector('.search-box-wrapper');
      if (!wrapper) return;
      if (wrapper.querySelector('.search-icon')) return; // already present
      const icon = document.createElement('i');
      icon.className = 'fas fa-search search-icon';
      wrapper.insertBefore(icon, wrapper.firstChild);
    })();
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initCustomerModal();
      loadCustomers();
    });
  } else {
    initCustomerModal();
    loadCustomers();
  }
})();
// ...existing code...