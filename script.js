// Création de l'observateur d'intersection
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Ajoute les classes pour l'animation quand l'élément est visible
            entry.target.classList.add('visible');
            // Arrête d'observer l'élément une fois qu'il est apparu
            observer.unobserve(entry.target);
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.1 // Déclenche quand 10% de l'élément est visible
});

// Fonction pour animer les éléments d'une liste avec délai
function animateListItems(items) {
    items.forEach((item, index) => {
        // Ajoute un délai croissant pour chaque élément
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
}

// Au chargement du document
document.addEventListener('DOMContentLoaded', () => {
    // Sélectionne toutes les sections et les items de liste
    const sections = document.querySelectorAll('section');
    const listItems = document.querySelectorAll('li');
    
    // Ajoute les classes initiales pour les animations
    sections.forEach(section => {
        section.classList.add('animate-section');
        observer.observe(section);
    });

    // Anime les items de liste
    animateListItems(Array.from(listItems));
});
