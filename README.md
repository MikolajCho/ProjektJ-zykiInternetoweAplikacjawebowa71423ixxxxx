# Study Tracker

---
## 1. Analiza problemu

### 1.1. Opis problemu
Utrzymanie regularności i samodyscypliny podczas nauki nowych kompetencji technologicznych stanowi wyzwanie dla wielu osób. Tradycyjne podejścia opierają się zazwyczaj na prostych listach zadań, które nie obrazują matematycznego długu ani nadwyżki czasowej względem założonego planu. 

Aplikacja rozwiązuje ten problem poprzez ciągłą ewaluację postępów względem celu minimalnego wynoszącego $3.0\text{ h / dzień}$. Zgodnie z zasadami psychologii behawioralnej, kluczem do wyrobienia nawyku jest ciągłość. System automatyzuje proces monitorowania postępów i natychmiastowo ostrzega użytkownika w sytuacjach krytycznych dla procesu uczenia, czyli w przypadku zaniechania pracy przez dwa dni z rzędu.

### 1.2. Użytkownik aplikacji
Głównym użytkownikiem systemu jest samodzielnie studiująca osoba prywatna (np. student przygotowujący się do sesji egzaminacyjnej lub programista zmieniający specjalizację). Jego podstawową potrzebą jest precyzyjna kontrola czasu poświęconego na pracę umysłową, wizualizacja trendu wydajności oraz zewnętrzny mechanizm dyscyplinujący, który nie pozwala na bezkarne pomijanie kolejnych dni nauki.

### 1.3. Analiza konkurencji / podobnych rozwiązań
1. **Toggl Track**: Komercyjne narzędzie do mierzenia czasu zadań. *Zalety:* Precyzyjny stoper, rozbudowane raporty. *Ograniczenia:* Interfejs nastawiony na zespoły biznesowe (B2B), brak wbudowanej analizy długu czasowego względem dziennego celu.
2. **Habitica**: Grywalizacja codziennych nawyków. *Zalety:* Atrakcyjna forma motywacji poprzez elementy RPG. *Ograniczenia:* Opiera się na systemie zero-jedynkowym (zrobione/niezrobione), co uniemożliwia agregację i analizę ułamkowych wartości godzin roboczych.
3. **Nasze rozwiązanie:** Aplikacja eliminuje elementy rozpraszające, skupiając się na czystej, matematycznej analizie odchyleń. Wprowadza unikalną funkcję bezwzględnego alarmowania audio w przypadku załamania ciągłości pracy, łącząc zalety prostego rejestru z automatyczną kontrolą nawyków.

---

## 2. Analiza funkcjonalna

### 2.1. Lista funkcji
* **F1: Formularz dodawania i aktualizacji wpisów** - Wprowadzanie daty oraz liczby godzin z automatycznym nadpisywaniem danych w przypadku dublujących się dni.
* **F2: Walidacja danych wejściowych** - Blokada przed wprowadzeniem wartości spoza realnego przedziału dobowego $t \in \langle 0, 24 \rangle$.
* **F3: Dynamiczne wskaźniki KPI** - Wyliczanie sumy czasu, średniej dobowej oraz bilansu netto w czasie rzeczywistym.
* **F4: Filtrowanie chronologiczne** - Przełączanie widoku danych między pełną historią a ostatnimi 7 dniem.
* **F5: Wykres odchyleń (Chart.js)** - Wizualizacja funkcji odchylenia liniowego $f(x) = \text{godziny} - 3.0$ na interaktywnej osi czasu.
* **F6: Detektor regresu (Krach Dyscypliny)** - Automatyczne wykrywanie przerw w nauce i aktywacja modalnego okna blokującego interfejs.
* **F7: Podsystem audio (Web Audio API)** - Programowa synteza dźwięku syreny ostrzegawczej bezpośrednio z poziomu karty dźwiękowej przeglądarki.
* **F8: Zarządzanie bazą (Serializacja JSON)** - Możliwość eksportu i importu całej historii wpisów do pliku tekstowego `.json`.

