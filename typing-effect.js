// Simple typing effect for the hero section - name only
document.addEventListener('DOMContentLoaded', function() {
    // Only show the name
    const name = 'Yashwanth G';
    
    const heroText = document.getElementById('hero-typed-text');
    let charIndex = 0;
    let typingSpeed = 150; // Base typing speed in ms
    
    function typeEffect() {
        // Add a character
        heroText.textContent = name.substring(0, charIndex + 1);
        charIndex++;
        
        // If we've typed the full name, stop and hide the cursor
        if (charIndex === name.length) {
            // Hide the cursor after typing is complete
            const cursor = document.querySelector('.hero-cursor');
            if (cursor) {
                cursor.style.display = 'none';
            }
            return;
        }
        
        // Random variation in typing speed for realism
        const randomSpeed = Math.max(50, 150 - Math.random() * 100);
        
        // Continue typing
        setTimeout(typeEffect, randomSpeed);
    }
    
    // Start the typing effect
    typeEffect();
});
