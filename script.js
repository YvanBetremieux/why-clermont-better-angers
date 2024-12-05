// État global pour suivre l'article courant
let currentArticleIndex = 0;
let articles = [];
let isAnimating = false;

function initializeSequentialDisplay() {
    // Récupère tous les articles
    articles = Array.from(document.querySelectorAll('article'));
    
    // Cache tous les articles sauf le premier
    articles.forEach((article, index) => {
        article.style.display = index === 0 ? 'block' : 'none';
        article.style.opacity = index === 0 ? '1' : '0';
    });

    // Crée et ajoute les boutons de navigation
    createNavigationButtons();
    
    // Affiche les éléments de liste du premier article
    animateListItems(articles[0].querySelectorAll('li'));
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
            Article <span class="current">1</span>/<span class="total">${articles.length}</span>
        </div>
    `;
    
    document.querySelector('main').appendChild(nav);
    
    // Ajoute l'écouteur d'événement pour le bouton suivant
    nav.querySelector('.next').addEventListener('click', showNextArticle);
}

async function showNextArticle() {
    if (isAnimating) return;
    isAnimating = true;

    // Calcule le prochain index
    const nextIndex = (currentArticleIndex + 1) % articles.length;
    
    // Anime la sortie de l'article courant
    await animateArticleTransition(
        articles[currentArticleIndex], 
        articles[nextIndex]
    );
    
    // Met à jour l'index courant
    currentArticleIndex = nextIndex;
    
    // Met à jour l'indicateur de progression
    document.querySelector('.current').textContent = currentArticleIndex + 1;
    
    isAnimating = false;
}

async function animateArticleTransition(currentArticle, nextArticle) {
    // Fait sortir l'article actuel
    await fadeOut(currentArticle);
    currentArticle.style.display = 'none';
    
    // Prépare et affiche le prochain article
    nextArticle.style.display = 'block';
    nextArticle.style.opacity = '0';
    await fadeIn(nextArticle);
    
    // Anime les éléments de liste du nouvel article
    animateListItems(nextArticle.querySelectorAll('li'));
}

function fadeOut(element) {
    return new Promise(resolve => {
        element.style.opacity = '0';
        setTimeout(resolve, 300); // Correspond à la durée de transition CSS
    });
}

function fadeIn(element) {
    return new Promise(resolve => {
        setTimeout(() => {
            element.style.opacity = '1';
            setTimeout(resolve, 300);
        }, 50);
    });
}

function animateListItems(items) {
    items = Array.from(items);
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initializeSequentialDisplay);