### 2.2. User Stories
* **US-1:** Jako użytkownik chcę szybko zapisać czas nauki z danego dnia, aby sprawdzić, czy zrealizowałem plan minimalny.
* **US-2:** Jako osoba kontrolująca postępy chcę filtrować dane do ostatniego tygodnia, aby ocenić moją aktualną systematyczność.
* **US-3:** Jako prokrastynator chcę mieć możliwość usunięcia błędnie dodanego wpisu, aby zachować rzetelność statystyk.
* **US-4:** Jako użytkownik dbający o dane chcę pobrać plik JSON z historią, aby móc ją przywrócić na innym urządzeniu lub po wyczyszczeniu przeglądarki.

### 2.4. Lista zadań projektowych (Backlog)
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
| **T10**| Budowa modułu eksportu/importu JSON i wdrożenie | Średni | Wykonane | AN |

### 2.5. Narzędzie do zarządzania zadaniami
Praca nad projektem była koordynowana za pomocą cyfrowej tablicy **GitHub Projects (Kanban)**. Zadania były realizowane sekwencyjnie. Wszystkie zaplanowane punkty zostały ukończone pomyślnie. Przepływ zadań od statusu "To Do" do "Done" kontrolowany był z poziomu gałęzi kodu, co pozwoliło uniknąć konfliktów podczas integracji.

---

## 3. Harmonogram pracy

Prace zostały rozłożone w czasie i zrealizowane terminowo zgodnie z harmonogramem:
* **Tydzień 1 (Inicjalizacja):** Prace analityczne, uściślenie struktur danych, przygotowanie semantycznego szkieletu HTML, bazy stylów oraz podstawowego mechanizmu obsługi LocalStorage.
* **Tydzień 2 (Formularz i tabela):** Wdrożenie matematycznej walidacji danych formularza oraz uruchomienie dynamicznego renderowania tabeli rejestru chronologicznego.
* **Tydzień 3 (Filtry i statystyki):** Implementacja funkcji usuwania wpisów, obsługa komunikatów o pustym stanie bazy danych, wdrożenie przełącznika filtrów czasowych oraz zaawansowanych pól kalkulacyjnych KPI.
* **Tydzień 4 (Analityka i wdrożenie):** Integracja wykresu liniowego Chart.js, oprogramowanie syntezatora dźwiękowego (Web Audio API), budowa modułu operacji na plikach JSON (eksport/import kopii) oraz konfiguracja środowiska Vercel.

**Opis problemów organizacyjnych:** Największym wyzwaniem inżynieryjnym okazało się zablokowanie automatycznego odtwarzania dźwięku przez nowoczesne przeglądarki (Autoplay Policy). Zespół rozwiązał ten problem poprzez modyfikację kodu, która uzależnia aktywację kontekstu audio od pierwszego kliknięcia użytkownika w przycisk zamykający okno modalne.

---

## 4. Specyfikacja techniczna

### 4.1. Technologie
* **HTML5**: Semantyczna struktura dokumentu gwarantująca optymalne parsowanie drzewa DOM.
* **CSS3**: Autorski design system oparty o zmienne `:root`, elastyczne układy Flexbox oraz responsywne siatki CSS Grid.
* **Vanilla JavaScript (ES6)**: Architektura oparta o czyste kod funkcyjny bez narzutu frameworków deweloperskich.
* **Chart.js (CDN)**: Zewnętrzna biblioteka renderująca wykres liniowy w elemencie `<canvas>`.
* **Web Audio API**: Wykorzystanie sprzętowego oscylatora przeglądarki (`OscillatorNode`) do bezpośredniej syntezy dźwięku alarmowego.

### 4.2. Model danych
Dane przechowywane są lokalnie jako tablica obiektów o następującej strukturze:
```json
[
  {
    "date": "YYYY-MM-DD",
    "hours": 4.5
  }
]
