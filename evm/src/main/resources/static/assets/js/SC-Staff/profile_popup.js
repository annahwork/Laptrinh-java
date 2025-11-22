document.addEventListener('DOMContentLoaded', function () {
  console.log(" Profile Popup Script Loaded");

  const userGroup = document.getElementById('userProfileGroup');
  const dropdown = document.getElementById('userDropdown');

  console.log("profile_popup: looking for elements", { userGroupExists: !!userGroup, dropdownExists: !!dropdown });

  if (userGroup && dropdown) {

    const CONTEXT_PATH = (() => {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      return pathParts.length > 0 ? `/${pathParts[0]}` : '/evm';
    })();
    console.log('profile_popup: CONTEXT_PATH=', CONTEXT_PATH);

    userGroup.addEventListener('click', function (e) {
      e.stopPropagation();

      dropdown.classList.toggle('show');
      console.log("Toggle Menu:", dropdown.classList.contains('show'));
    });

    dropdown.addEventListener('click', function (e) {
      e.stopPropagation();
      console.log('profile_popup: clicked inside dropdown, preventing close');
    });
    function attachDropdownToBody() {
      if (!dropdown.dataset.attached) {
        // preserve original placeholder so we could restore if needed
        dropdown._originalParent = dropdown.parentNode;
        document.body.appendChild(dropdown);
        dropdown.dataset.attached = 'true';
      }
    }

    function showDropdown() {
      attachDropdownToBody();
      positionDropdown();
      dropdown.classList.add('show');
      dropdown.style.display = 'block';
      dropdown.style.visibility = 'visible';
      dropdown.style.zIndex = '99999';
    }

    function hideDropdown() {
      dropdown.classList.remove('show');
      dropdown.style.display = 'none';
      dropdown.style.visibility = 'hidden';
    }
    function initDropdownButtons() {
      const btnSettings = dropdown.querySelector('#btnSettings');
      const darkmodeToggle = dropdown.querySelector('#darkmodeToggle');
      const btnLogout = dropdown.querySelector('#btnLogout');
      const btnLogin = dropdown.querySelector('#btnLogin');

      if (btnSettings) {
        btnSettings.addEventListener('click', function (ev) {
          ev.preventDefault();
          // try to trigger existing SPA navigation if available
          const navLink = document.querySelector('a[data-page="account_scstaff.html"], a[data-page="account.html"], a[href*="account"]');
          if (navLink) {
            navLink.click();
          } else {
            // fallback to a likely account URL
            window.location.href = '/evm/account';
          }
          hideDropdown();
        });
      }

      if (darkmodeToggle) {
        // initialize state from saved theme
        const applyState = () => {
          const cur = document.documentElement.getAttribute('data-theme');
          darkmodeToggle.checked = (cur === 'dark');
        };

        darkmodeToggle.addEventListener('change', function (ev) {
          const isOn = darkmodeToggle.checked;
          if (isOn) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('site-theme', 'dark');
          } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('site-theme', 'light');
          }
        });

        applyState();
      }

      if (btnLogout) {
        btnLogout.addEventListener('click', async function (ev) {
          ev.preventDefault();
          // show confirm modal before logging out
          try {
            const ok = await window.showConfirm('Bạn có chắc muốn đăng xuất?');
            if (!ok) return; // user cancelled
          } catch (err) {
            // if modal fails, fallback to native confirm
            if (!confirm('Bạn có chắc muốn đăng xuất?')) return;
          }

          hideDropdown();
          try {
            // call logout API if available, then redirect to login
            await fetch(`${CONTEXT_PATH}/api/login/logout`, { method: 'GET', credentials: 'same-origin' });
          } catch (err) {
            console.warn('Logout API call failed or not available:', err);
          }
          window.location.href = CONTEXT_PATH + '/login';
        });
      }

      // Some templates use btnLogin id for the logout/login link — handle it too
      if (btnLogin) {
        btnLogin.addEventListener('click', async function (ev) {
          ev.preventDefault();
          // confirm before redirecting to login (used as logout link in some templates)
          try {
            const ok = await window.showConfirm('Bạn có chắc muốn đăng xuất?');
            if (!ok) return;
          } catch (err) {
            if (!confirm('Bạn có chắc muốn đăng xuất?')) return;
          }
          hideDropdown();
          window.location.href = CONTEXT_PATH + '/login';
        });
      }
    }

    // init buttons now and also after attaching dropdown to body (elements remain same node)
    initDropdownButtons();

    function positionDropdown() {
      const rect = userGroup.getBoundingClientRect();
      // determine desired width based on userGroup width
      const desiredWidth = Math.max(220, rect.width + 20);
      dropdown.style.width = desiredWidth + 'px';

      // show briefly (hidden) to measure height, then restore
      const prevDisplay = dropdown.style.display;
      const prevVisibility = dropdown.style.visibility;
      dropdown.style.visibility = 'hidden';
      dropdown.style.display = 'block';
      const ddHeight = dropdown.offsetHeight;
      // restore
      dropdown.style.display = prevDisplay || 'none';
      dropdown.style.visibility = prevVisibility || '';

      // position: try below, otherwise place above
      let top = rect.bottom + 6; // gap
      if (top + ddHeight > window.innerHeight - 8) {
        top = rect.top - 6 - ddHeight; // place above
      }

      // center horizontally relative to userGroup
      let left = Math.round(rect.left + rect.width / 2 - desiredWidth / 2);
      // keep within viewport with 8px margin
      left = Math.max(8, Math.min(left, window.innerWidth - desiredWidth - 8));

      dropdown.style.position = 'fixed';
      dropdown.style.top = top + 'px';
      dropdown.style.left = left + 'px';
      dropdown.style.right = 'auto';
    }

    // Override toggle to attach and position when opening
    userGroup.addEventListener('click', function (e) {
      e.stopPropagation();
      const willShow = !dropdown.classList.contains('show');
      if (willShow) showDropdown();
      else hideDropdown();
      console.log("Toggle Menu:", dropdown.classList.contains('show'));
    });

    // Reposition on window resize/scroll while open
    window.addEventListener('resize', function () {
      if (dropdown.classList.contains('show')) positionDropdown();
    });
    window.addEventListener('scroll', function () {
      if (dropdown.classList.contains('show')) positionDropdown();
    }, true);

    // Nhiều layout tách avatar / username ra các phần tử con; đảm bảo click trên ảnh hoặc tên cũng bật/tắt
    const avatar = userGroup.querySelector('img, .sidebar__user-avatar, .avatar');
    const nameElem = userGroup.querySelector('.sidebar__userinfo, .sidebar__username');
    [avatar, nameElem].forEach(el => {
      if (el) {
        el.addEventListener('click', function (ev) {
          ev.stopPropagation();
          const willShow = !dropdown.classList.contains('show');
          if (willShow) showDropdown();
          else hideDropdown();
          console.log('Toggle Menu (from child):', dropdown.classList.contains('show'));
        });
      }
    });

    // 3. Sự kiện bấm ra ngoài khoảng không -> Đóng menu
    document.addEventListener('click', function (e) {
      // Nếu click KHÔNG nằm trong khối userGroup thì đóng menu
      if (!userGroup.contains(e.target)) {
        hideDropdown();
      }
    });

  } else {
    console.warn(" Không tìm thấy ID 'userProfileGroup' hoặc 'userDropdown'. Kiểm tra lại HTML", { userGroup, dropdown });
  }
});