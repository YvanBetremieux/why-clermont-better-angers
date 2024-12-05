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


function animateListItems(items) {
    items = Array.from(items);
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 150); // Délai plus long pour un effet plus marqué
    });
}

function showNextCard() {
    if (isAnimating) return;
    isAnimating = true;

    const currentCard = articles[currentArticleIndex];
    const nextIndex = (currentArticleIndex + 1) % articles.length;
    const nextCard = articles[nextIndex];

    // Reset des animations de la liste actuelle
    currentCard.querySelectorAll('li').forEach(li => {
        li.classList.remove('visible');
    });

    // Animation de sortie
    currentCard.style.opacity = '0';
    currentCard.style.transform = 'translateX(-100px)';

    setTimeout(() => {
        currentCard.style.display = 'none';
        nextCard.style.display = 'block';
        
        // Force un reflow
        nextCard.offsetHeight;
        
        nextCard.classList.add('active');
        
        // Anime les éléments de la liste
        animateListItems(nextCard.querySelectorAll('li'));
        
        // Met à jour l'index
        currentArticleIndex = nextIndex;
        document.querySelector('.current').textContent = currentArticleIndex + 1;
        
        isAnimating = false;
    }, 500);
}


document.addEventListener('DOMContentLoaded', initializeCards);
