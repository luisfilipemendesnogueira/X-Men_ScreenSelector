/* =======================================================
   1. CONTROLE DE ACESSO
   Verifica se o usuário tem permissão para acessar a página.
   Redireciona para "index.html" se a flag não estiver definida.
========================================================== */
if (!sessionStorage.getItem('allowed')) {
    window.location.href = 'index.html';
} else {
    sessionStorage.removeItem('allowed');
}

/* =======================================================
   2. ELEMENTOS DO DOM
   Seleciona os elementos necessários para a manipulação da interface.
========================================================== */
const personagens = document.querySelectorAll('.characters');
const nomePersonagem = document.getElementById('hero_name');
const imagemPersonagemGrande = document.getElementById('hero_pic');

/* =======================================================
   3. CONFIGURAÇÃO DOS ÁUDIOS
   Inicializa os sons usados no jogo e configura o looping do tema.
========================================================== */
const selectionSound = new Audio('./sounds/selection_sound.mp3');
const confirmSound = new Audio('./sounds/confirm_sound.mp3');
const titleSound = new Audio('./sounds/title.mp3');
const announcerSound = new Audio('./sounds/pick_up.mp3');
titleSound.loop = true;

/* =======================================================
   4. MAPEAMENTO DE TECLAS
   Define associações entre as teclas e as direções ou valores numéricos.
========================================================== */
// Mapeamento para traduzir teclas em direções (usadas para input secreto)
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

// Mapeamento padrão para navegação entre personagens
const defaultKeyMap = {
    'ArrowUp': -6,
    'ArrowDown': 6,
    'ArrowLeft': -1,
    'ArrowRight': 1,
    'w': -6,
    's': 6,
    'a': -1,
    'd': 1
};
// Mapeamentos especiais para personagens ou equipes específicas
const specialKeyMaps = {
    'cyclops': {
        'ArrowUp': 33,
        'ArrowDown': 6,
        'ArrowLeft': 38,
        'ArrowRight': 1,
        'w': 33,
        's': 6,
        'a': 38,
        'd': 1
    },
    'hope_summers': {
        'ArrowUp': -6,
        'ArrowDown': -33,
        'ArrowLeft': -1,  
        'ArrowRight': -38,
        'w': -6,
        's': -33,
        'a': -1,
        'd': -38
    },
    'team_1': {
        'ArrowUp': 33,
        'ArrowDown': 6,
        'ArrowLeft': -1,
        'ArrowRight': 1,
        'w': 33,
        's': 6,
        'a': -1,
        'd': 1
    },
    'team_2': {
        'ArrowUp': 33,
        'ArrowDown': 6,
        'ArrowLeft': -1,
        'ArrowRight': 1,
        'w': 33,
        's': 6,
        'a': -1,
        'd': 1
    },
    'team_5': {
        'ArrowUp': -6,
        'ArrowDown': 9,
        'ArrowLeft': -1,
        'ArrowRight': 1,
        'w': -6,
        's': 9,
        'a': -1,
        'd': 1
    },
    'team_6': {
        'ArrowUp': -6,
        'ArrowDown': 3,
        'ArrowLeft': -1,
        'ArrowRight': 1,
        'w': -6,
        's': 3,
        'a': -1,
        'd': 1
    },
    'special_team': {
        'ArrowUp': -3,
        'ArrowDown': 6,
        'ArrowLeft': -1,
        'ArrowRight': 1,
        'w': -3,
        's': 6,
        'a': -1,
        'd': 1
    },
    'team_7': {
        'ArrowUp': -9, 
        'ArrowDown': 6,
        'ArrowLeft': -1,
        'ArrowRight': 1,
        'w': -9,
        's': 6,
        'a': -1,
        'd': 1
    },
    'team_11': {
        'ArrowUp': -6,
        'ArrowDown': -33,
        'ArrowLeft': -1,
        'ArrowRight': 1,
        'w': -6,
        's': -33,
        'a': -1,
        'd': 1
    },
    'team_12': {
        'ArrowUp': -6,
        'ArrowDown': -33,
        'ArrowLeft': -1,
        'ArrowRight': 1,
        'w': -6,
        's': -33,
        'a': -1,
        'd': 1
    }
};

