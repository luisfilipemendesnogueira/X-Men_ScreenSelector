// Verifica se o acesso é permitido
if (!sessionStorage.getItem('allowed')) {
    window.location.href = 'index.html';
} else {
    // Remove a flag para que um refresh redirecione
    sessionStorage.removeItem('allowed');
}

const personagens = document.querySelectorAll('.characters');

const selectionSound = new Audio('./sounds/selection_sound.mp3');
const confirmSound = new Audio('./sounds/confirm_sound.mp3');
const titleSound = new Audio('./sounds/title.mp3');
const announcerSound = new Audio('./sounds/pick_up.mp3');

const keyToDirection = {
    'ArrowUp': 'up',
    'w': 'up',
    'ArrowDown': 'down',
    's': 'down',
    'ArrowLeft': 'left',
    'a': 'left',
    'ArrowRight': 'right',
    'd': 'right'
};

// Adicione no início do JS (após as variáveis existentes):
const secretCharacters = {
    'cyclops': {
        secretImg: './images/cyclops_dark_phoenix.png',
        cardImg: './images/card-cyclops_dark_phoenix.png',
        secretName: 'Dark Phoenix'
    },
    'jean_grey': {
        secretImg: './images/dark_phoenix.png',
        cardImg: './images/card-dark_phoenix.png',
        secretName: 'Dark Phoenix'
    },
    'emma_frost': {
        secretImg: './images/emma_frost_dark_phoenix.png',
        cardImg: './images/card-emma_frost_dark_phoenix.png',
        secretName: 'Dark Phoenix'
    },
    'emma_frost': {
        secretImg: './images/emma_frost_diamond.png',
        cardImg: './images/card-emma_frost_diamond.png',
        secretName: 'Diamond Form'
    },
    'magik': {
        secretImg: './images/magik_dark_phoenix.png',
        cardImg: './images/card-magik_dark_phoenix.png',
        secretName: 'Dark Phoenix'
    },
    'colossus': {
        secretImg: './images/colossus_dark_phoenix.png',
        cardImg: './images/card-colossus_dark_phoenix.png',
        secretName: 'Dark Phoenix'
    },
    'angel': {
        secretImg: './images/archangel.png',
        cardImg: './images/card-archangel.png',
        secretName: 'Archangel'
    },
};

const unlockedSecrets = new Set(); // Armazena quais segredos foram desbloqueados

let currentSelectionStep = 1;
let selectedCharacters = [];
let selectedIndex = 0;

let timer;
let isTimerRunning = false;
let currentTime = 3000;

let inputSequence = [];

titleSound.loop = true;

personagens.forEach((personagem) => {
    personagem.addEventListener('mouseenter', () => {
        if (personagem.classList.contains('selecionado')) {
            return; // Sai da função sem tocar o som
        }
        if (window.innerWidth < 450) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        removerSelecaoDoPersonagem();
        personagem.classList.add('selecionado');
        alterarImagemPersonagemSelecionado(personagem);
        alterarNomePersonagemSelecionado(personagem);

        selectionSound.currentTime = 0;
        selectionSound.play();

        selectedIndex = Array.from(personagens).indexOf(personagem);
        atualizarKeyMap(personagem);
    })
})

personagens.forEach((personagem) => {
    personagem.addEventListener('click', () => {
        if (selectedCharacters.includes(personagem)) {
            return; // Sai da função se já estiver selecionado
        }

        selectedIndex = Array.from(personagens).indexOf(personagem);

        //if (currentSelectionStep > 3) return;

        // Remove a seleção anterior deste slot
        if (selectedCharacters[currentSelectionStep - 1]) {
            selectedCharacters[currentSelectionStep - 1].classList.remove('escolhido');
        }

        // Atualiza o nome no slot correspondente
        const slotElement = document.getElementById(`hero_name${currentSelectionStep}`);
        slotElement.textContent = personagem.getAttribute('data-name');

        // Toca o som de confirmação
        confirmSound.currentTime = 0;
        confirmSound.play();

        // Adiciona estilo visual
        personagem.classList.add('escolhido');

        // Armazena a referência do personagem selecionado
        selectedCharacters[currentSelectionStep - 1] = personagem;

        currentSelectionStep = (currentSelectionStep % 3) + 1;

        alterarImagemPersonagemSelecionado(personagem);
        alterarNomePersonagemSelecionado(personagem);
    });
});

const primeiroPersonagem = document.querySelectorAll('.characters')[0];
if (primeiroPersonagem) {
    removerSelecaoDoPersonagem();
    primeiroPersonagem.classList.add('selecionado');
    alterarImagemPersonagemSelecionado(primeiroPersonagem);
    alterarNomePersonagemSelecionado(primeiroPersonagem);
}

