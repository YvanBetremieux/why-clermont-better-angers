// Variables globales
let currentArticleIndex = 0;
let articles = [];
let isAnimating = false;

// Collection de GIFs
const gifs = [
    {
        url: "https://media1.giphy.com/media/3o7TKOQ4Z2vOGZ1GbC/giphy.gif",
        caption: "Quand un Angevin découvre le Puy de Dôme..."
    },
    {
        url: "https://media2.giphy.com/media/3oz8xZMZox78ZbWbFC/giphy.gif",
        caption: "L'ASM qui arrive au stade..."
    },
    {
        url: "https://media3.giphy.com/media/S9i8jJxTvAKVHVMvvW/giphy.gif",
        caption: "Les volcans d'Auvergne be like..."
    }
];

// Initialisation des cartes
function initializeCards() {
    articles = Array.from(document.querySelectorAll('.card'));
    
    if (articles.length > 0) {
        articles[0].classList.add('active');
        animateListItems(articles[0].querySelectorAll('li'));
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
    items = Array.from(items);
    items.forEach((item, index) => {
        item.classList.remove('visible');
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 150);
    });
}

// Création d'une carte GIF
function createGifCard(gifData) {
    const gifCard = document.createElement('div');
    gifCard.className = 'card gif-card';
    gifCard.innerHTML = `
        <img src="${gifData.url}" alt="GIF humoristique" class="reaction-gif">
        <p class="gif-caption">${gifData.caption}</p>
    `;
    return gifCard;
}

// Vérification si on doit montrer un GIF
function shouldShowGif() {
    return currentArticleIndex % 3 === 2 && Math.random() < 0.7;
}

// Affichage du GIF intermédiaire
async function showGifInterlude() {
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    const gifCard = createGifCard(randomGif);
    
    document.querySelector('.card-container').appendChild(gifCard);
    
    return new Promise(resolve => setTimeout(() => {
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

// Affichage de la carte suivante
async function showNextCard() {
    if (isAnimating) return;
    isAnimating = true;

    const currentCard = articles[currentArticleIndex];
    const nextIndex = (currentArticleIndex + 1) % articles.length;
    const nextCard = articles[nextIndex];

    currentCard.style.opacity = '0';
    currentCard.style.transform = 'translateX(-100px)';

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

// Support du clavier
function addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowRight') {
            e.preventDefault();
            showNextCard();
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
                showNextCard();
            }
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initializeCards);
