document.addEventListener("DOMContentLoaded", function () {
  const claims = [
    { id: "CR001", vehicle: "V001", requester: "Nguyễn A", date: "11-05-2025", status: "Chờ duyệt" },
    { id: "CR002", vehicle: "V002", requester: "Trần B", date: "11-06-2025", status: "Chờ duyệt" },
    { id: "CR003", vehicle: "V003", requester: "Lê C", date: "11-07-2025", status: "Đã duyệt" },
    // Thêm dữ liệu demo
  ];

  let currentPage = 1;
  const itemsPerPage = 5;

  const tableBody = document.getElementById("claimTableBody");
  const pageInfo = document.getElementById("pageInfo");
  const totalItems = document.getElementById("totalItems");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumbersContainer = document.getElementById("pageNumbers");

  const modal = document.getElementById("claimModal");
  const closeModal = document.getElementById("closeModal");
  const modalClaimInfo = document.getElementById("modalClaimInfo");
  const approveBtn = document.getElementById("approveBtn");
  const rejectBtn = document.getElementById("rejectBtn");

  function renderTable() {
    tableBody.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = claims.slice(start, end);

    pageItems.forEach(claim => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${claim.id}</td>
        <td>${claim.vehicle}</td>
        <td>${claim.requester}</td>
        <td>${claim.date}</td>
        <td>${claim.status}</td>
        <td>
          ${claim.status === "Chờ duyệt" ? `<button class="btn-action" data-id="${claim.id}">Duyệt</button>` : ""}
        </td>
      `;
      tableBody.appendChild(row);
    });

    pageInfo.textContent = start + 1;
    totalItems.textContent = claims.length;
    renderPagination();
  }

  function renderPagination() {
    pageNumbersContainer.innerHTML = "";
    const totalPages = Math.ceil(claims.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.classList.add("pagination-btn");
      if (i === currentPage) btn.classList.add("pagination-btn--active");
      btn.addEventListener("click", () => {
        currentPage = i;
        renderTable();
      });
      pageNumbersContainer.appendChild(btn);
    }
  }

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-action")) {
      const claimId = e.target.dataset.id;
      const claim = claims.find(c => c.id === claimId);
      modalClaimInfo.textContent = `Duyệt yêu cầu ${claim.id} của ${claim.requester} (Xe: ${claim.vehicle})`;
      modal.style.display = "block";

      approveBtn.onclick = () => {
        claim.status = "Đã duyệt";
        modal.style.display = "none";
        renderTable();
      };
      rejectBtn.onclick = () => {
        claim.status = "Đã từ chối";
        modal.style.display = "none";
        renderTable();
      };
    }
  });

  closeModal.onclick = () => modal.style.display = "none";
  window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) { currentPage--; renderTable(); }
  });

  nextPageBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(claims.length / itemsPerPage)) { currentPage++; renderTable(); }
  });

  renderTable();
});
