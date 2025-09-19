// Projects Page JavaScript

// Make toggleProject globally accessible
window.toggleProject = function(element) {
    // Find the parent project-row
    const projectRow = element.closest('.project-row');

    if (!projectRow) {
        console.error('Project row not found');
        return;
    }

    // Close other expanded projects
    const allProjects = document.querySelectorAll('.project-row');
    allProjects.forEach(project => {
        if (project !== projectRow && project.classList.contains('expanded')) {
            project.classList.remove('expanded');
        }
    });

    // Toggle current project
    projectRow.classList.toggle('expanded');

    console.log('Toggled project:', projectRow.classList.contains('expanded') ? 'expanded' : 'collapsed');

    // Animate progress circles when expanded
    if (projectRow.classList.contains('expanded')) {
        const progressCircles = projectRow.querySelectorAll('.progress-circle');
        progressCircles.forEach(circle => {
            const progress = parseInt(circle.dataset.progress);
            const circumference = 2 * Math.PI * 25;
            const offset = circumference - (progress / 100) * circumference;

            const circleElement = circle.querySelector('.progress-ring-circle');
            if (circleElement) {
                circleElement.style.strokeDasharray = circumference;
                circleElement.style.strokeDashoffset = circumference;

                // Trigger animation after a brief delay
                setTimeout(() => {
                    circleElement.style.strokeDashoffset = offset;
                }, 100);
            }
        });

        // Smooth scroll to the expanded project
        setTimeout(() => {
            projectRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Alternative click handler using event delegation
    const projectMains = document.querySelectorAll('.project-main');
    projectMains.forEach(main => {
        main.style.cursor = 'pointer';
        main.addEventListener('click', function(e) {
            // Don't toggle if clicking on buttons or links
            if (e.target.closest('button') || e.target.closest('a')) {
                return;
            }
            window.toggleProject(this);
        });
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectRows = document.querySelectorAll('.project-row');
    const sortSelect = document.querySelector('.sort-select');

    // Initialize progress circles
    const progressCircles = document.querySelectorAll('.progress-circle');
    progressCircles.forEach(circle => {
        const progress = parseInt(circle.dataset.progress);
        const circumference = 2 * Math.PI * 25;
        const offset = circumference - (progress / 100) * circumference;

        const circleElement = circle.querySelector('.progress-ring-circle');
        circleElement.style.strokeDasharray = circumference;
        circleElement.style.strokeDashoffset = circumference;

        // Animate on page load
        setTimeout(() => {
            circleElement.style.strokeDashoffset = offset;
        }, 500);
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            projectRows.forEach(row => {
                if (filter === 'all') {
                    row.style.display = 'block';
                    setTimeout(() => {
                        row.style.opacity = '1';
                        row.style.transform = 'translateX(0)';
                    }, 10);
                } else {
                    if (row.getAttribute('data-category') === filter) {
                        row.style.display = 'block';
                        setTimeout(() => {
                            row.style.opacity = '1';
                            row.style.transform = 'translateX(0)';
                        }, 10);
                    } else {
                        row.style.opacity = '0';
                        row.style.transform = 'translateX(-20px)';
                        setTimeout(() => {
                            row.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const projectsList = document.querySelector('.projects-list');
            const projects = Array.from(projectRows);

            projects.sort((a, b) => {
                switch(sortValue) {
                    case 'trending':
                        // Sort by activity (contributors + stars)
                        const activityA = getProjectActivity(a);
                        const activityB = getProjectActivity(b);
                        return activityB - activityA;
                    case 'progress':
                        const progressA = parseInt(a.querySelector('.progress-circle').dataset.progress);
                        const progressB = parseInt(b.querySelector('.progress-circle').dataset.progress);
                        return progressB - progressA;
                    case 'contributors':
                        const contribA = parseInt(a.querySelector('.meta-value').textContent);
                        const contribB = parseInt(b.querySelector('.meta-value').textContent);
                        return contribB - contribA;
                    case 'recent':
                        // This would typically use actual date data
                        return 0;
                    default:
                        return 0;
                }
            });

            // Re-append sorted projects
            projects.forEach(project => {
                projectsList.appendChild(project);
            });
        });
    }

    // Helper function to calculate project activity
    function getProjectActivity(projectRow) {
        const metaItems = projectRow.querySelectorAll('.meta-value');
        const contributors = parseInt(metaItems[0].textContent);
        const stars = parseFloat(metaItems[1].textContent.replace('k', '')) * (metaItems[1].textContent.includes('k') ? 1000 : 1);
        return contributors + stars;
    }

    // Animate project cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    projectRows.forEach(row => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(30px)';
        row.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        projectObserver.observe(row);
    });

    // Prevent event bubbling for interactive elements inside project details
    const projectDetails = document.querySelectorAll('.project-details');
    projectDetails.forEach(details => {
        details.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Action button handlers
    const actionButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent project expansion
            e.preventDefault();

            // Add click effect
            const originalText = this.textContent;
            const isJoin = this.textContent.includes('JOIN');

            if (isJoin) {
                this.textContent = 'REQUEST SENT!';
                this.style.background = 'var(--neon-cyan)';
            } else {
                this.textContent = 'CONTRIBUTING!';
                this.style.background = 'var(--neon-pink)';
            }

            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 2000);
        });
    });

    // Project link handlers
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent project expansion
            e.preventDefault();

            // Add click effect
            this.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // You can add actual link navigation here if needed
            // window.open(this.href, '_blank');
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Contributor hover effects
    const contributorItems = document.querySelectorAll('.contributor-item');
    contributorItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const avatar = this.querySelector('.contributor-avatar');
            const rank = this.querySelector('.contributor-rank');

            avatar.style.transform = 'scale(1.1)';
            rank.style.transform = 'scale(1.1)';
        });

        item.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.contributor-avatar');
            const rank = this.querySelector('.contributor-rank');

            avatar.style.transform = 'scale(1)';
            rank.style.transform = 'scale(1)';
        });
    });

    // Animate stats on hero section
    const heroStats = document.querySelectorAll('.hero-stats .stat-number');
    heroStats.forEach(stat => {
        const finalValue = stat.textContent;
        const isDecimal = finalValue.includes('.');
        const hasK = finalValue.includes('K');

        let numericValue = parseFloat(finalValue.replace('K', ''));
        if (hasK) numericValue *= 1000;

        let currentValue = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }

            let displayValue = currentValue;
            if (hasK) {
                displayValue = (currentValue / 1000).toFixed(1) + 'K';
            } else if (isDecimal) {
                displayValue = currentValue.toFixed(1);
            } else {
                displayValue = Math.floor(currentValue);
            }

            stat.textContent = displayValue;
        }, 30);
    });
});

// Add some CSS styles dynamically for enhanced interactivity
const style = document.createElement('style');
style.textContent = `
    .contributor-avatar,
    .contributor-rank {
        transition: transform 0.3s ease;
    }

    .project-link {
        position: relative;
        overflow: hidden;
    }

    .project-link::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 0, 127, 0.2), transparent);
        transition: left 0.5s ease;
    }

    .project-link:hover::after {
        left: 100%;
    }

    @media (max-width: 768px) {
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }

        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--darker-bg);
            border-top: 1px solid rgba(255, 0, 127, 0.2);
            padding: 1rem 0;
        }
    }
`;
document.head.appendChild(style);