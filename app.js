// Główna tablica na dane pobierana z LocalStorage
let storage = JSON.parse(localStorage.getItem('study_db')) || [];

// Ustawienie dzisiejszej daty jako domyślnej w formularzu
document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];

// Obsługa wysyłania formularza
document.getElementById('inputForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const inputDate = document.getElementById('entryDate').value;
    const inputHours = parseFloat(document.getElementById('entryHours').value);
    
    // Szukanie czy data już istnieje - jeśli tak, nadpisujemy godziny
    const existingIndex = storage.findIndex(item => item.date === inputDate);
    if (existingIndex !== -1) {
        storage[existingIndex].hours = inputHours;
    } else {
        storage.push({ date: inputDate, hours: inputHours });
    }
    
    // Sortowanie wpisów chronologicznie
    storage.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Zapis do pamieci przegladarki
    localStorage.setItem('study_db', JSON.stringify(storage));
    
    document.getElementById('entryHours').value = '';
    initApp();
});

function initApp() {
    // Funkcja rozruchowa (zostanie rozbudowana w kolejnych commitach)
    console.log("Dane załadowane:", storage);
}

// Pierwsze uruchomienie przy starcie strony
initApp();
