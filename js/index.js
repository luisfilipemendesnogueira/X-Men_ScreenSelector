/* =======================================================
   1. ACCESS CONTROL
   Checks if the user has permission to access the page.
   Redirects to "index.html" if the flag is not defined.
========================================================== */
if (!sessionStorage.getItem('allowed')) {
    window.location.href = 'index.html';
} else {
    sessionStorage.removeItem('allowed');
}

/* =======================================================
   2. DOM ELEMENTS
   Selects the necessary elements for interface manipulation.
========================================================== */
const characters = document.querySelectorAll('.characters');
const characterName = document.getElementById('hero_name');
const largeCharacterImage = document.getElementById('hero_pic');

/* =======================================================
   3. AUDIO CONFIGURATION
   Initializes the sounds used in the game and configures the theme looping.
========================================================== */
const selectionSound = new Audio('./sounds/selection_sound.mp3');
const confirmSound = new Audio('./sounds/confirm_sound.mp3');
const titleSound = new Audio('./sounds/title.mp3');
const announcerSound = new Audio('./sounds/pick_up.mp3');
titleSound.loop = true;

/* =======================================================
   4. KEY MAPPING
   Defines associations between keys and directions or numerical values.
========================================================== */
// Mapping to translate keys into directions (used for secret input)
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

