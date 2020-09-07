# SoulMuWebExtenstion

## 1. Jak korzystać z wtyczki?
Po zainstalowaniu wtyczki i odświeżeniu strony z Panelem Gracza powinieneś zobaczyć taki widok:

![Screenshot](docs/screen.png)

Buildy dla każdej z postaci są z automatu WYŁĄCZONE. Kliknij w napis **Build postaci** przy postaci, której build chcesz skonfigurować.

Naszym oczom ukaże się takie okienko:

![Screenshot](docs/screen2.png)

Zwróć uwagę na ilość dostępnych punktów (czerwony napis). Tyle dostanie postać po resie.

Z rozwijanych list widocznych przy każdej statystyce wybieramy sposób w jaki punkty mają się dodawać:
* Opcja "Nie dodawaj nic" - w taką satystykę żaden punkt nie zostanie dodany
* Opcja "Stała ilość" - statystyka zostanie dodana wg tej ilości
* Opcja "Dynamiczna ilość" - ilość wyrażona w % - oblicza punkty do statystyki, które zostały w dostępnej puli punktów

Przykładowy build dla SM na początek:

![Screenshot](docs/screen3.png)

**_Wartości procentowe statystyk typu Dynamiczna ilość muszą zawsze łącznie dawać 100%. W powyższym przykładzie jest 70% i 30%._**

Kolorem zielonym oznaczone jest ile w każdą statystykę zostanie dodanych punktów. Klikamy **Zapisz build** i zamykamy ręcznie okienko.

### _Aby build zaczął działać wraz z wykonaniem resetu na postaci to musimy jeszcze włączyć build, klikając na napis **[Wyłączony]**._

<br/>

## 2. Dokonywanie zmian w buildzie wraz z RESETEM
Wtyczka jest zaprogramowana tak, aby maksować staty, które są ustawione jako "Dynamiczna ilość" w kolejności od największego procenta.
Czyli jeżeli mamy np. Agility 30% i Energy 70% to najpierw zostanie zmaksowana stata Energy, a potem Agility wraz z przyrostem resów.

Jeżeli w buildzie będziemy mieli jedną lub więcej statystyk typu "Stała ilość" to możemy spodziewać się takiego widoku:

![Screenshot](docs/screen4.png)

Zielone słowo **"[UPDATE]"** wskazuje na to, że mamy nadwyżkę punktów, taki napis pojawia się, gdy:
* wszystkie statystyki typu "Dynamiczna ilość" zostały zmaksowane do 32000,
* mamy statystyki tylko typu "Stała ilość" i naturalnie wraz z resetem pojawiło się więcej punktów,
* włączyliśmy build, a nawet nie przystąpiliśmy do jego konfiguracji.

Jeżeli przy którejś statystyce typu "Dynamiczna ilość" pokazuje się na zielono +32000 to polecam ustawić ją jako typ "Stała ilość" i wklepać tam z ręki 32000, a pozostałe statystyki wg uznania zmienić na "Dynamiczna ilość" lub "Stała ilość". Dopóki wszystkie statystyki typu "Dynamiczna ilość" nie zostaną zmaksowane to oznaczenie **"[UPDATE]"** nie powinno się pojawić. 

