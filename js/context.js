const optionsConfig = {
    audiance: ["Etudiants", "Professionnels", "Parents", "Retraités"],
    objectif: ["Acquisition de clients", "Conversion", "Notoriété", "Engagement social"],
    format: ["Post Instagram", "Story Instagram", "Affiche publicitaire", "Bannière web"],
    ton: ["Amical", "Sérieux", "Futuriste", "Minimaliste"]
};

const appState = {
    objectif: "",
    format: "",
    ton: "",
    elementObligatoire: "",
    description: "",
    adjustment: "",
    imageGenerated: false
};

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
const imageHistoryContainer = document.getElementById('image-history-container');

let currentParam = '';

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
generateButton.addEventListener('click', function() {
    const prompt = promptPreview.textContent;
    generateImageSet(prompt, predefinedImageSets[currentImageSetIndex]);
    currentImageSetIndex = (currentImageSetIndex + 1) % predefinedImageSets.length;
});
adjustmentInput.addEventListener('input', updateAdjustment);
adjustButton.addEventListener('click', adjustImage);

function openModal(param) {
    currentParam = param;
    modalTitle.textContent = getModalTitle(param);

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

    const paramSelector = document.querySelector(`.parameter-select[data-param="${param}"]`);
    paramSelector.querySelector('span').textContent = option;
    paramSelector.classList.add('filled');

    closeModal();

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

    const parts = [];

    if (objectif) parts.push(`Pour un objectif de ${objectif.toLowerCase()}`);
    if (format) parts.push(`au format ${format.toLowerCase()}`);
    if (ton) parts.push(`avec un ton ${ton.toLowerCase()}`);
    if (elementObligatoire) parts.push(`incluant obligatoirement ${elementObligatoire}`);

    if (parts.length > 0) {
        prompt += "\n\n" + parts.join(", ") + ".";
    }

    promptPreview.textContent = prompt;

    generateButton.disabled = !description || !objectif || !format || !ton;
}

