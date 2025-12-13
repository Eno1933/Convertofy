// Convertify Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.querySelector('.back-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const serviceCards = document.querySelectorAll('.service-card');
    const comingSoonButtons = document.querySelectorAll('.service-card.coming-soon .btn');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateNavLinkActiveState(this);
            }
        });
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        let currentSection = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Update nav link active state
    function updateNavLinkActiveState(clickedLink) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (clickedLink.classList.contains('nav-link')) {
            clickedLink.classList.add('active');
        }
    }
    
    // Service card hover effects
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('coming-soon')) {
                this.style.transform = 'translateY(-10px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('coming-soon')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Coming soon buttons notification
    comingSoonButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Layanan ini akan segera hadir!', 'info');
        });
    });
    
    // Back to top button functionality
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('.nav-link[href="#home"]').classList.add('active');
    });
    
    // Notification function
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'x-circle';
        if (type === 'warning') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="bi bi-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const notificationStyle = document.createElement('style');
        notificationStyle.id = 'notification-styles';
        notificationStyle.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 0.8rem;
                z-index: 9999;
                transform: translateX(150%);
                transition: transform 0.3s ease;
                max-width: 350px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification i {
                font-size: 1.2rem;
            }
            
            .notification-success {
                border-left: 4px solid #2ecc71;
                color: #27ae60;
            }
            
            .notification-error {
                border-left: 4px solid #e74c3c;
                color: #c0392b;
            }
            
            .notification-warning {
                border-left: 4px solid #f39c12;
                color: #d35400;
            }
            
            .notification-info {
                border-left: 4px solid #3498db;
                color: #2980b9;
            }
        `;
        document.head.appendChild(notificationStyle);
    }
    
    // Update year in footer
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('footer p');
    yearElements.forEach(element => {
        if (element.textContent.includes('2023')) {
            element.textContent = element.textContent.replace('2023', currentYear);
        }
    });
    
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Add active class to current page in navbar
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html' || currentPage === '') {
        document.querySelector('.nav-link[href="#home"]').classList.add('active');
    }
});