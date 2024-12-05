let currentArticleIndex = 0;
let articles = [];
let isAnimating = false;

function initializeCards() {
    articles = Array.from(document.querySelectorAll('article'));
    
    // Ajoute la classe active au premier article
    articles[0].classList.add('active');
    
    // Animation initiale des éléments de liste
    animateListItems(articles[0].querySelectorAll('li'));
    
    createNavigationButtons();
}

function createNavigationButtons() {
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

async function showNextCard() {
    if (isAnimating) return;
    isAnimating = true;

    const currentCard = articles[currentArticleIndex];
    const nextIndex = (currentArticleIndex + 1) % articles.length;
    const nextCard = articles[nextIndex];

    // Animation de sortie
    currentCard.style.transform = 'translateX(-100px)';
    currentCard.style.opacity = '0';
    
    setTimeout(() => {
        currentCard.classList.remove('active');
        nextCard.classList.add('active');
        nextCard.style.transform = 'translateX(0)';
        nextCard.style.opacity = '1';
        
        // Anime les éléments de liste
        animateListItems(nextCard.querySelectorAll('li'));
        
        // Met à jour l'index et l'indicateur
        currentArticleIndex = nextIndex;
        document.querySelector('.current').textContent = currentArticleIndex + 1;
        
        isAnimating = false;
    }, 500);
}

function animateListItems(items) {
    items = Array.from(items);
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100 + 300);
    });
}

document.addEventListener('DOMContentLoaded', initializeCards);
