let storage = JSON.parse(localStorage.getItem('study_db')) || [];
document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
let currentFilter = 'all';
let chartInstance = null;

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

// Sprawdzanie czy dwa ostatnie chronologicznie wpisy mają przypisane 0 godzin nauki
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
        console.log("Audio zablokowane - polityka autoplay przeglądarki.");
    }
}

function closeModal() {
    document.getElementById('deathModal').style.display = 'none';
}

function setFilter(filterType) {
    currentFilter = filterType;
    initApp();
}

// Filtrowanie tablicy obiektów
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
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Odchylenie od normy dobowej (Cel 3h)',
                data: chartData,
                borderColor: '#00d2d3',
                backgroundColor: 'transparent',
                borderWidth: 3,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: '#2c3444' } },
                x: { grid: { color: '#2c3444' } }
            }
        }
    });
}

function initApp() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    const activeData = filterData(storage);
    
    if (activeData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">Brak danych dla tego okresu.</td></tr>`;
        document.getElementById('kpiTotal').innerText = '0.0 h';
        document.getElementById('kpiNet').innerText = '0.0 h';
        document.getElementById('kpiAvg').innerText = '0.00 h';
        if (chartInstance) chartInstance.destroy();
        return;
    }
    
    let totalHours = 0;
    
    activeData.forEach(item => {
        totalHours += item.hours;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.date}</td>
            <td>${item.hours.toFixed(1)} h</td>
            <td><button style="color: var(--accent-red); background: none; border: none; cursor: pointer; font-weight: 600;" onclick="removeEntry('${item.date}')">Usuń</button></td>
        `;
        tbody.appendChild(tr);
    });
    
    let netBalance = totalHours - (activeData.length * 3.0);
    let averageHours = totalHours / activeData.length;
    
    document.getElementById('kpiTotal').innerText = `${totalHours.toFixed(1)} h`;
    document.getElementById('kpiNet').innerText = `${netBalance >= 0 ? '+' : ''}${netBalance.toFixed(1)} h`;
    document.getElementById('kpiNet').style.color = netBalance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    document.getElementById('kpiAvg').innerText = `${averageHours.toFixed(2)} h`;
    
    renderChart(activeData);
}

window.removeEntry = removeEntry;
window.setFilter = setFilter;
window.closeModal = closeModal;
initApp();
