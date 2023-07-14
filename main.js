import { renderTorus } from './src/torus.js';
import { nn } from './src/nn';
import { renderThes } from './src/thes';
import { spot } from './src/spot';
import { skillStack } from './src/blocks.js';

document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            if (entry.intersectionRatio > 0) {
                document.querySelector(`#sidebar ul li a[href="#${id}"]`).classList.add('active');
            } else {
                document.querySelector(`#sidebar ul li a[href="#${id}"]`).classList.remove('active');
            }
        });
    });

    // Track all sections that have an `id` applied
    document.querySelectorAll('supersection[id]').forEach((supersection) => {
        observer.observe(supersection);
    });

});

// Set the maximum viewport width for which videos should be hidden
const maxVideoViewportWidth = 768; // Adjust this value as needed

function handleResize() {
    // Get all the YouTube iframes on the page
    const videos = document.querySelectorAll('iframe[src^="https://www.youtube.com"]');
    
    // Get the current viewport width
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    
    // Show or hide videos based on the viewport width
    for (let video of videos) {
        video.style.display = viewportWidth <= maxVideoViewportWidth ? 'none' : 'block';
    }
}

// Handle resize events
window.addEventListener('resize', handleResize);

// Call the function initially when the page loads
handleResize();


const sidebar = document.getElementById('sidebar');

function resize() {
    if (window.innerWidth < 768) {
        sidebar.classList.add('d-none');
    } else {
        sidebar.classList.remove('d-none');
    }
}

// Call resize function initially to ensure the sidebar is hidden if the viewport is small
resize();

// Attach event listener
window.addEventListener('resize', resize);


let isAnimating = true;


nn(isAnimating);
renderTorus(isAnimating);

// const toggleSwitch = document.getElementById('toggle-switch');

// toggleSwitch.addEventListener('change', (event) => {

//   isAnimating = event.target.checked;

//   console.log('Animation: ', isAnimating);

//   // Start or stop the animations
//   if (isAnimating) {
//     nn(isAnimating);
//     renderTorus(isAnimating);
//   }
// });