// == vehicle_record_management  == //
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // === 1. DỮ LIỆU & BIẾN TOÀN CỤC ===
  let carRecords = JSON.parse(localStorage.getItem('carRecords')) || [];
  let editingId = null; // ID đang sửa (null = thêm mới)

  // === 2. DOM ELEMENTS ===
  const modal = document.getElementById('crm-modal');
  const form = document.getElementById('crm-form');
  const titleEl = document.getElementById('modal-title');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('cancel-btn');

  const addBtn = document.getElementById('btn');
  const exportBtn = document.getElementById('btn-export-json');
  const importBtn = document.getElementById('btn-import-json');
  const fileInput = document.getElementById('file-import');

  const searchInput = document.getElementById('search-input');
  const statusFilter = document.getElementById('status-filter');
  const tableBody = document.querySelector('#car-table tbody');

  // === 3. INPUTS FORM ===
  const inputs = {
    id: document.getElementById('input-id'),
    name: document.getElementById('input-name'),
    phone: document.getElementById('input-phone'),
    plate: document.getElementById('input-plate'),
    type: document.getElementById('input-type'),
    register: document.getElementById('input-register'),
    price: document.getElementById('input-price'),
    status: document.getElementById('input-status'),
    details: document.getElementById('input-details')
  };

  // === 4. HÀM MỞ / ĐÓNG MODAL ===
  window.openModal = function () {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    inputs.name.focus();
  };

  window.closeModal = function () {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    form.reset();
    clearErrors();
    editingId = null;
    setModalTitle('Thêm hồ sơ xe');
  };

  // Đóng modal
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  // === 5. HÀM ĐỔI TIÊU ĐỀ MODAL ===
  function setModalTitle(text) {
    if (titleEl) titleEl.textContent = text;
  }

  // === 6. HÀM TẠO ID TỰ ĐỘNG ===
  function generateCarID() {
    return 'CAR_' + Date.now().toString().slice(-6);
  }

  // === 7. HÀM HIỂN THỊ LỖI ===
  function showError(input, msg) {
    clearError(input);
    const error = document.createElement('small');
    error.className = 'text-danger';
    error.textContent = msg;
    input.parentElement.appendChild(error);
    input.classList.add('error');
  }

  function clearError(input) {
    const error = input.parentElement.querySelector('small.text-danger');
    if (error) error.remove();
    input.classList.remove('error');
  }

  function clearErrors() {
    document.querySelectorAll('.form-group small.text-danger').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }

  // === 8. HÀM VALIDATE FORM ===
  function validateForm() {
    let valid = true;
    clearErrors();

    if (!inputs.name.value.trim()) {
      showError(inputs.name, 'Vui lòng nhập tên khách hàng');
      valid = false;
    }

    const plate = inputs.plate.value.trim();
    if (plate && !/^[0-9]{2}[A-Z]-[0-9]{3}\.[0-9]{2}$/.test(plate)) {
      showError(inputs.plate, 'Biển số không hợp lệ (vd: 51A-123.45)');
      valid = false;
    }

    const price = inputs.price.value;
    if (price && (isNaN(price) || price <= 0)) {
      showError(inputs.price, 'Giá trị xe phải lớn hơn 0');
      valid = false;
    }

    return valid;
  }

  // === 9. HÀM LƯU DỮ LIỆU ===
  function saveToStorage() {
    localStorage.setItem('carRecords', JSON.stringify(carRecords));
  }

  // === 10. HÀM HIỂN THỊ BẢNG ===
  function renderTable(data = carRecords) {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (data.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="8" class="text-center">Chưa có hồ sơ nào</td>`;
      tableBody.appendChild(tr);
      return;
    }

    data.forEach(car => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${car.id}</td>
        <td>${escapeHtml(car.name)}</td>
        <td>${car.phone || ''}</td>
        <td>${car.plate || ''}</td>
        <td>${car.type || ''}</td>
        <td><span class="status status-${car.status}">${getStatusText(car.status)}</span></td>
        <td>${formatPrice(car.price)}</td>
        <td>
          <button class="btn btn--sm" onclick="editCar('${car.id}')">Sửa</button>
          <button class="btn btn--sm btn--danger" onclick="deleteCar('${car.id}')">Xóa</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  function getStatusText(status) {
    return status === 'active' ? 'Hoạt động' :
           status === 'maintenance' ? 'Bảo trì' : 'Không hoạt động';
  }

  function formatPrice(price) {
    return price ? new Intl.NumberFormat('vi-VN').format(price) + ' VND' : '';
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // === 11. THÊM / SỬA HỒ SƠ ===
  window.editCar = function (id) {
    const car = carRecords.find(c => c.id === id);
    if (!car) return;

    editingId = id;
    setModalTitle(`Chỉnh sửa hồ sơ - ${id}`);

    // Điền dữ liệu
    inputs.id.value = car.id;
    inputs.name.value = car.name;
    inputs.phone.value = car.phone || '';
    inputs.plate.value = car.plate || '';
    inputs.type.value = car.type || '';
    inputs.register.value = car.register || '';
    inputs.price.value = car.price || '';
    inputs.status.value = car.status;
    inputs.details.value = car.details || '';

    openModal();
  };

  window.deleteCar = function (id) {
    if (!confirm(`Xóa hồ sơ ${id}?`)) return;
    carRecords = carRecords.filter(c => c.id !== id);
    saveToStorage();
    renderTable();
  };

  // === 12. XỬ LÝ FORM SUBMIT ===
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = {
      id: inputs.id.value.trim() || generateCarID(),
      name: inputs.name.value.trim(),
      phone: inputs.phone.value.trim(),
      plate: inputs.plate.value.trim(),
      type: inputs.type.value.trim(),
      register: inputs.register.value,
      price: inputs.price.value ? parseInt(inputs.price.value) : null,
      status: inputs.status.value,
      details: inputs.details.value.trim(),
      createdAt: editingId ? carRecords.find(c => c.id === editingId).createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      const index = carRecords.findIndex(c => c.id === editingId);
      if (index !== -1) carRecords[index] = formData;
    } else {
      carRecords.push(formData);
    }

    saveToStorage();
    renderTable();
    closeModal();
    alert(editingId ? 'Cập nhật thành công!' : 'Thêm hồ sơ thành công!');
  });

  // === 13. NÚT THÊM MỚI ===
  addBtn?.addEventListener('click', () => {
    editingId = null;
    setModalTitle('Thêm hồ sơ xe');
    form.reset();
    openModal();
  });

  // === 14. XUẤT JSON ===
  exportBtn?.addEventListener('click', () => {
    if (carRecords.length === 0) return alert('Chưa có dữ liệu để xuất!');
    const data = JSON.stringify(carRecords, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ho_so_xe_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // === 15. NHẬP JSON ===
  importBtn?.addEventListener('click', () => fileInput.click());
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error('File phải chứa mảng JSON');
        const oldLen = carRecords.length;
        data.forEach(item => {
          if (item.id && !carRecords.find(c => c.id === item.id)) {
            carRecords.push(item);
          }
        });
        saveToStorage();
        renderTable();
        alert(`Đã nhập ${carRecords.length - oldLen} hồ sơ mới!`);
      } catch (err) {
        alert('Lỗi nhập file: ' + err.message);
      }
    };
    reader.readAsText(file);
    fileInput.value = '';
  });

  // === 16. TÌM KIẾM & LỌC ===
  function filterData() {
    let filtered = carRecords;

    const query = (searchInput?.value || '').trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(query) ||
        (car.plate && car.plate.toLowerCase().includes(query)) ||
        (car.phone && car.phone.includes(query))
      );
    }

    const status = statusFilter?.value;
    if (status && status !== 'all') {
      filtered = filtered.filter(car => car.status === status);
    }

    renderTable(filtered);
  }

  searchInput?.addEventListener('input', filterData);
  statusFilter?.addEventListener('change', filterData);

  // === 17. KHỞI TẠO ===
  renderTable();
});