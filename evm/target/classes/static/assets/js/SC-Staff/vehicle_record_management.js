// =======================
//  BIẾN TOÀN CỤC
// =======================
let vehiclesCache = [];        // cache danh sách xe để filter/search phía FE
let currentEditingVin = null;  // null = đang thêm mới, khác null = đang sửa

// =======================
//  HÀM MAP DỮ LIỆU
// =======================
function mapVehicleStatus(status) {
  switch (status) {
    case 'active': return 'Hoạt động';
    case 'maintenance': return 'Bảo trì';
    case 'inactive': return 'Không hoạt động';
    default: return status || 'N/A';
  }
}

function mapVehicleModel(model) {
  switch (model) {
    case 'Toyota': return 'Toyota';
    case 'Honda': return 'Honda';
    case 'Mercedes-Benz': return 'Mercedes-Benz';
    case 'BMW': return 'BMW';
    default: return model || 'N/A';
  }
}

function getCustomerNameFromVehicle(vehicle) {
  return (vehicle.customer && vehicle.customer.name) ||
    vehicle.customerName ||
    '';
}

function getCustomerPhoneFromVehicle(vehicle) {
  return (vehicle.customer && vehicle.customer.phone) ||
    vehicle.customerPhone ||
    '';
}

// =======================
//  HÀM VẼ BẢNG TỪ CACHE
// =======================
function renderVehiclesTable() {
  const tableBody = document.getElementById('vehiclesTbody');
  if (!tableBody) return;

  const searchInputEl = document.getElementById('searchVehicleBox');
  const statusFilterEl = document.getElementById('vehicleStatusFilter');

  const searchValue = (searchInputEl?.value || '').trim().toLowerCase();
  const statusFilter = statusFilterEl?.value || '';

  let filtered = vehiclesCache.slice(); // copy

  // Lọc theo từ khóa (VIN hoặc tên KH)
  if (searchValue) {
    filtered = filtered.filter(v => {
      const vin = (v.vin || '').toString().toLowerCase();
      const customerName = getCustomerNameFromVehicle(v).toLowerCase();
      return vin.includes(searchValue) || customerName.includes(searchValue);
    });
  }

  // Lọc theo trạng thái
  if (statusFilter) {
    filtered = filtered.filter(v => v.status === statusFilter);
  }

  // Cập nhật info phân trang đơn giản
  const paginationInfo = document.querySelector('.pagination-info');
  if (paginationInfo) {
    const total = vehiclesCache.length;
    const showing = filtered.length;
    paginationInfo.textContent = `Hiển thị ${showing} của ${total}`;
  }

  // Vẽ bảng
  if (!filtered.length) {
    tableBody.innerHTML = '<tr><td colspan="6">Không tìm thấy xe phù hợp.</td></tr>';
    return;
  }

  tableBody.innerHTML = '';
  filtered.forEach(vehicle => {
    const customerName = getCustomerNameFromVehicle(vehicle) || 'N/A';
    const customerPhone = getCustomerPhoneFromVehicle(vehicle) || 'N/A';

    const rowHTML = `
      <tr>
        <td>${vehicle.vin}</td>
        <td>${customerName}</td>
        <td>${customerPhone}</td>
        <td>${mapVehicleModel(vehicle.model)}</td>
        <td>${mapVehicleStatus(vehicle.status)}</td>
        <td>
          <button class="btn-sua" data-vin="${vehicle.vin}">Sửa</button>
          <button class="btn-xoa" data-vin="${vehicle.vin}">Xóa</button>
        </td>
      </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', rowHTML);
  });
}

// =======================
//  HÀM LOAD TỪ BE VÀ LƯU CACHE
// =======================
function loadVehiclesTable() {
  const tableBody = document.getElementById('vehiclesTbody');
  if (!tableBody) return;

  const url = '/evm/api/vehicles';

  console.log('Đang tải danh sách xe...');
  tableBody.innerHTML = '<tr><td colspan="6">Đang tải dữ liệu...</td></tr>';

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Lỗi khi tải danh sách xe. M check BE (JPA) xem?');
      }
      return response.json();
    })
    .then(vehicles => {
      if (!Array.isArray(vehicles)) {
        console.warn('Response /vehicles không phải array:', vehicles);
        vehiclesCache = [];
      } else {
        vehiclesCache = vehicles;
      }
      renderVehiclesTable();
    })
    .catch(error => {
      console.error('Lỗi khi load xe:', error);
      tableBody.innerHTML = `<tr><td colspan="6">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
    });
}

