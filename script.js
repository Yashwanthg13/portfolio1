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

// Fetch GitHub profile and projects
async function fetchGitHubProfile() {
    console.log('Starting to fetch GitHub profile...');
    const githubProfileElement = document.getElementById('github-profile');
    
    if (!githubProfileElement) {
        console.error('GitHub profile element not found');
        return;
    }
    
    try {
        const username = 'yashwanthg13';
        console.log(`Fetching GitHub profile data for ${username}...`);
        
        // Set timeout for fetch to avoid hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        // Fetch user data from our server-side API endpoint
        const userResponse = await fetch(`/api/github/user/${username}`, {
            signal: controller.signal
        });
        
        if (!userResponse.ok) {
            console.log(`GitHub API returned status: ${userResponse.status}`);
            throw new Error(`GitHub API user response error: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        console.log('Successfully fetched GitHub user data:', userData);
        clearTimeout(timeoutId); // Clear timeout after successful fetch
        
        // Update GitHub profile info
        githubProfileElement.innerHTML = `
            <div class="github-profile-header">
                <img src="${userData.avatar_url}" alt="${username} profile" class="github-avatar">
                <div>
                    <h3 class="github-profile-name">${userData.name || username}</h3>
                    <p class="github-profile-username">@${userData.login}</p>
                </div>
            </div>
            <p class="github-profile-bio">${userData.bio || 'Full Stack Web Developer'}</p>
            <div class="github-stats">
                <div class="github-stat">
                    <span class="stat-value">${userData.public_repos}</span>
                    <span class="stat-label">Repositories</span>
                </div>
                <div class="github-stat">
                    <span class="stat-value">${userData.followers}</span>
                    <span class="stat-label">Followers</span>
                </div>
                <div class="github-stat">
                    <span class="stat-value">${userData.following}</span>
                    <span class="stat-label">Following</span>
                </div>
            </div>
            <div class="github-links">
                <a href="${userData.html_url}" target="_blank" class="github-link">
                    <i class="fab fa-github"></i> View Profile
                </a>
            </div>
        `;
        
        // After successfully displaying the profile, fetch repositories
        fetchGitHubRepos(username);
        
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        githubProfileElement.innerHTML = `
            <div class="github-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Could not load GitHub profile. Please try again later.</p>
                <a href="https://github.com/yashwanthg13" target="_blank" class="github-link">
                    <i class="fab fa-github"></i> View Profile on GitHub
                </a>
            </div>
        `;
    }
}

// Fetch GitHub projects with fallback
async function fetchGitHubRepos(username) {
    console.log('Starting to fetch GitHub projects...');
    const projectGrid = document.getElementById('github-repos');
    const loadingProjects = document.querySelector('.loading-projects');
    
    if (!projectGrid) {
        console.error('Project grid element not found');
        return;
    }
    
    // Show loading indicator
    if (loadingProjects) {
        loadingProjects.style.display = 'flex';
    }
    
    // Add immediate timeout to ensure we don't wait too long
    setTimeout(() => {
        if (loadingProjects && loadingProjects.style.display === 'flex') {
            console.log('Loading timeout reached');
            loadingProjects.style.display = 'none';
            // Show message that GitHub repos couldn't be loaded
            projectGrid.innerHTML = '<div class="github-error"><p>Could not load GitHub repositories. Please try again later.</p></div>';
        }
    }, 3000); // 3 second timeout as a safety measure
    
    // No fallback projects - we'll only show actual GitHub repos
    
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
    
    try {
        const username = 'yashwanthg13';
        console.log(`Fetching GitHub data for ${username}...`);
        
        // Set timeout for fetch to avoid hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        // Fetch user data from our server-side API endpoint
        console.log(`Fetching GitHub data for ${username} from server API...`);
        const userResponse = await fetch(`/api/github/user/${username}`, {
            signal: controller.signal
        });
        
        if (!userResponse.ok) {
            console.log(`GitHub API returned status: ${userResponse.status}`);
            throw new Error(`GitHub API user response error: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        console.log('Successfully fetched GitHub user data');
        clearTimeout(timeoutId); // Clear timeout after successful fetch
        
        // Update GitHub profile info
        githubInfo.innerHTML = `
            <div class="github-profile">
                <img src="${userData.avatar_url}" alt="${username} profile" class="github-avatar">
                <div class="github-profile-info">
                    <h3>${userData.name || username}</h3>
                    <p>${userData.bio || 'Full Stack Web Developer'}</p>
                    <div class="github-stats">
                        <div class="stat">
                            <span class="stat-value">${userData.public_repos}</span>
                            <span class="stat-label">Repositories</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${userData.followers}</span>
                            <span class="stat-label">Followers</span>
                        </div>
                    </div>
                    <a href="${userData.html_url}" target="_blank" class="github-link">
                        <i class="fab fa-github"></i> View Profile
                    </a>
                </div>
            </div>
        `;
        
        // Set new timeout for repos fetch
        const reposController = new AbortController();
        const reposTimeoutId = setTimeout(() => reposController.abort(), 5000);
        
        // Fetch repositories from our server-side API endpoint
        console.log(`Fetching GitHub repos for ${username} from server API...`);
        const reposResponse = await fetch(`/api/github/repos/${username}`, {
            signal: reposController.signal
        });
        
        if (!reposResponse.ok) {
            throw new Error(`GitHub API repos response error: ${reposResponse.status}`);
        }
        
        const repos = await reposResponse.json();
        clearTimeout(reposTimeoutId);
        
        // Hide loading indicator
        if (loadingProjects) {
            loadingProjects.style.display = 'none';
        }
        
        // Clear project grid
        projectGrid.innerHTML = '';
        
        if (Array.isArray(repos) && repos.length > 0) {
            // Filter out portfolio repository and forks
            const filteredRepos = repos.filter(repo => 
                !repo.name.toLowerCase().includes('portfolio') && 
                !repo.fork
            );
            
            if (filteredRepos.length === 0) {
                // Show message that no repositories were found
                projectGrid.innerHTML = '<div class="github-error"><p>No public repositories found. Check back later for updates.</p></div>';
                return;
            }
            
            // Limit to 6 projects
            const limitedRepos = filteredRepos.slice(0, 6);
            
            // Create and append project cards
            limitedRepos.forEach(repo => {
                const projectCard = createProjectCard(repo);
                projectGrid.appendChild(projectCard);
                
                // Add animation observer if it exists
                if (typeof observer !== 'undefined') {
                    observer.observe(projectCard);
                }
            });
            
            // Add hover effects to all project cards
            addHoverEffectsToCards();
        } else {
            // Show message that no repositories were found
            projectGrid.innerHTML = '<div class="github-error"><p>No repositories found. Check back later for updates.</p></div>';
        }
        
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        
        // Hide loading indicator
        if (loadingProjects) {
            loadingProjects.style.display = 'none';
        }
        
        // Display error message
        console.log('Error loading GitHub repositories');
        projectGrid.innerHTML = '<div class="github-error"><p>Could not load GitHub repositories. Please try again later.</p></div>';
    }
}

// Add CSS for GitHub error messages
const style = document.createElement('style');
style.textContent = `
.github-error {
    text-align: center;
    padding: 2rem;
    background-color: var(--card-bg);
    border-radius: 10px;
    margin: 1rem 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.github-error p {
    color: var(--text-secondary);
    font-size: 1.1rem;
}

.github-error i {
    font-size: 2rem;
    color: var(--accent-color);
    margin-bottom: 1rem;
}
`;
document.head.appendChild(style);

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
    
    // Fetch GitHub profile and projects
    fetchGitHubProfile();
    
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
