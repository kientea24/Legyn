// Cyberpunk 2077 Landing Page JavaScript

// View Mission Statement function
function viewMissionStatement() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'mission-modal';
    modal.innerHTML = `
        <div class="mission-modal-content">
            <button class="modal-close" onclick="closeMissionModal()">×</button>
            <h2 class="modal-title">
                <span class="title-line">//</span>
                MISSION STATEMENT
                <span class="title-line">//</span>
            </h2>
            <div class="modal-body">
                <p class="mission-text">
                    We are the renegades of the digital frontier.
                    LEGYN exists to democratize the startup ecosystem,
                    giving power back to the builders, the dreamers, and the rebels.
                </p>
                <p class="mission-text">
                    We believe that great ideas shouldn't die in corporate bureaucracy or behind closed doors.
                    We build in public, fail in public, and succeed together.
                </p>
                <p class="mission-text">
                    Our mission is simple: Create a world where anyone with passion and determination
                    can build something meaningful, regardless of their background, connections, or capital.
                </p>
                <p class="mission-text highlight">
                    Together, we're not just building products—we're building the future.
                </p>
                <div class="modal-links">
                    <a href="mission-statement.html" class="full-mission-link">
                        VIEW WHOLE MISSION STATEMENT →
                    </a>
                </div>
            </div>
            <button class="btn-primary" onclick="closeMissionModal()">CLOSE</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Add animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeMissionModal() {
    const modal = document.querySelector('.mission-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize navbar transparency state
    const navbar = document.querySelector('.navbar');
    if (navbar && window.pageYOffset === 0) {
        navbar.classList.add('transparent');
    }
    
    // Bounty Board Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const bountyCards = document.querySelectorAll('.bounty-card');
    const sortSelect = document.querySelector('.sort-select');
    const claimButtons = document.querySelectorAll('.bounty-claim-btn');
    
    // Filter bounties by category
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            bountyCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Sort bounties
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const bountiesGrid = document.querySelector('.bounties-grid');
            const cards = Array.from(bountyCards);
            
            cards.sort((a, b) => {
                if (sortValue === 'reward') {
                    const aReward = parseFloat(a.querySelector('.reward-amount').textContent.replace('$', '').replace(',', ''));
                    const bReward = parseFloat(b.querySelector('.reward-amount').textContent.replace('$', '').replace(',', ''));
                    return bReward - aReward;
                } else if (sortValue === 'urgent') {
                    const urgencyOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };
                    const aUrgency = a.querySelector('.bounty-urgency').className.split(' ')[1];
                    const bUrgency = b.querySelector('.bounty-urgency').className.split(' ')[1];
                    return urgencyOrder[aUrgency] - urgencyOrder[bUrgency];
                }
                return 0;
            });
            
            // Re-append sorted cards
            cards.forEach(card => {
                bountiesGrid.appendChild(card);
            });
        });
    }
    
    // Claim bounty animation
    claimButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.bounty-card');
            
            // Add claiming animation
            this.textContent = 'CLAIMING...';
            this.style.background = 'linear-gradient(45deg, var(--neon-cyan), var(--purple-glow))';
            
            setTimeout(() => {
                this.textContent = 'CLAIMED!';
                this.disabled = true;
                this.style.opacity = '0.5';
                this.style.cursor = 'not-allowed';
                
                // Add success glow to card
                card.style.borderColor = 'var(--neon-cyan)';
                card.style.boxShadow = '0 0 50px rgba(0, 255, 255, 0.5)';
            }, 1500);
        });
    });
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Smooth Scrolling for Navigation Links
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
    
    // Parallax Effect for Hero Section and Navbar Transparency
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroParticles = document.querySelector('.neon-particles');
        const gridOverlay = document.querySelector('.grid-overlay');
        const navbar = document.querySelector('.navbar');
        
        // Parallax effects
        if (heroParticles) {
            heroParticles.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        if (gridOverlay) {
            gridOverlay.style.transform = `translate(${scrolled * 0.1}px, ${scrolled * 0.1}px)`;
        }
        
        // Navbar transparency logic
        if (navbar) {
            if (scrolled === 0) {
                // At the top - make completely transparent
                navbar.classList.remove('scrolled');
                navbar.classList.add('transparent');
            } else {
                // Scrolled down - make normal with background
                navbar.classList.remove('transparent');
                navbar.classList.add('scrolled');
            }
        }
    });
    
    // Terminal Typing Animation
    const terminalCommands = [
        'legyn --create-project "NeuroLink AI"',
        'legyn --join-community',
        'legyn --deploy --env=production',
        'legyn --stats --global'
    ];
    
    let commandIndex = 0;
    const typingElement = document.querySelector('.typing');
    
    function typeCommand() {
        if (typingElement) {
            const command = terminalCommands[commandIndex];
            typingElement.textContent = '';
            
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (charIndex < command.length) {
                    typingElement.textContent += command.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        commandIndex = (commandIndex + 1) % terminalCommands.length;
                        typeCommand();
                    }, 3000);
                }
            }, 100);
        }
    }
    
    // Start typing animation
    setTimeout(typeCommand, 1000);
    
    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all project cards
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe community steps
    document.querySelectorAll('.community-step').forEach(step => {
        observer.observe(step);
    });
    
    // Dynamic Neon Particle Effects
    function createNeonParticle() {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${Math.random() > 0.5 ? '#ff007f' : '#00ffff'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 20px currentColor;
        `;
        
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = -10;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        document.body.appendChild(particle);
        
        particle.animate([
            { transform: `translate(0, 0)`, opacity: 0 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px)`, opacity: 1 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'ease-out'
        }).addEventListener('finish', () => {
            particle.remove();
        });
    }
    
    // Create particles periodically
    setInterval(createNeonParticle, 2000);
    
    // Button Hover Effects
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Project Card Hover 3D Effect
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Glitch Effect Trigger
    function triggerGlitch() {
        const glitchElements = document.querySelectorAll('.glitch');
        glitchElements.forEach(element => {
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'glitch 2s infinite';
            }, 10);
        });
    }
    
    // Random glitch effects
    setInterval(triggerGlitch, Math.random() * 10000 + 5000);
    
    // Stats Counter Animation
    function animateCounter(element, target) {
        const start = 0;
        const increment = target / 100;
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 20);
    }
    
    // Trigger counter animation when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number');
                const targets = [2847, 15234, 1247892];
                
                numbers.forEach((number, index) => {
                    if (targets[index]) {
                        animateCounter(number, targets[index]);
                    }
                });
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
    
    // Matrix Rain Effect (Optional - for extra cyberpunk feel)
    function createMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
        `;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = '01';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#ff007f';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        setInterval(draw, 100);
    }
    
    // Uncomment the line below to enable matrix rain effect
    // createMatrixRain();
    
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    @keyframes animate-in {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: animate-in 0.8s ease-out;
    }
    
    .project-card {
        transition: transform 0.3s ease;
    }
    
    .nav-menu.active {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(10, 10, 15, 0.95);
        flex-direction: column;
        padding: 1rem;
        border-top: 1px solid var(--neon-pink);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;

document.head.appendChild(style);

// Alphabet cycling animation for the entire heading
document.addEventListener('DOMContentLoaded', function() {
    const clickableTitle = document.querySelector('.hero-title.clickable-title');
    
    if (clickableTitle) {
        clickableTitle.style.cursor = 'pointer';
        clickableTitle.addEventListener('click', function() {
            animateAlphabetCycle(this);
        });
    }
});

function animateAlphabetCycle(element) {
    const originalText = element.getAttribute('data-text') || 'JOIN THE REVOLUTION';
    const letters = originalText.split('');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let animationFrame = 0;
    const totalFrames = 40; // Number of animation frames
    const frameDelay = 40; // Milliseconds between frames
    
    function animate() {
        if (animationFrame >= totalFrames) {
            // Restore original text
            element.innerHTML = '<span class="glitch">JOIN THE</span><span class="glitch">REVOLUTION</span>';
            return;
        }
        
        // Create new text with cycling letters
        const newText = letters.map((letter, index) => {
            if (letter === ' ') return ' '; // Keep spaces
            
            // Calculate which alphabet letter to show based on animation progress
            const cycleSpeed = 2; // How fast letters cycle
            const alphabetIndex = (animationFrame * cycleSpeed + index) % alphabet.length;
            return alphabet[alphabetIndex];
        }).join('');
        
        // Update the entire heading with the cycling text
        element.innerHTML = `<span class="glitch">${newText}</span>`;
        animationFrame++;
        
        setTimeout(animate, frameDelay);
    }
    
    animate();
}

