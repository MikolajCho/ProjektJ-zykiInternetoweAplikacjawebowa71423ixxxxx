// ----- Dane aplikacji -----
// Wpisy trzymamy w localStorage jako tablicę obiektów { date, hours }.
let entries = JSON.parse(localStorage.getItem('study_db')) || [];

// Aktualnie wybrany filtr: 'all' (wszystko) albo 'week' (ostatnie 7 dni).
let currentFilter = 'all';

// Referencja do wykresu, żeby móc go odświeżać.
let chart = null;

// ----- Pobranie elementów ze strony -----
const form = document.getElementById('inputForm');
const dateInput = document.getElementById('entryDate');
const hoursInput = document.getElementById('entryHours');
const errorBox = document.getElementById('formError');
const tableBody = document.getElementById('tableBody');

// Na start ustawiamy w formularzu dzisiejszą datę.
dateInput.value = new Date().toISOString().split('T')[0];

// ----- Motyw jasny / ciemny -----
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    render(); // przerysowujemy wykres w nowych kolorach
}

// ----- Zewnętrzne API: ciekawostka w nagłówku -----
// Pokazuje, że potrafimy pobrać dane z zewnętrznego serwera (fetch + async).
// Lista tematów naukowych. Losujemy jeden i pobieramy jego opis z Wikipedii,
// dzięki czemu ciekawostka zawsze jest naukowa i po polsku.
const SCIENCE_TOPICS = [
    'Fotosynteza', 'Czarna_dziura', 'DNA', 'Mitochondrium', 'Teoria_względności',
    'Grawitacja', 'Atom', 'Ewolucja', 'Wielki_Wybuch', 'Prędkość_światła',
    'Wirus', 'Elektron', 'Ekosystem', 'Wulkan', 'Magnetyzm',
    'Układ_Słoneczny', 'Antybiotyk', 'Komórka_(biologia)', 'Fala_dźwiękowa', 'Tlen'
];

function loadQuote() {
    const topic = SCIENCE_TOPICS[Math.floor(Math.random() * SCIENCE_TOPICS.length)];

    fetch('https://pl.wikipedia.org/api/rest_v1/page/summary/' + topic)
        .then(response => response.json())
        .then(data => {
            let text = data.extract || '';
            // Skracamy długi opis, żeby nie rozpychał nagłówka.
            const MAX = 200;
            if (text.length > MAX) {
                text = text.slice(0, MAX);
                text = text.slice(0, text.lastIndexOf(' ')) + '...';
            }
            document.getElementById('apiQuote').innerText = '🔬 ' + text;
        })
        .catch(() => {
            // Gdy API nie odpowie, pokazujemy tekst zastępczy (obsługa błędu).
            document.getElementById('apiQuote').innerText = 'Nie udało się pobrać ciekawostki.';
        });
}

// ----- Dodawanie / aktualizacja wpisu -----
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const date = dateInput.value;
    const hours = parseFloat(hoursInput.value);

    // Walidacja: data musi być, godziny muszą być liczbą z zakresu 0–24.
    if (!date) {
        showError('Podaj datę.');
        return;
    }
    if (isNaN(hours) || hours < 0 || hours > 24) {
        showError('Liczba godzin musi być z zakresu 0–24.');
        return;
    }
    showError(''); // czyścimy komunikat błędu

    // Jeśli wpis na ten dzień już istnieje, nadpisujemy go; inaczej dodajemy nowy.
    const existing = entries.find(item => item.date === date);
    if (existing) {
        existing.hours = hours;
    } else {
        entries.push({ date: date, hours: hours });
    }

    // Sortujemy po dacie i zapisujemy do localStorage.
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    save();

    hoursInput.value = '';
    render();
});

// ----- Usuwanie wpisu -----
function removeEntry(date) {
    if (confirm('Usunąć wpis z dnia ' + date + '?')) {
        entries = entries.filter(item => item.date !== date);
        save();
        render();
    }
}

// ----- Filtr -----
function setFilter(filter) {
    currentFilter = filter;
    render();
}

// Zwraca dane po zastosowaniu aktualnego filtra.
function getVisibleEntries() {
    if (currentFilter === 'all') {
        return entries;
    }
    const limit = new Date();
    limit.setDate(limit.getDate() - 7);
    return entries.filter(item => new Date(item.date) >= limit);
}

// ----- Pomocnicze -----
function save() {
    localStorage.setItem('study_db', JSON.stringify(entries));
}

function showError(message) {
    errorBox.innerText = message;
}

// ----- Wykres godzin nauki -----
function renderChart(data) {
    if (chart) {
        chart.destroy();
    }
    const isLight = document.body.classList.contains('light-mode');
    const textColor = isLight ? '#0c0e12' : '#f5f6fa';
    const gridColor = isLight ? '#cbd5e0' : '#2c3444';

    chart = new Chart(document.getElementById('hoursChart'), {
        type: 'line',
        data: {
            labels: data.map(item => item.date),
            datasets: [
                {
                    label: 'Godziny nauki',
                    data: data.map(item => item.hours),
                    borderColor: '#00d2d3',
                    borderWidth: 3,
                    tension: 0.1
                },
                {
                    label: 'Cel 3 h',
                    data: data.map(() => 3),
                    borderColor: '#ff4757',
                    borderWidth: 1.5,
                    borderDash: [6, 6],
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor } } },
            scales: {
                y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } },
                x: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
        }
    });
}

// ----- Główne rysowanie widoku -----
function render() {
    // Podświetlenie aktywnego przycisku filtra.
    document.getElementById('btnFilterAll').classList.toggle('active', currentFilter === 'all');
    document.getElementById('btnFilterWeek').classList.toggle('active', currentFilter === 'week');

    const data = getVisibleEntries();
    tableBody.innerHTML = '';

    // Pusty stan: gdy nie ma żadnych danych.
    if (data.length === 0) {
        document.getElementById('kpiTotal').innerText = '0.0 h';
        document.getElementById('kpiAvg').innerText = '0.00 h';
        document.getElementById('kpiDays').innerText = '0';
        tableBody.innerHTML = '<tr><td colspan="3" class="empty">Brak danych dla tego okresu.</td></tr>';
        if (chart) chart.destroy();
        return;
    }

    // Obliczenia statystyk.
    let total = 0;
    data.forEach(item => total += item.hours);
    const avg = total / data.length;

    document.getElementById('kpiTotal').innerText = total.toFixed(1) + ' h';
    document.getElementById('kpiAvg').innerText = avg.toFixed(2) + ' h';
    document.getElementById('kpiDays').innerText = data.length;

    renderChart(data);

    // Rysowanie wierszy tabeli.
    data.forEach(item => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.innerText = item.date;

        const hoursCell = document.createElement('td');
        hoursCell.innerText = item.hours.toFixed(1) + ' h';

        const actionCell = document.createElement('td');
        const delBtn = document.createElement('button');
        delBtn.className = 'btn-delete';
        delBtn.innerText = 'Usuń';
        delBtn.onclick = () => removeEntry(item.date);
        actionCell.appendChild(delBtn);

        row.appendChild(dateCell);
        row.appendChild(hoursCell);
        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });
}

// ----- Podpięcie zdarzeń i start aplikacji -----
document.getElementById('themeBtn').addEventListener('click', toggleTheme);
document.getElementById('btnFilterAll').addEventListener('click', () => setFilter('all'));
document.getElementById('btnFilterWeek').addEventListener('click', () => setFilter('week'));

loadQuote();
render();
