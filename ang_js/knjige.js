let firebaseUrl = "https://web-projekat-602fa-default-rtdb.firebaseio.com";
let sveKnjige = {};

// iz baze preuzimam knjigee
async function preuzmiKnjigeKatalog() {
    let grid = document.getElementById("knjige-grid");
    if (!grid) return;

    try {
        const odg = await fetch(firebaseUrl + "/knjige.json");
        sveKnjige = await odg.json() || {};
        prikaziKnjige(sveKnjige);
    } catch (greska) {
        console.error("Грешка при преузимању података:", greska);
        grid.innerHTML = `<p class="nema-rezultata">Грешка при учитавању базе података.</p>`;
    }
}

function prikaziKnjige(knjigeZaPrikaz) {
    let grid = document.getElementById("knjige-grid");
    grid.innerHTML = ""; 

    if (Object.keys(knjigeZaPrikaz).length === 0) {
        grid.innerHTML = `<p class="nema-rezultata">Нема пронађених књига за задати критеријум.</p>`;
        return;
    }

    for (let id in knjigeZaPrikaz) {
        let knjiga = knjigeZaPrikaz[id];
        
        // Извлачење прве слике из низа у бази
        let slikaUrl = (knjiga.slike && knjiga.slike.length > 0) 
            ? knjiga.slike[0] 
            : "https://via.placeholder.com/150x220?text=Nema+Slike";

        grid.innerHTML += `
            <div class="knjiga-kartica">
                <img src="${slikaUrl}" alt="${knjiga.naziv}">
                <h3>${knjiga.naziv}</h3>
                <p><strong>Жанр:</strong> ${knjiga.zanr || "/"}</p>
                <p><strong>Цена:</strong> ${knjiga.cena} РСД</p>
                <a href="knjiga detaljno.html?id=${id}">
                    <button>Детаљи</button>
                </a>
            </div>`;
    }
}

//pretrage
function pretraziKnjige() {
    let kriterijum = document.getElementById("kriterijum").value;
    let tekstPretrage = document.getElementById("pretraga").value.toLowerCase().trim();

    if (tekstPretrage === "") {
        prikaziKnjige(sveKnjige);
        return;
    }

    let filtriraneKnjige = {};

    for (let id in sveKnjige) {
        let knjiga = sveKnjige[id];
        let poklapaSe = false;

        let nazivKnjige = knjiga.naziv ? knjiga.naziv.toLowerCase() : "";
        let zanrKnjige = knjiga.zanr ? knjiga.zanr.toLowerCase() : "";

        if (kriterijum === "naslov" && nazivKnjige.includes(tekstPretrage)) {
            poklapaSe = true;
        } else if (kriterijum === "zanr" && zanrKnjige.includes(tekstPretrage)) {
            poklapaSe = true;
        } else if (!kriterijum) {
            // Ако критеријум није изабран, тражи истовремено у оба поља
            if (nazivKnjige.includes(tekstPretrage) || zanrKnjige.includes(tekstPretrage)) {
                poklapaSe = true;
            }
        }

        if (poklapaSe) {
            filtriraneKnjige[id] = knjiga;
        }
    }

    prikaziKnjige(filtriraneKnjige);
}

document.addEventListener("DOMContentLoaded", () => {
    preuzmiKnjigeKatalog();

    const btnPretraga = document.querySelector(".btn-pretraga");
    if (btnPretraga) {
        btnPretraga.addEventListener("click", pretraziKnjige);
    }
    
    document.getElementById("pretraga").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            pretraziKnjige();
        }
    });
});