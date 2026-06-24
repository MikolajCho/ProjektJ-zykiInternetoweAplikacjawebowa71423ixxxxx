# Ewidencja Czasu Nauki (Study Tracker)

###  [https://study-tracker-vy5d.vercel.app/]

---

## 1. Analiza funkcjonalna

### 1.1. Lista funkcji
* **F1: Formularz dodawania i aktualizacji wpisów** - Wprowadzanie daty oraz liczby godzin z automatycznym nadpisywaniem danych w przypadku dublujących się dni.
* **F2: Walidacja danych wejściowych** - Blokada przed wprowadzeniem wartości spoza realnego przedziału dobowego $t \in \langle 0, 24 \rangle$.
* **F3: Asynchroniczna integracja z zewnętrznym API (Numbers API)** - Automatyczne pobieranie i wyświetlanie losowych faktów matematyczno-naukowych w nagłówku aplikacji.
* **F4: Przełącznik motywów (Dark/Light Mode)** - Możliwość zmiany interfejsu z automatycznym zapisem preferencji użytkownika w pamięci przeglądarki oraz dynamicznym dostosowaniem kolorystyki wykresu.
* **F5: Dynamiczne wskaźniki KPI** - Wyliczanie sumy czasu, średniej dobowej oraz bilansu netto w czasie rzeczywistym.
* **F6: Filtrowanie chronologiczne** - Przełączanie widoku danych między pełną historią a ostatnimi 7 dniami.
* **F7: Wykres odchyleń (Chart.js)** - Wizualizacja funkcji odchylenia liniowego $f(x) = \text{godziny} - 3.0$ na interaktywnej osi czasu.
* **F8: Detektor regresu (Krach Dyscypliny)** - Automatyczne wykrywanie przerw w nauce (dwa dni z rzędu z zerowym czasem) i aktywacja modalnego okna blokującego interfejs.
* **F9: Podsystem audio (Web Audio API)** - Programowa synteza dźwięku syreny ostrzegawczej o fali piłokształtnej bezpośrednio z poziomu karty dźwiękowej przeglądarki.
* **F10: Zarządzanie bazą (Serializacja JSON)** - Możliwość eksportu i importu całej historii wpisów do pliku tekstowego `.json`.

### 1.2. User Stories
* **US-1:** Jako użytkownik chcę szybko zapisać czas nauki z danego dnia, aby sprawdzić, czy zrealizowałem plan minimalny.
* **US-2:** Jako osoba kontrolująca postępy chcę filtrować dane do ostatniego tygodnia, aby ocenić moją aktualną systematyczność.
* **US-3:** Jako prokrastynator chcę mieć możliwość usunięcia błędnie dodanego wpisu, aby zachować rzetelność statystyk.
* **US-4:** Jako użytkownik chcę zapoznać się z losowym faktem matematycznym przy uruchomieniu aplikacji, aby poszerzyć wiedzę przed sesją nauki.
* **US-5:** Jako osoba pracująca w różnych warunkach oświetleniowych chcę wygodnie przełączać motyw między jasnym a ciemnym.
* **US-6:** Jako użytkownik dbający o dane chcę pobrać plik JSON z historią, aby móc ją przywrócić na innym urządzeniu.

### 1.3. Lista zadań projektowych (Backlog)
| ID | Zadanie | Priorytet | Status | Przypisany |
|---|---|---|---|---|
| **T1** | Przygotowanie struktury semantycznej HTML | Wysoki | Wykonane | JK |
| **T2** | Implementacja systemu stylów CSS Dark Mode | Wysoki | Wykonane | JK |
| **T3** | Integracja zapisu/odczytu z LocalStorage | Wysoki | Wykonane | JK |
| **T4** | Implementacja walidacji danych wejściowych | Wysoki | Wykonane | JK |
| **T5** | Silnik dynamicznego renderowania wierszy tabeli | Wysoki | Wykonane | JK |
| **T6** | Obsługa usuwania rekordów i pustych stanów UI | Średni | Wykonane | AN |
| **T7** | Dodanie podsystemu filtrów chronologicznych i KPI | Średni | Wykonane | AN |
| **T8** | Integracja zewnętrznej biblioteki wykresów Chart.js | Średni | Wykonane | AN |
| **T9** | Implementacja detektora regresu i syreny audio | Wysoki | Wykonane | AN |
| **T10**| Integracja zewnętrznego Numbers API, motywów i wdrożenie | Średni | Wykonane | AN |

### 1.4. Narzędzie do zarządzania zadaniami
Praca nad projektem była koordynowana za pomocą cyfrowej tablicy **GitHub Projects (Kanban)**. Zadania były realizowane sekwencyjnie. Wszystkie zaplanowane punkty zostały ukończone pomyślnie. Przepływ zadań od statusu "To Do" do "Done" kontrolowany był z poziomu gałęzi kodu, co pozwoliło uniknąć konfliktów podczas integracji.

---

## 2. Harmonogram pracy

Prace zostały rozłożone w czasie i zrealizowane terminowo zgodnie z harmonogramem:
* **Tydzień 1 (Inicjalizacja):** Prace analityczne, uściślenie struktur danych, przygotowanie semantycznego szkieletu HTML, bazy stylów oraz podstawowego mechanizmu obsługi LocalStorage.
* **Tydzień 2 (Formularz i tabela):** Wdrożenie matematycznej walidacji danych formularza oraz uruchomienie dynamicznego renderowania tabeli rejestru chronologicznego.
* **Tydzień 3 (Filtry i statystyki):** Implementacja funkcji usuwania wpisów, obsługa komunikatów o pustym stanie bazy danych, wdrożenie przełącznika filtrów czasowych oraz zaawansowanych pól kalkulacyjnych KPI.
* **Tydzień 4 (Analityka, API i wdrożenie):** Integracja wykresu liniowego Chart.js, oprogramowanie syntezatora dźwiękowego (Web Audio API), wdrożenie asynchronicznego pobierania danych z zewnętrznego Numbers API, dodanie systemu przełączania motywów, budowa modułu operacji na plikach JSON oraz konfiguracja środowiska Vercel.

**Opis problemów organizacyjnych:** Największym wyzwaniem inżynieryjnym okazało się zablokowanie automatycznego odtwarzania dźwięku przez nowoczesne przeglądarki (Autoplay Policy). Zespół rozwiązał ten problem poprzez modyfikację kodu, która uzależnia aktywację kontekstu audio od pierwszego kliknięcia użytkownika w przycisk zamykający okno modalne.

---

## 3. Specyfikacja techniczna

### 3.1. Technologie
* **HTML5**: Semantyczna struktura dokumentu gwarantująca optymalne parsowanie drzewa DOM.
* **CSS3**: Autorski design system oparty o zmienne `:root`, elastyczne układy Flexbox oraz responsywne siatki CSS Grid z pełnym wsparciem dla dwóch osobnych motywów graficznych.
* **Vanilla JavaScript (ES6)**: Architektura oparta o czysty kod funkcyjny bez narzutu zewnętrznych frameworków deweloperskich. Interfejs `fetch` użyty do asynchronicznej obsługi zapytania HTTP GET do Numbers API.
* **Chart.js (CDN)**: Zewnętrzna biblioteka renderująca wykres liniowy w elemencie `<canvas>`.
* **Web Audio API**: Wykorzystanie sprzętowego oscylatora przeglądarki (`OscillatorNode`) do bezpośredniej syntezy dźwięku alarmowego.

### 3.2. Model danych
Dane przechowywane są lokalnie jako tablica obiektów o następującej strukturze:
```json
[
  {
    "date": "YYYY-MM-DD",
    "hours": 4.5
  }
]
