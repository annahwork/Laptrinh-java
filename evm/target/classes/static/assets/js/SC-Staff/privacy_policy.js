document.addEventListener('DOMContentLoaded', function () {
    console.log('Privacy Policy page loaded');

    const sections = document.querySelectorAll('.privacy-policy__section');
    const backToTopBtn = document.getElementById('backToTopBtn'); // Lấy nút từ HTML

    const animateOnScroll = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight - 100) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Loại bỏ mã JS tạo và style nút bằng chuỗi cứng (Hardcoded Styling)
    if (backToTopBtn) {
        // Ẩn/hiện nút dựa trên cuộn
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
                setTimeout(() => backToTopBtn.style.opacity = '1', 10);
            } else {
                backToTopBtn.style.opacity = '0';
                setTimeout(() => backToTopBtn.style.display = 'none', 300);
            }
        });

        // Xử lý sự kiện click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Loại bỏ các sự kiện mouseenter/mouseleave nếu style được quản lý bởi CSS
    }

});