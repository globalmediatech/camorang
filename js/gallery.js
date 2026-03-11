/**
 * FCAN Morang - Gallery JavaScript
 * Photo gallery functionality with lightbox
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Gallery
    const gallery = document.querySelector('.photo-gallery');
    if (!gallery) return;
    
    const galleryItems = gallery.querySelectorAll('.gallery-item');
    const lightbox = createLightbox();
    
    // Add click event to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            const caption = this.querySelector('.caption')?.textContent || imgAlt;
            
            openLightbox(imgSrc, imgAlt, caption, index);
        });
    });
    
    // Create lightbox
    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                <div class="lightbox-image-container">
                    <img src="" alt="" class="lightbox-image">
                </div>
                <div class="lightbox-caption"></div>
                <div class="lightbox-counter"></div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Add event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
        
        // Close on backdrop click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
        
        return lightbox;
    }
    
    let currentIndex = 0;
    let images = [];
    
    function openLightbox(src, alt, caption, index) {
        // Collect all gallery images
        images = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            alt: item.querySelector('img').alt,
            caption: item.querySelector('.caption')?.textContent || item.querySelector('img').alt
        }));
        
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function updateLightbox() {
        const currentImage = images[currentIndex];
        
        lightbox.querySelector('.lightbox-image').src = currentImage.src;
        lightbox.querySelector('.lightbox-image').alt = currentImage.alt;
        lightbox.querySelector('.lightbox-caption').textContent = currentImage.caption;
        lightbox.querySelector('.lightbox-counter').textContent = `${currentIndex + 1} / ${images.length}`;

        
        // Update button states
        lightbox.querySelector('.lightbox-prev').style.display = currentIndex === 0 ? 'none' : 'block';
        lightbox.querySelector('.lightbox-next').style.display = currentIndex === images.length - 1 ? 'none' : 'block';
    }
    
    function showPrevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            updateLightbox();
        }
    }
    
    function showNextImage() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateLightbox();
        }
    }
    
    // Gallery Filter
    const filterButtons = document.querySelectorAll('.gallery-filter');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Add CSS for gallery
    const galleryStyles = document.createElement('style');
    galleryStyles.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .lightbox.active {
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            background-color: transparent;
        }
        
        .lightbox-image-container {
            max-height: 80vh;
            overflow: hidden;
            border-radius: 4px;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 80vh;
            display: block;
            margin: 0 auto;
        }
        
        .lightbox-caption {
            color: white;
            text-align: center;
            padding: 15px 0;
            font-size: 1.1rem;
        }
        
        .lightbox-counter {
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            font-size: 0.9rem;
            margin-top: 10px;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .lightbox-prev,
        .lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            transition: background-color 0.3s ease;
        }
        
        .lightbox-prev:hover,
        .lightbox-next:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .lightbox-prev {
            left: -70px;
        }
        
        .lightbox-next {
            right: -70px;
        }
        
        .gallery-item {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .gallery-item:hover {
            transform: translateY(-5px);
        }
        
        @media (max-width: 767.98px) {
            .lightbox-prev {
                left: 10px;
            }
            
            .lightbox-next {
                right: 10px;
            }
            
            .lightbox-close {
                top: 10px;
                right: 10px;
            }
        }
    `;
    document.head.appendChild(galleryStyles);
});