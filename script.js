// Function to handle mobile menu toggle
function setupMobileMenu() {
    console.log('Setting up mobile menu...');
    
    // Get all required elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    // Check if elements exist
    if (!mobileMenuBtn) console.error('Mobile menu button not found');
    if (!mobileMenu) console.error('Mobile menu not found');
    if (!mobileMenuOverlay) console.error('Mobile menu overlay not found');
    
    if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay) {
        return;
    }
    
    // Function to toggle the mobile menu
    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        console.log('Mobile menu toggled:', mobileMenu.classList.contains('active'));
    }
    
    // Function to close the mobile menu
    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Mobile menu closed');
    }
    
    // Toggle mobile menu on button click
    mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close mobile menu when clicking on the overlay
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    console.log('Mobile menu setup complete');
}

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', setupMobileMenu);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .skill-category, .section-title, .contact-content, .education-item, .timeline-item, .skills-chart')
    .forEach(el => observer.observe(el));

// Active section highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveSection() {
    const currentPos = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (currentPos >= sectionTop && currentPos < sectionBottom) {
            const id = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this), wait);
    };
}

// Add scroll event listener with debounce
window.addEventListener('scroll', debounce(updateActiveSection));

// Display projects directly without GitHub API
function fetchGitHubProjects() {
    console.log('Loading projects...');
    const projectGrid = document.querySelector('.project-grid');
    const loadingProjects = document.querySelector('.loading-projects');
    
    if (!projectGrid) {
        console.error('Project grid element not found');
        return;
    }
    
    // Hide loading indicator immediately
    if (loadingProjects) {
        loadingProjects.style.display = 'none';
    }
    
    // Define projects to display
    const projects = [
        {
            name: 'E-Commerce Platform',
            description: 'A full-featured e-commerce platform with product catalog, shopping cart, and secure checkout process.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
            image: 'https://via.placeholder.com/600x400/2a2a2a/ffffff?text=E-Commerce+Platform',
            demoUrl: '#',
            codeUrl: '#'
        },
        {
            name: 'Task Management App',
            description: 'A task management application with drag-and-drop functionality, task categorization, and user authentication.',
            technologies: ['React', 'Express', 'MongoDB', 'JWT'],
            image: 'https://via.placeholder.com/600x400/2a2a2a/ffffff?text=Task+Management+App',
            demoUrl: '#',
            codeUrl: '#'
        },
        {
            name: 'Weather Dashboard',
            description: 'Weather forecasting application that provides real-time weather data using the OpenWeatherMap API.',
            technologies: ['JavaScript', 'REST APIs', 'Bootstrap', 'LocalStorage'],
            image: 'https://via.placeholder.com/600x400/2a2a2a/ffffff?text=Weather+Dashboard',
            demoUrl: '#',
            codeUrl: '#'
        },
        {
            name: 'Social Media Dashboard',
            description: 'A comprehensive dashboard for social media analytics with real-time data visualization.',
            technologies: ['Vue.js', 'D3.js', 'Firebase', 'Social APIs'],
            image: 'https://via.placeholder.com/600x400/2a2a2a/ffffff?text=Social+Media+Dashboard',
            demoUrl: '#',
            codeUrl: '#'
        },
        {
            name: 'Recipe Finder App',
            description: 'An application to discover and save recipes based on available ingredients and dietary preferences.',
            technologies: ['React Native', 'Redux', 'Food API', 'AsyncStorage'],
            image: 'https://via.placeholder.com/600x400/2a2a2a/ffffff?text=Recipe+Finder+App',
            demoUrl: '#',
            codeUrl: '#'
        },
        {
            name: 'Fitness Tracker',
            description: 'A fitness tracking application that monitors workouts, nutrition, and provides personalized recommendations.',
            technologies: ['Flutter', 'Firebase', 'Health APIs', 'Charts'],
            image: 'https://via.placeholder.com/600x400/2a2a2a/ffffff?text=Fitness+Tracker',
            demoUrl: '#',
            codeUrl: '#'
        }
    ];
    
    // Function to filter projects by category
    function filterProjects(filter) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'flex';
            } else {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }
    
    // Display projects directly
    console.log('Displaying projects directly...');
    displayProjects(projectGrid, projects);
};

