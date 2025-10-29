document.getElementById('year').textContent = new Date().getFullYear();
const partsForm = document.getElementById('parts-form');

// Initialize data from localStorage
let partsOrders = JSON.parse(localStorage.getItem('partsOrders')) || [];
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

// Validate parts form
function validatePartsForm(data) {
  if (!data.code.trim() || !data.name.trim() || data.qty <= 0) {
    alert('Vui lòng điền đầy đủ và hợp lệ thông tin phụ tùng!');
    return false;
  }
  return true;
}

// Handle parts form submission
partsForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = {
    code: document.getElementById('pt-code').value.trim(),
    qty: parseInt(document.getElementById('pt-qty').value),
    name: document.getElementById('pt-name').value.trim(),
    note: document.getElementById('pt-note').value.trim(),
    status: 'Chờ duyệt',
    date: new Date().toISOString().split('T')[0]
  };

  if (validatePartsForm(data)) {
    partsOrders.push(data);
    localStorage.setItem('partsOrders', JSON.stringify(partsOrders));
    notifications.unshift({
      title: `Đơn phụ tùng mới (${data.code})`,
      date: data.date,
      type: 'info'
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    alert('Yêu cầu phụ tùng đã được gửi đến EVM staff!');
    this.reset();
  }
});

// Reset button
document.getElementById('btnReset').addEventListener('click', () => {
  partsForm.reset();
});