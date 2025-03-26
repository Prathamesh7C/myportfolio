// Update the particle configuration
const particleConfig = {
    light: {
        particles: {
            number: { value: 80 },
            color: { value: '#0078FF' },
            opacity: { value: 0.5 },
            size: { value: 3 },
            line_linked: {
                color: '#0078FF',
                opacity: 0.4
            }
        }
    },
    dark: {
        particles: {
            number: { value: 80 },
            color: { value: '#00A3FF' },
            opacity: { value: 0.7 },
            size: { value: 3 },
            line_linked: {
                color: '#00A3FF',
                opacity: 0.6
            }
        }
    }
};

// Initialize particles with default config
function initParticles(isDark = false) {
    const config = isDark ? particleConfig.dark : particleConfig.light;
    particlesJS('particles-js', {
        particles: {
            number: {
                value: config.particles.number.value,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: config.particles.color.value
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: config.particles.opacity.value,
                random: false
            },
            size: {
                value: config.particles.size.value,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: config.particles.line_linked.color,
                opacity: config.particles.line_linked.opacity,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }
        },
        retina_detect: true
    });
}

// Enhanced Dark Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function updateParticles(isDark) {
    if (window.pJSDom && window.pJSDom[0]) {
        const particles = window.pJSDom[0].pJS.particles;
        const config = isDark ? particleConfig.dark : particleConfig.light;
        
        // Smoothly update particle colors
        particles.array.forEach(particle => {
            gsap.to(particle.color, {
                value: config.particles.color.value,
                duration: 0.5
            });
        });
        
        // Update configuration
        particles.color.value = config.particles.color.value;
        particles.line_linked.color = config.particles.line_linked.color;
        particles.opacity.value = config.particles.opacity.value;
        particles.line_linked.opacity = config.particles.line_linked.opacity;
    }
}

function toggleDarkMode(isDark) {
    // Update theme
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // Update icon with animation
    const icon = themeToggle.querySelector('i');
    gsap.to(icon, {
        scale: 0,
        duration: 0.2,
        onComplete: () => {
            icon.classList.toggle('fa-sun', isDark);
            icon.classList.toggle('fa-moon', !isDark);
            gsap.to(icon, {
                scale: 1,
                duration: 0.2
            });
        }
    });
    
    // Update particles
    updateParticles(isDark);
    
    // Refresh navigation styles
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        // Preserve active state
        const isActive = link.classList.contains('active');
        if (isActive) {
            link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        }
    });
    
    // Save preference
    localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
}

// Initialize theme based on saved preference or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme-preference');
    const systemPrefersDark = prefersDarkScheme.matches;
    
    if (savedTheme) {
        toggleDarkMode(savedTheme === 'dark');
    } else {
        toggleDarkMode(systemPrefersDark);
    }
    
    // Initialize particles after theme is set
    initParticles(savedTheme === 'dark' || (!savedTheme && systemPrefersDark));
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'dark';
    toggleDarkMode(isDark);
});

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-preference')) {
        toggleDarkMode(e.matches);
    }
});

// Initialize theme and particles
initializeTheme();

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// Hover effect on links
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursorFollower.style.transform = 'scale(2)';
    });
    
    link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// Typing Animation
const typingText = document.querySelector('.typing-text');
const texts = ['Java Web Developer', 'Full Stack Developer', 'UI/UX Designer'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 50 : 100);
    }
}

type();

// Initialize AOS with custom settings
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    offset: 120,
    disable: function() {
        return window.innerWidth < 768;
    }
});

// Ensure navigation is visible on page load
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.glass-nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (navbar) {
        navbar.style.opacity = '1';
        navbar.style.visibility = 'visible';
        navbar.style.transform = 'none';
    }
    
    // Remove AOS animations from navigation
    navLinks.forEach(link => {
        link.removeAttribute('data-aos');
        link.removeAttribute('data-aos-delay');
    });
});

// Navigation Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.glass-nav');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Update active navigation based on scroll position
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 150) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

// Add scroll event listener for navigation
window.addEventListener('scroll', updateActiveNav);

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Update menu icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }
}

// Scroll-based animations
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Parallax effect for sections
    document.querySelectorAll('section').forEach(section => {
        const speed = 0.5;
        const offset = section.offsetTop;
        const distance = (scrolled - offset) * speed;
        
        if (section.querySelector('.section-title')) {
            section.querySelector('.section-title').style.transform = 
                `translateY(${distance * 0.1}px)`;
        }
    });
    
    // Show/hide scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (scrolled > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    }
});

// GSAP Animations
gsap.from('.hero-content', {
    duration: 1,
    y: 100,
    opacity: 0,
    ease: 'power4.out'
});

gsap.from('.nav-logo, .nav-links a, .theme-toggle', {
    duration: 1,
    y: -50,
    opacity: 0,
    stagger: 0.1,
    ease: 'power4.out'
});

// Enhanced Active navigation highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNavigation() {
    const scrollPosition = window.scrollY + 200; // Offset for better activation
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                    link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                } else {
                    link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
                }
            });
        }
    });
}

// Update active navigation on scroll
window.addEventListener('scroll', updateActiveNavigation);

// Initialize active navigation on page load
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNavigation();
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
});

// Education and Experience Timeline Animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.education-item, .experience-item');
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 200 * index);
    });
}

// Skills Progress Bar Animation
function initSkillsAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress-bar');
                const percentage = entry.target.dataset.percentage;
                progressBar.style.width = percentage + '%';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillItems.forEach(item => {
        observer.observe(item);
    });
}

// Scroll Animation
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize all animations when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initTimelineAnimations();
    initSkillsAnimation();
    initScrollAnimations();
});

// Initialize skill progress bars
function initializeSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const percentage = item.getAttribute('data-percentage');
        const progressBar = item.querySelector('.skill-progress-bar');
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
    });
}

// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true
    });

    // Initialize skills after a short delay
    setTimeout(initializeSkills, 500);

    // Initialize mobile menu
    initializeMobileMenu();
});

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Update menu icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }
}

// Scroll event for navigation
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.glass-nav');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}); 