// Display projects
function displayProjects(projectGrid, projects) {
    console.log('Setting up projects display...');
    projectGrid.innerHTML = '';
    
    projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card';
        
        // Determine project category for filtering
        let category = 'other';
        const lowerName = project.name.toLowerCase();
        const lowerDescription = project.description.toLowerCase();
        
        // Assign category based on project name, description, or technologies
        if (
            lowerName.includes('web') || 
            lowerName.includes('site') || 
            lowerDescription.includes('web') ||
            project.technologies.some(tech => ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue'].includes(tech))
        ) {
            category = 'web';
        } else if (
            lowerName.includes('app') || 
            lowerName.includes('mobile') || 
            lowerDescription.includes('app') ||
            project.technologies.some(tech => ['React Native', 'Flutter', 'Android', 'iOS', 'Mobile'].includes(tech))
        ) {
            category = 'app';
        }
        
        // Set category as data attribute for filtering
        card.setAttribute('data-category', category);
        
        // Create project card HTML
        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.name}" class="project-img">
            </div>
            <div class="project-info">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="project-btn demo-btn"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                    ${project.codeUrl ? `<a href="${project.codeUrl}" target="_blank" class="project-btn code-btn"><i class="fab fa-github"></i> View Code</a>` : ''}
                </div>
            </div>
        `;
        
        projectGrid.appendChild(card);
        
        // Add animation observer if it exists
        if (typeof observer !== 'undefined') {
            observer.observe(card);
        }
    });
    
    // Add hover effects
    addHoverEffectsToCards();
}

// This function is no longer needed as we're using displayProjects directly

// Add hover effects to project cards
function addHoverEffectsToCards() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
}

// Create project card from GitHub repo data
function createProjectCard(repo) {
    const card = document.createElement('article');
    card.className = 'project-card';
    
    // Determine project category for filtering
    let category = 'other';
    const lowerName = repo.name.toLowerCase();
    const lowerDescription = (repo.description || '').toLowerCase();
    
    // Assign category based on repo name, description, or language
    if (
        lowerName.includes('web') || 
        lowerName.includes('site') || 
        lowerName.includes('html') || 
        lowerName.includes('css') || 
        lowerName.includes('react') || 
        lowerName.includes('angular') || 
        lowerName.includes('vue') ||
        (repo.language && ['JavaScript', 'TypeScript', 'HTML', 'CSS'].includes(repo.language))
    ) {
        category = 'web';
    } else if (
        lowerName.includes('app') || 
        lowerName.includes('mobile') || 
        lowerName.includes('android') || 
        lowerName.includes('ios') || 
        lowerName.includes('flutter') || 
        lowerName.includes('react-native') ||
        lowerDescription.includes('mobile app')
    ) {
        category = 'app';
    }
    
    // Set category as data attribute for filtering
    card.setAttribute('data-category', category);
    
    // Default image for GitHub projects
    const defaultImage = 'https://via.placeholder.com/600x400/2a2a2a/ffffff?text=GitHub+Project';
    
    // Get repository description or generate one based on name
    let description = repo.description;
    
    if (!description) {
        if (lowerName.includes('ecommerce') || lowerName.includes('shop')) {
            description = 'An e-commerce application with product listings, shopping cart, and checkout functionality.';
        } else if (lowerName.includes('blog') || lowerName.includes('cms')) {
            description = 'A content management system for creating and managing blog posts and articles.';
        } else if (lowerName.includes('api') || lowerName.includes('rest')) {
            description = 'A RESTful API service for data management and integration.';
        } else if (lowerName.includes('chat') || lowerName.includes('message')) {
            description = 'A real-time chat application with messaging functionality.';
        } else if (lowerName.includes('game')) {
            description = 'An interactive web-based game with engaging gameplay.';
        } else if (lowerName.includes('dashboard') || lowerName.includes('admin')) {
            description = 'An administrative dashboard for data visualization and management.';
        } else if (lowerName.includes('weather')) {
            description = 'A weather forecasting application that provides real-time weather data.';
        } else if (lowerName.includes('task') || lowerName.includes('todo')) {
            description = 'A task management application with organization features.';
        } else {
            description = 'A web application built with modern technologies and best practices.';
        }
    }
    
    // Get repository languages or use topics
    let technologies = [];
    
    // If repo has topics, use those
    if (repo.topics && repo.topics.length > 0) {
        technologies = repo.topics.slice(0, 4).map(topic => 
            topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ')
        );
    } 
    // If repo has language, use that
    else if (repo.language) {
        technologies.push(repo.language);
        
        // Add some common complementary technologies based on the main language
        if (repo.language === 'JavaScript') {
            technologies.push('HTML', 'CSS');
        } else if (repo.language === 'TypeScript') {
            technologies.push('Angular', 'React');
        } else if (repo.language === 'Java') {
            technologies.push('Spring Boot');
        } else if (repo.language === 'Python') {
            technologies.push('Flask', 'Django');
        } else if (repo.language === 'HTML') {
            technologies.push('CSS', 'JavaScript');
        }
    } 
    // Default fallback
    else {
        technologies = ['GitHub', 'Web Development'];
    }
    
    // Format the name to be more readable
    const formattedName = repo.name
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    // Create project card HTML
    card.innerHTML = `
        <div class="project-image">
            <img src="${defaultImage}" alt="${formattedName}" class="project-img">
        </div>
        <div class="project-info">
            <h3>${formattedName}</h3>
            <p>${description}</p>
            <div class="project-technologies">
                ${technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-btn demo-btn"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                <a href="${repo.html_url}" target="_blank" class="project-btn code-btn"><i class="fab fa-github"></i> View Code</a>
            </div>
        </div>
    `;
    
    return card;
}

// Theme Toggle Functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateMobileToggleText('dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateMobileToggleText('light');
    }
    
    // Toggle theme when the button is clicked
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateMobileToggleText(newTheme);
    }
    
    // Update the text on the mobile toggle button
    function updateMobileToggleText(theme) {
        if (mobileThemeToggle) {
            const textSpan = mobileThemeToggle.querySelector('span');
            if (textSpan) {
                textSpan.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
            }
            
            const icon = mobileThemeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }
    
    // Add event listeners to both toggle buttons
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a, .mobile-menu .mobile-theme-toggle');
    const html = document.documentElement;
    let isMenuOpen = false;
    let menuAnimation = null;

    function closeMenu() {
        if (!isMenuOpen) return;
                
        // Animate menu items out
        if (mobileMenu) {
            const menuItems = mobileMenu.querySelectorAll('li');
            menuItems.forEach((item, index) => {
                item.style.transitionDelay = `${0.1 * (menuItems.length - index - 1)}s`;
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });
        }

        // Close menu after animations complete
        clearTimeout(menuAnimation);
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
                
        menuAnimation = setTimeout(() => {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (mobileMenu) mobileMenu.style.visibility = 'hidden';
            if (mobileMenuOverlay) mobileMenuOverlay.style.visibility = 'hidden';
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            html.style.overflow = '';
            isMenuOpen = false;
        }, 300);
    }

    function openMenu() {
        if (isMenuOpen) return;
                
        // Show menu and overlay
        if (mobileMenu) mobileMenu.style.visibility = 'visible';
        if (mobileMenuOverlay) mobileMenuOverlay.style.visibility = 'visible';
        if (mobileMenu) mobileMenu.style.display = 'flex';
        if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
        html.style.overflow = 'hidden';
                
        // Trigger reflow to ensure the initial state is applied before adding active class
        if (mobileMenu) void mobileMenu.offsetWidth;
                
        // Add active class to trigger animations
        if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
        if (mobileMenu) mobileMenu.classList.add('active');
                
        // Animate menu items in
        if (mobileMenu) {
            const menuItems = mobileMenu.querySelectorAll('li');
            menuItems.forEach((item, index) => {
                item.style.transitionDelay = `${0.1 * (index + 1)}s`;
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        }
                
        isMenuOpen = true;
    }
            
    function toggleMenu(e) {
        e.stopPropagation();
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
            
    // Close menu when clicking on overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMenu);
    }
            
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && mobileMenu && !mobileMenu.contains(e.target) && e.target !== mobileMenuBtn) {
            closeMenu();
        }
    });
            
    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
}

    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }


    if (mobileMenuBtn && mobileMenu) {
        // Toggle mobile menu on button click
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !mobileMenu.contains(e.target) && e.target !== mobileMenuBtn) {
                closeMenu();
            }
        });

        // Close menu when clicking on a link or theme toggle
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Don't close if it's the theme toggle
                if (!link.classList.contains('mobile-theme-toggle')) {
                    closeMenu();
                }
            });
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
const html = document.documentElement;

// Initialize theme icon based on current theme
function updateThemeIcon() {
    const isDark = html.dataset.theme === 'dark';
    const icons = document.querySelectorAll('.theme-toggle-icon');
    
    icons.forEach(icon => {
        icon.className = `fas ${isDark ? 'fa-sun' : 'fa-moon'}`;
    });
    
    // Update mobile theme toggle text
    if (mobileThemeToggle) {
        const textSpan = mobileThemeToggle.querySelector('span');
        if (textSpan) {
            textSpan.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
    }
}

function toggleTheme() {
    const newTheme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

// Add event listeners for both desktop and mobile theme toggles
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
}

// Initialize theme from localStorage or prefer-color-scheme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        html.dataset.theme = savedTheme;
    } else if (prefersDark) {
        html.dataset.theme = 'dark';
    } else {
        html.dataset.theme = 'light';
    }
    
    updateThemeIcon();
}

// Initialize theme
initTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        html.dataset.theme = e.matches ? 'dark' : 'light';
        updateThemeIcon();
    }
});

// Typing Animation with cursor hide
const text = "Yashwanth G";
const typingText = document.querySelector('.typing-text');
const typingCursor = document.querySelector('.typing-cursor');
let charIndex = 0;

function type() {
    if (charIndex < text.length) {
        typingText.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(type, 150);
    } else {
        // Hide cursor after typing completes
        setTimeout(() => {
            typingCursor.classList.add('hide');
        }, 1500);
    }
}

// Create floating particles
function createParticles() {
    const hero = document.querySelector('.hero');
    const particles = document.createElement('div');
    particles.className = 'particles';
    hero.appendChild(particles);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 10) + 's';
        particles.appendChild(particle);
    }
}

// Mouse trail effect removed
// Mouse trail effect listener removed

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations and effects
    setTimeout(type, 500);
    createParticles();
    
    // Setup mobile menu toggle
    setupMobileMenu();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Setup contact form
    setupContactForm();
    
    // Fetch projects
    fetchGitHubProjects();
    
    // Close mobile menu when clicking on navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenuBtn && mobileMenu) {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
});

// System theme change listener removed

// Contact Form Functionality
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Show sending status
            formStatus.textContent = 'Sending message...';
            formStatus.className = 'form-status sending';
            
            // Send data to server using fetch API
            fetch('/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Success message
                    formStatus.textContent = data.message || 'Message sent successfully!';
                    formStatus.className = 'form-status success';
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    // Error message
                    formStatus.textContent = data.message || 'Something went wrong. Please try again.';
                    formStatus.className = 'form-status error';
                }
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                formStatus.textContent = 'Network error. Please try again later.';
                formStatus.className = 'form-status error';
                
                // Clear error message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            });
        });
    }
}

// Typing effect removed for minimalism
// End of script
