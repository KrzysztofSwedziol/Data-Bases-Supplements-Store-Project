<h1>Sklep z Suplementami Krzysztof Swędzioł i Piotr Błaszczyk<h1>

<h4>Tematem naszego projektu jest sklep z suplementami dla sportowców, który oparliśmy o technologię MongoDB, gdyż nasz sklep z czasem będzie ewoluował a baza ta jest bazą NoSQL dającą dużą elastyczność i nie wymaga z góry zdefiniowanego schematu tabel<h4>

<h2>1. Opis struktury bazy danych<h2>

<h4>Baza danych składa się z 8 kolekcji - Products, Orders, 
Payments, Categories, Reviews, Shipping, Suppliers i Users.<h4>

<h3>1.1 Products<h3>

<h4>Każdy produkt ma swoje unikatowe "_id" będące liczbą int, nazwę "name" będącą String, opis "description" będący "String", cenę "price" będącą int, ilość produktu w magazynie "stock" będącą int, atrybuty "attributes", będące objektem dla którego pod kluczem - nazwą atrybutum jest jego wartość - tutaj mamy zarówno atrybuty wspólne dla wszystkich produktów, na przykład wagę i i kilokalorie oraz unikatowe dla danego produktu, na przykład smak "flavor", kategorię do której należy "category_id" i dostawcę, który zaopatruje nasz sklep w dany produkt "supplier_id"<h4>

<h4> Przykład takiego produktu prezentuje się następująco : <h4>

![alt text](<screenyv2/product.png>)

<h3>1.2 Orders<h3>

<h4>Orders to kolekcja przechowująca obecne i przeszłe zamówienia, łącznie z tymi, które jeszcze nie zostały zrealizowane/opłacone. Zawierają one : 
unikatowy identyfikator "_id" będący int, listę przedmiotów wchodzących w skład zamówienia "Items" - Array - jest to lista przedmiotów w której mamy listy [index1, index2] przy czym index1 to unikatowy identyfikator produktu z tabeli products a index2 to ilość tego produktu w zamówieniu, Całkowitą cenę zamówienia "totalAmount" będącą int, status zamówienia "status" będący string, informujący nas o tym czy zamówienie zostało zrealizowane, czy jest w trakcie realizacji - "delivered" oraz "pending", adres dostawy "shippingAdress" będący obiektem z pozycjami klucz - wartość, na przykład street : Krakowska 12, numer płatności "payment_id" będący wskazaniem na obiekt z kolekcji payment za dane zamówienie oraz user_id będący wskazaniem na użytkownika z kolekcji Users, który złożył zamówienie. <h4>

<h4>Przykładowa pozycja z kolekcji orders prezentuje się w następujący sposób : <h4>

![alt text](<screenyv2/orders.png>)

<h3>1.3 Payments<h3>

<h4>Payments to kolekcja przechowująca informacje o płatnościach powiązane z poszczególnymi zamówieniami z tabeli Orders. Każdemu zamówieniu przypisana jest dokładnie jedna płatność, a jej status może być zmieniany przez odpowiednie operacje. W obiektu kolekcji wchdzą : unikatowy identyfikator "_id" typu int, metoda płatności "paymentMethod" jedna spośród dostępnych "credit_card" lub "cash" typu string, data zamówienia "date" typu date, status płatności "completed" typu bool oraz wskazanie na zamówienie do którego przynależy płatność "order_id" typu int. Zdecydowaliśmy się na rozdzielenie płatności od tabeli orders gdyż Płatności i zamówienia mogą mieć różne cykle życia i wymagania dotyczące przetwarzania. Płatność może wymagać dodatkowego przetwarzania i audytu po zakończeniu zamówienia, na przykład do celów księgowości, zwrotów lub reklamacji. Oddzielenie tych dwóch typów danych umożliwia bardziej elastyczne zarządzanie i przetwarzanie.<h4>

<h4>Przykład z kolekcji payments : <h4>

![alt text](<screenyv2/payment.png>)

<h3>1.4 Categories<h3>

<h4>Categories to kolekcja przechowująca kategorie do jakich dane produkty mogą należeć. Obecność tej kolekcji w bazie danych umożliwia łatwe aggregowanie produktów. Pojedyńczy obiekt z tej kolekcji składa się z : 
unikalnego identyfikatora "_id" typu int, nazwy "name" typu string oraz opisu "description" typu string

<h4>Przykładowy obiekt z kolekcji Categories : <h4>

![alt text](<screenyv2/Categories.png>)

