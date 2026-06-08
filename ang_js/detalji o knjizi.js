const firebaseUrl = "https://web-projekat-602fa-default-rtdb.firebaseio.com";

// Čita id knjige iz URL-a (?id=knj005)
function uzmiIdIzUrl() {
    return new URLSearchParams(window.location.search).get("id");
}

// ========================
//  UČITAVANJE KNJIGE
// ========================

async function ucitajPodatkeOKnjizi() {
    const idKnjige = uzmiIdIzUrl();
    if (!idKnjige) {
        document.getElementById("knjiga-naslov").innerText = "Није пронађен ID књиге у URL-у.";
        return;
    }

    try {
        const odg = await fetch(`${firebaseUrl}/knjige/${idKnjige}.json`);
        const knjiga = await odg.json();

        if (!knjiga) {
            document.getElementById("knjiga-naslov").innerText = "Књига није пронађена.";
            return;
        }

        // Osnovni podaci
        document.getElementById("knjiga-naslov").innerText = knjiga.naziv || "/";
        document.getElementById("knjiga-zanr").innerText = `Жанр: ${knjiga.zanr || "/"}`;
        document.getElementById("knjiga-isbn").innerText = `ISBN: ${knjiga.isbn || "/"}`;
        document.getElementById("knjiga-cena").innerText = `Цена: ${knjiga.cena ? knjiga.cena + " РСД" : "/"}`;
        document.getElementById("knjiga-opis").innerText = knjiga.opis || "Нема описа.";

        // Slika
        const slikaUrl = (knjiga.slike && knjiga.slike.length > 0) ? knjiga.slike[0] : "";
        document.getElementById("knjiga-slika").src = slikaUrl;

        // Autor — učitaj ime iz Firebase
        if (knjiga.idAutora) {
            ucitajAutora(knjiga.idAutora);
        }

        // Recenzije
        ucitajRecenzije(idKnjige);

    } catch (greska) {
        console.error("Грешка при учитавању књиге:", greska);
        document.getElementById("knjiga-naslov").innerText = "Грешка при учитавању.";
    }
}

// ========================
//  UČITAVANJE AUTORA
// ========================

async function ucitajAutora(idAutora) {
    try {
        const odg = await fetch(`${firebaseUrl}/autori/${idAutora}.json`);
        const autor = await odg.json();

        const autorEl = document.getElementById("knjiga-autor");
        if (autor) {
            autorEl.innerText = `${autor.ime} ${autor.prezime}`;
            autorEl.href = `autor.html?id=${idAutora}`;
        } else {
            autorEl.innerText = idAutora;
        }
    } catch (e) {
        console.error("Грешка при учитавању аутора:", e);
    }
}

// ========================
//  UČITAVANJE RECENZIJA
// ========================

async function ucitajRecenzije(idKnjige) {
    const kontejner = document.getElementById("komentari-kontejner");

    try {
        const odg = await fetch(`${firebaseUrl}/recenzije.json`);
        const sveRecenzije = await odg.json() || {};

        // Filtriraj samo recenzije za ovu knjigu
        const recenzijeKnjige = Object.values(sveRecenzije).filter(
            r => r.idKnjige === idKnjige
        );

        if (recenzijeKnjige.length === 0) {
            kontejner.innerHTML = `<p class="prazna-poruka">Нема рецензија за ову књигу.</p>`;
            return;
        }

        // Sortiraj od najnovije
        recenzijeKnjige.sort((a, b) => new Date(b.datum) - new Date(a.datum));

        kontejner.innerHTML = "";
        recenzijeKnjige.forEach(r => {
            const div = document.createElement("div");
            div.classList.add("komentar-kartica");
            div.innerHTML = `
                <div class="komentar-meta">
                    <span class="komentar-korisnik">👤 ${r.idKorisnika || "Анониман"}</span>
                    <span class="komentar-datum">${formatDatum(r.datum)}</span>
                </div>
                <p class="komentar-tekst">${r.tekst || ""}</p>
            `;
            kontejner.appendChild(div);
        });

    } catch (e) {
        console.error("Грешка при учитавању рецензија:", e);
        kontejner.innerHTML = `<p class="prazna-poruka">Грешка при учитавању рецензија.</p>`;
    }
}

function formatDatum(datum) {
    if (!datum) return "";
    const d = new Date(datum);
    return d.toLocaleDateString("sr-Latn", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// ========================
//  SLANJE RECENZIJE
// ========================

function inicijalizujFormuRecenzije() {
    const dugme = document.getElementById("btn-posalji-recenziju");
    const poruka = document.getElementById("recenzija-poruka");

    if (!dugme) return;

    dugme.addEventListener("click", () => {
        const tekst = document.getElementById("recenzija-tekst").value.trim();

        if (tekst === "") {
            prikaziPorukulokalno(poruka, "❌ Поље за рецензију не може бити празно.", "greska");
            return;
        }

        // Za DZ2 — validacija prolazi, upis u Firebase za finalnu odbranu
        prikaziPorukulokalno(poruka, "✅ Рецензија је валидирана. Упис у базу се ради на финалној одбрани.", "uspeh");
        document.getElementById("recenzija-tekst").value = "";
    });
}

function prikaziPorukulokalno(el, tekst, tip) {
    if (!el) return;
    el.textContent = tekst;
    el.className = "recenzija-poruka " + tip;
    setTimeout(() => { el.textContent = ""; el.className = "recenzija-poruka"; }, 4000);
}

// ========================
//  INIT
// ========================

document.addEventListener("DOMContentLoaded", () => {
    ucitajPodatkeOKnjizi();
    inicijalizujFormuRecenzije();
});