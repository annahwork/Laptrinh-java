(function () {
  function initPerformancePage() {
    const filterSelect = document.getElementById("filterRange");

    const workChartCtx = document.getElementById("workChart");
    const statusChartCtx = document.getElementById("statusChart");

    const workChart = new Chart(workChartCtx, {
      type: "line",
      data: {
        labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        datasets: [
          {
            label: "Số công việc hoàn tất",
            data: [3, 4, 5, 6, 7, 5, 6],
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    const statusChart = new Chart(statusChartCtx, {
      type: "doughnut",
      data: {
        labels: ["Hoàn tất", "Đang xử lý", "Trễ hạn"],
        datasets: [
          {
            data: [36, 5, 1],
            backgroundColor: ["#16a34a", "#3b82f6", "#dc2626"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    filterSelect.addEventListener("change", () => {
      const range = filterSelect.value;
      alert(`📊 Đang xem thống kê hiệu suất cho: ${range === "week" ? "Tuần này" : range === "month" ? "Tháng này" : "Quý này"}`);
      // Sau này có thể thêm fetch API để tải dữ liệu thật tại đây
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initPerformancePage);
  else initPerformancePage();
})();
