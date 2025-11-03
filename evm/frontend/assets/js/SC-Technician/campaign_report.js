    (function () {
    function initReportPage() {
        const btnExport = document.getElementById("btnExportReport");
        const filter = document.getElementById("reportFilter");
        const container = document.getElementById("reportContainer");

        function exportReport() {
        const range = filter.value;
        const now = new Date();
        const title =
            range === "this-month"
            ? `Báo cáo tháng ${now.getMonth() + 1}/${now.getFullYear()}`
            : range === "last-month"
            ? `Báo cáo tháng ${now.getMonth()}/${now.getFullYear()}`
            : "Báo cáo toàn bộ chiến dịch";

        if (window.addNotification) {
            window.addNotification({
            title: title,
            meta: `Được xuất lúc ${new Date().toLocaleString()}`,
            body: "Báo cáo chiến dịch đã được xuất thành công.",
            unread: true,
            });
        } else {
            alert(`✅ ${title}\nBáo cáo đã được xuất thành công!`);
        }
        }

        function filterReports() {
        const val = filter.value;
        console.log("Đang lọc báo cáo theo:", val);
        }

        if (btnExport) btnExport.addEventListener("click", exportReport);
        if (filter) filter.addEventListener("change", filterReports);
    }

    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", initReportPage);
    else initReportPage();
    })();
