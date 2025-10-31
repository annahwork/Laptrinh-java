// ====  customer_record_management.js  ====
document.addEventListener("DOMContentLoaded", function () {
  // ==== STATE ====
  let customers = [];
  let editIndex = null;

  // ==== SELECTORS ====
  const tableBody = document.querySelector("#customers-table tbody");
  const emptyNote = document.getElementById("customers-empty");
  const searchBox = document.getElementById("customer-search");
  const modal = document.getElementById("customer-modal");
  const modalTitle = document.getElementById("customer-modal-title");
  const form = document.getElementById("customer-form");

  const idInput = document.getElementById("cust-id");
  const nameInput = document.getElementById("cust-name");
  const phoneInput = document.getElementById("cust-phone");
  const emailInput = document.getElementById("cust-email");
  const addressInput = document.getElementById("cust-address");

  const btnAdd = document.getElementById("btn-add-customer");
  const btnCancel = document.getElementById("customer-cancel");
  const btnExport = document.getElementById("btn-export-customers");
  const btnImport = document.getElementById("btn-import-customers");
  const fileImport = document.getElementById("file-import-customers");

  // ==== FUNCTIONS ====

  // Hiển thị danh sách khách hàng
  function renderTable(list = customers) {
    tableBody.innerHTML = "";

    if (list.length === 0) {
      emptyNote.style.display = "block";
      return;
    }
    emptyNote.style.display = "none";

    list.forEach((cust, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${cust.id}</td>
        <td>${cust.name}</td>
        <td>${cust.phone || "-"}</td>
        <td>${cust.email || "-"}</td>
        <td>${cust.address || "-"}</td>
        <td>
          <button class="btn btn-sm btn-edit" data-index="${index}">Sửa</button>
          <button class="btn btn-sm btn-delete" data-index="${index}">Xóa</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Mở modal
  function openModal(isEdit = false) {
    modal.classList.remove("modal-hidden");
    modal.setAttribute("aria-hidden", "false");
    if (isEdit) {
      modalTitle.textContent = "Chỉnh sửa khách hàng";
    } else {
      modalTitle.textContent = "Thêm khách hàng";
      form.reset();
      idInput.value = generateId();
    }
  }

  // Đóng modal
  function closeModal() {
    modal.classList.add("modal-hidden");
    modal.setAttribute("aria-hidden", "true");
    editIndex = null;
  }

  // Sinh ID khách hàng tự động
  function generateId() {
    const num = customers.length + 1;
    return "KH_" + num.toString().padStart(5, "0");
    // KH_00001
  }

  // Thêm / Cập nhật khách hàng
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const newCust = {
      id: idInput.value || generateId(),
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      address: addressInput.value.trim(),
    };

    if (!newCust.name) {
      alert("Tên khách hàng không được bỏ trống!");
      return;
    }

    if (editIndex !== null) {
      customers[editIndex] = newCust;
    } else {
      customers.push(newCust);
    }

    renderTable();
    closeModal();
  });

  // Nút thêm khách
  btnAdd.addEventListener("click", () => {
    editIndex = null;
    openModal(false);
  });

  // Nút hủy
  btnCancel.addEventListener("click", closeModal);

  // Xử lý sự kiện sửa / xóa
  tableBody.addEventListener("click", (e) => {
    const btn = e.target;
    if (btn.classList.contains("btn-edit")) {
      editIndex = parseInt(btn.dataset.index);
      const cust = customers[editIndex];

      idInput.value = cust.id;
      nameInput.value = cust.name;
      phoneInput.value = cust.phone;
      emailInput.value = cust.email;
      addressInput.value = cust.address;

      openModal(true);
    }

    if (btn.classList.contains("btn-delete")) {
      const idx = parseInt(btn.dataset.index);
      if (confirm("Xóa khách hàng này?")) {
        customers.splice(idx, 1);
        renderTable();
      }
    }
  });

  // Tìm kiếm
  searchBox.addEventListener("input", () => {
    const keyword = searchBox.value.toLowerCase();
    const filtered = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(keyword) ||
        (c.phone && c.phone.toLowerCase().includes(keyword)) ||
        (c.email && c.email.toLowerCase().includes(keyword))
    );
    renderTable(filtered);
  });

  // Xuất JSON
  btnExport.addEventListener("click", () => {
    if (customers.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }
    const blob = new Blob([JSON.stringify(customers, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Nhập JSON
  btnImport.addEventListener("click", () => fileImport.click());
  fileImport.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data)) {
          customers = data;
          renderTable();
          alert("Nhập dữ liệu thành công!");
        } else {
          alert("File không đúng định dạng!");
        }
      } catch {
        alert("Lỗi khi đọc file!");
      }
    };
    reader.readAsText(file);
  });

