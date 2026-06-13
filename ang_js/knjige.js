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
    if (!grid) return;
    grid.innerHTML = ""; 

    let brojKnjiga = Array.isArray(knjigeZaPrikaz) ? knjigeZaPrikaz.length : Object.keys(knjigeZaPrikaz).length;

    if (brojKnjiga === 0) {
        grid.innerHTML = `<p class="nema-rezultata">Нема пронађених књига за задати критеријум.</p>`;
        return;
    }

    let nizKnjiga = [];
    if (Array.isArray(knjigeZaPrikaz)) {
        nizKnjiga = knjigeZaPrikaz;
    } else {
        for (let id in knjigeZaPrikaz) {
            nizKnjiga.push({ id: id, ...knjigeZaPrikaz[id] });
        }
    }

    nizKnjiga.forEach(knjiga => {
        let id = knjiga.id;
        let slikaUrl = (knjiga.slike && knjiga.slike.length > 0) ? knjiga.slike[0] : "https://via.placeholder.com/150x220?text=Nema+Slike";

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
    });
}

//pretrage
function pretraziKnjige() {
    let kriterijum = document.getElementById("kriterijum").value;
    let tekstPretrage = document.getElementById("pretraga").value.toLowerCase().trim();

    let nizKnjiga = [];
    for (let id in sveKnjige) {
        nizKnjiga.push({ id: id, ...sveKnjige[id] });
    }

    if (tekstPretrage !== "") {
        nizKnjiga = nizKnjiga.filter(knjiga => {
            let nazivKnjige = knjiga.naziv ? knjiga.naziv.toLowerCase() : "";
            let zanrKnjige = knjiga.zanr ? knjiga.zanr.toLowerCase() : "";

            if (kriterijum === "naslov") {
                return nazivKnjige.includes(tekstPretrage);
            } else if (kriterijum === "zanr") {
                return zanrKnjige.includes(tekstPretrage);
            } else if (!kriterijum || kriterijum === "cena-rastuce" || kriterijum === "cena-opadajuce") {
                return nazivKnjige.includes(tekstPretrage) || zanrKnjige.includes(tekstPretrage);
            }
            return false;
        });
    }

    if (kriterijum === "naslov") {
        nizKnjiga.sort((a, b) => (a.naziv || "").localeCompare(b.naziv || "", "sr-Cyrl"));
    } 
    else if (kriterijum === "zanr") {
        nizKnjiga.sort((a, b) => (a.zanr || "").localeCompare(b.zanr || "", "sr-Cyrl"));
    } 
    else if (kriterijum === "cena-rastuce") {
        nizKnjiga.sort((a, b) => Number(a.cena || 0) - Number(b.cena || 0));
    } 
    else if (kriterijum === "cena-opadajuce") {
        nizKnjiga.sort((a, b) => Number(b.cena || 0) - Number(a.cena || 0));
    }

    prikaziKnjige(nizKnjiga);
}

// Sve event listenere stavljamo ovde unutra da se pokrenu tek kad se HTML skroz ucita
document.addEventListener("DOMContentLoaded", () => {
    preuzmiKnjigeKatalog();

    const btnReset = document.getElementById("btn-reset");
    if (btnReset) {
        btnReset.addEventListener("click", function() {
            document.getElementById("kriterijum").selectedIndex = 0; 
            document.getElementById("pretraga").value = "";
            prikaziKnjige(sveKnjige); 
        });
    }

    const btnPretraga = document.querySelector(".btn-pretraga:not(#btn-reset)");
    if (btnPretraga) {
        btnPretraga.addEventListener("click", pretraziKnjige);
    }
    
    const selectKriterijum = document.getElementById("kriterijum");
    if (selectKriterijum) {
        selectKriterijum.addEventListener("change", pretraziKnjige);
    }
    
    const inputPretraga = document.getElementById("pretraga");
    if (inputPretraga) {
        inputPretraga.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                pretraziKnjige();
            }
        });
    }
});