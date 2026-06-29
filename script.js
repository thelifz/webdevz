// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // Initial Page Load Animations
    gsap.to(".header", { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 });
    gsap.fromTo(".book-container", 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }
    );

    // Book Scroll Animation Timeline
    const bookTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-scroll-container",
            start: "top top",
            end: "+=6000", // Pin for exactly 6000px of scrolling
            scrub: 1, // Smooth scrubbing
            pin: ".hero-sticky-area" // Pin just the sticky area
        }
    });

    // Helper to add a realistic shadow sweep to a page flip
    function flipPage(tl, pageSelector, startTimeOffset, newZIndex) {
        // The actual 3D page flip
        tl.to(pageSelector, {
            rotationY: -180,
            ease: "none",
            duration: 1
        }, startTimeOffset);

        // Swap Z-index exactly halfway through the turn so the left side stacks correctly
        tl.set(pageSelector, { zIndex: newZIndex }, startTimeOffset + 0.5);

        // Front face shadow: darkens as the page lifts to 90 degrees
        tl.fromTo(`${pageSelector} .shadow-front`, 
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: "none" }, 
            startTimeOffset
        );
        // Front face shadow: fades out as it completes the turn
        tl.to(`${pageSelector} .shadow-front`, 
            { opacity: 0, duration: 0.5, ease: "none" }, 
            startTimeOffset + 0.5
        );

        // Back face shadow: starts dark at 90 degrees and fades to 0 as it lands
        tl.fromTo(`${pageSelector} .shadow-back`, 
            { opacity: 1 },
            { opacity: 0, duration: 0.5, ease: "none" }, 
            startTimeOffset + 0.5
        );
    }

    // 1. As the book opens, we shift it to the right so the spine is perfectly centered
    bookTl.to(".book-container", {
        x: "50%", 
        ease: "none",
        duration: 1
    }, 0);

    // 2. Flip Page 1. Starts at z-index 6 on right. Becomes z-index 1 on left.
    flipPage(bookTl, ".page-1", 0, 1);
    
    // 3. Flip Page 2. Starts at z-index 5 on right. Becomes z-index 2 on left.
    flipPage(bookTl, ".page-2", 1, 2);
    
    // 4. Flip Page 3. Starts at z-index 4 on right. Becomes z-index 3 on left.
    flipPage(bookTl, ".page-3", 2, 3);
    
    // 5. Flip Page 4 (JEE/NEET). Starts at z-index 3 on right. Becomes z-index 4 on left.
    flipPage(bookTl, ".page-4", 3, 4);
    
    // 6. Flip Page 5 (Online/YT). Starts at z-index 2 on right. Becomes z-index 5 on left.
    flipPage(bookTl, ".page-5", 4, 5);
    
    // 7. Close the book back to the FRONT cover!
    // Animate all flipped pages back to 0 simultaneously.
    bookTl.to(".page-1, .page-2, .page-3, .page-4, .page-5", {
        rotationY: 0,
        ease: "power2.inOut",
        duration: 2
    }, 5);
    
    // Reset their z-indexes halfway through the close so the cover (page-1) ends up on top.
    bookTl.set(".page-1", { zIndex: 6 }, 6);
    bookTl.set(".page-2", { zIndex: 5 }, 6);
    bookTl.set(".page-3", { zIndex: 4 }, 6);
    bookTl.set(".page-4", { zIndex: 3 }, 6);
    bookTl.set(".page-5", { zIndex: 2 }, 6);
    
    // Shift the container back to center (x: 0%) as the book closes back to the right side.
    bookTl.to(".book-container", {
        x: "0%", 
        ease: "power2.inOut",
        duration: 2
    }, 5);

    // 8. Add a pause at the end of the timeline. 
    // This ensures the closed book stays fully pinned on screen for a while
    // as the user continues to scroll, before the next section finally pushes it up.
    bookTl.to({}, { duration: 1.5 });
});

// Hover Animations for Header Elements
const accountBtn = document.querySelector('.account-btn');

accountBtn.addEventListener('mouseenter', () => {
    gsap.to(accountBtn, { 
        y: -3, 
        boxShadow: '0 10px 20px rgba(255, 152, 0, 0.2)', 
        borderColor: 'rgba(255, 152, 0, 0.5)',
        color: '#FF9800',
        duration: 0.3 
    });
});

accountBtn.addEventListener('mouseleave', () => {
    gsap.to(accountBtn, { 
        y: 0, 
        boxShadow: 'none', 
        borderColor: 'var(--glass-border)',
        color: 'var(--text-primary)',
        duration: 0.3 
    });
});

// Syllabus Data for Class 7-12
const syllabusData = {
    "7": {
        cbse: ["Mathematics", "Science", "Social Science", "English", "Hindi / Regional Language"],
        kerala: ["Mathematics", "Basic Science", "Social Science", "English", "Malayalam", "Hindi"]
    },
    "8": {
        cbse: ["Mathematics", "Science", "Social Science", "English", "Hindi / Regional Language"],
        kerala: ["Mathematics", "Basic Science", "Social Science", "English", "Malayalam", "Hindi"]
    },
    "9": {
        cbse: ["Mathematics", "Science", "Social Science", "English", "Hindi / Regional Language"],
        kerala: ["Mathematics", "Physics", "Chemistry", "Biology", "Social Science", "English", "Malayalam", "Hindi"]
    },
    "10": {
        cbse: ["Mathematics", "Science", "Social Science", "English", "Hindi / Regional Language"],
        kerala: ["Mathematics", "Physics", "Chemistry", "Biology", "Social Science", "English", "Malayalam", "Hindi"]
    },
    "11": {
        cbse: ["Physics", "Chemistry", "Mathematics / Biology", "English", "Computer Science / PE"],
        kerala: ["Physics", "Chemistry", "Mathematics / Biology", "English", "Malayalam / Hindi"]
    },
    "12": {
        cbse: ["Physics", "Chemistry", "Mathematics / Biology", "English", "Computer Science / PE"],
        kerala: ["Physics", "Chemistry", "Mathematics / Biology", "English", "Malayalam / Hindi"]
    }
};

// Interactive Syllabus Overlay Logic
const classBtns = document.querySelectorAll('.class-btn');
const syllabusOverlay = document.querySelector('.syllabus-overlay');
const closeOverlayBtn = document.querySelector('.close-overlay');
const overlayTitle = document.getElementById('overlay-title');
const cbseList = document.getElementById('cbse-list');
const keralaList = document.getElementById('kerala-list');

classBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const classLevel = btn.getAttribute('data-class');
        const data = syllabusData[classLevel];
        
        if (data) {
            // Update Title
            overlayTitle.textContent = `Class ${classLevel} Syllabus`;
            
            // Populate CBSE
            cbseList.innerHTML = data.cbse.map(subject => `<li>${subject}</li>`).join('');
            
            // Populate Kerala State Board
            keralaList.innerHTML = data.kerala.map(subject => `<li>${subject}</li>`).join('');
            
            // Animate overlay up
            gsap.to(syllabusOverlay, {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: "power3.out"
            });
        }
    });
});

closeOverlayBtn.addEventListener('click', () => {
    gsap.to(syllabusOverlay, {
        y: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
    });
});
