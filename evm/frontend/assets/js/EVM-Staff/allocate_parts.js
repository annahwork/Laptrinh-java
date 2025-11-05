<script>
  // Giới hạn hiển thị phụ tùng: hiển thị tối đa 2 rows, nếu >2 hiện nút "Xem thêm"
  (function(){
    const partsTable = document.querySelector('.parts-table');
    const partsRows = partsTable ? partsTable.querySelectorAll('.parts-table__row') : [];
    const partsMoreRow = partsTable ? partsTable.querySelector('.parts-table__more-row') : null;
    const partsViewMoreBtn = document.getElementById('partsViewMoreBtn');
    const refreshBtn = document.getElementById('refreshPartsList');
    const openModalBtn = document.getElementById('openAllocateModal');

    // Ẩn hàng >2 và show nút Xem thêm nếu cần
    function updatePartsVisibility(){
      if(!partsTable) return;
      const total = partsRows.length;
      if(total > 2){
        partsTable.classList.add('is-collapsed');
        if(partsMoreRow) partsMoreRow.style.display = '';
        // show view-more button inside more-row as fallback
        const viewBtn = document.getElementById('partsViewMoreBtn');
        if(viewBtn) viewBtn.style.display = '';
      } else {
        partsTable.classList.remove('is-collapsed');
        if(partsMoreRow) partsMoreRow.style.display = 'none';
      }
    }

    // Nút xem thêm: chuyển sang trang quản lý phụ tùng
    document.getElementById('partsViewMoreBtn')?.addEventListener('click', () => {
      window.location.href = '/Laptrinh-java/evm/frontend/pages/EVM-Staff/Secsion/manage_ev_parts.html';
      // hoặc set đúng đường dẫn quản lý phụ tùng của bạn
    });

    // Nút xem thêm lịch
    document.getElementById('historyViewMoreBtn')?.addEventListener('click', () => {
      window.location.href = '/Laptrinh-java/evm/frontend/pages/EVM-Staff/Secsion/allocate_parts.html'; // thay bằng trang lịch sử nếu có
    });
    document.getElementById('historyViewMoreBtnInner')?.addEventListener('click', () => {
      document.getElementById('historyViewMoreBtn')?.click();
    });

    // Mở modal phân bổ
    openModalBtn?.addEventListener('click', () => {
      const modal = document.getElementById('allocateModal');
      if(modal){
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });

    // Đóng modal
    document.querySelectorAll('#closeAllocateModal').forEach(btn=>{
      btn.addEventListener('click', ()=> {
        const modal = document.getElementById('allocateModal');
        if(modal){
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    });

    // Click ra ngoài để đóng
    window.addEventListener('click', (e)=> {
      const modal = document.getElementById('allocateModal');
      if(modal && e.target === modal){
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    // nút Refresh - ví dụ reload data (ở đây chỉ làm demo: reload trang)
    refreshBtn?.addEventListener('click', ()=> {
      // TODO: gọi endpoint / load lại data. Tạm thời reload:
      window.location.reload();
    });

    // Khởi tạo
    updatePartsVisibility();
  })();
</script>