function alterarNomePersonagemSelecionado(personagem) {
    const nomePersonagem = document.getElementById('hero_name');
    if (unlockedSecrets.has(personagem.id)) {
        nomePersonagem.innerText = secretCharacters[personagem.id].secretName;
    } else {
        nomePersonagem.innerText = personagem.getAttribute('data-name');
    }
}

function alterarImagemPersonagemSelecionado(personagem) {
    const idPersonagem = personagem.id;
    const imagemPersonagemGrande = document.getElementById('hero_pic');
    if (unlockedSecrets.has(idPersonagem)) {
        imagemPersonagemGrande.src = secretCharacters[idPersonagem].cardImg;
    } else {
        imagemPersonagemGrande.src = `./images/card-${idPersonagem}.png`;
    }
}

function removerSelecaoDoPersonagem() {
    // Remove a classe de TODOS os personagens selecionados
    document.querySelectorAll('.characters.selecionado').forEach(el => {
        el.classList.remove('selecionado');
    });
}

function resetarSelecoes() {
    selectedCharacters.forEach(char => {
        if (char) char.classList.remove('escolhido');
    });
    selectedCharacters = [];
    currentSelectionStep = 1;
    document.querySelectorAll('[id^="hero_name"]').forEach(el => el.textContent = '');
}

// Mapeamento de teclas (setas e WASD)
const defaultKeyMap = {
    'ArrowUp': -6,    // Move para cima (2 colunas)
    'ArrowDown': 6,   // Move para baixo (2 colunas)
    'ArrowLeft': -1,  // Move para esquerda
    'ArrowRight': 1,  // Move para direita
    'w': -6,          // WASD equivalente
    's': 6,
    'a': -1,
    'd': 1
};

const specialKeyMaps = {
    'cyclops': {
        'ArrowUp': 33,       // Move só uma posição pra cima
        'ArrowDown': 6,      // Move só uma posição pra baixo
        'ArrowLeft': 38,     // Move 2 colunas para esquerda
        'ArrowRight': 1,     // Move 2 colunas para direita
        'w': 33,
        's': 6,
        'a': 38,
        'd': 1
    },
    'hope_summers': {
        'ArrowUp': -6,       // Move só uma posição pra cima
        'ArrowDown': -33,      // Move só uma posição pra baixo
        'ArrowLeft': -1,     // Move 2 colunas para esquerda
        'ArrowRight': -38,     // Move 2 colunas para direita
        'w': -6,
        's': -33,
        'a': -1,
        'd': -38
    },
    'team_1': {
        'ArrowUp': 33,       // Move só uma posição pra cima
        'ArrowDown': 6,      // Move só uma posição pra baixo
        'ArrowLeft': -1,     // Move 2 colunas para esquerda
        'ArrowRight': 1,     // Move 2 colunas para direita
        'w': 33,
        's': 6,
        'a': -1,
        'd': 1
    },
    'team_2': {
        'ArrowUp': 33,       // Move só uma posição pra cima
        'ArrowDown': 6,      // Move só uma posição pra baixo
        'ArrowLeft': -1,     // Move 2 colunas para esquerda
        'ArrowRight': 1,     // Move 2 colunas para direita
        'w': 33,
        's': 6,
        'a': -1,
        'd': 1
    },
    'team_5': {
        'ArrowUp': -6,       // Move só uma posição pra cima
        'ArrowDown': 9,      // Move só uma posição pra baixo
        'ArrowLeft': -1,     // Move 2 colunas para esquerda
        'ArrowRight': 1,     // Move 2 colunas para direita
        'w': -6,
        's': 9,
        'a': -1,
        'd': 1
    },
    'team_6': {
        'ArrowUp': -6,       // Move só uma posição pra cima
        'ArrowDown': 3,      // Move só uma posição pra baixo
        'ArrowLeft': -1,     // Move 2 colunas para esquerda
        'ArrowRight': 1,     // Move 2 colunas para direita
        'w': -6,
        's': 3,
        'a': -1,
        'd': 1
    },
    'special_team': {
        'ArrowUp': -3,       // Move só uma posição pra cima
        'ArrowDown': 6,      // Move só uma posição pra baixo
        'ArrowLeft': -1,     // Move 2 colunas para esquerda
        'ArrowRight': 1,     // Move 2 colunas para direita
        'w': -3,
        's': 6,
        'a': -1,
        'd': 1
    },
    'team_7': {
        'ArrowUp': -9,       // Move só uma posição pra cima
        'ArrowDown': 6,      // Move só uma posição pra baixo
        'ArrowLeft': -1,     // Move 2 colunas para esquerda
        'ArrowRight': 1,     // Move 2 colunas para direita
        'w': -9,
        's': 6,
        'a': -1,
        'd': 1
    },
    'team_11': {
        'ArrowUp': -6,       // Move só uma posição pra cima
        'ArrowDown': -33,      // Move só uma posição pra baixo
        'ArrowLeft': -1,     // Move 2 colunas para esquerda
        'ArrowRight': 1,     // Move 2 colunas para direita
        'w': -6,
        's': -33,
        'a': -1,
        'd': 1
    },
    'team_12': {
        'ArrowUp': -6,       // Move só uma posição pra cima
        'ArrowDown': -33,      // Move só uma posição pra baixo
        'ArrowLeft': -1,     // Move 2 colunas para esquerda
        'ArrowRight': 1,     // Move 2 colunas para direita
        'w': -6,
        's': -33,
        'a': -1,
        'd': 1
    }
};

