// BestFit Chiropractic - Complete JavaScript Functionality with EmailJS
document.addEventListener('DOMContentLoaded', function() {
    
    // Hamburger menu functionality - FIXED for mobile interaction
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA attributes for accessibility
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Scroll-based navigation highlighting
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
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // FIXED: Floating label functionality for booking form - properly handles label positioning
    const inputs = document.querySelectorAll('.floating-field input[type="text"], .floating-field input[type="email"], .floating-field input[type="tel"], .floating-field textarea');
    
    inputs.forEach(input => {
        // Check if input has value on page load (for browser auto-fill)
        checkInputValue(input);
        
        // Handle typing in input fields
        input.addEventListener('input', function() {
            checkInputValue(this);
        });
        
        // Handle focus (when user clicks into field)
        input.addEventListener('focus', function() {
            this.classList.add('focused');
            // Ensure label stays up if there's content
            checkInputValue(this);
        });
        
        // Handle blur (when user clicks away from field)
        input.addEventListener('blur', function() {
            this.classList.remove('focused');
            checkInputValue(this);
        });

        // Handle browser auto-fill detection
        input.addEventListener('animationstart', function(e) {
            if (e.animationName === 'onAutoFillStart') {
                this.classList.add('has-value');
            }
        });
        
        // Check on change as well (for programmatic changes)
        input.addEventListener('change', function() {
            checkInputValue(this);
        });
    });
    
    // Function to check and update input value state
    function checkInputValue(input) {
        if (input.value && input.value.trim() !== '') {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }
    }
    
    // Check all inputs on page load (for browser autofill)
    setTimeout(() => {
        inputs.forEach(input => {
            checkInputValue(input);
        });
    }, 100);

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle internal links only
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Calculate position accounting for fixed navbar
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const offsetTop = targetSection.offsetTop - navHeight;
                    
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
            this.style.transition = 'transform 0.3s ease';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Form submission handling - Updated for EmailJS
    const bookingForm = document.querySelector('#contact-form');
    const formStatus = document.querySelector('#form-status');
    const submitButton = document.querySelector('#submit-button');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Always prevent default for EmailJS
            
            // Clear any previous status messages
            if (formStatus) {
                formStatus.style.display = 'none';
            }
            
            // Disable submit button during processing
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }
            
            // Get form data
            const formData = new FormData(this);
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message') || 'No additional message provided';
            
            // Get checked body areas
            const bodyAreas = [];
            const checkboxes = document.querySelectorAll('input[name="bodyAreas"]:checked');
            checkboxes.forEach(checkbox => {
                bodyAreas.push(checkbox.value);
            });
            const areasText = bodyAreas.length > 0 ? bodyAreas.join(', ') : 'None specified';
            
            // Basic validation
            if (!firstName || !lastName || !email || !phone) {
                showFormStatus('Please fill in all required fields.', 'error');
                resetSubmitButton();
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormStatus('Please enter a valid email address.', 'error');
                resetSubmitButton();
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phone)) {
                showFormStatus('Please enter a valid phone number.', 'error');
                resetSubmitButton();
                return;
            }
            
            // Prepare template parameters for EmailJS
            const templateParams = {
                from_name: `${firstName} ${lastName}`,
                from_email: email,
                phone: phone,
                body_areas: areasText,
                message: message,
                to_email: 'bestfitchiropractic@gmail.com'
            };
            
            // Send email using EmailJS - REPLACE THESE WITH YOUR ACTUAL VALUES
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showFormStatus('Thank you! Your appointment request has been sent successfully.', 'success');
                    
                    // Reset form
                    bookingForm.reset();
                    inputs.forEach(input => {
                        input.classList.remove('has-value', 'focused');
                    });
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        if (formStatus) {
                            formStatus.style.display = 'none';
                        }
                    }, 5000);
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
                    showFormStatus('Sorry, there was an error sending your message. Please try again or call us directly.', 'error');
                })
                .finally(function() {
                    resetSubmitButton();
                });
        });
    }
    
    // Helper function to reset submit button
    function resetSubmitButton() {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Request';
        }
    }
    
    // Function to show form status messages
    function showFormStatus(message, type) {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = `form-status ${type}`;
            formStatus.style.display = 'block';
            
            // Auto-hide error messages after 5 seconds
            if (type === 'error') {
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }
        }
    }

    // Add CSS for auto-fill detection - Updated to work better with floating labels
    const style = document.createElement('style');
    style.textContent = `
        @keyframes onAutoFillStart {
            from { opacity: 1; }
            to { opacity: 1; }
        }
        
        input:-webkit-autofill,
        textarea:-webkit-autofill {
            animation-name: onAutoFillStart;
            animation-duration: 0.001s;
        }
        
        /* Ensure autofilled inputs trigger the label to float */
        input:-webkit-autofill + label,
        textarea:-webkit-autofill + label,
        input.has-value + label,
        textarea.has-value + label {
            top: -12px !important;
            left: 15px !important;
            font-size: 0.85rem !important;
            color: white !important;
            background: linear-gradient(135deg, #EB2526, #dc2626) !important;
            padding: 4px 8px !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 8px rgba(235, 37, 38, 0.3) !important;
        }
        
        /* Prevent text input from being hidden under floating label */
        .floating-field input.has-value,
        .floating-field textarea.has-value,
        .floating-field input:-webkit-autofill,
        .floating-field textarea:-webkit-autofill {
            padding-top: 18px !important;
        }
    `;
    document.head.appendChild(style);
    
    // Mobile touch improvements
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Improve touch responsiveness for hamburger menu
        if (hamburger) {
            hamburger.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.click();
            });
        }
    }

    console.log('BestFit Chiropractic JavaScript with EmailJS loaded successfully!');
});