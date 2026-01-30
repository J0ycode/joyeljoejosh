document.addEventListener('DOMContentLoaded', () => {

    // Diamond Glow Cursor (Kept from Premium Update)
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Diamond Follows
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline Follows with slight delay & rotation effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 400, fill: "forwards" });
    });

    // Hover Effects
    const interactiveElements = document.querySelectorAll('a, button, .glass-card, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // Particle Background (Kept from Premium Update)
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particlesArray;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.directionX = (Math.random() * 0.2) - 0.1;
            this.directionY = (Math.random() * 0.2) - 0.1;
            this.size = Math.random() * 1.5;
            this.color = '#d4af37'; // Gold particles
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.5;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 9) * (canvas.height / 9)) {
                    opacityValue = 1 - (distance / 30000);
                    ctx.strokeStyle = 'rgba(212, 175, 55,' + (opacityValue * 0.2) + ')'; // Gold lines
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });

    init();
    animateParticles();

    // Typewriter
    const typingText = document.querySelector('.typing-text');
    const roles = ['Web Developer', 'Business Aspirant', 'Tech Enthusiast', 'Innovator'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    let erasingDelay = 50;
    let newTextDelay = 2000;

    function type() {
        if (!typingText) return;
        if (roleIndex >= roles.length) roleIndex = 0;
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex++;
                setTimeout(type, 500);
            } else {
                setTimeout(type, erasingDelay);
            }
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(type, newTextDelay);
            } else {
                setTimeout(type, typingDelay);
            }
        }
    }

    setTimeout(type, newTextDelay + 250);

    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('toggle');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Animations (Intersection Observer)
    // Old observer removed in favor of new one below

    // Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    // Add the "Man" icon
    document.body.appendChild(progressBar);

    let lastScrollTop = 0;

    // Parallax & Scroll Progress
    window.addEventListener('scroll', () => {
        const scrolledPy = window.scrollY; // Current scroll position

        // Progress Bar Width
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrolledPy / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;

        // Scroll Direction Logic for the "Man"
        // (Removed Man logic, keeping basic bar update)

        // Flight Takeoff Animation
        const flightIcon = document.querySelector('.flight-icon');
        if (flightIcon) {
            // Calculate flight path based on scroll
            // As we scroll down (0 -> 500px), plane goes Bottom-Left -> Top-Right
            const flightProgress = Math.min(scrolledPy / 600, 1); // Cap at 600px scroll

            if (scrolledPy < 600) {
                flightIcon.style.opacity = '1';
                const x = flightProgress * 500; // Move right 500px
                const y = flightProgress * -400; // Move up 400px
                const scale = 1 + flightProgress * 2; // Plane gets closer/bigger
                const rotate = -15 - (flightProgress * 30); // Tilt up from -15 to -45

                flightIcon.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
            } else {
                flightIcon.style.opacity = '0'; // Disappear once flown away
            }
        }
        if (scrolledPy > lastScrollTop) {
            // Scrolling Down (Pulling)
            scrollMan.classList.remove('pushing');
            scrollMan.classList.add('pulling');
        } else {
            // Scrolling Up (Pushing)
            scrollMan.classList.add('pushing');
            scrollMan.classList.remove('pulling');
        }
        lastScrollTop = scrolledPy <= 0 ? 0 : scrolledPy; // For Mobile or negative scrolling

        // Parallax Background Effect
        // Move background slower than scroll
        document.body.style.backgroundPositionY = `${scrolledPy * 0.5}px`;

        // Menu Bar Scroll Effect (Moving Spotlight)
        const glassNav = document.querySelector('.glass-nav');
        if (glassNav) {
            // Move highlight from 20% to 80% based on scroll
            // Cycle every 1000px or so
            const navProgress = (scrolledPy % 2000) / 2000;
            const highlightPos = 20 + (navProgress * 60); // Keep between 20% and 80%
            glassNav.style.setProperty('--highlight-pos', `${highlightPos}%`);
        }

        // Move particles slightly differently for depth
        const canvas = document.querySelector('#particle-canvas');
        if (canvas) {
            canvas.style.transform = `translateY(${scrolledPy * 0.2}px)`;
        }
    });

    // Advanced Scroll Reveal (Slide Up)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before bottom
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target); // Removed to allow re-triggering
            } else {
                // Remove class when out of view to reset animation
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    // General Slide Up Elements (Excluding Skills and Projects)
    const elementsToAnimate = document.querySelectorAll('.glass-card:not(.skill-card):not(.project-card), .section-title, .hero-content, .hero-btns, .contact-container');
    elementsToAnimate.forEach(el => {
        el.classList.add('reveal-up');
        observer.observe(el);
    });

    // Staggered Fall Down for Skills
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((el, index) => {
        el.classList.add('reveal-down');
        el.style.transitionDelay = `${index * 100}ms`; // Stagger effect
        observer.observe(el);
    });

    // Staggered Fall Down for Projects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((el, index) => {
        el.classList.add('reveal-down');
        el.style.transitionDelay = `${index * 150}ms`; // Slightly slower stagger for larger cards
        observer.observe(el);
    });

    // Cinematic Preloader Logic
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        // Slight delay to ensure the animation is seen
        setTimeout(() => {
            preloader.classList.add('fade-out');
            // Enable scrolling after preloader leaves (optional polish)
            document.body.style.overflow = 'auto';
        }, 1500);
    });

    // Magnetic Button Effect
    const magneticButtons = document.querySelectorAll('.btn, .social-icon');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // magnetic pull strength
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });

    // 3D Holographic Card Tilt Effect
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            // Apply 3D rotation, keeping the scale pop
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Footer Text Wave Animation
    const footerText = document.querySelector('.footer-content p');
    if (footerText) {
        footerText.innerHTML = footerText.textContent.split('').map((char, index) => {
            if (char === ' ') return '<span>&nbsp;</span>';
            return `<span style="animation-delay: ${index * 100}ms">${char}</span>`;
        }).join('');
    }
});
