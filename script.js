// Variables globales
let currentArticleIndex = 0;
let articles = [];
let isAnimating = false;

// Initialisation des cartes
function initializeCards() {
    articles = Array.from(document.querySelectorAll('.card'));
    
    if (articles.length > 0) {
        articles[0].classList.add('active');
        if (!articles[0].classList.contains('gif-card')) {
            animateListItems(articles[0].querySelectorAll('li'));
        }
    }
    
    createNavigationControls();
    addKeyboardSupport();
    addTouchSupport();
    updateHeaderFooterVisibility();
}

function updateHeaderFooterVisibility() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const firstCard = articles[0];
    const currentCard = articles[currentArticleIndex];
    
    if (window.innerWidth <= 768) {
        if (currentCard === firstCard) {
            header.style.display = 'block';
            footer.style.display = 'block';
        } else {
            header.style.display = 'none';
            footer.style.display = 'none';
        }
    } else {
        header.style.display = 'block';
        footer.style.display = 'block';
    }
}

// Création des contrôles de navigation
function createNavigationControls() {
    const nav = document.createElement('div');
    nav.className = 'navigation-controls';
    nav.innerHTML = `
        <button class="nav-button prev">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Précédent
        </button>
        <button class="nav-button next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Suivant
        </button>
    `;
    
    document.body.appendChild(nav);
    nav.querySelector('.prev').addEventListener('click', () => changeCard('prev'));
    nav.querySelector('.next').addEventListener('click', () => changeCard('next'));
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

// Fonction générique pour changer de carte
function changeCard(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const currentCard = articles[currentArticleIndex];
    const nextIndex = direction === 'next' 
        ? (currentArticleIndex + 1) % articles.length
        : (currentArticleIndex - 1 + articles.length) % articles.length;
    const nextCard = articles[nextIndex];

    // Direction de l'animation
    const exitTransform = direction === 'next' ? -100 : 100;
    const enterTransform = direction === 'next' ? 50 : -50;

    // Animation de sortie
    currentCard.style.opacity = '0';
    currentCard.style.transform = `translateX(${exitTransform}px)`;

    setTimeout(() => {
        currentCard.classList.remove('active');
        currentCard.style.display = 'none';
        
        // Préparation de la nouvelle carte
        nextCard.style.display = 'block';
        nextCard.style.transform = `translateX(${enterTransform}px)`;
        nextCard.style.opacity = '0';
        
        nextCard.offsetHeight; // Force reflow
        
        // Animation d'entrée
        nextCard.classList.add('active');
        nextCard.style.transform = '';
        nextCard.style.opacity = '';
        
        if (!nextCard.classList.contains('gif-card')) {
            animateListItems(nextCard.querySelectorAll('li'));
        }
        
        currentArticleIndex = nextIndex;
        isAnimating = false;

        updateHeaderFooterVisibility();
    }, 500);
}

window.addEventListener('resize', updateHeaderFooterVisibility);

// Support du clavier
function addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
            case 'ArrowRight':
                e.preventDefault();
                changeCard('next');
                break;
            case 'ArrowLeft':
                e.preventDefault();
                changeCard('prev');
                break;
        }
    });
}

// Support tactile
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
                changeCard('next');
            } else {
                changeCard('prev');
            }
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initializeCards);