let currentKeyMap = defaultKeyMap;

function atualizarKeyMap(personagem) {
    if (specialKeyMaps[personagem.id]) {
        currentKeyMap = specialKeyMaps[personagem.id];
    } else {
        const team = personagem.closest('.teams')?.id;
        currentKeyMap = specialKeyMaps[team] || defaultKeyMap;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    titleSound.play()
        .then(() => {
            // Agenda o announcerSound para tocar após 1 segundo
            setTimeout(() => {
                announcerSound.play().catch(error => {
                    console.error("Erro no announcer:", error);
                });
            }, 500); // 1000ms = 1 segundo
        })
        .catch(error => {
            console.error("Erro ao reproduzir título:", error);
        });
});

// Adicione este evento para recarregar o áudio se a página for revisitada
window.addEventListener('pageshow', () => {
    if (titleSound.paused) {
        titleSound.play();
    }
});

// Função para navegar entre personagens
function navigateSelection(direction) {
    const totalCharacters = personagens.length;
    const previousCharacter = personagens[selectedIndex]; // Guarda personagem atual antes da mudança

    // Calcula novo índice
    let newIndex = selectedIndex + direction;

    // Limita aos índices válidos (0 a totalCharacters-1)
    newIndex = Math.max(0, Math.min(newIndex, totalCharacters - 1));

    if (newIndex !== selectedIndex) {
        // Remove o segredo do personagem anterior se não foi selecionado
        if (unlockedSecrets.has(previousCharacter.id) &&
            !selectedCharacters.includes(previousCharacter)) {
            unlockedSecrets.delete(previousCharacter.id);
            const charImg = previousCharacter.querySelector('.char_img');
            charImg.src = previousCharacter.dataset.originalImg;
            previousCharacter.setAttribute('data-name', previousCharacter.dataset.originalName);
            // Atualiza a exibição
            if (previousCharacter.classList.contains('selecionado')) {
                alterarImagemPersonagemSelecionado(previousCharacter);
                alterarNomePersonagemSelecionado(previousCharacter);
            }
        }

        selectedIndex = newIndex;
        const personagem = personagens[selectedIndex];

        // Atualiza seleção visual
        removerSelecaoDoPersonagem();
        personagem.classList.add('selecionado');
        alterarImagemPersonagemSelecionado(personagem);
        alterarNomePersonagemSelecionado(personagem);

        atualizarKeyMap(personagem);

        // Toca o som de seleção
        selectionSound.currentTime = 0;
        selectionSound.play();

        // Rola a tela para o personagem selecionado (se necessário)
        personagem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Event listener para teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { // Adicionado suporte para Enter
        e.preventDefault();
        const personagemSelecionado = personagens[selectedIndex];
        if (!selectedCharacters.includes(personagemSelecionado)) {
            personagemSelecionado.click();
        }
        personagemSelecionado.click(); // Dispara o evento de clique
    }
    else if (currentKeyMap.hasOwnProperty(e.key)) {
        e.preventDefault();
        navigateSelection(currentKeyMap[e.key]);
    }

    // Registrar direção no inputSequence
    const direction = keyToDirection[e.key];
    if (direction) {
        inputSequence.push(direction);
        if (inputSequence.length > 8) {
            inputSequence.shift();
        }
        checkSecretCode();
    }
});

