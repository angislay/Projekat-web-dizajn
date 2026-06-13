const firebaseUrl = "https://web-projekat-602fa-default-rtdb.firebaseio.com";

let sveKnjige = {};
let sviAutori = {};
let trenutniRezim = "dodaj";
let trenutniIdKnjige = null;
let idZaBrisanje = null;

//ucitavanje podataka iz baze

async function ucitajKnjige() {
    try {
        const odg = await fetch(`${firebaseUrl}/knjige.json`);
        sveKnjige = await odg.json() || {};
        prikaziTabelu();
    } catch (e) {
        document.getElementById("tabela-telo").innerHTML =
            `<tr><td colspan="6" style="text-align:center;color:red;">Грешка при учитавању базе.</td></tr>`;
    }
}

async function ucitajAutore() {
    try {
        const odg = await fetch(`${firebaseUrl}/autori.json`);
        sviAutori = await odg.json() || {};
        popuniSelectAutora();
    } catch (e) {
        console.error("Грешка при учитавању аутора:", e);
        popuniSelectAutora();
    }
}

// stvari za tabelu 

function prikaziTabelu() {
    const telo = document.getElementById("tabela-telo");
    telo.innerHTML = "";

    const kljucevi = Object.keys(sveKnjige);
    if (kljucevi.length === 0) {
        telo.innerHTML = `<tr><td colspan="6" style="text-align:center;">Нема књига у бази.</td></tr>`;
        return;
    }

    kljucevi.forEach(function(id) {
    const k = sveKnjige[id];
    const autor = sviAutori[k.idAutora]
        ? `${sviAutori[k.idAutora].ime} ${sviAutori[k.idAutora].prezime}`
        : k.idAutora || "/";

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${k.naziv || "/"}</td>
        <td>${autor}</td>
        <td>${k.zanr || "/"}</td>
        <td>${k.cena ? k.cena + " РСД" : "/"}</td>
        <td>${k.isbn || "/"}</td>
        <td class="akcije">
            <button class="btn-izmeni" onclick="otvoriFormuZaIzmenu('${id}')">Измени</button>
            <button class="btn-obrisi" onclick="otvoriBrisanje('${id}')">Обриши</button>
        </td>`;
    telo.appendChild(tr);
});
}



function popuniSelectAutora() {
    const sel = document.getElementById("autor_knjige");
    sel.innerHTML = "";
    Object.keys(sviAutori).forEach(id => {
        const a = sviAutori[id];
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = `${a.ime} ${a.prezime}`;
        sel.appendChild(opt);
    });
}



function otvoriFormu(rezim) {
    trenutniRezim = rezim;
    ocistiGreske();

    if (rezim === "dodaj") {
        document.getElementById("knjiga-naslov-forme").textContent = "Додавање нове књиге";
        ocistiFormu();
        trenutniIdKnjige = null;
    }

    document.getElementById("modal-knjiga").style.display = "flex";
}

function otvoriFormuZaIzmenu(id) {
    trenutniIdKnjige = id;
    const k = sveKnjige[id];
    if (!k) return;

    document.getElementById("knjiga-naslov-forme").textContent = "Измена књиге";
    ocistiGreske();

    document.getElementById("naslov_knjige").value = k.naziv || "";
    document.getElementById("opis_knjige").value = k.opis || "";
    document.getElementById("zanr_knjige").value = k.zanr || "";
    document.getElementById("cena_knjige").value = k.cena || "";
    document.getElementById("strane_knjige").value = k.brojStrana || "";
    document.getElementById("isbn_knjige").value = k.isbn || "";
    document.getElementById("slike_knjige").value = k.slike ? k.slike.join(", ") : "";

    const formatSel = document.getElementById("format_knjige");
    for (let opt of formatSel.options) {
        if (opt.value === k.format) { opt.selected = true; break; }
    }

    const autorSel = document.getElementById("autor_knjige");
    for (let opt of autorSel.options) {
        if (opt.value === k.idAutora) { opt.selected = true; break; }
    }

    trenutniRezim = "izmeni";
    document.getElementById("modal-knjiga").style.display = "flex";
}

function zatvoriFormu() {
    document.getElementById("modal-knjiga").style.display = "none";
    ocistiFormu();
    ocistiGreske();
    trenutniIdKnjige = null;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("modal-knjiga").addEventListener("click", function(e) {
        if (e.target === this) zatvoriFormu();
    });
});

function ocistiFormu() {
    document.getElementById("naslov_knjige").value = "";
    document.getElementById("opis_knjige").value = "";
    document.getElementById("zanr_knjige").value = "";
    document.getElementById("cena_knjige").value = "";
    document.getElementById("strane_knjige").value = "";
    document.getElementById("isbn_knjige").value = "";
    document.getElementById("slike_knjige").value = "";
    document.getElementById("format_knjige").selectedIndex = 0;
    if (document.getElementById("autor_knjige").options.length > 0)
        document.getElementById("autor_knjige").selectedIndex = 0;
}


function validanISBN(vrednost) {
    const samoCifre = vrednost.replace(/-/g, "");
    return /^(978|979)\d{10}$/.test(samoCifre);
}

function prikaziGresku(id, poruka) {
    document.getElementById(id).textContent = poruka;
}

function ocistiGreske() {
    ["gr-naslov", "gr-zanr", "gr-cena", "gr-strane", "gr-isbn"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });
}

function validirajFormu() {
    ocistiGreske();
    let ispravno = true;

    const naslov = document.getElementById("naslov_knjige").value.trim();
    if (!naslov) {
        prikaziGresku("gr-naslov", "— Наслов је обавезан");
        ispravno = false;
    }

    const zanr = document.getElementById("zanr_knjige").value.trim();
    if (!zanr) {
        prikaziGresku("gr-zanr", "— Жанр је обавезан");
        ispravno = false;
    }

    const cena = document.getElementById("cena_knjige").value;
    if (!cena || isNaN(cena) || Number(cena) < 0) {
        prikaziGresku("gr-cena", "— Унесите исправну цену");
        ispravno = false;
    }

    const strane = document.getElementById("strane_knjige").value;
    if (!strane || isNaN(strane) || Number(strane) < 1) {
        prikaziGresku("gr-strane", "— Унесите исправан број страна");
        ispravno = false;
    }

    const isbn = document.getElementById("isbn_knjige").value.trim();
    if (!isbn || !validanISBN(isbn)) {
        prikaziGresku("gr-isbn", "— ISBN мора имати 13 цифара и почети са 978 или 979");
        ispravno = false;
    }

    return ispravno;
}



function sacuvajKnjigu() {
    if (!validirajFormu()) return;

    const novaKnjiga = {
        naziv: document.getElementById("naslov_knjige").value.trim(),
        opis: document.getElementById("opis_knjige").value.trim(),
        zanr: document.getElementById("zanr_knjige").value.trim(),
        format: document.getElementById("format_knjige").value,
        cena: Number(document.getElementById("cena_knjige").value),
        brojStrana: Number(document.getElementById("strane_knjige").value),
        isbn: document.getElementById("isbn_knjige").value.trim(),
        idAutora: document.getElementById("autor_knjige").value,
        slike: document.getElementById("slike_knjige").value
            .split(",")
            .map(s => s.trim())
            .filter(s => s !== "")
    };

    if (trenutniRezim === "izmeni" && trenutniIdKnjige) {
        sveKnjige[trenutniIdKnjige] = { ...sveKnjige[trenutniIdKnjige], ...novaKnjiga };
        prikaziTabelu();
        zatvoriFormu();
        prikaziPoruku("✅ Измена је успешно сачувана (локално).");
    } else {
        const noviId = "knj_novo_" + Date.now();
        sveKnjige[noviId] = novaKnjiga;
        prikaziTabelu();
        zatvoriFormu();
        prikaziPoruku("✅ Нова књига је додата (локално).");
    }
}

function prikaziPoruku(tekst) {
    let poruka = document.getElementById("flash-poruka");
    if (!poruka) {
        poruka = document.createElement("p");
        poruka.id = "flash-poruka";
        poruka.style.cssText = "color:#4caf50;font-weight:bold;margin:10px 20px;";
        document.querySelector("main").prepend(poruka);
    }
    poruka.textContent = tekst;
    setTimeout(() => { poruka.textContent = ""; }, 4000);
}


function otvoriBrisanje(id) {
    idZaBrisanje = id;
    const k = sveKnjige[id];
    document.getElementById("dijalog-naziv").textContent = k ? k.naziv : id;
    document.getElementById("dijalog-brisanje").style.display = "flex";
}

function zatvoriDijalog() {
    idZaBrisanje = null;
    document.getElementById("dijalog-brisanje").style.display = "none";
}

function potvrdiObrisanje() {
    if (!idZaBrisanje) return;
    delete sveKnjige[idZaBrisanje];
    prikaziTabelu();
    zatvoriDijalog();
    prikaziPoruku("✅ Књига је обрисана (локално).");
}



document.addEventListener("DOMContentLoaded", async () => {
    await ucitajAutore();
    await ucitajKnjige();
}); 