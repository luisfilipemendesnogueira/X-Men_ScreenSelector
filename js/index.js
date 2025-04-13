    /* 
    O que precisamos fazer? - quando passar o mouse em cima do personagem na lista temos que adicionar a borda azul de seleção na imagem pequena do personagem e mostrar a imagem, o nome e o texto grande do personagem que está selecionado

        OBJETIVO 1 - quando passar o mouse em cima do personagem na listagem, devemos selecioná-lo
            passo 1 - pegar os personagens no JS pra poder verificar quando o usuário passar o mouse em cima de um deles
            
            passo 2 - adicionar a classe selecionado no personagem que o usuário passar o cursor do mouse
            
            passo 3 - verificar se já exista um personagem selecionado, se sim, devemos remover a seleção dele 

        OBJETIVO 2 - quando passar o mouse em cima do personagem na listagem, trocar a imagem, o nome e a descrição do personagem grande
            passo 1 - pegar o elemento do personagem grande pra adicionar as informações nele
            passo 2 - alterar a imagem do personagem grande
            passo 3 - alterar o nome do personagem grande
    */

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

    let currentSelectionStep = 1;
    let selectedCharacters = [];
    let selectedIndex = 0;
    
    let timer;
    let isTimerRunning = false;
    let currentTime = 1600;

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

            //if (selectedCharacters.length === 3) {
             //   currentTime = 1600; // Reset do timer quando time completo
            //}
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
        nomePersonagem.innerText = personagem.getAttribute('data-name');
    }

    function alterarImagemPersonagemSelecionado(personagem) {
        const idPersonagem = personagem.id;
        const imagemPersonagemGrande = document.getElementById('hero_pic');
        imagemPersonagemGrande.src = `./images/card-${idPersonagem}.png`;
    }

    function removerSelecaoDoPersonagem() {
        const personagemSelecionado = document.querySelector('.characters.selecionado');
        if (personagemSelecionado) {
            personagemSelecionado.classList.remove('selecionado');
        }
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

    // Função para navegar entre personagens
    function navigateSelection(direction) {
        const totalCharacters = personagens.length;
        
        // Calcula novo índice
        let newIndex = selectedIndex + direction;
        
        // Limita aos índices válidos (0 a totalCharacters-1)
        newIndex = Math.max(0, Math.min(newIndex, totalCharacters - 1));
        
        if (newIndex !== selectedIndex) {
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
    selectedCharacters.forEach(char => {
        if (char) {
            char.classList.remove('escolhido');
            char.classList.remove('selecionado');
        }
    });
    selectedCharacters = [];
    currentSelectionStep = 1;
    
    // Resetar todos os nomes
    document.querySelectorAll('[id^="hero_name"]').forEach(el => {
        el.textContent = '';
    });
    
    // Resetar a seleção inicial
    const primeiroPersonagem = document.querySelector('.characters');
    if (primeiroPersonagem) {
        primeiroPersonagem.classList.add('selecionado');
        alterarImagemPersonagemSelecionado(primeiroPersonagem);
        alterarNomePersonagemSelecionado(primeiroPersonagem);
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
        resetSelecoes();
        currentTime = 1600;
    }
    startTimer();
}