<h3>1.5 Reviews<h3>

<h4>Reviews to kolekcja zawierająca recenzje klientów w stosunku do poszczególnych produktów. W skład obiektu takiej kolekcji wchodzą : unikatowy identyfikator "_id" typu int, ocena w skali od 1 do 5 "rating" typu int, komentarz od wystawiającego "comment" typu string, data wstawienia recenzji "date", wskazanie na produkt, którego dotyczy recenzja "product_id" oraz wskazanie na użytkownika wystawiającego recenzję "user_id" typu int

<h4>Przykład pozycji z reviews : 

<h4>reviews.png

<h3>1.6 Shipping<h3>

<h4>Jest to kolekcja przechowująca informacje dotyczące sposobu dostawy danego zamówienia. Obiekt tej kolekcji składa się z : unikalnego identyfikatora "_id" typu int, nazwy dostawcy "carrier" typu string, unikalnego numeru do śledzenia przesyłki "trackingNumber" typu int, statusu dostawy typu string "delivered" "shipped" lub "pending", oczekiwanej daty dostawy "estimatedDeliveryDate" typu date oraz wskazania na zamówienie "order_id <h4>

<h4>Przykładowa pozycja z Shipping : <h4>

![alt text](<screenyv2/shipping.png>)

<h3>1.7 Suppliers <h3>

<h4>Suppliers to kolekcja przechowująca informacje o dostawcach poszczególnych produktów. Składa się z : unikalnego identyfikatora "_id" typu int, nazwy dostawcy "name" typu string oraz adresu typu object<h4>

<h4> Przykładowa pozycja z Suppliers : <h4>

![alt text](<screenyv2/suppliers.png>)

<h3>1.8 Users<h3>

<h4>Users to kolekcja przechowująca informacje o klientach zarejestrowanych w naszej bazie danych - tych co przeszli przez proces rejestracji. Obiekt tej kolekcji składa się z : unikalnego identyfikatora "_id" typu int, nicku użytkownika "username", w celu zwiększenia bezpieczeństwa zahaszowanego hasła - hasła przed wpisaniem do bazy danych są haszowane żeby w przypadku włamania do bazy danych odpowiedzialne za to osoby nie uzyskały prawdziwych haseł użytkowników<h4>

<h4>Przykładowa pozycja z Users : <h4>

![alt text](<screenyv2/Users.png>)

<h2> 2. Opis działania backendu<h2>

<h3>2.1 Struktura Projektu<h3>

<h4>w celu zwiększenia czytelności, handlery do poszczególnych requestów, odpowiadających za poszczególne kolekcje umieściliśmy w osobnych routach: <h4>

![alt text](<screenyv2/routes.png>)

<h3>2.2 Bezpieczeństwo aplikacji<h3>

<h4>W celu bezpieczeństwa, aby uchronić się przed wykradnięciem danych w postaci na przykład haseł, stworzyliśmy dodatkowy plik .env, w którym przechowujemy takowe informacje, który natomiast dodaliśmy do .gitignore<h4>

![alt text](<screenyv2/env.png>)

<h3>2.3 Łączenie z bazą danych<h3>

<h4>Żeby ułatwić sobie łączenie z bazą, stworzyliśmy jeden plik js, który obsługuje właśnie to zadanie w funkcji, którą eksportuje. Oznacza to że w pozostałych plikach nie musimy robić tego ręcznie, a jedynie zaimportować i użyć opisywaną funkcję.<h4>

![alt text](<screenyv2/Connect To Database.png>)

<h3>Główna część servera<h3>

<h4>Główna część servera umieszczona jest w pliku app.js, który nasłuchuje nadchodzące requesty i przekierowuje je pod odpowiednie routy<h4>

![alt text](<screenyv2/app js.png>)

<h3>Struktura Plików<h3>

<h4>Struktura wszystkich plików prezentuje się następująco :<h4>

![alt text](<screenyv2/Struktura Projektu.png>)

<h2>Routy<h2>

<h4>Każdy Route odpowiedzialny jest za konkretne request. Jedno mają wspólne - każdy ma handler do : Otwarcia (GET), zapisu (POST), zastąpienia (PUT), edycji (PATCH) i usunięcia (DELETE) elementów z kolekcji za którą odpowiada.<h4>

<h3>Products<h3>
<h4>Na podstawie routa products przedstawię działanie każdej z operacji CRUD<h4>

<h4>GET - wyświetli wszystkie produkty<h4>

![alt text](<screenyv2/productsGET.png>)

<h4> POST - doda nowy produkt<h4>

