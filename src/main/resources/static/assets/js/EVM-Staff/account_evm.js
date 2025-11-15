(function () {
    'use strict';

    console.log('Account script loaded');

    const CONTEXT_PATH = (() => {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        return pathParts.length > 0 ? `/${pathParts[0]}` : '';
    })();
    console.log('Detected context path for account page:', CONTEXT_PATH);


    function handleLogout(e) {
        e.preventDefault();
        
        console.log('User clicked logout. Redirecting to login page...');
        window.location.href = CONTEXT_PATH + '/login';
    }

    function init() {
        const logoutButton = document.querySelector('.logout-button');
        
        if (logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        } else {
            console.error('Logout button (.logout-button) not found!');
        }
    }

    document.addEventListener('DOMContentLoaded', init);

})();