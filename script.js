// Bisous Bisous Club - Advanced Interactive Scripts
// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initAnimations();
    initModals();
    initForms();
    initGallery();
    initCalendar();
    initThreeJS();
    initSoundToggle();
    
    // Remove loading screen
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);
    
    // Failsafe for mobile loading screen
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 4000);
});

// Custom Cursor - REMOVED per user request

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle with proper touch handling
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Active link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Scroll Effects
function initScrollEffects() {
    // Scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    // Smooth scroll implementation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation on Scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special handling for counters
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .stat-number').forEach(el => {
        observer.observe(el);
    });
    
    // Magnetic buttons
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.dataset.count || element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const start = performance.now();
    const startValue = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.round(startValue + (target - startValue) * easeOutQuart(progress));
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// Modals
function initModals() {
    // Generic modal functionality
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Forms
function initForms() {
    // Booking form handling
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            const formData = new FormData(bookingForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const date = formData.get('date');
            const guests = formData.get('guests');
            
            if (!name || !email || !date || !guests) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            // Show confirmation modal
            document.getElementById('booking-confirmation').style.display = 'block';
            openModal('confirmation-modal');
            
            // Reset form
            bookingForm.reset();
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show confirmation
            alert('Merci pour votre message! Nous vous répondrons bientôt.');
            contactForm.reset();
        });
    }
    
    // WhatsApp booking button
    window.openWhatsApp = function() {
        const message = encodeURIComponent('Bonjour! Je souhaite réserver une table au Bisous Bisous Club. Pouvez-vous m\'aider?');
        window.open(`https://wa.me/33123456789?text=${message}`, '_blank');
    };
}

// Gallery & Lightbox
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    
    if (lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('.gallery-image');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Gallery filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
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

// Calendar
function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;
    
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    // Sample events
    const events = {
        '2024-02-16': 'DJ Magnetic - Deep House Night',
        '2024-02-17': 'Soirée Disco Fever',
        '2024-02-23': 'Hip Hop Saturdays',
        '2024-02-24': 'EDM Explosion'
    };
    
    function renderCalendar() {
        const monthYear = document.getElementById('monthYear');
        const calendarGrid = document.getElementById('calendarGrid');
        
        monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            if (events[dateStr]) {
                dayEl.classList.add('has-event');
                dayEl.title = events[dateStr];
            }
            
            calendarGrid.appendChild(dayEl);
        }
    }
    
    // Navigation
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    document.getElementById('nextMonth')?.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    renderCalendar();
}

// Three.js Disco Ball Effect
function initThreeJS() {
    const canvas = document.getElementById('disco-canvas');
    if (!canvas) return;
    
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded, skipping 3D effects');
        return;
    }
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create disco ball
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0xffd700,
        shininess: 100,
        specular: 0xffffff
    });
    
    const discoBall = new THREE.Mesh(geometry, material);
    scene.add(discoBall);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffd700, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    const spotLight = new THREE.SpotLight(0xff1493, 1, 100, Math.PI / 4, 0.5);
    spotLight.position.set(-10, 10, 10);
    scene.add(spotLight);
    
    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const positions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffd700,
        size: 0.05,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    camera.position.z = 5;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        discoBall.rotation.x += 0.005;
        discoBall.rotation.y += 0.01;
        
        particles.rotation.y += 0.001;
        
        // Color changing lights
        const time = Date.now() * 0.001;
        pointLight.color.setHSL((time * 0.1) % 1, 0.7, 0.5);
        spotLight.color.setHSL((time * 0.15 + 0.5) % 1, 0.7, 0.5);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Sound Toggle
function initSoundToggle() {
    let audioContext;
    let isPlaying = false;
    
    window.toggleSound = function() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (isPlaying) {
            // Stop sound
            audioContext.suspend();
            isPlaying = false;
            document.getElementById('sound-btn').textContent = '🔇';
        } else {
            // Start ambient sound
            audioContext.resume();
            isPlaying = true;
            document.getElementById('sound-btn').textContent = '🔊';
            
            // Create a simple ambient sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(110, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            
            oscillator.start();
            
            setTimeout(() => {
                oscillator.stop();
            }, 5000);
        }
    };
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

// Instagram feed simulation
function loadInstagramFeed() {
    const feedContainer = document.getElementById('instagram-feed');
    if (!feedContainer) return;
    
    // Simulated Instagram posts
    const posts = [
        { image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=300&h=300&fit=crop', likes: '234', caption: 'Another magical night at Bisous Bisous! 💋🪩' },
        { image: 'https://images.unsplash.com/photo-1571266028243-d220c2dcbf53?w=300&h=300&fit=crop', likes: '187', caption: 'The night is young and so are we! ✨' },
        { image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', likes: '312', caption: 'VIP experience at its finest 🥂' },
        { image: 'https://images.unsplash.com/photo-1571168962643-4c8b2d99b9fe?w=300&h=300&fit=crop', likes: '156', caption: 'Dancing until dawn 🌅' }
    ];
    
    posts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'instagram-post fade-in';
        postEl.innerHTML = `
            <img src="${post.image}" alt="Instagram post" class="instagram-image">
            <div class="instagram-overlay">
                <div class="instagram-likes">❤️ ${post.likes}</div>
                <div class="instagram-caption">${post.caption}</div>
            </div>
        `;
        feedContainer.appendChild(postEl);
    });
}

// Page transitions
function initPageTransitions() {
    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([href^="http"])');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Create transition overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, #0A0A0A, #D4AF37);
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.5s ease;
            `;
            
            document.body.appendChild(overlay);
            
            setTimeout(() => {
                overlay.style.opacity = '1';
            }, 10);
            
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
}

// Initialize page transitions
initPageTransitions();

// Error handling for missing elements
window.addEventListener('error', (e) => {
    console.warn('Non-critical error:', e.message);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    document.body.style.overflow = '';
});