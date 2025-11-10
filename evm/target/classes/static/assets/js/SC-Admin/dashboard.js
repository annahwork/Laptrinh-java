(function () {
    'use strict';

    console.log('Dashboard loaded - Ready for backend integration');

    async function loadDashboardStats() {
        try {
            const response = await fetch('/evm/api/user/stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
            const data = await response.json();

            document.getElementById('total-employees').textContent = data.totalEmployees || 0;
            document.getElementById('total-vehicles').textContent = data.totalVehicles || 0;
            

            const roles = data.roles || {};
            document.getElementById('role-admin-count').textContent = roles.ADMIN || 0;
            document.getElementById('role-scstaff-count').textContent = roles.SC_STAFF || 0;
            document.getElementById('role-sctech-count').textContent = roles.SC_TECHNICIAN || 0;
            document.getElementById('role-evm-count').textContent = roles.EVM_STAFF || 0;
        } catch (err) {
            console.error('Error loading dashboard stats:', err);
        }
    }

    loadDashboardStats();

})();
