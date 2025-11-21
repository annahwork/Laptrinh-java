(function () {
  'use strict';

  let vehiclesCache = [];
  let currentEditingVin = null;

  let currentPage = 1;
  const PAGE_SIZE = 5; // muốn 10 dòng/trang thì đổi 10
  const API_BASE_URL = "/evm/api/sc-staff/vehicles";

  function mapVehicleStatus(status) {
    switch (String(status).toLowerCase()) {
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
      vehicle.customerName || '';
  }

  function getCustomerPhoneFromVehicle(vehicle) {
    return (vehicle.customer && vehicle.customer.phone) ||
      vehicle.customerPhone || '';
  }

  function renderVehiclesTable() {
    const tableBody = document.getElementById('vehiclesTbody');
    if (!tableBody) return;

    const searchInputEl = document.getElementById('searchVehicleBox');
    const statusFilterEl = document.getElementById('vehicleStatusFilter');

    const searchValue = (searchInputEl?.value || '').trim().toLowerCase();
    const statusFilter = statusFilterEl?.value || '';

    let filtered = vehiclesCache.slice();

    if (searchValue) {
      filtered = filtered.filter(v => {
        const vin = (v.vehicle && v.vehicle.vin) ? v.vehicle.vin.toString().toLowerCase() : '';
        const customerName = getCustomerNameFromVehicle(v).toLowerCase();
        return vin.includes(searchValue) || customerName.includes(searchValue);
      });
    }

    if (statusFilter) {
      filtered = filtered.filter(v => {
        const status = (v.vehicle && v.vehicle.status) ? v.vehicle.status.toLowerCase() : '';
        return status === statusFilter;
      });
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    // nếu đang ở trang lớn hơn tổng trang (do filter) thì kéo về trang cuối
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageItems = filtered.slice(startIndex, endIndex);

    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
      const showing = pageItems.length;
      paginationInfo.textContent = `Hiển thị ${showing} của ${total}`;
    }

    // cập nhật hiển thị số trang (nếu có)
    const pageLabel = document.getElementById('vehiclePageNumber');
    if (pageLabel) {
      pageLabel.textContent = currentPage.toString();
    }

    // disable / enable nút Trước / Sau
    const prevBtn = document.getElementById('vehiclePrevBtn');
    const nextBtn = document.getElementById('vehicleNextBtn');
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

    if (!pageItems.length) {
      tableBody.innerHTML = '<tr><td colspan="6">Không tìm thấy xe phù hợp.</td></tr>';
      return;
    }

    tableBody.innerHTML = '';
    pageItems.forEach(item => {
      const customerName = getCustomerNameFromVehicle(item) || 'N/A';
      const customerPhone = getCustomerPhoneFromVehicle(item) || 'N/A';
      const vehicleData = item.vehicle || {};

      const rowHTML = `
      <tr>
        <td>${vehicleData.vin || 'N/A'}</td>
        <td>${customerName}</td>
        <td>${customerPhone}</td>
        <td>${mapVehicleModel(vehicleData.model)}</td>
        <td>${mapVehicleStatus(vehicleData.status)}</td>
        <td>
          <button class="btn-action btn-edit" data-vin="${vehicleData.vin || ''}">Sửa</button>
          <button class="btn-action btn-delete" data-vin="${vehicleData.vin || ''}">Xóa</button>
        </td>
      </tr>
    `;
      tableBody.insertAdjacentHTML('beforeend', rowHTML);
    });
  }



  function loadVehiclesTable() {
    const tableBody = document.getElementById('vehiclesTbody');
    if (!tableBody) return;

    const url = `${API_BASE_URL}/all`;

    console.log('Đang tải danh sách xe...');
    tableBody.innerHTML = '<tr><td colspan="6">Đang tải dữ liệu...</td></tr>';

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Lỗi khi tải danh sách xe. Check BE (Controller/Service).');
        }
        return response.json();
      })
      .then(vehicles => {
        if (!Array.isArray(vehicles)) {
          console.warn('Response /all không phải array:', vehicles);
          vehiclesCache = [];
        } else {
          vehiclesCache = vehicles.filter(v => v && v.vehicle);
        }
        renderVehiclesTable();
      })
      .catch(error => {
        console.error('Lỗi khi load xe:', error);
        tableBody.innerHTML = `<tr><td colspan="6">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
      });
  }

  function fillVehicleForm(data) {
    const plateEl = document.getElementById('vehicle_plate');
    const customerEl = document.getElementById('vehicle_customer');
    const phoneEl = document.getElementById('vehicle_phone');
    const typeEl = document.getElementById('vehicle_type');
    const yearEl = document.getElementById('vehicle_year');
    const warrantyEl = document.getElementById('vehicle_warranty');
    const statusEl = document.getElementById('vehicle_status');
    const notesEl = document.getElementById('vehicle_notes');

    const customerName = getCustomerNameFromVehicle(data);
    const customerPhone = getCustomerPhoneFromVehicle(data);
    const vehicleData = data.vehicle || {};

    if (plateEl) {
      plateEl.value = vehicleData.vin || '';
      plateEl.readOnly = !!currentEditingVin;
    }

    if (customerEl) customerEl.value = customerName || '';
    if (phoneEl) phoneEl.value = customerPhone || '';

    if (typeEl) typeEl.value = vehicleData.model || '';

    if (statusEl) {
      statusEl.value = (vehicleData.status || 'active').toLowerCase();
    }

    if (notesEl) notesEl.value = vehicleData.notes || '';

    if (yearEl) yearEl.value = vehicleData.year_Of_Manufacture || '';
    if (warrantyEl) warrantyEl.value = vehicleData.warranty_Time || '';
  }

  function resetVehicleForm() {
    const form = document.querySelector('.vehicle__form');
    const plateEl = document.getElementById('vehicle_plate');
    if (form) form.reset();
    if (plateEl) {
      plateEl.readOnly = false;
    }
    const statusEl = document.getElementById('vehicle_status');
    if (statusEl) statusEl.value = 'active';
  }

  function debounce(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }

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

      if (btnOpen) {
        btnOpen.addEventListener('click', function () {
          currentEditingVin = null;
          resetVehicleForm();
          openModal();
        });
      }

      if (btnClose) btnClose.addEventListener('click', closeModal);
      if (btnCancel) btnCancel.addEventListener('click', closeModal);

      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          const currentStaffId = 2; 7

          const vinValue = document.getElementById('vehicle_plate')?.value || '';
          const modelValue = document.getElementById('vehicle_type')?.value || '';
          const statusValue = document.getElementById('vehicle_status')?.value || '';
          const customerNameValue = document.getElementById('vehicle_customer')?.value || '';
          const customerPhoneValue = document.getElementById('vehicle_phone')?.value || '';
          const yearValue = document.getElementById('vehicle_year')?.value;
          const warrantyValue = document.getElementById('vehicle_warranty')?.value;

          const requestBody = {
            vehicle: {
              vin: vinValue,
              model: modelValue,
              status: statusValue,
              year_Of_Manufacture: yearValue ? parseInt(yearValue, 10) : new Date().getFullYear(),
              warranty_Time: warrantyValue || '',
            },
            customer: {
              name: customerNameValue,
              phone: customerPhoneValue,
              email: '',
              address: '',
            },
          };

          let url = '';
          let method = '';

          if (currentEditingVin) {
            method = 'PUT';
            url = `${API_BASE_URL}/update/${encodeURIComponent(currentEditingVin)}?staffId=${currentStaffId}`;

            const oldData = vehiclesCache.find(v => v.vehicle.vin === currentEditingVin);
            if (oldData) {
              requestBody.vehicle.year_Of_Manufacture = oldData.vehicle.year_Of_Manufacture;
              requestBody.vehicle.warranty_Time = oldData.vehicle.warranty_Time;
            }

          } else {
            method = 'POST';
            url = `${API_BASE_URL}/register?staffId=${currentStaffId}`;
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
              loadVehiclesTable();
            })
            .catch((error) => {
              console.error('Lỗi khi tạo/cập nhật xe:', error);
              alert(`Lỗi: ${error.message}`);
            });
        });
      }

      window.addEventListener('click', function (e) {
        if (modal && modal.style.display === 'block' && e.target === modal) {
          closeModal();
        }
      });
    }

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

        const targetVin = target.dataset.vin;

        if (target.classList.contains('btn-xoa')) {
          if (!targetVin) return;

          if (!confirm(`M có chắc muốn xóa xe với VIN/Biển số: ${targetVin}?`)) return;

          fetch(`${API_BASE_URL}/delete/${encodeURIComponent(targetVin)}`, {
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

        if (target.classList.contains('btn-sua')) {
          if (!targetVin) return;

          currentEditingVin = targetVin;

          const vehicleData = vehiclesCache.find(v => v.vehicle && v.vehicle.vin === targetVin);

          if (vehicleData) {
            fillVehicleForm(vehicleData);
            openModal();
          } else {
            console.error('Không tìm thấy xe trong cache với VIN:', targetVin);
            alert('Lỗi: Không tìm thấy dữ liệu xe để sửa.');
            currentEditingVin = null;
          }
        }
      });
    }

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

    function init() {
      initVehicleModal();
      initVehicleTableActions();
      initSearchAndFilter();
      initPagination();
      loadVehiclesTable();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
  function initPagination() {
    const prevBtn = document.getElementById('vehiclePrevBtn');
    const nextBtn = document.getElementById('vehicleNextBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        currentPage--;
        renderVehiclesTable();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        currentPage++;
        renderVehiclesTable();
      });
    }
  }

})();