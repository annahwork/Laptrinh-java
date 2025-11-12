(function () {
    // Biến toàn cục đơn giản (không cần phân trang phức tạp nữa)
    let currentPage = 1;
    const pageSize = 10; // Giữ cố định

    // ÁNH XẠ TRẠNG THÁI sang tiếng Việt
   const statusMap = {
        "planned": "Đã lên kế hoạch",
        "active": "Đang diễn ra",
        "completed": "Đã hoàn thành",
        "Chua gi?i quy?t": "Chưa giải quyết"
    };
    /**
     * HÀM HIỂN THỊ THÔNG BÁO (Thay thế alert())
     */
    function showMessage(message, isError = false) {
        // Có thể thay thế bằng modal xịn hơn
        console.log(isError ? "LỖI:" : "THÔNG BÁO:", message);
        alert(message); // Dùng alert tạm thời
    }

    /**
     * HÀM LẤY VÀ VẼ LẠI BẢNG (Đơn giản)
     */
    function fetchCampaigns() {
        // URL đã sửa (thêm /evm)
        const url = `/evm/api/campaigns?page=${currentPage}&pageSize=${pageSize}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Lỗi mạng hoặc server');
                return res.json();
            })
            .then(data => {
                // DATA là 1 LIST [ ... ]
                renderTable(data);
            })
            .catch(err => {
                console.error('Lỗi khi tải chiến dịch:', err);
                const tbody = document.getElementById('campaignsTbody');
                if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="table-placeholder-cell">Lỗi tải dữ liệu. (Không tìm thấy /evm/api/...)</td></tr>`;
            });
    }

    /**
     * HÀM VẼ BẢNG
     */
    function renderTable(campaigns) {
        const tbody = document.getElementById('campaignsTbody');
        if (!tbody) return;

        if (!Array.isArray(campaigns) || campaigns.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="table-placeholder-cell">Không có dữ liệu chiến dịch.</td></tr>`;
            return;
        }

        tbody.innerHTML = campaigns.map(campaign => {
            // Vì date là null, show N/A nếu null hoặc chuyển định dạng nếu có giá trị
        const startDate = campaign.date ? new Date(campaign.date).toLocaleDateString() : 'Chưa nhập';
            return `
                <tr>
                    <td>${campaign.name || 'N/A'}</td>
                    <td>${startDate}</td>
                    <td>${statusMap[campaign.status] || campaign.status || 'N/A'}</td>
                    <td>${campaign.description || 'N/A'}</td>
                    <td><!-- Thao tác tuỳ chỉnh --></td>
                </tr>
            `;
        }).join('');
    }

    /**
     * HÀM XỬ LÝ FORM (Chỉ Tạo Mới)
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        const form = document.getElementById('campaignForm');
        const formData = new FormData(form);

        // Chuyển FormData sang Object JSON (Khớp POJO)
        const campaignData = {
            Name: formData.get('Name'),            
            Status: formData.get('Status'),
            Date: formData.get('Date'), // chỉ gửi đúng trường BE có
            Description: formData.get('Description')
        };

        // Lấy Staff ID (tạm gán cứng, đổi lại bằng dữ liệu thật nếu có)
        const staffId = 3;

        const url = `/evm/api/campaigns/create?staffId=${staffId}`;
        const method = 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(campaignData)
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(errData => {
                        if (errData && errData.error) {
                            throw new Error(errData.error);
                        }
                        throw new Error(`Server trả về ${res.status}`);
                    }).catch(parseErr => {
                        console.error("Lỗi parse JSON:", parseErr);
                        throw new Error(`Server trả về ${res.status} (không phải JSON)`);
                    });
                }
                return res.json();
            })
            .then(savedCampaign => {
                showMessage('Tạo chiến dịch thành công!');
                closeModal();
                fetchCampaigns();
            })
            .catch(err => {
                console.error('Lỗi khi tạo chiến dịch:', err);
                showMessage(`Tạo chiến dịch thất bại: ${err.message}`, true);
            });
    }

    // Các hàm quản lý Modal 
    const modal = document.getElementById('modalQuanLyChienDich');
    const form = document.getElementById('campaignForm');

    function openModal() {
        if (!modal || !form) return;
        form.reset();
        // Reset field ẩn ID nếu cần
        const campaignIdInput = document.getElementById('campaign_id');
        const modalTitle = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('campaignSubmitBtn');

        if (campaignIdInput) campaignIdInput.value = '';
        if (modalTitle) modalTitle.innerText = 'Tạo Chiến Dịch Mới';
        if (submitBtn) submitBtn.innerText = 'Tạo';

        modal.style.display = 'block';
    }

    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';
    }

    /**
     * Khởi chạy khi tải trang
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run);
        } else {
            run();
        }
    }

    function run() {
        // Nút mở Modal
        const btnOpen = document.getElementById('btnMoFormCampaign');
        if (btnOpen) btnOpen.addEventListener('click', openModal);

        // Nút đóng/cancel Modal
        const btnClose = document.getElementById('campaignCloseBtn');
        const btnCancel = document.getElementById('campaignCancelBtn');
        if (btnClose) btnClose.addEventListener('click', closeModal);
        if (btnCancel) btnCancel.addEventListener('click', closeModal);

        // Form Submit
        const campaignForm = document.getElementById('campaignForm');
        if (campaignForm) campaignForm.addEventListener('submit', handleFormSubmit);

        // Tải dữ liệu lần đầu
        fetchCampaigns();
    }

    init(); // Chạy
})();