function generateImageSet(promptUsed, imageSet) {
    const generationItem = document.createElement('div');
    generationItem.className = 'image-generation-item';

    const imageGrid = document.createElement('div');
    imageGrid.className = 'image-grid';

    for (let i = 0; i < 4; i++) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-preview-container';

        const imgSrc = imageSet && imageSet[i] ? imageSet[i] :
                       `https://via.placeholder.com/400x400/000000/FFFFFF?text=Image+${i+1}`;

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Image générée ${i+1}`;
        img.className = 'generated-image';

        img.addEventListener('click', function() {
            openImageModal(imgSrc);
        });

        imageContainer.appendChild(img);
        imageGrid.appendChild(imageContainer);
    }

    const generationInfo = document.createElement('div');
    generationInfo.className = 'generation-info';

    const timestamp = new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    generationInfo.innerHTML = `
        <span class="generation-timestamp">Génération du ${timestamp}</span>
        <span class="generation-prompt">Prompt utilisé : ${promptUsed}</span>
    `;

    generationItem.appendChild(imageGrid);
    generationItem.appendChild(generationInfo);

    imageHistoryContainer.insertBefore(generationItem, imageHistoryContainer.firstChild);

    document.getElementById('adjustment').disabled = false;
    document.getElementById('adjust-button').disabled = false;
}

function adjustImage() {
    adjustButton.disabled = true;
    adjustButton.textContent = "Ajustement en cours...";

    setTimeout(() => {
        generateImageSet("Ajustement: " + appState.adjustment, predefinedImageSets[currentImageSetIndex]);

        currentImageSetIndex = (currentImageSetIndex + 1) % predefinedImageSets.length;

        adjustButton.textContent = "Ajuster l'image";
        adjustButton.disabled = false;
        adjustmentInput.value = "";
        appState.adjustment = "";
    }, 1500);
}

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-toggle-icon');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '🌙';
    }

    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');

      if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '☀️';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '🌙';
      }
    });

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.querySelector('.theme-toggle-icon').textContent = '🌙';
      localStorage.setItem('theme', 'dark');
    }
});

updatePrompt();

const assetsData = {
    logos: [
        { id: 'logo1', src: 'https://via.placeholder.com/100x100.png?text=Logo+1', alt: 'Logo 1' },
        { id: 'logo2', src: 'https://via.placeholder.com/100x100.png?text=Logo+2', alt: 'Logo 2' },
        { id: 'logo3', src: 'https://via.placeholder.com/100x100.png?text=Logo+3', alt: 'Logo 3' },
        { id: 'logo4', src: 'https://via.placeholder.com/100x100.png?text=Logo+4', alt: 'Logo 4' },
        { id: 'logo5', src: 'https://via.placeholder.com/100x100.png?text=Logo+5', alt: 'Logo 5' },
        { id: 'logo6', src: 'https://via.placeholder.com/100x100.png?text=Logo+6', alt: 'Logo 6' }
    ],
    produits: [
        { id: 'prod1', src: 'https://via.placeholder.com/100x100.png?text=Produit+1', alt: 'Produit 1' },
        { id: 'prod2', src: 'https://via.placeholder.com/100x100.png?text=Produit+2', alt: 'Produit 2' },
        { id: 'prod3', src: 'https://via.placeholder.com/100x100.png?text=Produit+3', alt: 'Produit 3' }
    ],
    personnages: [
        { id: 'pers1', src: 'https://via.placeholder.com/100x100.png?text=Personnage+1', alt: 'Personnage 1' },
        { id: 'pers2', src: 'https://via.placeholder.com/100x100.png?text=Personnage+2', alt: 'Personnage 2' }
    ],
    decors: [
        { id: 'decor1', src: 'https://via.placeholder.com/100x100.png?text=Décor+1', alt: 'Décor 1' },
        { id: 'decor2', src: 'https://via.placeholder.com/100x100.png?text=Décor+2', alt: 'Décor 2' },
        { id: 'decor3', src: 'https://via.placeholder.com/100x100.png?text=Décor+3', alt: 'Décor 3' },
        { id: 'decor4', src: 'https://via.placeholder.com/100x100.png?text=Décor+4', alt: 'Décor 4' }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    const openAssetsModalBtn = document.getElementById('open-assets-modal');
    const assetsModalOverlay = document.getElementById('assets-modal-overlay');
    const assetsModalClose = document.getElementById('assets-modal-close');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const assetsGrid = document.getElementById('assets-grid');
    const selectedAssets = document.getElementById('selected-assets');
    const assetsCount = document.getElementById('assets-count');
    const saveAssetsBtn = document.getElementById('save-assets');
    const uploadAssetBtn = document.getElementById('upload-asset');

    let selectedAssetsList = [];
    const MAX_ASSETS = 5;

    openAssetsModalBtn.addEventListener('click', function() {
        assetsModalOverlay.classList.add('active');
        renderAssets('logos');
        updateSelectedAssetsDisplay();
    });

    assetsModalClose.addEventListener('click', function() {
        assetsModalOverlay.classList.remove('active');
    });

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            renderAssets(category);
        });
    });

    function renderAssets(category) {
        assetsGrid.innerHTML = '';

        assetsData[category].forEach(asset => {
            const isSelected = selectedAssetsList.some(a => a.id === asset.id);

            const assetElement = document.createElement('div');
            assetElement.className = `asset-grid-item ${isSelected ? 'selected' : ''}`;
            assetElement.dataset.id = asset.id;

            assetElement.innerHTML = `
                <img src="${asset.src}" alt="${asset.alt}">
                <div class="asset-add">+</div>
            `;

            assetElement.addEventListener('click', function() {
                toggleAssetSelection(asset);
            });

            assetsGrid.appendChild(assetElement);
        });

        const emptyElement = document.createElement('div');
        emptyElement.className = 'asset-grid-item empty';
        emptyElement.innerHTML = '<div class="plus">+</div>';
        emptyElement.addEventListener('click', function() {
            uploadAssetBtn.click();
        });
        assetsGrid.appendChild(emptyElement);
    }

    function toggleAssetSelection(asset) {
        const assetIndex = selectedAssetsList.findIndex(a => a.id === asset.id);

        if (assetIndex === -1) {
            if (selectedAssetsList.length < MAX_ASSETS) {
                selectedAssetsList.push(asset);
            } else {
                alert(`Vous ne pouvez pas sélectionner plus de ${MAX_ASSETS} assets.`);
                return;
            }
        } else {
            selectedAssetsList.splice(assetIndex, 1);
        }

        updateSelectedAssetsDisplay();

        const assetElements = document.querySelectorAll(`.asset-grid-item[data-id="${asset.id}"]`);
        assetElements.forEach(element => {
            if (assetIndex === -1) {
                element.classList.add('selected');
            } else {
                element.classList.remove('selected');
            }
        });
    }

    function updateSelectedAssetsDisplay() {
        assetsCount.textContent = `${selectedAssetsList.length}/${MAX_ASSETS}`;

        selectedAssets.innerHTML = '';

        if (selectedAssetsList.length === 0) {
            selectedAssets.innerHTML = '<div class="no-assets-message">Aucun asset sélectionné</div>';
            return;
        }

        selectedAssetsList.forEach(asset => {
            const assetElement = document.createElement('div');
            assetElement.className = 'asset-item';
            assetElement.innerHTML = `
                <img src="${asset.src}" alt="${asset.alt}">
                <div class="asset-remove" data-id="${asset.id}">&times;</div>
            `;
            selectedAssets.appendChild(assetElement);
        });

        document.querySelectorAll('.asset-remove').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const assetId = this.getAttribute('data-id');
                const asset = selectedAssetsList.find(a => a.id === assetId);
                if (asset) {
                    toggleAssetSelection(asset);
                }
            });
        });
    }

    uploadAssetBtn.addEventListener('click', function() {
        alert('Fonctionnalité d\'importation d\'asset à implémenter');
    });

    saveAssetsBtn.addEventListener('click', function() {
        assetsModalOverlay.classList.remove('active');
        updateAssetsButtonDisplay();
    });

    function updateAssetsButtonDisplay() {
        const assetsButton = document.getElementById('open-assets-modal');

        if (selectedAssetsList.length > 0) {
            assetsButton.querySelector('span').textContent = `${selectedAssetsList.length} asset(s) sélectionné(s)`;
            assetsButton.classList.add('filled');
        } else {
            assetsButton.querySelector('span').textContent = 'Ajouter des assets';
            assetsButton.classList.remove('filled');
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const imageModalOverlay = document.getElementById('image-modal-overlay');
    const imageModalClose = document.getElementById('image-modal-close');
    const modalImage = document.getElementById('modal-image');
    const downloadImageBtn = document.getElementById('download-image');
    const useImageBtn = document.getElementById('use-image');

    

    function openImageModal(imgSrc) {
        modalImage.src = imgSrc;
        imageModalOverlay.classList.add('active');
    }

    imageModalClose.addEventListener('click', function() {
        imageModalOverlay.classList.remove('active');
    });

    imageModalOverlay.addEventListener('click', function(e) {
        if (e.target === imageModalOverlay) {
            imageModalOverlay.classList.remove('active');
        }
    });

    downloadImageBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.href = modalImage.src;
        link.download = 'image-generee-' + new Date().getTime() + '.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    useImageBtn.addEventListener('click', function() {
        alert('Image sélectionnée pour utilisation!');
        imageModalOverlay.classList.remove('active');
    });
});

const predefinedImageSets = [
    [
        'https://www.effiebelgium.be/gifs/cases/2024-hey.jpg',
        'https://www.effiebelgium.be/gifs/cases/2024-hey.jpg',
        'https://www.effiebelgium.be/gifs/cases/2024-hey.jpg',
        'https://www.effiebelgium.be/gifs/cases/2024-hey.jpg'
    ],
    [
        'https://www.effiebelgium.be/gifs/cases/2024-hey.jpg',
        'https://www.effiebelgium.be/gifs/cases/2024-hey.jpg',
        'https://www.effiebelgium.be/gifs/cases/2024-hey.jpg',
        'https://www.effiebelgium.be/gifs/cases/2024-hey.jpg'
    ]
];

let currentImageSetIndex = 0;