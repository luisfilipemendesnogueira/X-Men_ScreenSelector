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
    window.location.href = 'index1.html';
  } else {
    // Remove a flag para que um refresh redirecione
    sessionStorage.removeItem('allowed');
  }

const personagens = document.querySelectorAll('.characters');
const selectionSound = new Audio('./sounds/selection_sound.mp3');

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
    const nomeGrupo = document.getElementById('hero_name1');
    nomeGrupo.innerText = personagem.getAttribute('data-name');
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

// Variável para rastrear o personagem atualmente selecionado
let selectedIndex = 0;

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
    if (currentKeyMap.hasOwnProperty(e.key)) {
        e.preventDefault(); // Evita comportamento padrão (scroll da página)
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