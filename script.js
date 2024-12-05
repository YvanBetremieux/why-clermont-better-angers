// Variables globales
let currentArticleIndex = 0;
let articles = [];
let isAnimating = false;

// Initialisation
function initializeCards() {
    // Récupère tous les articles
    articles = Array.from(document.querySelectorAll('.card'));
    
    // Configure le premier article
    if (articles.length > 0) {
        articles[0].classList.add('active');
        animateListItems(articles[0].querySelectorAll('li'));
    }
    
    // Crée la navigation
    createNavigationControls();
    
    // Ajoute le support clavier
    addKeyboardSupport();
}

// Création des contrôles de navigation
function createNavigationControls() {
    const nav = document.createElement('div');
    nav.className = 'navigation-controls';
    nav.innerHTML = `
        <button class="nav-button next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Suivant
        </button>
        <div class="progress-indicator">
            <span class="current">1</span>/<span class="total">${articles.length}</span>
        </div>
    `;
    
    document.body.appendChild(nav);
    nav.querySelector('.next').addEventListener('click', showNextCard);
}

// Animation des éléments de liste
function animateListItems(items) {
    items = Array.from(items);
    items.forEach((item, index) => {
        // Reset de l'état
        item.classList.remove('visible');
        
        // Animation avec délai
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 150);
    });
}

// Affichage de la carte suivante
function showNextCard() {
    if (isAnimating) return;
    isAnimating = true;

    const currentCard = articles[currentArticleIndex];
    const nextIndex = (currentArticleIndex + 1) % articles.length;
    const nextCard = articles[nextIndex];

    // Animation de sortie de la carte actuelle
    currentCard.style.opacity = '0';
    currentCard.style.transform = 'translateX(-100px)';

    setTimeout(() => {
        // Cache la carte actuelle
        currentCard.classList.remove('active');
        currentCard.style.display = 'none';

        // Prépare la nouvelle carte
        nextCard.style.display = 'block';
        nextCard.style.transform = 'translateX(50px)';
        nextCard.style.opacity = '0';

        // Force un reflow
        nextCard.offsetHeight;

        // Affiche la nouvelle carte
        nextCard.classList.add('active');
        nextCard.style.transform = '';
        nextCard.style.opacity = '';

        // Anime les éléments de la liste
        animateListItems(nextCard.querySelectorAll('li'));

        // Met à jour l'index et l'indicateur
        currentArticleIndex = nextIndex;
        updateProgress();

        isAnimating = false;
    }, 500);
}

// Mise à jour de l'indicateur de progression
function updateProgress() {
    document.querySelector('.current').textContent = currentArticleIndex + 1;
}

// Support clavier
function addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowRight') {
            e.preventDefault();
            showNextCard();
        }
    });
}

// Gestion du swipe sur mobile
function addTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            showNextCard();
        }
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initializeCards();
    addTouchSupport();
});