// =======================
//  HÀM ĐIỀN FORM TỪ 1 VEHICLE
// =======================
function fillVehicleForm(vehicle) {
  const plateEl = document.getElementById('vehicle_plate');
  const customerEl = document.getElementById('vehicle_customer');
  const phoneEl = document.getElementById('vehicle_phone');
  const typeEl = document.getElementById('vehicle_type');
  const yearEl = document.getElementById('vehicle_year');
  const warrantyEl = document.getElementById('vehicle_warranty');
  const statusEl = document.getElementById('vehicle_status');
  const notesEl = document.getElementById('vehicle_notes');

  const customerName = getCustomerNameFromVehicle(vehicle);
  const customerPhone = getCustomerPhoneFromVehicle(vehicle);

  if (plateEl) {
    plateEl.value = vehicle.vin || '';
    // Khi sửa: không cho sửa VIN (id)
    plateEl.readOnly = !!currentEditingVin;
  }

  if (customerEl) customerEl.value = customerName || '';
  if (phoneEl) phoneEl.value = customerPhone || '';
  if (typeEl) typeEl.value = vehicle.model || '';
  if (yearEl) yearEl.value = vehicle.year_Of_Manufacture || '';
  if (warrantyEl) warrantyEl.value = vehicle.warranty_Time || '';
  if (statusEl) statusEl.value = vehicle.status || 'active';
  if (notesEl) notesEl.value = vehicle.notes || '';
}

// =======================
//  HÀM RESET FORM (THÊM MỚI)
// =======================
function resetVehicleForm() {
  const form = document.querySelector('.vehicle__form');
  const plateEl = document.getElementById('vehicle_plate');
  if (form) form.reset();
  if (plateEl) {
    plateEl.readOnly = false; // thêm mới cho sửa VIN
  }
}

