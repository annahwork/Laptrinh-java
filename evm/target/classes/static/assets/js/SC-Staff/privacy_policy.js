
document.addEventListener('DOMContentLoaded', function () {
    console.log('Privacy Policy page loaded');

    const sections = document.querySelectorAll('.privacy-policy__section');

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

    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease, background-color 0.3s ease;
        display: none;
    `;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
            setTimeout(() => backToTopBtn.style.opacity = '1', 10);
        } else {
            backToTopBtn.style.opacity = '0';
            setTimeout(() => backToTopBtn.style.display = 'none', 300);
        }
    });

    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.backgroundColor = '#218838';
    });

    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.backgroundColor = '#28a745';
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(backToTopBtn);
});
