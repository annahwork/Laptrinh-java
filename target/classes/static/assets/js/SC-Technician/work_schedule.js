(function () {
  function initWorkSchedule() {
    const datePicker = document.getElementById("datePicker");
    const viewMode = document.getElementById("viewMode");

    function updateView() {
      const mode = viewMode.value;
      const date = new Date(datePicker.value || Date.now());
      console.log("Hiển thị lịch:", mode, "Ngày:", date.toLocaleDateString());
    }

    if (viewMode) viewMode.addEventListener("change", updateView);
    if (datePicker) datePicker.addEventListener("change", updateView);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initWorkSchedule);
  else initWorkSchedule();
})();