// Default mapping for navigation between characters
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
// Special mappings for specific characters or teams
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
   5. SECRET CHARACTERS CONFIGURATION
   Defines the default and alternative secret characters, with their images and names.
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
    'brotherhood': {
        secretImg: './images/five_phoenix.png',
        cardImg: './images/card-five_phoenix.png',
        secretName: 'Five Phoenix'
    }
};
const secretCharactersAlternative = {
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
   6. GAME STATE VARIABLES
   Manage selection progress, timer, and input sequences.
========================================================== */
// Selection Progress
let currentSelectionStep = 1;
let selectedCharacters = [];
let selectedIndex = 0;
let currentKeyMap = defaultKeyMap;
const unlockedSecretsDefault = new Set();
const unlockedSecretsAlternative = new Set();

// Timer
let timer;
let isTimerRunning = false;
let currentTime = 3000;

// Input Sequences
let inputSequenceDefault = [];
let inputSequenceAlternative = [];

/* =======================================================
   7. CHARACTER EVENTS (MOUSE)
   Allows selection and visual highlighting of characters when hovering or clicking.
========================================================== */
characters.forEach((character) => {
    character.addEventListener('mouseenter', () => {
        if (character.classList.contains('selected')) return;

        if (window.innerWidth < 450) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        removeCharacterSelection();
        character.classList.add('selected');
    
        if (unlockedSecretsAlternative.has(character.id)) {
            changeSelectedCharacterImageAlternative(character);
            changeSelectedCharacterNameAlternative(character);
        } else {
            changeSelectedCharacterImageDefault(character);
            changeSelectedCharacterNameDefault(character);
        }

        selectionSound.currentTime = 0;
        selectionSound.play();

        selectedIndex = Array.from(characters).indexOf(character);
        updateKeyMap(character);
    });
});

characters.forEach((character) => {
    character.addEventListener('click', () => {
        if (selectedCharacters.includes(character)) return;

        selectedIndex = Array.from(characters).indexOf(character);

        if (selectedCharacters[currentSelectionStep - 1]) {
            selectedCharacters[currentSelectionStep - 1].classList.remove('chosen');
        }

        const slotElement = document.getElementById(`hero_name${currentSelectionStep}`);
        slotElement.textContent = character.getAttribute('data-name');

        confirmSound.currentTime = 0;
        confirmSound.play();

        character.classList.add('chosen');
        
        selectedCharacters[currentSelectionStep - 1] = character;

        currentSelectionStep = (currentSelectionStep % 3) + 1;

        if (selectedCharacters.length === 3) {
            const selectedCards = selectedCharacters.map(char => {
                if (unlockedSecretsAlternative.has(char.id)) {
                    return {
                        cardImg: secretCharactersAlternative[char.id].cardImg,
                        name: secretCharactersAlternative[char.id].secretName
                    };
                }
                else if (unlockedSecretsDefault.has(char.id)) {
                    return {
                        cardImg: secretCharactersDefault[char.id].cardImg,
                        name: secretCharactersDefault[char.id].secretName
                    };
                }
                return {
                    cardImg: `./images/card-${char.id}.png`,
                    name: char.getAttribute('data-name')
                };
            });
            
            localStorage.setItem('selectedCharacters', JSON.stringify(selectedCards));
            window.location.href = 'index3.html';
        }

        if (unlockedSecretsAlternative.has(character.id)) {
            changeSelectedCharacterImageAlternative(character);
            changeSelectedCharacterNameAlternative(character);
        } else {
            changeSelectedCharacterImageDefault(character);
            changeSelectedCharacterNameDefault(character);
        }
    });
});

const firstCharacter = document.querySelectorAll('.characters')[0];
if (firstCharacter) {
    removeCharacterSelection();
    firstCharacter.classList.add('selected');
    changeSelectedCharacterImageDefault(firstCharacter);
    changeSelectedCharacterNameDefault(firstCharacter);
}

/* =======================================================
   8. INTERFACE UPDATE FUNCTIONS
   Updates the image and name of the selected character (default or alternative mode).
========================================================== */
function changeSelectedCharacterNameDefault(character) {
    if (unlockedSecretsDefault.has(character.id)) {
        characterName.innerText = secretCharactersDefault[character.id].secretName;
    } else {
        characterName.innerText = character.getAttribute('data-name');
    }
}

function changeSelectedCharacterImageDefault(character) {
    const characterId = character.id;
    if (unlockedSecretsDefault.has(characterId)) {
        largeCharacterImage.src = secretCharactersDefault[characterId].cardImg;
    } else {
        largeCharacterImage.src = `./images/card-${characterId}.png`;
    }
}

function changeSelectedCharacterNameAlternative(character) {
    if (unlockedSecretsAlternative.has(character.id)) {
        characterName.innerText = secretCharactersAlternative[character.id].secretName;
    } else {
        characterName.innerText = character.getAttribute('data-name');
    }
}

function changeSelectedCharacterImageAlternative(character){
    const characterId = character.id;
    if (unlockedSecretsAlternative.has(characterId)) {
        largeCharacterImage.src = secretCharactersAlternative[characterId].cardImg;
    } else {
        largeCharacterImage.src = `./images/card-${characterId}.png`;
    }
}

/* =======================================================
   9. SELECTION RESET AND UPDATE FUNCTIONS
   Manages the removal of selection classes and character reset.
========================================================== */
function removeCharacterSelection() {
    document.querySelectorAll('.characters.selected').forEach(el => {
        el.classList.remove('selected');
    });
}

function resetSelections() {
    selectedCharacters.forEach(char => {
        if (char) char.classList.remove('chosen');
    });
    selectedCharacters = [];
    currentSelectionStep = 1;
    document.querySelectorAll('[id^="hero_name"]').forEach(el => el.textContent = '');
}

function resetAllSelections() {
    document.querySelectorAll('.characters').forEach(char => {
        char.classList.remove('chosen', 'selected');
    });

    characters.forEach(character => {
        const charImg = character.querySelector('.char_img');
        if (charImg && character.dataset.originalImg) {
            charImg.src = character.dataset.originalImg;
        }
        character.setAttribute('data-name', character.dataset.originalName);
    });

    selectedCharacters = [];
    currentSelectionStep = 1;
    selectedIndex = 0;

    document.querySelectorAll('[id^="hero_name"]').forEach(el => {
        el.textContent = '';
    });

    const firstCharacter = characters[0];
    if (firstCharacter) {
        firstCharacter.classList.add('selected');
        changeSelectedCharacterImageDefault(firstCharacter);
        changeSelectedCharacterNameDefault(firstCharacter);
        updateKeyMap(firstCharacter);
    }

    firstCharacter.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    unlockedSecretsDefault.clear();

    const currentCharacter = document.querySelector('.characters.selected');
    if (currentCharacter) {
        changeSelectedCharacterImageDefault(currentCharacter);
        changeSelectedCharacterNameDefault(currentCharacter);
    }
}

function updateKeyMap(character) {
    if (specialKeyMaps[character.id]) {
        currentKeyMap = specialKeyMaps[character.id];
    } else {
        const team = character.closest('.teams')?.id;
        currentKeyMap = specialKeyMaps[team] || defaultKeyMap;
    }
}

/* =======================================================
   10. TIMER FUNCTIONS
   Controls the countdown and resets selections when time runs out.
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
        unlockedSecretsAlternative.clear();
        
        characters.forEach(character => {
            const charImg = character.querySelector('.char_img');
            charImg.src = character.dataset.originalImg;
            character.setAttribute('data-name', character.dataset.originalName);
        });
        resetAllSelections();
        currentTime = 3000;
    }
    startTimer();
}

/* =======================================================
   11. NAVIGATION FUNCTIONS (KEYBOARD)
   Allows moving the selection between characters using the keyboard.
========================================================== */
function navigateSelection(direction) {
    const totalCharacters = characters.length;
    const previousCharacter = characters[selectedIndex];
    let newIndex = selectedIndex + direction;
    newIndex = Math.max(0, Math.min(newIndex, totalCharacters - 1));

    if (newIndex !== selectedIndex) {
        if (unlockedSecretsDefault.has(previousCharacter.id) && !selectedCharacters.includes(previousCharacter)) {
            unlockedSecretsDefault.delete(previousCharacter.id);
            const charImg = previousCharacter.querySelector('.char_img');
            charImg.src = previousCharacter.dataset.originalImg;
            previousCharacter.setAttribute('data-name', previousCharacter.dataset.originalName);
            if (previousCharacter.classList.contains('selected')) {
                changeSelectedCharacterImageDefault(previousCharacter);
                changeSelectedCharacterNameDefault(previousCharacter);
            }
        }
        if (unlockedSecretsAlternative.has(previousCharacter.id) && !selectedCharacters.includes(previousCharacter)) {
            unlockedSecretsAlternative.delete(previousCharacter.id);
            const charImg = previousCharacter.querySelector('.char_img');
            charImg.src = previousCharacter.dataset.originalImg;
            previousCharacter.setAttribute('data-name', previousCharacter.dataset.originalName);
            if (previousCharacter.classList.contains('selected')) {
                changeSelectedCharacterImageAlternative(previousCharacter);
                changeSelectedCharacterNameAlternative(previousCharacter);
            }
        }

        selectedIndex = newIndex;
        const character = characters[selectedIndex];

        removeCharacterSelection();
        character.classList.add('selected');
        if (unlockedSecretsAlternative.has(character.id)) {
            changeSelectedCharacterImageAlternative(character);
            changeSelectedCharacterNameAlternative(character);
        } else {
            changeSelectedCharacterImageDefault(character);
            changeSelectedCharacterNameDefault(character);
        }
        updateKeyMap(character);

        selectionSound.currentTime = 0;
        selectionSound.play();

        character.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/* =======================================================
   12. SECRET INPUT FUNCTIONS
   Checks if the user has entered the correct sequence of directions to unlock secrets.
========================================================== */
function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

function checkSecretCodeDefault() {
    const secretCodeDefault = ['up', 'down', 'right', 'left', 'down', 'up', 'left', 'right'];
    if (arraysEqual(inputSequenceDefault, secretCodeDefault)) {
        const currentCharacter = document.querySelector('.characters.selected');
        if (currentCharacter && secretCharactersDefault[currentCharacter.id]) {
            unlockSecretCharacterDefault(currentCharacter.id);
            inputSequenceDefault = [];
        }
    }
}
function checkSecretCodeAlternative() {
    const secretCodeAlternative = ['up', 'down', 'left', 'right', 'down', 'up', 'right', 'left'];
    if (arraysEqual(inputSequenceAlternative, secretCodeAlternative)) {
        const currentCharacter = document.querySelector('.characters.selected');
        if (currentCharacter && secretCharactersAlternative[currentCharacter.id]) {
            unlockSecretCharacterAlternative(currentCharacter.id);
            inputSequenceAlternative = [];
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

    const currentCharacter = document.querySelector('.characters.selected');
    if (currentCharacter && currentCharacter.id === characterId) {
        changeSelectedCharacterImageDefault(currentCharacter);
        changeSelectedCharacterNameDefault(currentCharacter);
    }
}

function unlockSecretCharacterAlternative(characterId) {
    unlockedSecretsAlternative.add(characterId);
    const characterElement = document.getElementById(characterId);
    const charImg = characterElement.querySelector('.char_img');

    if (secretCharactersAlternative[characterId]?.secretImg) {
        charImg.src = secretCharactersAlternative[characterId].secretImg;
        characterElement.setAttribute('data-name', secretCharactersAlternative[characterId].secretName);
    }

    const currentCharacter = document.querySelector('.characters.selected');
    if (currentCharacter && currentCharacter.id === characterId) {
        changeSelectedCharacterImageAlternative(currentCharacter);
        changeSelectedCharacterNameAlternative(currentCharacter);
    }
}

/* =======================================================
   13. GLOBAL EVENTS (KEYBOARD AND PAGE)
   Sets up keyboard events for navigation and secret input, as well as page loading events.
========================================================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { 
        e.preventDefault();
        const selectedCharacter = characters[selectedIndex];
        if (!selectedCharacters.includes(selectedCharacter)) {
            selectedCharacter.click();
        }
        selectedCharacter.click();
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
        inputSequenceAlternative.push(direction);
        if (inputSequenceAlternative.length > 8) {
            inputSequenceAlternative.shift();
        }
        checkSecretCodeAlternative();
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
    if (characters.length > 0) {
        characters[0].classList.add('selected');
        changeSelectedCharacterImageDefault(characters[0]);
        changeSelectedCharacterNameDefault(characters[0]);
        updateKeyMap(characters[0]);
    }
});

function handleKeyboardSelection() {
    const character = characters[selectedIndex];
    if (character) {
        character.dispatchEvent(new Event('click'));
    }
}

/* =======================================================
   14. FINAL INITIALIZATION
   Starts the timer and stores the original images and names for future restoration.
========================================================== */
window.addEventListener('DOMContentLoaded', () => {
    startTimer();
});

characters.forEach(character => {
    const img = character.querySelector('.char_img');
    if (img) {
        character.dataset.originalImg = img.src;
        character.dataset.originalName = character.getAttribute('data-name');
    }
});