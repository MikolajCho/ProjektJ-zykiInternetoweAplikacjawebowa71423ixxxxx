# Study Tracker

Prosta aplikacja webowa do śledzenia czasu nauki. Pozwala zapisywać, ile godzin
dziennie się uczysz, i na bieżąco pokazuje statystyki oraz wykres postępów.

**Wersja online:** https://study-tracker-vy5d.vercel.app/

## Do czego służy

Aplikacja pomaga utrzymać systematyczność w nauce. Codziennie wpisujesz liczbę
przepracowanych godzin, a aplikacja liczy sumę, średnią dzienną i porównuje
wynik z założonym celem 3 godzin dziennie.

## Funkcje

- Dodawanie wpisu (data + liczba godzin), z nadpisaniem istniejącego dnia
- Walidacja danych (data wymagana, godziny w zakresie 0–24)
- Tabela z historią wpisów i możliwością usuwania
- Filtrowanie: wszystko / ostatnie 7 dni
- Statystyki KPI: suma godzin, średnia dzienna, liczba dni
- Wykres godzin nauki z linią celu (Chart.js)
- Tryb jasny i ciemny (zapamiętywany)
- Ciekawostka pobierana z zewnętrznego API
- Zapis danych w przeglądarce (localStorage)

## Technologie

- **HTML5** – struktura strony
- **CSS3** – stylowanie, Flexbox i Grid, responsywność, tryb jasny/ciemny
- **JavaScript (ES6)** – logika aplikacji, walidacja, obsługa zdarzeń
- **Chart.js** – wykres godzin nauki
- **Numbers API** – zewnętrzne API z ciekawostkami (fetch)
- **localStorage** – zapis danych w przeglądarce
- **Vercel** – hosting wersji online

## Uruchomienie lokalne

Wystarczy otworzyć plik `index.html` w przeglądarce. Nie trzeba nic instalować.
