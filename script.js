// Variables globales
let currentArticleIndex = 0;
let articles = [];
let isAnimating = false;

// Initialisation des cartes
function initializeCards() {
    articles = Array.from(document.querySelectorAll('.card'));
    
    if (articles.length > 0) {
        articles[0].classList.add('active');
        // Si ce n'est pas une carte GIF, anime les items de liste
        if (!articles[0].classList.contains('gif-card')) {
            animateListItems(articles[0].querySelectorAll('li'));
        }
    }
    
    createNavigationControls();
    addKeyboardSupport();
    addTouchSupport();
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
    `;
    
    document.body.appendChild(nav);
    nav.querySelector('.next').addEventListener('click', showNextCard);
}

// Animation des items de liste
function animateListItems(items) {
    if (!items) return;
    items = Array.from(items);
    items.forEach((item, index) => {
        item.classList.remove('visible');
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

    currentCard.style.opacity = '0';
    currentCard.style.transform = 'translateX(-100px)';

    setTimeout(() => {
        currentCard.classList.remove('active');
        currentCard.style.display = 'none';
        
        nextCard.style.display = 'block';
        nextCard.style.transform = 'translateX(50px)';
        nextCard.style.opacity = '0';
        
        nextCard.offsetHeight; // Force reflow
        
        nextCard.classList.add('active');
        nextCard.style.transform = '';
        nextCard.style.opacity = '';
        
        // Anime les items de liste seulement si ce n'est pas une carte GIF
        if (!nextCard.classList.contains('gif-card')) {
            animateListItems(nextCard.querySelectorAll('li'));
        }
        
        currentArticleIndex = nextIndex;
        isAnimating = false;
    }, 500);
}

// Support du clavier et tactile (reste identique)
function addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowRight') {
            e.preventDefault();
            showNextCard();
        }
    });
}

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
        const swipeDistance = touchStartX - touchEndX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                showNextCard();
            }
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initializeCards);
