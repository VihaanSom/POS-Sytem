$(document).ready(function() {
    // Your existing IntersectionObserver logic
    const sectionsToAnimate = document.querySelectorAll("#menu, #contact");

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(entry.target).css('opacity', '1'); // Fade-in effect
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.2 // Percentage of the element's visibility required to trigger animation
        });

        sectionsToAnimate.forEach(section => {
            observer.observe(section);
        });
    } else {
        // Fallback for browsers not supporting IntersectionObserver
        sectionsToAnimate.forEach(section => {
            $(section).css('opacity', '1'); // Directly apply animation if IntersectionObserver is not supported
        });
    }
});
