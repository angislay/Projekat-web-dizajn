let firebaseUrl = "https://web-projekat-602fa-default-rtdb.firebaseio.com";




//cita se id 
function uzmiIdIzUrl() {
    let parametri = new URLSearchParams(window.location.search);
    return parametri.get("id");
}





//ucitavam bazu
async function ucitajPodatkeOKnjizi() {
    let idKnjige = uzmiIdIzUrl();
    if (!idKnjige) return;

    try {
        const odg = await fetch(`${firebaseUrl}/knjige/${idKnjige}.json`);
        const knjiga = await odg.json();

        if (!knjiga) {
            document.getElementById("knjiga-naslov").innerText = "Књига није пронађена.";
            return;
        }

        // Popunjavanje HTML elemenata kljucevimaaa
        document.getElementById("knjiga-naslov").innerText = knjiga.naziv;
        document.getElementById("knjiga-autor").innerText = knjiga.idAutora; // Za DZ2 ispisujemo ID autora
        document.getElementById("knjiga-zanr").innerText = `Жанр: ${knjiga.zanr || "/"}`;
        document.getElementById("knjiga-isbn").innerText = `ISBN: ${knjiga.isbn || "/"}`;
        document.getElementById("knjiga-cena").innerText = `Цена: ${knjiga.cena} РСД`;
        document.getElementById("knjiga-opis").innerText = knjiga.opis || "Нема описа.";

       
        let slikaUrl = (knjiga.slike && knjiga.slike.length > 0) ? knjiga.slike[0] : "";
        document.getElementById("knjiga-slika").src = slikaUrl;

        document.getElementById("komentari-kontejner").innerHTML = `
            <p><b>Милан:</b> Одлична књига!</p>
            <p><b>Ана:</b> Моја омиљенa</p>
        `;

    } catch (greska) {
        console.error("Greška pri učitavanju detalja:", greska);
    }
}

function inicijalizujValidacijuRecenzije() {
    let dugme = document.getElementById("btn-posalji-recenziju");
    if (dugme) {
        dugme.addEventListener("click", (e) => {
            e.preventDefault(); // Zaustavlja osvežavanje forme
            let tekst = document.getElementById("recenzija-tekst").value.trim();

            if (tekst === "") {
                alert("Поље за рецензију не може бити празно!");
                return;
            }

            alert("Рецензија је успешно валидирана! (Упис у Firebase се ради за финалну одбрану).");
            document.getElementById("recenzija-tekst").value = "";
        });
    }
}

// Pokretanje funkcija kada se ucita html
document.addEventListener("DOMContentLoaded", () => {
    ucitajPodatkeOKnjizi();
    inicijalizujValidacijuRecenzije();
});