// This script adds a simple "fade in on scroll" animation to elements.

document.addEventListener("DOMContentLoaded", () => {
    // 1. Select all elements that should be animated
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // 2. Set up the Intersection Observer
    // This is a modern browser API that efficiently watches for when elements enter the screen.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is on screen (isIntersecting)
            if (entry.isIntersecting) {
                // Add the 'is-visible' class, which triggers the CSS animation
                entry.target.classList.add('is-visible');
                // Optional: Stop observing the element once it's visible so the animation only happens once
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Options for the observer
        threshold: 0.1 // Trigger the animation when 10% of the element is visible
    });

    // 3. Tell the observer to watch each of our selected elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});

