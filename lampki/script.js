document.addEventListener('DOMContentLoaded', () => {
    // Stan lampek: false = zgaszona, true = świeci
    const lamps = {
        'L1': false,
        'L2': false,
        'L3': false,
        'L4': false,
        'L5': false
    };

    // POŁĄCZENIA - Klasyczny układ "Lights Out" (lampka zmienia siebie i sąsiadów)
    const connections = {
        'L1': ['L2', 'L5'], // L1 wpływa na L2 i L5
        'L2': ['L1', 'L3'], // L2 wpływa na L1 i L3
        'L3': ['L2', 'L4'], // L3 wpływa na L2 i L4
        'L4': ['L3', 'L5'], // L4 wpływa na L3 i L5
        'L5': ['L4', 'L1']  // L5 wpływa na L4 i L1
    };

    const lampButtons = document.querySelectorAll('.lamp');
    const lampListDisplay = document.getElementById('lamp-list');
    const messageDisplay = document.getElementById('message');
    const resetButton = document.getElementById('reset-button');
    const l3Button = document.getElementById('L3'); // ODNOŚNIK DO PRZYCISKU L3

    // Funkcja aktualizująca wygląd lampek na podstawie ich stanu w obiekcie 'lamps'
    function updateLampDisplay() {
        lampButtons.forEach(button => {
            const lampId = button.dataset.lamp;
            if (lamps[lampId]) {
                button.classList.add('on');
            } else {
                button.classList.remove('on');
            }
        });

        // Aktualizacja listy tekstowej stanu lampek
        lampListDisplay.innerHTML = ''; // Czyścimy listę
        for (const lampId in lamps) {
            const li = document.createElement('li');
            li.textContent = `${lampId}: ${lamps[lampId] ? 'ŚWIECI' : 'ZGASZONA'}`;
            lampListDisplay.appendChild(li);
        }
    }

    // Funkcja do przełączania stanu lampki
    function toggleLamp(lampId) {
        if (lamps.hasOwnProperty(lampId)) {
            lamps[lampId] = !lamps[lampId];
        }
    }

    // Funkcja sprawdzająca warunek zwycięstwa (tylko L3 świeci)
    function checkWinCondition() {
        if (lamps['L3'] === true &&
            lamps['L1'] === false &&
            lamps['L2'] === false &&
            lamps['L4'] === false &&
            lamps['L5'] === false) {
            
            messageDisplay.textContent = "GRATULACJE! Osiągnąłeś cel! Tylko L3 świeci!";
            messageDisplay.classList.add('win'); 
            l3Button.classList.add('win-state'); // DODAJ KLASĘ win-state DO L3
            lampButtons.forEach(button => button.removeEventListener('click', handleLampClick)); 
            return true;
        } else {
            messageDisplay.textContent = ""; 
            messageDisplay.classList.remove('win');
            l3Button.classList.remove('win-state'); // USUŃ KLASĘ win-state Z L3, jeśli warunek nie jest spełniony
            return false;
        }
    }

    // Funkcja obsługująca kliknięcie w lampkę
    function handleLampClick(event) {
        const clickedLampId = event.target.dataset.lamp;
        
        // Zmień stan klikniętej lampki
        toggleLamp(clickedLampId);

        // Zmień stan powiązanych lampek (sąsiadów)
        const connectedLamps = connections[clickedLampId];
        if (connectedLamps) {
            connectedLamps.forEach(connectedId => {
                toggleLamp(connectedId);
            });
        }

        updateLampDisplay();
        checkWinCondition(); // Sprawdź warunek zwycięstwa po każdej zmianie
    }

    // Funkcja resetująca grę do stanu początkowego
    function resetGame() {
        for (const lampId in lamps) {
            lamps[lampId] = false; // Ustaw wszystkie na zgaszone
        }
        messageDisplay.textContent = "";
        messageDisplay.classList.remove('win');
        l3Button.classList.remove('win-state'); // USUŃ KLASĘ win-state PRZY RESTARTOWANIU
        lampButtons.forEach(button => button.addEventListener('click', handleLampClick)); // Ponownie aktywuj klikanie
        updateLampDisplay();
    }

    // Dodanie nasłuchiwania na kliknięcia dla każdej lampki
    lampButtons.forEach(button => {
        button.addEventListener('click', handleLampClick);
    });

    // Dodanie nasłuchiwania na przycisk resetu
    resetButton.addEventListener('click', resetGame);

    // Inicjalizacja stanu lampek przy ładowaniu strony
    updateLampDisplay();
    checkWinCondition(); // Sprawdź stan początkowy
});