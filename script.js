// Selectors
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0;
// visibleItems tracks which images are currently filtered so the lightbox doesn't show hidden images
let visibleItems = Array.from(galleryItems); 

// --- 1. Filtering System ---
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle active button class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        // Show/Hide based on category
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });

        // Update the array of currently visible items for accurate lightbox navigation
        visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
    });
});

// --- 2. Lightbox Logic ---
galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
        const imgSource = item.querySelector('img').src;
        // Determine the index of the clicked item within the currently filtered view
        currentIndex = visibleItems.indexOf(item);
        
        lightboxImg.src = imgSource;
        lightbox.classList.add('active');
    });
});

// Close Lightbox
closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

// Close Lightbox by clicking the background overlay
lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg && e.target !== prevBtn && e.target !== nextBtn) {
        lightbox.classList.remove('active');
    }
});

// --- 3. Navigation (Prev/Next) ---
function navigate(direction) {
    currentIndex += direction;

    // Create a continuous loop (wrap around if at the end/beginning)
    if (currentIndex < 0) {
        currentIndex = visibleItems.length - 1;
    } else if (currentIndex >= visibleItems.length) {
        currentIndex = 0;
    }

    // Set the new image source
    const newSrc = visibleItems[currentIndex].querySelector('img').src;
    lightboxImg.src = newSrc;
}

prevBtn.addEventListener('click', () => navigate(-1));
nextBtn.addEventListener('click', () => navigate(1));

// Keyboard Support for UX
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'Escape') lightbox.classList.remove('active');
});