// =======================
//  DEBOUNCE CHO SEARCH
// =======================
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// =======================
//  INIT MODAL + FORM SUBMIT
// =======================
(function () {
  function initVehicleModal() {
    const btnOpen = document.getElementById('btnMoFormVehicle');
    const modal = document.getElementById('modalQuanLyVehicle');
    const btnClose = modal ? modal.querySelector('.vehicle__close-button') : null;
    const btnCancel = document.getElementById('vehicleCancelBtn');
    const form = modal ? modal.querySelector('.vehicle__form') : null;

    function openModal() {
      if (modal) modal.style.display = 'block';
    }

    function closeModal() {
      if (modal) {
        modal.style.display = 'none';
        resetVehicleForm();
        currentEditingVin = null;
      }
    }

    // Thêm mới
    if (btnOpen) {
      btnOpen.addEventListener('click', function () {
        currentEditingVin = null;
        resetVehicleForm();
        openModal();
      });
    }

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    // Submit form: thêm hoặc sửa
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const currentStaffId = 2; // TODO: m chỉnh lấy từ session nếu cần

        const vinValue = document.getElementById('vehicle_plate')?.value || '';

        const requestBody = {
          vehicle: {
            vin: vinValue,
            model: document.getElementById('vehicle_type')?.value || '',
            status: document.getElementById('vehicle_status')?.value || '',
            year_Of_Manufacture: parseInt(document.getElementById('vehicle_year')?.value, 10),
            warranty_Time: document.getElementById('vehicle_warranty')?.value || '',
          },
          customer: {
            name: document.getElementById('vehicle_customer')?.value || '',
            phone: document.getElementById('vehicle_phone')?.value || '',
            email: '',
            address: '',
          },
        };

        let url = '';
        let method = '';

        if (currentEditingVin) {
          // ĐANG SỬA
          method = 'PUT';
          url = `/evm/api/vehicles/${encodeURIComponent(currentEditingVin)}?staffId=${currentStaffId}`;
        } else {
          // ĐANG THÊM MỚI
          method = 'POST';
          url = `/evm/api/vehicles?staffId=${currentStaffId}`;
        }

        fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })
          .then((response) => {
            if (response.ok) return response.text();
            return response.text().then((text) => { throw new Error(text); });
          })
          .then((message) => {
            console.log(message);
            alert(currentEditingVin ? 'Cập nhật xe thành công!' : 'Đăng ký xe thành công!');
            closeModal();
            loadVehiclesTable(); // reload bảng sau khi thêm/sửa
          })
          .catch((error) => {
            console.error('Lỗi khi tạo/cập nhật xe:', error);
            alert(`Lỗi: ${error.message}`);
          });
      });
    }

    // Click bên ngoài modal thì đóng
    window.addEventListener('click', function (e) {
      if (modal && modal.style.display === 'block' && e.target === modal) {
        closeModal();
      }
    });
  }

  // =======================
  //  INIT EVENT TRÊN BẢNG (SỬA / XÓA)
  // =======================
  function initVehicleTableActions() {
    const tableBody = document.getElementById('vehiclesTbody');
    const modal = document.getElementById('modalQuanLyVehicle');

    function openModal() {
      if (modal) modal.style.display = 'block';
    }

    if (!tableBody) return;

    tableBody.addEventListener('click', function (e) {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      // XÓA
      if (target.classList.contains('btn-xoa')) {
        const vin = target.dataset.vin;
        if (!vin) return;

        if (!confirm(`M có chắc muốn xóa xe với VIN/Biển số: ${vin}?`)) return;

        fetch(`/evm/api/vehicles/${encodeURIComponent(vin)}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (!response.ok) {
              return response.text().then((text) => { throw new Error(text || 'Xóa thất bại'); });
            }
            return response.text();
          })
          .then((msg) => {
            console.log(msg);
            alert('Xóa xe thành công!');
            loadVehiclesTable();
          })
          .catch((error) => {
            console.error('Lỗi khi xóa xe:', error);
            alert(`Lỗi xóa: ${error.message}`);
          });
      }

      // SỬA
      if (target.classList.contains('btn-sua')) {
        const vin = target.dataset.vin;
        if (!vin) return;

        currentEditingVin = vin;

        const url = `/evm/api/vehicles/${encodeURIComponent(vin)}`;

        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Không tải được chi tiết xe.');
            }
            return response.json();
          })
          .then(vehicle => {
            fillVehicleForm(vehicle);
            openModal();
          })
          .catch(error => {
            console.error('Lỗi khi tải chi tiết xe:', error);
            alert(`Lỗi tải chi tiết xe: ${error.message}`);
          });
      }
    });
  }

  // =======================
  //  INIT SEARCH + FILTER
  // =======================
  function initSearchAndFilter() {
    const searchInputEl = document.getElementById('searchVehicleBox');
    const statusFilterEl = document.getElementById('vehicleStatusFilter');

    if (searchInputEl) {
      searchInputEl.addEventListener('input', debounce(() => {
        renderVehiclesTable();
      }, 300));
    }

    if (statusFilterEl) {
      statusFilterEl.addEventListener('change', function () {
        renderVehiclesTable();
      });
    }
  }

  // =======================
  //  KHỞI TẠO KHI LOAD TRANG
  // =======================
  function init() {
    initVehicleModal();
    initVehicleTableActions();
    initSearchAndFilter();
    loadVehiclesTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();