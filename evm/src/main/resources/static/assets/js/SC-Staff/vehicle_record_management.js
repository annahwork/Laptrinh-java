(function () {
  'use strict';

  // 💡 Hàm tra cứu dịch thuật (giả định)
  const T = (key, fallbackText) => window.messages && window.messages[key] ? window.messages[key] : fallbackText;

  let vehiclesCache = [];
  let currentEditingVin = null;

  let currentPage = 1;
  const PAGE_SIZE = 5; // muốn 10 dòng/trang thì đổi 10
  const API_BASE_URL = "/evm/api/sc-staff/vehicles";

  function mapVehicleStatus(status) {
    const s = String(status).toLowerCase();
    switch (s) {
      // 💡 Dịch các trạng thái
      case 'active': return T('vehicle.status.active', 'Hoạt động');
      case 'maintenance': return T('vehicle.status.maintenance', 'Bảo trì');
      case 'inactive': return T('vehicle.status.inactive', 'Không hoạt động');
      default: return status || T('general.na', 'N/A');
    }
  }

  function mapVehicleModel(model) {
    // Giữ nguyên model name nếu không có bản dịch cụ thể
    switch (model) {
      case 'Toyota': return 'Toyota';
      case 'Honda': return 'Honda';
      case 'Mercedes-Benz': return 'Mercedes-Benz';
      case 'BMW': return 'BMW';
      default: return model || T('general.na', 'N/A');
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

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageItems = filtered.slice(startIndex, endIndex);

    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
      const showing = pageItems.length;
      // 💡 Dịch: Hiển thị X của Y
      paginationInfo.textContent = T('pagination.display_info_of', 'Hiển thị %s của %s')
                                        .replace('%s', showing)
                                        .replace('%s', total);
    }

    // cập nhật hiển thị số trang (nếu có)
    const pageLabel = document.getElementById('vehiclePageNumber');
    if (pageLabel) {
      pageLabel.textContent = currentPage.toString();
    }

    // disable / enable nút Trước / Sau
    const prevBtn = document.getElementById('vehiclePrevBtn');
    const nextBtn = document.getElementById('vehicleNextBtn');
    const btnPrevText = T('button.previous', '« Trước');
    const btnNextText = T('button.next', 'Sau »');

    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

    if (!pageItems.length) {
      // 💡 Dịch: Không tìm thấy xe phù hợp.
      tableBody.innerHTML = `<tr><td colspan="6">${T('vehicle.table.no_match', 'Không tìm thấy xe phù hợp.')}</td></tr>`;
      return;
    }

    // 💡 Dịch: Nhãn nút
    const editBtnText = T('button.edit', 'Sửa');
    const deleteBtnText = T('button.delete', 'Xóa');


    tableBody.innerHTML = '';
    pageItems.forEach(item => {
      const customerName = getCustomerNameFromVehicle(item) || T('general.na', 'N/A');
      const customerPhone = getCustomerPhoneFromVehicle(item) || T('general.na', 'N/A');
      const vehicleData = item.vehicle || {};

      const rowHTML = `
      <tr>
        <td>${vehicleData.vin || T('general.na', 'N/A')}</td>
        <td>${customerName}</td>
        <td>${customerPhone}</td>
        <td>${mapVehicleModel(vehicleData.model)}</td>
        <td>${mapVehicleStatus(vehicleData.status)}</td>
        <td>
          <button class="btn-action btn-edit" data-vin="${vehicleData.vin || ''}">${editBtnText}</button>
          <button class="btn-action btn-delete" data-vin="${vehicleData.vin || ''}">${deleteBtnText}</button>
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

    // 💡 Dịch: Đang tải danh sách xe...
    console.log(T('vehicle.loading.list', 'Đang tải danh sách xe...'));
    tableBody.innerHTML = `<tr><td colspan="6">${T('message.loading_data', 'Đang tải dữ liệu...')}</td></tr>`;

    fetch(url)
      .then(response => {
        // 💡 Dịch: Lỗi khi tải danh sách xe. Check BE (Controller/Service).
        if (!response.ok) {
          throw new Error(T('vehicle.error.load_list_fail', 'Lỗi khi tải danh sách xe. Check BE (Controller/Service).'));
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
        // 💡 Dịch: Lỗi tải dữ liệu:
        console.error('Lỗi khi load xe:', error);
        tableBody.innerHTML = `<tr><td colspan="6">${T('error.load_data', 'Lỗi tải dữ liệu')}: ${error.message}</td></tr>`;
      });
  }

  function fillVehicleForm(data) {
    // (Giữ nguyên logic fill form)
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
    // 💡 Dịch: Đặt lại trạng thái mặc định
    const form = document.querySelector('.vehicle__form');
    const plateEl = document.getElementById('vehicle_plate');
    if (form) form.reset();
    if (plateEl) {
      plateEl.readOnly = false;
    }
    const statusEl = document.getElementById('vehicle_status');
    if (statusEl) statusEl.value = 'active'; // Vẫn giữ giá trị active
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
      const btnClose = modal ? modal.querySelector('.close-button') : null;
      const btnCancel = document.getElementById('vehicleCancelBtn');
      const form = modal ? modal.querySelector('.vehicle__form') : null;

      function openModal() {
        // 💡 Dịch: Cập nhật tiêu đề modal
        const modalTitle = modal.querySelector('.vehicle__modal-title');
        if (modalTitle) {
          modalTitle.textContent = currentEditingVin
                                    ? T('vehicle.modal.title_edit', 'Chỉnh sửa hồ sơ xe')
                                    : T('vehicle.modal.title_add', 'Đăng ký hồ sơ xe mới');
        }
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
          const currentStaffId = 2; // Giữ giá trị mẫu 7

          const submitBtn = document.getElementById('vehicleSubmitBtn');
          const originalText = submitBtn.textContent;
          submitBtn.disabled = true;
          // 💡 Dịch: Đang xử lý...
          submitBtn.textContent = T('form.processing', 'Đang xử lý...');


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
          let successMessage = '';

          if (currentEditingVin) {
            method = 'PUT';
            url = `${API_BASE_URL}/update/${encodeURIComponent(currentEditingVin)}?staffId=${currentStaffId}`;
            successMessage = T('vehicle.alert.update_success', 'Cập nhật xe thành công!');

            const oldData = vehiclesCache.find(v => v.vehicle.vin === currentEditingVin);
            if (oldData) {
              requestBody.vehicle.year_Of_Manufacture = oldData.vehicle.year_Of_Manufacture;
              requestBody.vehicle.warranty_Time = oldData.vehicle.warranty_Time;
            }

          } else {
            method = 'POST';
            url = `${API_BASE_URL}/register?staffId=${currentStaffId}`;
            successMessage = T('vehicle.alert.register_success', 'Đăng ký xe thành công!');
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
              alert(successMessage);
              closeModal();
              loadVehiclesTable();
            })
            .catch((error) => {
              // 💡 Dịch: Lỗi khi tạo/cập nhật xe
              console.error(T('vehicle.error.save_fail', 'Lỗi khi tạo/cập nhật xe:'), error);
              alert(`${T('general.error', 'Lỗi')}: ${error.message}`);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
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

        if (target.classList.contains('btn-delete')) { // Giữ nguyên class
          if (!targetVin) return;

          // 💡 Dịch: Xác nhận xóa
          if (!confirm(T('vehicle.alert.confirm_delete', `Bạn có chắc muốn xóa xe với VIN/Biển số: ${targetVin}?`))) return;

          fetch(`${API_BASE_URL}/delete/${encodeURIComponent(targetVin)}`, {
            method: 'DELETE',
          })
            .then((response) => {
              if (!response.ok) {
                return response.text().then((text) => { throw new Error(text || T('vehicle.error.delete_fail', 'Xóa thất bại')); });
              }
              return response.text();
            })
            .then((msg) => {
              console.log(msg);
              // 💡 Dịch: Xóa xe thành công!
              alert(T('vehicle.alert.delete_success', 'Xóa xe thành công!'));
              loadVehiclesTable();
            })
            .catch((error) => {
              // 💡 Dịch: Lỗi xóa:
              console.error(T('vehicle.error.delete_fail', 'Lỗi khi xóa xe:'), error);
              alert(`${T('general.error', 'Lỗi xóa')}: ${error.message}`);
            });
        }

        if (target.classList.contains('btn-edit')) { // Giữ nguyên class
          if (!targetVin) return;

          currentEditingVin = targetVin;

          const vehicleData = vehiclesCache.find(v => v.vehicle && v.vehicle.vin === targetVin);

          if (vehicleData) {
            fillVehicleForm(vehicleData);
            openModal();
          } else {
            // 💡 Dịch: Không tìm thấy dữ liệu xe để sửa.
            console.error('Không tìm thấy xe trong cache với VIN:', targetVin);
            alert(T('vehicle.error.no_cache_data', 'Lỗi: Không tìm thấy dữ liệu xe để sửa.'));
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