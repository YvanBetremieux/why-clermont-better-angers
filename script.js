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

function createGifCard(gifData) {
    const gifCard = document.createElement('div');
    gifCard.className = 'card gif-card';
    gifCard.innerHTML = `
        <img src="${gifData.url}" alt="GIF humoristique" class="reaction-gif">
        <p class="gif-caption">${gifData.caption}</p>
    `;
    return gifCard;
}

function shouldShowGif() {
    // Montre un GIF toutes les 3 cartes avec 70% de chance
    return currentArticleIndex % 3 === 2 && Math.random() < 0.7;
}

async function showNextCard() {
    if (isAnimating) return;
    isAnimating = true;

    const currentCard = articles[currentArticleIndex];
    const nextIndex = (currentArticleIndex + 1) % articles.length;
    const nextCard = articles[nextIndex];

    // Animation de sortie de la carte actuelle
    currentCard.style.opacity = '0';
    currentCard.style.transform = 'translateX(-100px)';

    // Vérifie si on doit montrer un GIF
    if (shouldShowGif()) {
        await showGifInterlude();
    }

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
        
        animateListItems(nextCard.querySelectorAll('li'));
        
        currentArticleIndex = nextIndex;
        isAnimating = false;
    }, 500);
}

async function showGifInterlude() {
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    const gifCard = createGifCard(randomGif);
    
    document.querySelector('.card-container').appendChild(gifCard);
    
    await new Promise(resolve => setTimeout(() => {
        gifCard.classList.add('active');
        
        setTimeout(() => {
            gifCard.style.opacity = '0';
            gifCard.style.transform = 'translateX(-100px)';
            
            setTimeout(() => {
                gifCard.remove();
                resolve();
            }, 500);
        }, 2000);
    }, 0));
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
