(function () {
    'use strict';

    const documentsData = [
        { id: 1, title: "Hướng dẫn bảo dưỡng pin Lithium", type: "manual", content: "Chi tiết quy trình kiểm tra, làm sạch và thay thế cell pin.", file: "huongdan_baoduong_pin.docx" },
        { id: 2, title: "Sơ đồ mạch điện xe máy điện EVM-01", type: "diagram", content: "Sơ đồ kết nối mạch điện chính, bao gồm bộ điều khiển và cảm biến tốc độ.", file: "sododien_EVM01.docx" },
        { id: 3, title: "Biểu mẫu kiểm tra sau bảo dưỡng", type: "form", content: "Form checklist gồm 15 hạng mục cần xác nhận sau khi bảo dưỡng.", file: "form_kiemtra.docx" },
        { id: 4, title: "Hướng dẫn thay thế bộ điều khiển trung tâm", type: "manual", content: "Các bước tháo lắp, lập trình và kiểm thử bộ điều khiển trung khiển trung tâm MCU.", file: "huongdan_thaybo_MC.docx" },
        { id: 5, title: "Sơ đồ hệ thống phanh điện tử EBS", type: "diagram", content: "Sơ đồ phân tích tín hiệu cảm biến phanh và bộ xử lý trung tâm EBS.", file: "sodo_phanhEBS.docx" },
        { id: 6, title: "Biểu mẫu ghi nhận sự cố", type: "form", content: "Dùng để kỹ thuật viên ghi nhận lỗi và tình trạng khắc phục sự cố.", file: "form_suco.docx" },
        { id: 7, title: "Hướng dẫn sử dụng phần mềm chẩn đoán lỗi", type: "manual", content: "Giới thiệu giao diện và quy trình đọc lỗi từ bộ điều khiển xe điện.", file: "huongdan_chanloi.docx" },
        { id: 8, title: "Sơ đồ cảm biến tốc độ bánh xe", type: "diagram", content: "Hiển thị cách kết nối cảm biến tốc độ và tín hiệu đầu vào ECU.", file: "sodo_cam_bien_toc_do.docx" },
        { id: 9, title: "Biểu mẫu bảo hành pin", type: "form", content: "Ghi nhận chi tiết các trường hợp bảo hành và thay thế pin Lithium.", file: "form_baohanh_pin.docx" },
        { id: 10, title: "Hướng dẫn kiểm tra động cơ điện", type: "manual", content: "Các bước kiểm tra điện trở, công suất và hiệu suất của động cơ điện.", file: "huongdan_kiemtra_dongco.docx" },
        { id: 11, title: "Sơ đồ dây dẫn hệ thống sạc nhanh", type: "diagram", content: "Sơ đồ kết nối giữa trạm sạc nhanh và module pin.", file: "sodo_sacnhanh.docx" },
        { id: 12, title: "Biểu mẫu bảo dưỡng định kỳ", type: "form", content: "Checklist cho các kỳ bảo dưỡng 1000km, 3000km, 5000km.", file: "form_baoduong_dinhky.docx" },
        { id: 13, title: "Hướng dẫn thay thế cầu chì chính", type: "manual", content: "Chi tiết thao tác tháo lắp cầu chì và lựa chọn loại cầu chì phù hợp.", file: "huongdan_thay_cauchinh.docx" },
        { id: 14, title: "Sơ đồ hệ thống đèn pha thông minh", type: "diagram", content: "Chi tiết sơ đồ mạch chiếu sáng và cảm biến ánh sáng tự động.", file: "sodo_denpha.docx" },
        { id: 15, title: "Biểu mẫu nghiệm thu sau sửa chữa", type: "form", content: "Mẫu phiếu xác nhận chất lượng sau khi hoàn thành bảo hành.", file: "form_nghiemthu.docx" },
        { id: 16, title: "Hướng dẫn kiểm tra cảm biến nhiệt độ", type: "manual", content: "Phương pháp đo và xác định lỗi cảm biến nhiệt trong pin.", file: "huongdan_cam_bien_nhiet.docx" },
        { id: 17, title: "Sơ đồ hệ thống truyền động", type: "diagram", content: "Cấu trúc cơ khí và điện tử trong hệ thống truyền động bánh sau.", file: "sodo_truyendong.docx" },
        { id: 18, title: "Biểu mẫu theo dõi thời gian bảo hành", type: "form", content: "Theo dõi thời gian bảo hành và các hạng mục đã thay thế.", file: "form_theogio.docx" },
        { id: 19, title: "Hướng dẫn xử lý lỗi khởi động", type: "manual", content: "Cách xác định nguyên nhân xe không khởi động và khắc phục.", file: "huongdan_loikhoidong.docx" },
        { id: 20, title: "Sơ đồ hệ thống làm mát pin", type: "diagram", content: "Mô tả đường ống, cảm biến nhiệt và bộ điều khiển quạt làm mát.", file: "sodo_lammatpin.docx" },
        { id: 21, title: "Biểu mẫu kiểm tra linh kiện nhập kho", type: "form", content: "Ghi nhận số lượng và tình trạng linh kiện mới nhập.", file: "form_kiemtra_nhapkho.docx" },
        { id: 22, title: "Hướng dẫn thay module sạc", type: "manual", content: "Các bước tháo, thay và kiểm thử module sạc xe điện.", file: "huongdan_thay_module_sac.docx" },
        { id: 23, title: "Sơ đồ cảm biến áp suất lốp", type: "diagram", content: "Sơ đồ truyền tín hiệu áp suất đến ECU trung tâm.", file: "sodo_ap_suat_lop.docx" },
        { id: 24, title: "Biểu mẫu báo cáo kỹ thuật", type: "form", content: "Mẫu ghi nhận kết quả kiểm tra định kỳ của kỹ thuật viên.", file: "form_baocao_kythuat.docx" },
        { id: 25, title: "Hướng dẫn cập nhật firmware ECU", type: "manual", content: "Các bước cập nhật phần mềm điều khiển ECU qua cổng USB.", file: "huongdan_firmware.docx" },
        { id: 26, title: "Sơ đồ hệ thống đèn tín hiệu", type: "diagram", content: "Chi tiết sơ đồ đấu nối đèn xi nhan và đèn phanh.", file: "sodo_den_tin_hieu.docx" },
        { id: 27, title: "Biểu mẫu bàn giao xe sau bảo hành", type: "form", content: "Phiếu bàn giao và xác nhận xe sau bảo hành.", file: "form_bangiao_xe.docx" },
        { id: 28, title: "Hướng dẫn thay pin điều khiển", type: "manual", content: "Hướng dẫn thay pin trong remote điều khiển xe điện.", file: "huongdan_thay_pin_remote.docx" },
        { id: 29, title: "Sơ đồ nguồn điện xe điện", type: "diagram", content: "Chi tiết hệ thống cấp nguồn 48V-72V và bộ chuyển đổi DC-DC.", file: "sodo_nguon.docx" },
        { id: 30, title: "Biểu mẫu đánh giá kỹ thuật viên", type: "form", content: "Bảng đánh giá năng lực kỹ thuật viên theo tiêu chuẩn EVM.", file: "form_danhgia_tech.docx" }
    ];

    window.openDocumentDetail = function (id) {
        const doc = documentsData.find(d => d.id.toString() === id.toString());
        if (!doc) return;

        const modal = document.getElementById('modalChiTiet'); 

        if (!modal) {
            console.error('Modal element not found!');
            return;
        }

        document.getElementById('detailTitle').textContent = `Chi tiết Tài liệu: ${doc.title || 'N/A'}`;
        
        const detailContent = `
            <p><strong>Mã tài liệu:</strong> DOC-2025-${String(doc.id).padStart(3, '0')}</p>
            <p><strong>Loại tài liệu:</strong> ${getDocumentTypeLabel(doc.type)}</p>
            <p><strong>Nội dung tóm tắt:</strong> ${doc.content || 'Không có mô tả.'}</p>
            <p><strong>Ngày phát hành:</strong> 01/11/2025</p>
            <p><strong>Người đăng:</strong> EV Manufacturer</p>
            <p><strong>Tên file:</strong> ${doc.file}</p>
            <button class="btn-primary" onclick="handleDownload('${doc.file}')">Tải xuống (${doc.file})</button>`;

        document.getElementById('detailDescription').innerHTML = detailContent; 

        modal.style.display = 'flex';
    };

    window.closeDocumentDetail = function () {
        const modal = document.getElementById('modalChiTiet');
        if (modal) modal.style.display = 'none';
    };

    function getDocumentTypeLabel(type) {
        switch (type) {
            case 'manual':
                return 'Hướng dẫn';
            case 'diagram':
                return 'Sơ đồ';
            case 'form':
                return 'Biểu mẫu';
            default:
                return 'Khác';
        }
    }

    function createDocumentCard(doc) {
        const card = document.createElement('div');
        card.className = 'data-card';
        card.setAttribute('data-doc-id', doc.id);

        const releaseDate = '01/11/2025';
        const publisher = 'EV Manufacturer';

        card.innerHTML = `
            <div class="card-header">
                <h3>${doc.title}</h3>
                <span class="doc-type ${doc.type}">${getDocumentTypeLabel(doc.type)}</span>
            </div>
            <div class="card-body">
                <p><strong>Mã tài liệu:</strong> DOC-2025-${String(doc.id).padStart(3, '0')}</p>
                <p><strong>Ngày phát hành:</strong> ${releaseDate}</p>
                <p><strong>Người đăng:</strong> ${publisher}</p>
                </div>
            <div class="card-footer">
                <button class="btn-outline btn-view-detail" onclick="openDocumentDetail(${doc.id})">Xem Chi tiết</button>
                <button class="btn-light btn-download" data-file-name="${doc.file}">Tải xuống</button>
            </div>`;
        const downloadButton = card.querySelector('.btn-download');
        downloadButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const fileName = e.currentTarget.getAttribute('data-file-name');
            handleDownload(fileName);
        });

        return card;
    }

    function renderDocuments(documents) {
        const container = document.getElementById("docContainer");
        if (container) {
            container.innerHTML = '';
            documents.forEach(doc => {
                container.appendChild(createDocumentCard(doc));
            });
        }
    }

    window.handleDownload = function (fileName) { 
        alert(`Đang mô phỏng tải xuống file: ${fileName}...\n(File sẽ được tải về dưới dạng ${fileName})`);

        const link = document.createElement('a');
        link.href = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAAAAIABQAd29yZC9fcmVscy9kb2N1bWVudC54bWwucmVscyB2c6hLSUvKB...';
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    function initDocumentsPage() {
        const searchInput = document.getElementById("searchDocs");
        const typeFilter = document.getElementById("docTypeFilter");
        const uploadBtn = document.getElementById("btnUploadDoc");

        renderDocuments(documentsData);

        function filterDocuments() {
            const searchValue = searchInput.value.toLowerCase().trim();
            const typeValue = typeFilter.value;

            const filtered = documentsData.filter(doc => {
                const title = doc.title.toLowerCase();
                const type = doc.type;

                const matchSearch = title.includes(searchValue);

                const matchType = typeValue === "all" || typeValue === type;

                return matchSearch && matchType;
            });

            renderDocuments(filtered);
        }

        if (searchInput) searchInput.addEventListener("input", filterDocuments);
        if (typeFilter) typeFilter.addEventListener("change", filterDocuments);

        if (uploadBtn) {
            uploadBtn.addEventListener("click", () => {
                alert("Chức năng tải lên sẽ được tích hợp sau (upload file).");
            });
        }

        window.addEventListener('click', e => {
            const modalDetail = document.getElementById('modalChiTiet');
            if (e.target === modalDetail) closeDocumentDetail();
        });

        document.getElementById('detailCloseBtn')?.addEventListener('click', closeDocumentDetail);

    }

    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", initDocumentsPage);
    else initDocumentsPage();
})();