/* =======================================================
   5. CONFIGURAÇÃO DOS PERSONAGENS SECRETOS
   Define os personagens secretos padrão e alternativos, com suas imagens e nomes.
========================================================== */
const secretCharactersDefault = {
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
const secretCharactersAlternate = {
    'jean_grey': {
        secretImg: './images/white_phoenix.png',
        cardImg: './images/card-white_phoenix.png',
        secretName: 'White Phoenix'
    },
    'emma_frost': {
        secretImg: './images/emma_frost_diamond.png',
        cardImg: './images/card-emma_frost_diamond.png',
        secretName: 'Diamond Form'
    }
};

/* =======================================================
   6. VARIÁVEIS DE ESTADO DO JOGO
   Gerenciam o progresso da seleção, timer e sequências de input.
========================================================== */
// Progresso da Seleção
let currentSelectionStep = 1;
let selectedCharacters = [];
let selectedIndex = 0;
let currentKeyMap = defaultKeyMap;
const unlockedSecretsDefault = new Set();
const unlockedSecretsAlternate = new Set();

// Timer
let timer;
let isTimerRunning = false;
let currentTime = 3000;

// Sequências de input
let inputSequenceDefault = [];
let inputSequenceAlternate = [];

/* =======================================================
   7. EVENTOS DOS PERSONAGENS (MOUSE)
   Permite a seleção e realce visual dos personagens ao passar o mouse ou clicar.
========================================================== */
personagens.forEach((personagem) => {
    personagem.addEventListener('mouseenter', () => {
        // Se já estiver selecionado, não faz nada
        if (personagem.classList.contains('selecionado')) return;

        // Em telas menores, garante que a rolagem esteja no topo
        if (window.innerWidth < 450) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Atualiza a seleção visual e a imagem/nome exibido
        removerSelecaoDoPersonagem();
        personagem.classList.add('selecionado');
        
        // Verifica se o secret alternate está desbloqueado; se sim, usa as funções alternate
        if (unlockedSecretsAlternate.has(personagem.id)) {
            alterarImagemPersonagemSelecionadoAlternate(personagem);
            alterarNomePersonagemSelecionadoAlternate(personagem);
        } else {
            alterarImagemPersonagemSelecionadoDefault(personagem);
            alterarNomePersonagemSelecionadoDefault(personagem);
        }

        selectionSound.currentTime = 0;
        selectionSound.play();

        // Atualiza o índice do personagem selecionado e mapeia teclas especiais se necessário
        selectedIndex = Array.from(personagens).indexOf(personagem);
        atualizarKeyMap(personagem);
    });
});

personagens.forEach((personagem) => {
    personagem.addEventListener('click', () => {
        // Impede seleção duplicada
        if (selectedCharacters.includes(personagem)) return;

        selectedIndex = Array.from(personagens).indexOf(personagem);

        // Remove a seleção anterior do mesmo slot, se houver
        if (selectedCharacters[currentSelectionStep - 1]) {
            selectedCharacters[currentSelectionStep - 1].classList.remove('escolhido');
        }

        // Atualiza o nome do slot selecionado na interface
        const slotElement = document.getElementById(`hero_name${currentSelectionStep}`);
        slotElement.textContent = personagem.getAttribute('data-name');

        confirmSound.currentTime = 0;
        confirmSound.play();

        // Adiciona o estilo para indicar a seleção
        personagem.classList.add('escolhido');

        // Armazena a referência do personagem selecionado
        selectedCharacters[currentSelectionStep - 1] = personagem;

        // Avança para o próximo slot (1 a 3 ciclicamente)
        currentSelectionStep = (currentSelectionStep % 3) + 1;

        if (selectedCharacters.length === 3) {
            // Store selected characters data
            const selectedCards = selectedCharacters.map(char => {
                // Verifica primeiro o segredo alternate (prioridade maior)
                if (unlockedSecretsAlternate.has(char.id)) {
                    return {
                        cardImg: secretCharactersAlternate[char.id].cardImg,
                        name: secretCharactersAlternate[char.id].secretName
                    };
                }
                // Verifica o segredo default
                else if (unlockedSecretsDefault.has(char.id)) {
                    return {
                        cardImg: secretCharactersDefault[char.id].cardImg,
                        name: secretCharactersDefault[char.id].secretName
                    };
                }
                // Caso normal
                return {
                    cardImg: `./images/card-${char.id}.png`,
                    name: char.getAttribute('data-name')
                };
            });
            
            localStorage.setItem('selectedCharacters', JSON.stringify(selectedCards));
            window.location.href = 'index3.html';
        }

        // Verifica se o secret alternate está desbloqueado antes de atualizar a imagem e o nome
        if (unlockedSecretsAlternate.has(personagem.id)) {
            alterarImagemPersonagemSelecionadoAlternate(personagem);
            alterarNomePersonagemSelecionadoAlternate(personagem);
        } else {
            alterarImagemPersonagemSelecionadoDefault(personagem);
            alterarNomePersonagemSelecionadoDefault(personagem);
        }
    });
});

// Seleciona inicialmente o primeiro personagem se existir
const primeiroPersonagem = document.querySelectorAll('.characters')[0];
if (primeiroPersonagem) {
    removerSelecaoDoPersonagem();
    primeiroPersonagem.classList.add('selecionado');
    alterarImagemPersonagemSelecionadoDefault(primeiroPersonagem);
    alterarNomePersonagemSelecionadoDefault(primeiroPersonagem);
}

/* =======================================================
   8. FUNÇÕES DE ATUALIZAÇÃO DE INTERFACE
   Atualiza a imagem e o nome do personagem selecionado (modo padrão ou alternativo).
========================================================== */
function alterarNomePersonagemSelecionadoDefault(personagem) {
    if (unlockedSecretsDefault.has(personagem.id)) {
        nomePersonagem.innerText = secretCharactersDefault[personagem.id].secretName;
    } else {
        nomePersonagem.innerText = personagem.getAttribute('data-name');
    }
}

function alterarImagemPersonagemSelecionadoDefault(personagem) {
    const idPersonagem = personagem.id;
    if (unlockedSecretsDefault.has(idPersonagem)) {
        imagemPersonagemGrande.src = secretCharactersDefault[idPersonagem].cardImg;
    } else {
        imagemPersonagemGrande.src = `./images/card-${idPersonagem}.png`;
    }
}

function alterarNomePersonagemSelecionadoAlternate(personagem) {
    if (unlockedSecretsAlternate.has(personagem.id)) {
        nomePersonagem.innerText = secretCharactersAlternate[personagem.id].secretName;
    } else {
        nomePersonagem.innerText = personagem.getAttribute('data-name');
    }
}

function alterarImagemPersonagemSelecionadoAlternate(personagem){
    const idPersonagem = personagem.id;
    if (unlockedSecretsAlternate.has(idPersonagem)) {
        imagemPersonagemGrande.src = secretCharactersAlternate[idPersonagem].cardImg;
    } else {
        imagemPersonagemGrande.src = `./images/card-${idPersonagem}.png`;
    }
}

/* =======================================================
   9. FUNÇÕES DE RESETA E ATUALIZAÇÃO DE SELEÇÕES
   Gerencia a remoção das classes de seleção e o reset dos personagens.
========================================================== */
function removerSelecaoDoPersonagem() {
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

function resetSelecoes() {
    // Remove classes de seleção e restaura as imagens e nomes originais
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
    selectedIndex = 0;

    // Limpa os nomes exibidos em cada slot
    document.querySelectorAll('[id^="hero_name"]').forEach(el => {
        el.textContent = '';
    });

    // Re-seleciona o primeiro personagem
    const primeiroPersonagem = personagens[0];
    if (primeiroPersonagem) {
        primeiroPersonagem.classList.add('selecionado');
        alterarImagemPersonagemSelecionadoDefault(primeiroPersonagem);
        alterarNomePersonagemSelecionadoDefault(primeiroPersonagem);
        atualizarKeyMap(primeiroPersonagem);
    }

    primeiroPersonagem.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    unlockedSecretsDefault.clear();

    const currentCharacter = document.querySelector('.characters.selecionado');
    if (currentCharacter) {
        alterarImagemPersonagemSelecionadoDefault(currentCharacter);
        alterarNomePersonagemSelecionadoDefault(currentCharacter);
    }
}

function atualizarKeyMap(personagem) {
    if (specialKeyMaps[personagem.id]) {
        currentKeyMap = specialKeyMaps[personagem.id];
    } else {
        const team = personagem.closest('.teams')?.id;
        currentKeyMap = specialKeyMaps[team] || defaultKeyMap;
    }
}

/* =======================================================
   10. FUNÇÕES DE TIMER
   Controla a contagem regressiva e reinicia as seleções ao término do tempo.
========================================================== */
function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timer = setInterval(updateTimer, 10);
    }
}

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
        unlockedSecretsDefault.clear();
        unlockedSecretsAlternate.clear();
        
        // Restaura as imagens e nomes dos personagens
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

