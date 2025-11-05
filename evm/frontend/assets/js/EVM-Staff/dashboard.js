// file: /assets/js/JS.js  (hoặc file JS đang load trong page)
(function () {
  // --- helper load page into main-content ---
  function loadPage(page) {
    // TÙY CHỈNH: cho đường dẫn tuyệt đối từ root project nếu muốn tránh sai relative.
    // Ví dụ project của bạn đặt pages trong:
    // /Laptrinh-java/evm/frontend/pages/<page>
    const base = '/Laptrinh-java/evm/frontend/pages/'; // <-- sửa cho đúng với cấu trúc bạn
    const url = base + page;

    console.info('Tải trang:', url);
    fetch(url, { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status + ' - ' + response.statusText);
        }
        return response.text();
      })
      .then(html => {
        document.getElementById('main-content').innerHTML = html;
      })
      .catch(err => {
        console.error('❌ Không tải được trang:', page, err);
        // hiện cho dev / user (tùy)
        const main = document.getElementById('main-content');
        if (main) {
          main.innerHTML = `<div style="padding:20px;color:#b91c1c;">
            ❌ Không tải được trang: ${page} — ${err.message}
            <br><small>Kiểm tra Network/Console để xem chi tiết đường dẫn.</small>
          </div>`;
        }
      });
  }

  // --- gắn event cho sidebar links ---
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.sidebar__link[data-page]').forEach(a => {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        const page = this.dataset.page;
        if (!page) return;
        loadPage(page);
      });
    });

    // nếu muốn load dashboard mặc định lúc mở trang:
    // loadPage('dashboard.html');
  });
})();
