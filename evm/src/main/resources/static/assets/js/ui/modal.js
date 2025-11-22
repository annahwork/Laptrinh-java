// Simple reusable modal functions: showConfirm(message) -> Promise<boolean>, showAlert(message) -> Promise<void>
/* modal utility loaded */
console.log('modal.js loaded');
(function () {
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'custom-modal-overlay';
    return overlay;
  }

  function createModalBox(message, options = {}) {
    const box = document.createElement('div');
    box.className = 'custom-modal-box';
    if (options.maxWidth) box.style.maxWidth = options.maxWidth;

    const msg = document.createElement('div');
    msg.className = 'custom-modal-message';
    msg.textContent = message;

    const actions = document.createElement('div');
    actions.className = 'custom-modal-actions';

    box.appendChild(msg);
    box.appendChild(actions);
    return { box, actions };
  }

  function makeButton(text, primary = false) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.className = primary ? 'custom-btn primary' : 'custom-btn';
    return b;
  }

  window.showConfirm = function (message, opts = {}) {
    return new Promise((resolve) => {
      const overlay = createOverlay();
      const { box, actions } = createModalBox(message, opts.box || {});

      const btnCancel = makeButton(opts.cancelText || 'Hủy', false);
      const btnOk = makeButton(opts.okText || (opts.okIsDanger ? 'Xóa' : 'OK'), opts.okPrimary !== false && !opts.okIsDanger);
      if (opts.okIsDanger) {
        btnOk.classList.add('danger');
      }

      actions.appendChild(btnCancel);
      actions.appendChild(btnOk);

      overlay.appendChild(box);
      document.body.appendChild(overlay);

      function cleanup(result) {
        try { document.body.removeChild(overlay); } catch (e) { /* ignore */ }
        resolve(result);
      }

      btnCancel.addEventListener('click', function () { cleanup(false); });
      btnOk.addEventListener('click', function () { cleanup(true); });

      // close on ESC
      function onKey(e) {
        if (e.key === 'Escape') { cleanup(false); }
      }
      document.addEventListener('keydown', onKey);

      // remove key listener when done
      const origResolve = resolve;
      resolve = function (v) { document.removeEventListener('keydown', onKey); origResolve(v); };
    });
  };

  window.showAlert = function (message, opts = {}) {
    return new Promise((resolve) => {
      const overlay = createOverlay();
      const { box, actions } = createModalBox(message, opts.box || {});
      const btnOk = makeButton(opts.okText || 'OK', true);
      actions.appendChild(btnOk);
      overlay.appendChild(box);
      document.body.appendChild(overlay);

      btnOk.addEventListener('click', function () {
        try { document.body.removeChild(overlay); } catch (e) { }
        resolve();
      });
      function onKey(e) { if (e.key === 'Escape') { try { document.body.removeChild(overlay); } catch (e) { } resolve(); } }
      document.addEventListener('keydown', onKey);
    });
  };

})();
