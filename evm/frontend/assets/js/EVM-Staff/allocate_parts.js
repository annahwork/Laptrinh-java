(function(){
      const partsTableBody = document.getElementById('partsTableBody');
      const refreshBtn = document.getElementById('refreshPartsList');
      const openModalBtn = document.getElementById('openAllocateModal');
      const allocateModal = document.getElementById('allocateModal');
      const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
      const allocateForm = document.getElementById('allocateForm');
      const partsMoreRow = document.querySelector('.parts-more-row');
      const partsViewMoreBtn = document.getElementById('partsViewMoreBtn');

      // Tính số hàng dữ liệu thực (loại trống / more-row)
      function getDataRows() {
        if(!partsTableBody) return [];
        // lấy tất cả tr trong tbody trừ .parts-more-row
        return Array.from(partsTableBody.querySelectorAll('tr')).filter(tr => !tr.classList.contains('parts-more-row'));
      }

      // Ẩn hàng >2 và show nút Xem thêm nếu cần
      function updatePartsVisibility(){
        const dataRows = getDataRows();
        if(dataRows.length > 2){
          dataRows.forEach((tr, idx) => {
            if(idx >= 2) tr.style.display = 'none';
            else tr.style.display = '';
          });
          if(partsMoreRow) partsMoreRow.style.display = ''; // hiện hàng xem thêm
        } else {
          dataRows.forEach(tr => tr.style.display = '');
          if(partsMoreRow) partsMoreRow.style.display = 'none';
        }
      }

      // Nút xem thêm: chuyển sang trang quản lý phụ tùng (thay bằng route thực tế)
      partsViewMoreBtn?.addEventListener('click', () => {
        window.location.href = '/Laptrinh-java/evm/frontend/pages/EVM-Staff/Secsion/manage_ev_parts.html';
      });

      // Mở modal phân bổ
      openModalBtn?.addEventListener('click', () => {
        if(allocateModal){
          allocateModal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
          // focus vào trường đầu
          const first = allocateModal.querySelector('select, input, button');
          if(first) first.focus();
        }
      });

      // Đóng modal cho mọi nút có class .modal-close-btn
      modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if(allocateModal){
            allocateModal.style.display = 'none';
            document.body.style.overflow = '';
          }
        });
      });

      // Click ra ngoài để đóng
      allocateModal?.addEventListener('click', (e) => {
        if(e.target === allocateModal){
          allocateModal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });

      // ESC để đóng modal
      document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && allocateModal && allocateModal.style.display !== 'none'){
          allocateModal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });

      // submit form phân bổ (ví dụ demo)
      allocateForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const center = document.getElementById('scCenterSelect')?.value;
        const qty = Number(document.getElementById('quantity')?.value || 0);
        if(!center || qty <= 0){
          alert('Vui lòng điền trung tâm nhận và số lượng hợp lệ.');
          return;
        }
        // TODO: call API để gửi phân bổ
        console.log('Gửi phân bổ:', { center, qty });
        // đóng modal và reset
        allocateModal.style.display = 'none';
        document.body.style.overflow = '';
        allocateForm.reset();
        // (tùy bạn có thể thêm cập nhật UI lịch sử phân bổ ở đây)
      });

      // refresh (demo)
      refreshBtn?.addEventListener('click', () => {
        window.location.reload();
      });

      // Khởi tạo hiển thị
      updatePartsVisibility();
    })();