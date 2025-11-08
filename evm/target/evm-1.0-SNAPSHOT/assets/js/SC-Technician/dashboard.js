    document.addEventListener("DOMContentLoaded", () => {
    loadOverview();
    loadSchedule();
    loadCampaigns();
    loadNotices();
    });

    const API_BASE = "http://localhost:8080/api/technician/dashboard";

    async function loadOverview() {
    try {
        const res = await fetch(`${API_BASE}/overview`);
        const data = await res.json();

        const container = document.getElementById("overview-cards");
        container.innerHTML = "";

        data.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${item.title}</h3>
            <p class="number">${item.value}</p>
        `;
        container.appendChild(card);
        });
    } catch (error) {
        console.error("Lỗi tải dữ liệu tổng quan:", error);
    }
    }

    async function loadSchedule() {
    try {
        const res = await fetch(`${API_BASE}/schedule`);
        const data = await res.json();

        const tbody = document.querySelector("#schedule-table tbody");
        tbody.innerHTML = "";

        data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.time}</td>
            <td>${row.vin}</td>
            <td>${row.customer}</td>
            <td>${row.task}</td>
            <td><span class="status ${row.statusClass}">${row.statusText}</span></td>
        `;
        tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Lỗi tải lịch làm việc:", error);
    }
    }

    async function loadCampaigns() {
    try {
        const res = await fetch(`${API_BASE}/campaigns`);
        const data = await res.json();

        const tbody = document.querySelector("#campaign-table tbody");
        tbody.innerHTML = "";

        data.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.code}</td>
            <td>${c.title}</td>
            <td>${c.vehicleCount}</td>
            <td>${c.progress}%</td>
        `;
        tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Lỗi tải chiến dịch:", error);
    }
    }

    async function loadNotices() {
    try {
        const res = await fetch(`${API_BASE}/notifications`);
        const data = await res.json();

        const tbody = document.querySelector("#notice-table tbody");
        tbody.innerHTML = "";

        data.forEach(n => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${n.date}</td>
            <td>${n.message}</td>
        `;
        tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Lỗi tải thông báo:", error);
    }
    }
