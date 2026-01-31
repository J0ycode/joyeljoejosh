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
    init();
    animateParticles();

    // Background Wave Animation
    const initWaves = () => {
        const canvas = document.createElement('canvas');
        canvas.id = 'wave-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-2'; // Behind particles
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width, height, docHeight, maxScroll;
        let waves = [];
        let previousWidth = window.innerWidth;

        const resize = () => {
            const newWidth = window.innerWidth;
            // Mobile Optimization: Only resize if width changes (ignores vertical address bar resize)
            if (newWidth === previousWidth && width) return;

            previousWidth = newWidth;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            docHeight = document.documentElement.scrollHeight;
            maxScroll = docHeight - height;
            createWaves(); // Re-create waves on valid resize
        };

        class Wave {
            constructor(y, amplitude, length, speed, color) {
                this.y = y; // Initial Y (start position)
                this.amplitude = amplitude;
                this.length = length;
                this.speed = speed;
                this.color = color;
                this.phase = Math.random() * Math.PI * 2;
            }

            draw(context, scrollY) {
                context.beginPath();
                context.fillStyle = this.color;

                // Use cached maxScroll to prevent reflow
                const scrollPercent = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

                // Interpolate from Start Y to Bottom (winHeight = height)
                // "Join": Reach the absolute bottom to merge with footer
                const targetY = height;
                const currentY = this.y + (targetY - this.y) * scrollPercent;

                // Draw filled shape from TOP (0,0) down to the wave
                context.moveTo(0, 0);
                context.lineTo(0, currentY);

                // Draw sine wave across width
                // Optimization: Increased step from 10 to 30 for better performance
                for (let x = 0; x <= width; x += 30) {
                    const y = currentY + Math.sin(x * (Math.PI * 2 / this.length) + this.phase) * this.amplitude;
                    context.lineTo(x, y);
                }

                context.lineTo(width, 0); // Back up to top-right
                context.closePath();
                context.fill();

                // Slow continuous animation
                this.phase += this.speed;
            }
        }

        const createWaves = () => {
            waves = [];
            const isMobile = width < 768;

            if (isMobile) {
                // Mobile Optimization: Fewer waves (2 layers)
                waves.push(new Wave(height * 0.15, 35, 1500, 0.01, 'rgba(255, 255, 255, 0.02)'));
                waves.push(new Wave(height * 0.2, 50, 1300, 0.014, 'rgba(255, 255, 255, 0.015)'));
            } else {
                // Desktop: Full quality (4 layers)
                // "Stay slightly above the page" -> High start positions (10-25%)
                // Reduced Amplitude and Increased Length for closer to "less circular" naturally flowing feel
                // Speed maintained
                waves.push(new Wave(height * 0.15, 35, 1500, 0.01, 'rgba(255, 255, 255, 0.02)'));
                waves.push(new Wave(height * 0.2, 50, 1300, 0.014, 'rgba(255, 255, 255, 0.015)'));
                waves.push(new Wave(height * 0.25, 30, 1800, 0.008, 'rgba(255, 255, 255, 0.01)'));

                // A slightly lower layer
                waves.push(new Wave(height * 0.1, 55, 2200, 0.006, 'rgba(255, 255, 255, 0.01)'));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            const scrollY = window.scrollY || 0;

            waves.forEach(wave => {
                wave.draw(ctx, scrollY);
            });

            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize); // Logic moved to resize()

        resize();
        // createWaves called inside resize
        animate();
    };

    initWaves();

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

    // Magnetic Button Effect & 3D Tilt (Desktop Only)
    // Optimization: Skip these heavy listeners on touch devices
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

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
        });
    }

    // Footer Text Wave Animation
    const footerText = document.querySelector('.footer-content p');
    if (footerText) {
        footerText.innerHTML = footerText.textContent.split('').map((char, index) => {
            if (char === ' ') return '<span>&nbsp;</span>';
            return `<span style="animation-delay: ${index * 100}ms">${char}</span>`;
        }).join('');
    }

    // Smoke Collapse Animation Logic
    const initSmokeAnimation = () => {
        const h1 = document.querySelector('.glitch');
        if (!h1) return;

        const text = h1.getAttribute('data-text') || h1.innerText;
        h1.innerHTML = '';
        h1.classList.remove('glitch'); // Pause glitch

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.classList.add('smoke-span');

            // Random positions for "here and there"
            const x = (Math.random() - 0.5) * 300; // -150px to 150px
            const y = (Math.random() - 0.5) * 300; // -150px to 150px
            const r = (Math.random() - 0.5) * 360; // Random rotation

            span.style.setProperty('--x', `${x}px`);
            span.style.setProperty('--y', `${y}px`);
            span.style.setProperty('--r', `${r}deg`);
            span.style.animationDelay = `${index * 50}ms`; // Staggered arrival

            h1.appendChild(span);
        });

        // Show Description earlier (while name is forming)
        setTimeout(() => {
            const val = document.querySelector('.hero-desc');
            if (val) val.classList.add('show');
        }, 1000); // 1s delay (during smoke)

        // Restore Glitch Effect after animation
        setTimeout(() => {
            h1.classList.add('glitch');
            // Keeping the spans prevents the "jump" in layout
            // h1.innerHTML = text; 
        }, 3500); // 1.5s animation + delays
    };

    // Trigger Smoke Animation after Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Wait for preloader fade out logic
        const originalFadeOut = window.getComputedStyle(preloader).transitionDuration;
        // We hook into the existing load listener logic roughly
        setTimeout(() => {
            initSmokeAnimation();
        }, 1600); // 1500ms is the preloader delay in existing code + 100ms buffer
    } else {
        initSmokeAnimation();
    }
});
