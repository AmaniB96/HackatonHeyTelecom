const optionsConfig = {
    audiance: [
        "Etudiants",
        "Professionnels",
        "Parents",
        "Retraités"
    ],
    objectif: [
        "Acquisition de clients",
        "Conversion",
        "Notoriété",
        "Engagement social"
    ],
    format: [
        "Post Instagram",
        "Story Instagram",
        "Affiche publicitaire",
        "Bannière web"
    ],
    ton: [
        "Amical",
        "Sérieux",
        "Futuriste",
        "Minimaliste"
    ]
};

// État de l'application
const appState = {
    objectif: "",
    format: "",
    ton: "",
    elementObligatoire: "",
    description: "",
    adjustment: "",
    imageGenerated: false
};

// Éléments DOM
const parameterSelects = document.querySelectorAll('.parameter-select');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const optionsList = document.getElementById('options-list');
const elementObligatoireInput = document.getElementById('element-obligatoire');
const descriptionTextarea = document.getElementById('description');
const promptPreview = document.getElementById('prompt-preview');
const generateButton = document.getElementById('generate-button');
const adjustmentInput = document.getElementById('adjustment');
const adjustButton = document.getElementById('adjust-button');
const imagePreview = document.getElementById('image-preview');
const generatedImage = document.getElementById('generated-image');

// Variable pour stocker le paramètre actuel
let currentParam = '';

// Gestion des événements
parameterSelects.forEach(select => {
    select.addEventListener('click', () => openModal(select.dataset.param));
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

elementObligatoireInput.addEventListener('input', updateElementObligatoire);
descriptionTextarea.addEventListener('input', updateDescription);
generateButton.addEventListener('click', generateImage);
adjustmentInput.addEventListener('input', updateAdjustment);
adjustButton.addEventListener('click', adjustImage);

// Fonctions
function openModal(param) {
    currentParam = param;
    modalTitle.textContent = getModalTitle(param);
    
    // Vider et remplir la liste des options
    optionsList.innerHTML = '';
    optionsConfig[param].forEach(option => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        if (appState[param] === option) {
            optionItem.classList.add('selected');
        }
        optionItem.textContent = option;
        optionItem.addEventListener('click', () => selectOption(option, param));
        optionsList.appendChild(optionItem);
    });
    
    // Afficher le modal
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

function getModalTitle(param) {
    switch(param) {
        case 'objectif': return '📌 Sélectionner un objectif marketing';
        case 'format': return '🎨 Sélectionner un format de visuel';
        case 'ton': return '🌟 Sélectionner un ton et une ambiance';
        default: return 'Sélectionner une option';
    }
}

function selectOption(option, param) {
    appState[param] = option;
    
    // Mettre à jour l'affichage du paramètre sélectionné
    const paramSelector = document.querySelector(`.parameter-select[data-param="${param}"]`);
    paramSelector.querySelector('span').textContent = option;
    paramSelector.classList.add('filled');
    
    // Fermer le modal
    closeModal();
    
    // Mettre à jour le prompt
    updatePrompt();
}

function updateElementObligatoire() {
    appState.elementObligatoire = elementObligatoireInput.value.trim();
    updatePrompt();
}

function updateDescription() {
    appState.description = descriptionTextarea.value.trim();
    updatePrompt();
}

function updateAdjustment() {
    appState.adjustment = adjustmentInput.value.trim();
    adjustButton.disabled = !appState.adjustment;
}

function updatePrompt() {
    const { objectif, format, ton, elementObligatoire, description } = appState;
    
    if (!description) {
        promptPreview.textContent = "Saisissez une description et définissez les paramètres pour générer votre prompt...";
        return;
    }
    
    let prompt = description;
    
    // Ajouter les paramètres sélectionnés au prompt
    const parts = [];
    
    if (objectif) parts.push(`Pour un objectif de ${objectif.toLowerCase()}`);
    if (format) parts.push(`au format ${format.toLowerCase()}`);
    if (ton) parts.push(`avec un ton ${ton.toLowerCase()}`);
    if (elementObligatoire) parts.push(`incluant obligatoirement ${elementObligatoire}`);
    
    if (parts.length > 0) {
        prompt += "\n\n" + parts.join(", ") + ".";
    }
    
    promptPreview.textContent = prompt;
    
    // Activer/désactiver le bouton de génération
    generateButton.disabled = !description || !objectif || !format || !ton;
}

function generateImage() {
    // Simuler la génération d'image (dans un vrai cas, cela appellerait une API IA)
    generateButton.disabled = true;
    generateButton.textContent = "Génération en cours...";
    
    setTimeout(() => {
        // Dans un cas réel, nous recevrions l'URL de l'image du serveur
        // Pour la simulation, nous utilisons une image placeholder
        displayPlaceholderImage();
        
        // Mettre à jour l'état
        appState.imageGenerated = true;
        generateButton.textContent = "Générer une nouvelle image";
        generateButton.disabled = false;
        
        // Activer les contrôles d'ajustement
        adjustmentInput.disabled = false;
        adjustButton.disabled = true; // Sera activé quand l'input aura du texte
    }, 2000);
}

function adjustImage() {
    // Simuler l'ajustement d'image
    adjustButton.disabled = true;
    adjustButton.textContent = "Ajustement en cours...";
    
    setTimeout(() => {
        // Simuler un changement dans l'image
        displayPlaceholderImage(true);
        
        // Réinitialiser les contrôles
        adjustButton.textContent = "Ajuster l'image";
        adjustButton.disabled = false;
        adjustmentInput.value = "";
        appState.adjustment = "";
    }, 1500);
}

function displayPlaceholderImage(isAdjusted = false) {
    // Simuler l'affichage d'une image générée
    // Dans une vraie application, nous afficherions l'image reçue de l'API
    const imagePreviewText = imagePreview.querySelector('span');
    if (imagePreviewText) {
        imagePreviewText.style.display = 'none';
    }
    
    // Générer une URL différente pour simuler le changement d'image
    const timestamp = new Date().getTime();
    const width = 280;
    const height = 240;
    const randomSeed = isAdjusted ? 'adjusted' : 'original';
    
    generatedImage.src = `https://s3.eu-west-3.amazonaws.com/pub.be/2023/08/29/Header-NL.jpg`;
    generatedImage.style.display = 'block';
    generatedImage.classList.add('fadeIn');
    
    // Retirer l'animation après qu'elle soit terminée
    setTimeout(() => {
        generatedImage.classList.remove('fadeIn');
    }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-toggle-icon');
    
    // Vérifier s'il y a une préférence enregistrée
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '🌙';
    }
    
    // Gérer le changement de thème
    themeToggle.addEventListener('click', function() {
      // Vérifier le thème actuel
      const currentTheme = document.documentElement.getAttribute('data-theme');
      
      if (currentTheme === 'dark') {
        // Passer au mode clair
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '☀️';
      } else {
        // Passer au mode sombre
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '🌙';
      }
    });
  });
  
  // Vérifier les préférences système pour le mode sombre
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.querySelector('.theme-toggle-icon').textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  }

// Initialiser l'interface
updatePrompt();