![alt text](<screenyv2/postBody.png>)

![alt text](<screenyv2/dodanyProd.png>)

<h4> PUT - zastąpi produkt nowym<h4>

![alt text](<screenyv2/put.png>)

<h4>PATCH - zmodyfikuje istniejący produkt<h4>

![alt text](<screenyv2/patch.png>)

<h4> DELETE - usunie produkt<h4>

![alt text](<screenyv2/DELETE.png>)

<h4>Analogicznie działają te operacje dla innych routów odpowiedzialnych za swoje kolekcje. 

<h3>Categories<h3>

<h4>Categories - jest relatywnie stałą kolekcją i zmiany w innych nie mają na nią wpływu, dlatego implementuje ona podstawowe operacje CRUD.<h4>

<h3>Login<h3>

<h4>login - Oprócz podstawowych operacji, implementuje również ciekawą funkcjonalność - każde nowo zarejestrowane hasło "Haszuje"
i zapisuje do bazy danych w tej właśnie postaci. 
Uniemożliwia to kradzież haseł nawet w przypadku wypłynięcia danych z Bazy. Użytkownik przy logowaniu podaje hasło, następnie tworzony jest request i w serverze to hasło jest haszowane i porównywane z tym zapisanym w bazie danych.
 Dodatkowo sprawdzane jest czy logująca się osoba to Admin, czy Klient i w zależności od tego udostępniane są poszczególne funkcjonalności.<h4>

<h3>Orders<h3>

 <h4>Orders - Podstawowe operacje CRUD oraz sprawdzanie czy przy składaniu zamówienia, produkty w nie wchodzące są w magazynie, jeśli nie, informuje użytkownika, którego produktu brakuje. Jeśli zamówienie jest możliwe do zrealizowania, tworzony jest nowy Payment z id obeznego zamówienia.<h4>

 <h3>Payments<h3>

 <h4>Payments - Oprócz podstawowych operacji, payment przy realizacji sprawdza za jakie zamówienie odpowiada i jeśli zostało ono opłacone to zmniejsza ilość produktów w magazynie o ilość podaną w zamówieniu. Jeśli użytkownik złożył zamówienie gdy produkty były dostępne, ale nie opłacił na czas i ktoś inny wykupił dany produkt, przy tworzeniu płatności klient zostanie poinformowany o braku produktów na magazynie.<h4>

 <h3>Suppliers<h3>

 <h4>Suppliers - Podstawowe operacje CRUD, zmiany w kolekcji nie wpływają na inne kolekcje<h4>

 <h3>Reviews<h3>

 <h4>Reviews - Podstawowe operacje CRUD, zmiany w kolekcji nie wpływają na inne kolekcje<h4>

 <h3>Shipping<h3>

 <h4>Shipping - podstawowe operacje CRUD, zmiany w kolekcji nie wpływają na inne kolekcje. Sposób dostawy jest wynierany przez użytkownika podczas tworzenia płatności i jest traktowany odrębnie.<h4>

 <h3>Users<h3>

 <h4>Users - operacje zgodne z tabelą login. Użytkowników można wypisać lub zarejestrować.<h4>

 <h2>4. Operacja o charakterze transakcyjnym<h2>

 <h4>Kiedy składamy zamówienie, najpierw sprawdzane jest czy wszystkie produkty z tego zamówienia są w magazynie, jeśli nie, użytkownik jest informowany których produktów jest za mało. : <h4>

 ![alt text](<screenyv2/notInStock.png>)

 <h4>Następnie, jeśli produkty były na stanie, zostaje utworzone zamówienie, program oblicza łączną cenę zamówienia i dodaje je do bazy danych ale jeszcze nie rezerwuje produktów w nim zawartych - stanie się to dopiero przy opłaceniu. Tworzona jest też nowa płatność z completed : false.Na screenshotach pokazane jest działanie dla zamówienia z poprzedniego zrzutu ale ze zmienionym id na 2228 i payment id 2228 oraz ilość produktów 1 kategorii to 2 a drugiej kategorii to 1 <h4>

 ![alt text](<screenyv2/Paymentt.png>)

 <h4>Po zmianie statusu płatności na completed : True, w products ilość produktów zostanie zmniejszona o ilość podaną w zamówieniu<h4>

 <h4>obecny stan magazynu : <h4>
 
 ![alt text](<screenyv2/stanMag1.png>)

 <h4>stan magazynu po zapłaceniu : <h4>

 ![alt text](<screenyv2/stanMag2.png>)