/* =======================================================
   11. FUNÇÕES DE NAVEGAÇÃO (TECLADO)
   Permite mover a seleção entre os personagens usando o teclado.
========================================================== */
function navigateSelection(direction) {
    const totalCharacters = personagens.length;
    const previousCharacter = personagens[selectedIndex];
    let newIndex = selectedIndex + direction;
    newIndex = Math.max(0, Math.min(newIndex, totalCharacters - 1));

    if (newIndex !== selectedIndex) {
        // Se o personagem anterior tiver um segredo desbloqueado e não tiver sido selecionado, restaura os valores originais
        if (unlockedSecretsDefault.has(previousCharacter.id) && !selectedCharacters.includes(previousCharacter)) {
            unlockedSecretsDefault.delete(previousCharacter.id);
            const charImg = previousCharacter.querySelector('.char_img');
            charImg.src = previousCharacter.dataset.originalImg;
            previousCharacter.setAttribute('data-name', previousCharacter.dataset.originalName);
            if (previousCharacter.classList.contains('selecionado')) {
                alterarImagemPersonagemSelecionadoDefault(previousCharacter);
                alterarNomePersonagemSelecionadoDefault(previousCharacter);
            }
        }
        if (unlockedSecretsAlternate.has(previousCharacter.id) && !selectedCharacters.includes(previousCharacter)) {
            unlockedSecretsAlternate.delete(previousCharacter.id);
            const charImg = previousCharacter.querySelector('.char_img');
            charImg.src = previousCharacter.dataset.originalImg;
            previousCharacter.setAttribute('data-name', previousCharacter.dataset.originalName);
            if (previousCharacter.classList.contains('selecionado')) {
                alterarImagemPersonagemSelecionadoAlternate(previousCharacter);
                alterarNomePersonagemSelecionadoAlternate(previousCharacter);
            }
        }

        selectedIndex = newIndex;
        const personagem = personagens[selectedIndex];

        removerSelecaoDoPersonagem();
        personagem.classList.add('selecionado');
        // Usa a versão alternate se o personagem tiver o secret alternate desbloqueado
        if (unlockedSecretsAlternate.has(personagem.id)) {
            alterarImagemPersonagemSelecionadoAlternate(personagem);
            alterarNomePersonagemSelecionadoAlternate(personagem);
        } else {
            alterarImagemPersonagemSelecionadoDefault(personagem);
            alterarNomePersonagemSelecionadoDefault(personagem);
        }
        atualizarKeyMap(personagem);

        selectionSound.currentTime = 0;
        selectionSound.play();

        personagem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/* =======================================================
   12. FUNÇÕES DE INPUT SECRETO
   Verifica se o usuário inseriu a sequência correta de direções para desbloquear segredos.
========================================================== */
function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

function checkSecretCodeDefault() {
    const secretCodeDefault = ['up', 'down', 'right', 'left', 'down', 'up', 'left', 'right'];
    if (arraysEqual(inputSequenceDefault, secretCodeDefault)) {
        const currentCharacter = document.querySelector('.characters.selecionado');
        if (currentCharacter && secretCharactersDefault[currentCharacter.id]) {
            unlockSecretCharacterDefault(currentCharacter.id);
            inputSequenceDefault = [];
        }
    }
}
function checkSecretCodeAlternate() {
    const secretCodeAlternate = ['up', 'down', 'left', 'right', 'down', 'up', 'right', 'left'];
    if (arraysEqual(inputSequenceAlternate, secretCodeAlternate)) {
        const currentCharacter = document.querySelector('.characters.selecionado');
        if (currentCharacter && secretCharactersAlternate[currentCharacter.id]) {
            unlockSecretCharacterAlternate(currentCharacter.id);
            inputSequenceAlternate = [];
        }
    }
}

function unlockSecretCharacterDefault(characterId) {
    unlockedSecretsDefault.add(characterId);
    const characterElement = document.getElementById(characterId);
    const charImg = characterElement.querySelector('.char_img');

    if (secretCharactersDefault[characterId]?.secretImg) {
        charImg.src = secretCharactersDefault[characterId].secretImg;
        characterElement.setAttribute('data-name', secretCharactersDefault[characterId].secretName); 
    }

    const currentCharacter = document.querySelector('.characters.selecionado');
    if (currentCharacter && currentCharacter.id === characterId) {
        alterarImagemPersonagemSelecionadoDefault(currentCharacter);
        alterarNomePersonagemSelecionadoDefault(currentCharacter);
    }
}

function unlockSecretCharacterAlternate(characterId) {
    unlockedSecretsAlternate.add(characterId);
    const characterElement = document.getElementById(characterId);
    const charImg = characterElement.querySelector('.char_img');

    if (secretCharactersAlternate[characterId]?.secretImg) {
        charImg.src = secretCharactersAlternate[characterId].secretImg;
        characterElement.setAttribute('data-name', secretCharactersAlternate[characterId].secretName);
    }

    const currentCharacter = document.querySelector('.characters.selecionado');
    if (currentCharacter && currentCharacter.id === characterId) {
        alterarImagemPersonagemSelecionadoAlternate(currentCharacter);
        alterarNomePersonagemSelecionadoAlternate(currentCharacter);
    }
}

/* =======================================================
   13. EVENTOS GLOBAIS (TECLADO E PÁGINA)
   Configura os eventos de teclado para navegação e input secreto, além dos eventos de carregamento da página.
========================================================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { 
        e.preventDefault();
        const personagemSelecionado = personagens[selectedIndex];
        if (!selectedCharacters.includes(personagemSelecionado)) {
            personagemSelecionado.click();
        }
        personagemSelecionado.click();
    }
    else if (currentKeyMap.hasOwnProperty(e.key)) {
        e.preventDefault();
        navigateSelection(currentKeyMap[e.key]);
    }

    const direction = keyToDirection[e.key];
    if (direction) {
        inputSequenceDefault.push(direction);
        if (inputSequenceDefault.length > 8) {
            inputSequenceDefault.shift();
        }
        checkSecretCodeDefault();
    }
    if (direction) {
        inputSequenceAlternate.push(direction);
        if (inputSequenceAlternate.length > 8) {
            inputSequenceAlternate.shift();
        }
        checkSecretCodeAlternate();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    titleSound.play()
        .then(() => {
            setTimeout(() => {
                announcerSound.play().catch(error => {
                    console.error("Erro no announcer:", error);
                });
            }, 500);
        })
        .catch(error => {
            console.error("Erro ao reproduzir título:", error);
        });
});

window.addEventListener('pageshow', () => {
    if (titleSound.paused) {
        titleSound.play();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    if (personagens.length > 0) {
        personagens[0].classList.add('selecionado');
        alterarImagemPersonagemSelecionadoDefault(personagens[0]);
        alterarNomePersonagemSelecionadoDefault(personagens[0]);
        atualizarKeyMap(personagens[0]);
    }
});

function handleKeyboardSelection() {
    const personagem = personagens[selectedIndex];
    if (personagem) {
        personagem.dispatchEvent(new Event('click'));
    }
}

/* =======================================================
   14. INICIALIZAÇÃO FINAL
   Inicia o timer e armazena as imagens e nomes originais para restauração futura.
========================================================== */
window.addEventListener('DOMContentLoaded', () => {
    startTimer();
});

personagens.forEach(personagem => {
    const img = personagem.querySelector('.char_img');
    if (img) {
        personagem.dataset.originalImg = img.src;
        personagem.dataset.originalName = personagem.getAttribute('data-name');
    }
});