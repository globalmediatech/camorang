/**
 * FCAN Morang - Main JavaScript File
 * Contains all interactive functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.innerHTML = mainNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Dropdown Menu for Mobile
    const dropdowns = document.querySelectorAll('.dropdown > a');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 991.98) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== this && other.parentElement.classList.contains('active')) {
                        other.parentElement.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-menu-toggle')) {
            mainNav.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            // Close all dropdowns
            dropdowns.forEach(dropdown => {
                dropdown.parentElement.classList.remove('active');
            });
        }
    });
    
    // Hero Slider (if multiple slides)
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 1) {
        let currentSlide = 0;
        
        function showSlide(index) {
            heroSlides.forEach(slide => slide.classList.remove('active'));
            heroSlides[index].classList.add('active');
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % heroSlides.length;
            showSlide(currentSlide);
        }
        
        // Auto slide every 5 seconds
        setInterval(nextSlide, 5000);
    }
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href.startsWith('#!')) return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking
                if (window.innerWidth <= 991.98) {
                    mainNav.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            }
        });
    });
    
    // Form Validation
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add error message
                    let errorMsg = field.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
    
    // News Filtering
    const newsFilter = document.querySelector('.news-filter');
    if (newsFilter) {
        const filterButtons = newsFilter.querySelectorAll('.filter-btn');
        const newsItems = document.querySelectorAll('.news-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter news items
                newsItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Tender Search
    const tenderSearch = document.querySelector('#tender-search');
    if (tenderSearch) {
        const searchInput = tenderSearch.querySelector('input[type="search"]');
        const tenderRows = document.querySelectorAll('.tenders-table tbody tr');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            tenderRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Member Registration Form
    const memberForm = document.querySelector('#member-registration-form');
    if (memberForm) {
        // Category selection
        const categorySelect = memberForm.querySelector('#category');
        const otherCategoryDiv = memberForm.querySelector('#other-category-div');
        
        if (categorySelect && otherCategoryDiv) {
            categorySelect.addEventListener('change', function() {
                if (this.value === 'other') {
                    otherCategoryDiv.style.display = 'block';
                } else {
                    otherCategoryDiv.style.display = 'none';
                }
            });
        }
        
        // File upload preview
        const fileInputs = memberForm.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', function() {
                const fileName = this.files[0]?.name;
                if (fileName) {
                    const label = this.previousElementSibling;
                    if (label && label.classList.contains('file-label')) {
                        label.textContent = fileName;
                        label.classList.add('has-file');
                    }
                }
            });
        });
    }
    
    // Contact Form Submission
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'alert alert-success';
                successMsg.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <strong>Thank you!</strong> Your message has been sent successfully.
                `;
                
                this.insertBefore(successMsg, this.firstChild);
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);
            }, 1500);
        });
    }
    
    // Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.title = 'Back to top';
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initialize date pickers
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Set min date to today for future dates
        if (input.hasAttribute('data-future')) {
            const today = new Date().toISOString().split('T')[0];
            input.setAttribute('min', today);
        }
        
        // Set max date to today for past dates
        if (input.hasAttribute('data-past')) {
            const today = new Date().toISOString().split('T')[0];
            input.setAttribute('max', today);
        }
    });
    
    // Image Lazy Loading
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // Cookie Consent
    if (!localStorage.getItem('fcan-cookies-accepted')) {
        const cookieConsent = document.createElement('div');
        cookieConsent.className = 'cookie-consent';
        cookieConsent.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button class="btn btn-primary accept-cookies">Accept</button>
                    <button class="btn btn-secondary learn-more">Learn More</button>
                </div>
            </div>
        `;
        document.body.appendChild(cookieConsent);
        
        cookieConsent.querySelector('.accept-cookies').addEventListener('click', function() {
            localStorage.setItem('fcan-cookies-accepted', 'true');
            cookieConsent.classList.add('hidden');
            setTimeout(() => cookieConsent.remove(), 300);
        });
        
        cookieConsent.querySelector('.learn-more').addEventListener('click', function() {
            window.open('privacy-policy.html#cookies', '_blank');
        });
    }
    
    // Print Functionality
    const printButtons = document.querySelectorAll('.print-btn');
    printButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            window.print();
        });
    });
    
    // Share Buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const url = window.location.href;
            const title = document.title;
            
            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: url
                });
            } else {
                // Fallback to clipboard
                navigator.clipboard.writeText(url).then(() => {
                    alert('Link copied to clipboard!');
                });
            }
        });
    });
});

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for dynamic elements
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--fcan-light-blue);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        font-size: 1.2rem;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
    
    .back-to-top.visible {
        opacity: 1;
        visibility: visible;
    }
    
    .back-to-top:hover {
        background-color: var(--fcan-dark-blue);
        transform: translateY(-3px);
    }
    
    .error {
        border-color: var(--fcan-red) !important;
    }
    
    .error-message {
        color: var(--fcan-red);
        font-size: 0.85rem;
        margin-top: 5px;
    }
    
    .cookie-consent {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: var(--fcan-blue);
        color: white;
        padding: 20px;
        z-index: 1000;
        transition: transform 0.3s ease;
    }
    
    .cookie-consent.hidden {
        transform: translateY(100%);
    }
    
    .cookie-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
    }
    
    .cookie-content p {
        margin: 0;
        flex: 1;
        min-width: 300px;
    }
    
    .cookie-buttons {
        display: flex;
        gap: 10px;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        background-color: white;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1001;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-info {
        border-left: 4px solid var(--fcan-light-blue);
    }
    
    .notification-success {
        border-left: 4px solid var(--fcan-green);
    }
    
    .notification-warning {
        border-left: 4px solid var(--fcan-orange);
    }
    
    .notification-error {
        border-left: 4px solid var(--fcan-red);
    }
    
    @media (max-width: 767.98px) {
        .back-to-top {
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            font-size: 1rem;
        }
        
        .cookie-content {
            flex-direction: column;
            text-align: center;
        }
        
        .cookie-content p {
            min-width: auto;
        }
    }
`;
document.head.appendChild(dynamicStyles);