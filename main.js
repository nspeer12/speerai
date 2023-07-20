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

function hideMobile() {

    // select anythign with a class of hide-mobile
    const hideMobile = document.querySelectorAll('.hide-mobile');
    
    // Get the current viewport width
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    
    // Show or hide videos based on the viewport width
    for (let element of hideMobile) {
        element.style.display = viewportWidth <= maxVideoViewportWidth ? 'none' : 'block';
    }
}

// Handle resize events
window.addEventListener('resize', hideMobile);

// Call the function initially when the page loads
hideMobile();


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


let jobTitles = ["AI Engineer", "Full-Stack Developer", "Product Designer", "Robotics Engineer"];
let currentJob = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    let target = document.getElementById('job-title');
    if(!target) return; // Return if element not found

    if(charIndex === jobTitles[currentJob].length + 1 && !isDeleting) {
        // Start deleting after the last character has been displayed
        isDeleting = true;
    } else if(isDeleting && charIndex === 0) {
        // Move to the next job title and switch the direction
        currentJob = (currentJob + 1) % jobTitles.length;
        isDeleting = false;
    }

    target.innerHTML = jobTitles[currentJob].substring(0, charIndex) || "&nbsp;";

    if(isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    // Set the typing speed
    let typingSpeed = 100;
    if(isDeleting) {
        typingSpeed /= 2; // Deleting is faster
    }

    // If a word is fully printed, wait 3s before start deleting
    if(!isDeleting && charIndex === jobTitles[currentJob].length + 1) {
        setTimeout(typeEffect, 3000);
    } else {
        setTimeout(typeEffect, typingSpeed);
    }
}

// Call the function
typeEffect();

