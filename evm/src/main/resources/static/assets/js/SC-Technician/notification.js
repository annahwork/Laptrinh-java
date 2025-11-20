(function () {
    'use strict';

    console.log('Notification List script loaded (Client-Side Optimized)');

    const API_BASE = '/evm/api/notifications';
    const API_MARK_READ = '/evm/api/markRead/'; 
    
    const API_MARK_ALL_READ = '/evm/api/markAllRead'; 
    
    const API_DELETE = '/evm/api/delete/'; 
    const PAGE_SIZE = 9999;

    const container = document.getElementById("notificationContainer");
    const filterSelect = document.getElementById("filterSelect");
    const markAllBtn = document.getElementById("btnMarkAllRead");
    
    let allNotifications = []; 
    let currentFilteredNotifications = []; 
    let currentPage = 1;
    let currentFilter = 'all'; 

    function formatDate(dateString) {
        if (!dateString) return 'Vừa xong'; 
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'}) + ', ' + date.toLocaleDateString('vi-VN');
    }

    function createNotificationCard(notification) {
        const isRead = notification.isRead;
        const card = document.createElement('div');
        card.className = `notification-card ${isRead ? 'read' : 'unread'}`;
        card.setAttribute('data-id', notification.notificationID); 
        
        const displayTime = formatDate(notification.timestamp);
        
        card.innerHTML = `
            <div class="notify-icon">${isRead ? '⚪' : '⚫'}</div>
            <div class="notify-content">
                <h4>${notification.title || 'Thông báo mới'}</h4>
                <p>${notification.message || 'Không có nội dung.'}</p>
                <span class="notify-time">${displayTime}</span>
            </div>
            <div class="notify-actions">
                ${isRead ? '' : '<button class="btnMarkRead" title="Đánh dấu đã đọc">✓</button>'}
            </div>
        `;
        
        card.querySelector('.btnMarkRead')?.addEventListener('click', handleMarkRead);
        return card;
    }

    function renderNotifications(notifications) {
        if (!container) return;
        container.innerHTML = '';

        if (!notifications || notifications.length === 0) {
            container.innerHTML = '<p class="no-data-message">Không có thông báo nào.</p>';
            return;
        }

        notifications.forEach(notification => {
            container.appendChild(createNotificationCard(notification));
        });
    }

    function renderPaginatedNotifications() {
        currentFilter = filterSelect?.value || 'all';
        currentFilteredNotifications = allNotifications.filter(n => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'read') return n.isRead === true;
            if (currentFilter === 'unread') return n.isRead === false;
            return true;
        });

        const totalRecords = currentFilteredNotifications.length;
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const paginated = currentFilteredNotifications.slice(startIndex, startIndex + PAGE_SIZE);
        
        renderNotifications(paginated);
        updatePagination(totalRecords);
    }

    function updatePagination(totalRecords) {
        const totalPages = Math.ceil(totalRecords / PAGE_SIZE) || 1;
    }

    async function fetchAllNotifications() {
        if (!container) return;
        container.innerHTML = '<p class="loading-message">Đang tải thông báo...</p>';

        try {
            const url = `${API_BASE}?page=1&size=9999&filter=all`; 
            
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            
            const data = await res.json();
            
            allNotifications = Array.isArray(data) ? data : data.data || [];
            
            currentPage = 1;
            renderPaginatedNotifications();
            
        } catch (err) {
            console.error('Fetch error:', err);
            container.innerHTML = `<p class="error-message">Lỗi khi tải thông báo: ${err.message}</p>`;
        }
    }

    async function handleMarkRead(e) {
        const card = e.target.closest(".notification-card");
        const id = card?.getAttribute('data-id');
        if (!id) return;
        
        try {
            const response = await fetch(API_MARK_READ + id, { method: 'POST' });
            
            if (response.ok) {
                const notif = allNotifications.find(n => n.notificationID.toString() === id.toString());
                if (notif) notif.isRead = true;
                
                renderPaginatedNotifications(); 
            } else {
                alert('Lỗi khi đánh dấu đã đọc.');
            }
        } catch (error) {
            console.error('Error marking read:', error);
        }
    }

    async function handleDelete(e) {
        const card = e.target.closest(".notification-card");
        const id = card?.getAttribute('data-id');
        if (!id || !confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;
        
        try {
            const response = await fetch(API_DELETE + id, { method: 'DELETE' });
            
            if (response.ok) {
                allNotifications = allNotifications.filter(n => n.notificationID.toString() !== id.toString());

                renderPaginatedNotifications(); 
            } else {
                alert('Lỗi khi xóa thông báo.');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }
    
    async function handleMarkAllRead() {
        if (!confirm('Bạn có muốn đánh dấu TẤT CẢ thông báo là đã đọc?')) return;

        try {
            const response = await fetch(API_MARK_ALL_READ, { method: 'POST' });
            
            if (response.ok) {
                allNotifications.forEach(n => n.isRead = true);

                renderPaginatedNotifications();
            } else {
                alert('Lỗi khi đánh dấu tất cả đã đọc.');
            }
        } catch (error) {
            console.error('Error marking all read:', error);
        }
    }
    
    function handleFilterChange() {
        currentPage = 1;
        renderPaginatedNotifications();
    }


    function initNotifications() {
        if (!container) {
            console.error('Notification container not found!');
            return;
        }
        
        if (markAllBtn) {
            markAllBtn.addEventListener("click", handleMarkAllRead);
        }

        if (filterSelect) {
            filterSelect.addEventListener("change", handleFilterChange);
        }
        
        fetchAllNotifications(); 
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initNotifications);
    } else {
        initNotifications();
    }
})();