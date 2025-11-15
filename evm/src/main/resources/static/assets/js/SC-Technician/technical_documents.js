(function () {
  function initDocumentsPage() {
    const searchInput = document.getElementById("searchDocs");
    const typeFilter = document.getElementById("docTypeFilter");
    const uploadBtn = document.getElementById("btnUploadDoc");
    const container = document.getElementById("docContainer");

    function filterDocuments() {
      const searchValue = searchInput.value.toLowerCase();
      const typeValue = typeFilter.value;

      container.querySelectorAll(".data-card").forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const type = card.querySelector(".doc-type").classList[1];
        const matchSearch = title.includes(searchValue);
        const matchType = typeValue === "all" || typeValue === type;
        card.style.display = matchSearch && matchType ? "block" : "none";
      });
    }

    if (searchInput) searchInput.addEventListener("input", filterDocuments);
    if (typeFilter) typeFilter.addEventListener("change", filterDocuments);

    if (uploadBtn) {
      uploadBtn.addEventListener("click", () => {
        alert("📂 Chức năng tải lên sẽ được tích hợp sau (upload file).");
      });
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initDocumentsPage);
  else initDocumentsPage();
})();
