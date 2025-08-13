// BestFit Chiropractic - Complete JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Scroll-based navigation highlighting (fixed to match your HTML)
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu li a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Account for fixed navbar
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Handle special case: "contact " link with space maps to "booking" section
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Fix: Handle your contact link with space
            if (href === '#contact ' && currentSection === 'booking') {
                link.classList.add('active');
            } else if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Floating label functionality for booking form
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    
    inputs.forEach(input => {
        // Check if input has value on page load (for browser auto-fill)
        if (input.value && input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        
        // Handle typing in input fields
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        // Handle focus (when user clicks into field)
        input.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        // Handle blur (when user clicks away from field)
        input.addEventListener('blur', function() {
            this.classList.remove('focused');
            
            // Keep has-value class if input has content
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });

        // Handle browser auto-fill detection
        input.addEventListener('animationstart', function(e) {
            if (e.animationName === 'onAutoFillStart') {
                this.classList.add('has-value');
            }
        });
    });

    // Smooth scrolling for navigation links (enhanced)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle internal links only
            if (href.startsWith('#')) {
                e.preventDefault();
                
                // Map "contact " (with space) to "booking" section
                let targetId = href.substring(1).trim(); // Remove # and trim space
                if (targetId === 'contact') {
                    targetId = 'booking'; // Map to actual section ID
                }
                
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Calculate position accounting for fixed navbar
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Enhanced logo hover effects
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Form submission handling (optional enhancement)
    const bookingForm = document.querySelector('#booking form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default submission for demo
            
            // Get form data
            const formData = new FormData(this);
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const phone = formData.get('phone');
            
            // Basic validation
            if (!firstName || !lastName || !email || !phone) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Success message (replace with actual form submission)
            alert(`Thank you, ${firstName}! We'll contact you soon at ${email}.`);
            
            // Reset form and floating labels
            this.reset();
            inputs.forEach(input => {
                input.classList.remove('has-value', 'focused');
            });
        });
    }

    // Add CSS for auto-fill detection (append to head)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes onAutoFillStart {
            from { opacity: 1; }
            to { opacity: 1; }
        }
        
        input:-webkit-autofill {
            animation-name: onAutoFillStart;
            animation-duration: 0.001s;
        }
        
        /* Ensure auto-filled inputs show floating labels */
        input:-webkit-autofill + label {
            top: -8px !important;
            left: 15px !important;
            font-size: 0.85rem !important;
            color: white !important;
            background: linear-gradient(135deg, #EB2526, #dc2626) !important;
            padding: 4px 8px !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 8px rgba(235, 37, 38, 0.3) !important;
        }
    `;
    document.head.appendChild(style);

    // Console log for debugging
    console.log('BestFit Chiropractic JavaScript loaded successfully!');
    console.log('Sections found:', document.querySelectorAll('section[id]').length);
    console.log('Nav links found:', navLinks.length);
});
