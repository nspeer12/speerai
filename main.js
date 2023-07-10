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
    document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section);
    });

});


// skillStack();
nn();
renderTorus();
// spot();