// Inicializa com o primeiro personagem selecionado
window.addEventListener('DOMContentLoaded', () => {
    if (personagens.length > 0) {
        personagens[0].classList.add('selecionado');
        alterarImagemPersonagemSelecionado(personagens[0]);
        alterarNomePersonagemSelecionado(personagens[0]);
        atualizarKeyMap(personagens[0]);
    }
});

function handleKeyboardSelection() {
    const personagem = personagens[selectedIndex];
    if (personagem) {
        personagem.dispatchEvent(new Event('click'));
    }
}

// Função para iniciar o timer
function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timer = setInterval(updateTimer, 10);
    }
}

// Modifique a função resetSelecoes existente para:
function resetSelecoes() {
    // Remove TODAS as classes de seleção de TODOS os personagens
    document.querySelectorAll('.characters').forEach(char => {
        char.classList.remove('escolhido', 'selecionado');
    });

    personagens.forEach(personagem => {
        const charImg = personagem.querySelector('.char_img');
        if (charImg && personagem.dataset.originalImg) {
            charImg.src = personagem.dataset.originalImg;
        }
        personagem.setAttribute('data-name', personagem.dataset.originalName);
    });

    selectedCharacters = [];
    currentSelectionStep = 1;
    selectedIndex = 0; // Resetar índice para o primeiro personagem

    // Resetar nomes na UI
    document.querySelectorAll('[id^="hero_name"]').forEach(el => {
        el.textContent = '';
    });

    // Forçar seleção visual no primeiro personagem
    const primeiroPersonagem = personagens[0];
    if (primeiroPersonagem) {
        primeiroPersonagem.classList.add('selecionado');
        alterarImagemPersonagemSelecionado(primeiroPersonagem);
        alterarNomePersonagemSelecionado(primeiroPersonagem);
        atualizarKeyMap(primeiroPersonagem); // Resetar mapeamento de teclas
    }

    // Garantir scroll para visibilidade
    primeiroPersonagem.scrollIntoView({ behavior: 'auto', block: 'nearest' });

    // Reseta todos os segredos
    unlockedSecrets.clear();
    const currentCharacter = document.querySelector('.characters.selecionado');
    if (currentCharacter) {
        alterarImagemPersonagemSelecionado(currentCharacter);
        alterarNomePersonagemSelecionado(currentCharacter);
    }
}

// Inicie o timer quando o DOM estiver carregado
window.addEventListener('DOMContentLoaded', () => {
    startTimer();
});

// Função para atualizar o timer
function updateTimer() {
    if (currentTime > 0) {
        currentTime--;
        const seconds = Math.floor(currentTime / 100);
        const tenths = currentTime % 100;

        document.querySelector('.main_time').textContent = seconds.toString().padStart(2, '0');
        document.querySelector('.decimal_time').textContent = `${tenths.toString().padStart(2, '0')}`;
    } else {
        clearInterval(timer);
        isTimerRunning = false;
        unlockedSecrets.clear();
        // Reseta imagens e nomes
        personagens.forEach(personagem => {
            const charImg = personagem.querySelector('.char_img');
            charImg.src = personagem.dataset.originalImg;
            personagem.setAttribute('data-name', personagem.dataset.originalName);
        });
        resetSelecoes();
        currentTime = 3000;
    }
    startTimer();
}

function checkSecretCode() {
    const secretCode = ['up', 'down', 'right', 'left', 'down', 'up', 'left', 'right'];
    if (arraysEqual(inputSequence, secretCode)) {
        const currentCharacter = document.querySelector('.characters.selecionado');
        if (currentCharacter && secretCharacters[currentCharacter.id]) {
            unlockSecretCharacter(currentCharacter.id);
            inputSequence = [];
        }
    }
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

function unlockSecretCharacter(characterId) {
    unlockedSecrets.add(characterId);

    const characterElement = document.getElementById(characterId);
    const charImg = characterElement.querySelector('.char_img');

    // Atualiza imagem do grid
    if (secretCharacters[characterId]?.secretImg) {
        charImg.src = secretCharacters[characterId].secretImg;
        characterElement.setAttribute('data-name', secretCharacters[characterId].secretName); // Atualiza o data-name
    }

    // Atualiza imediatamente a exibição se o personagem estiver selecionado
    const currentCharacter = document.querySelector('.characters.selecionado');
    if (currentCharacter && currentCharacter.id === characterId) {
        alterarImagemPersonagemSelecionado(currentCharacter);
        alterarNomePersonagemSelecionado(currentCharacter);
    }
}

personagens.forEach(personagem => {
    const img = personagem.querySelector('.char_img');
    if (img) {
        personagem.dataset.originalImg = img.src;
        personagem.dataset.originalName = personagem.getAttribute('data-name');
    }
});
