let storage = JSON.parse(localStorage.getItem('study_db')) || [];
document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
let currentFilter = 'all';
let chartInstance = null;
let currentPage = 1;
const itemsPerPage = 10;

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    initApp();
}

function fetchExternalAPI() {
    fetch('https://numbersapi.com/random/math?json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('apiQuote').innerText = `Naukowy fakt matematyczny: ${data.text}`;
        })
        .catch(() => {
            document.getElementById('apiQuote').innerText = "Matematyka to królowa nauk, a programowanie to jej doskonałe narzędzie.";
        });
}

document.getElementById('inputForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const inputDate = document.getElementById('entryDate').value;
    const inputHours = parseFloat(document.getElementById('entryHours').value);
    
    if (isNaN(inputHours) || inputHours < 0 || inputHours > 24) {
        alert("Błąd: Liczba godzin musi wynosić od 0 do 24!");
        return;
    }
    
    const existingIndex = storage.findIndex(item => item.date === inputDate);
    if (existingIndex !== -1) {
        storage[existingIndex].hours = inputHours;
    } else {
        storage.push({ date: inputDate, hours: inputHours });
    }
    
    storage.sort((a, b) => new Date(a.date) - new Date(b.date));
    localStorage.setItem('study_db', JSON.stringify(storage));
    
    document.getElementById('entryHours').value = '';
    initApp();
    checkRegression();
});

function removeEntry(date) {
    if (confirm(`Czy na pewno chcesz usunąć wpis z dnia ${date}?`)) {
        storage = storage.filter(item => item.date !== date);
        localStorage.setItem('study_db', JSON.stringify(storage));
        initApp();
    }
}

function checkRegression() {
    if (storage.length < 2) return;
    const last = storage[storage.length - 1];
    const prev = storage[storage.length - 2];
    if (last.hours === 0 && prev.hours === 0) {
        document.getElementById('deathModal').style.display = 'flex';
        playSiren();
    }
}

function playSiren() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(70, audioCtx.currentTime + 1.0);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1.2);
    } catch(e) {
        console.log("Audio zablokowane.");
    }
}

function closeModal() {
    document.getElementById('deathModal').style.display = 'none';
}

function setFilter(filterType) {
    currentFilter = filterType;
    currentPage = 1;
    initApp();
}

function filterData(dataArray) {
    if (currentFilter === 'all') return dataArray;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    return dataArray.filter(item => new Date(item.date) >= cutoffDate);
}

function renderChart(data) {
    if (chartInstance) {
        chartInstance.destroy();
    }
    const ctx = document.getElementById('deviationChart').getContext('2d');
    const labels = data.map(item => item.date);
    const chartData = data.map(item => item.hours - 3.0);
    
    const isLight = document.body.classList.contains('light-mode');
    const textColor = isLight ? '#0c0e12' : '#f5f6fa';
    const gridColor = isLight ? '#cbd5e0' : '#2c3444';
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Odchylenie od normy dobowej (Cel 3h)',
                    data: chartData,
                    borderColor: '#00d2d3',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.1
                },
                {
                    label: 'Norma Dobowa (Cel 3h/d)',
                    data: Array(labels.length).fill(0),
                    borderColor: '#ff4757',
                    borderWidth: 1.5,
                    borderDash: [6, 6],
                    backgroundColor: 'transparent',
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor } }
            },
            scales: {
                y: { 
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                },
                x: { 
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                }
            }
        }
    });
}

function exportJSON() {
    if (storage.length === 0) {
        alert("Baza danych jest pusta.");
        return;
    }
    const blob = new Blob([JSON.stringify(storage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kopia_bezpieczeństwa_nauki.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsedData = JSON.parse(e.target.result);
            if (Array.isArray(parsedData)) {
                storage = parsedData;
                localStorage.setItem('study_db', JSON.stringify(storage));
                initApp();
                alert("Baza danych została pomyślnie zaimportowana!");
            } else {
                alert("Nieprawidłowy format pliku JSON.");
            }
        } catch(err) {
            alert("Błąd podczas odczytu pliku kopii zapasowej.");
        }
    };
    reader.readAsText(file);
}

function renderPaginationControls(totalItems) {
    const container = document.getElementById('paginationControls');
    container.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;

    const btnPrev = document.createElement('button');
    btnPrev.className = 'btn-page';
    btnPrev.innerText = '‹ Poprzednia';
    btnPrev.disabled = currentPage === 1;
    btnPrev.onclick = () => { currentPage--; initApp(); };
    container.appendChild(btnPrev);

    const info = document.createElement('span');
    info.className = 'page-info';
    info.innerText = `${currentPage} / ${totalPages}`;
    container.appendChild(info);

    const btnNext = document.createElement('button');
    btnNext.className = 'btn-page';
    btnNext.innerText = 'Następna ›';
    btnNext.disabled = currentPage === totalPages;
    btnNext.onclick = () => { currentPage++; initApp(); };
    container.appendChild(btnNext);
}

function initApp() {
    document.getElementById('btnFilterAll').classList.toggle('active', currentFilter === 'all');
    document.getElementById('btnFilterWeek').classList.toggle('active', currentFilter === 'week');

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    const activeData = filterData(storage);
    
    if (activeData.length === 0) {
        document.getElementById('kpiTotal').innerText = '0.0 h';
        document.getElementById('kpiNet').innerText = '0.0 h';
        document.getElementById('kpiAvg').innerText = '0.00 h';
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">Brak danych dla tego okresu.</td></tr>`;
        if (chartInstance) chartInstance.destroy();
        document.getElementById('paginationControls').innerHTML = '';
        return;
    }
    
    let totalHours = 0;
    activeData.forEach(item => {
        totalHours += item.hours;
    });
    
    let netBalance = totalHours - (activeData.length * 3.0);
    let averageHours = totalHours / activeData.length;
    
    document.getElementById('kpiTotal').innerText = `${totalHours.toFixed(1)} h`;
    document.getElementById('kpiNet').innerText = `${netBalance >= 0 ? '+' : ''}${netBalance.toFixed(1)} h`;
    document.getElementById('kpiNet').style.color = netBalance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    document.getElementById('kpiAvg').innerText = `${averageHours.toFixed(2)} h`;
    
    renderChart(activeData);

    const totalPages = Math.ceil(activeData.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = activeData.slice(start, end);
    
    pageData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.date}</td>
            <td>${item.hours.toFixed(1)} h</td>
            <td><button style="color: var(--accent-red); background: none; border: none; cursor: pointer; font-weight: 600;" onclick="removeEntry('${item.date}')">Usuń</button></td>
        `;
        tbody.appendChild(tr);
    });
    
    renderPaginationControls(activeData.length);
}

window.removeEntry = removeEntry;
window.setFilter = setFilter;
window.closeModal = closeModal;
window.exportJSON = exportJSON;
window.importJSON = importJSON;
window.toggleTheme = toggleTheme;

fetchExternalAPI();
initApp();
