const firebaseUrlLogin = "https://web-projekat-602fa-default-rtdb.firebaseio.com";

function otvoriLoginModal() {
    document.getElementById("login-modal").style.display = "flex";
    loginPrikaziTab("prijava");
    ocistiLoginFormu();
}

function zatvoriLoginModal() {
    document.getElementById("login-modal").style.display = "none";
}

function loginPrikaziTab(tab) {
    if (tab === "prijava") {
        document.getElementById("sekcija-prijava").style.display = "block";
        document.getElementById("tab-prijava").classList.add("aktivan");
    } else {
        document.getElementById("sekcija-prijava").style.display = "none";
        document.getElementById("tab-prijava").classList.remove("aktivan");
    }

    if (tab === "registracija") {
        document.getElementById("sekcija-registracija").style.display = "block";
        document.getElementById("tab-registracija").classList.add("aktivan");
    } else {
        document.getElementById("sekcija-registracija").style.display = "none";
        document.getElementById("tab-registracija").classList.remove("aktivan");
    }
}

function ocistiLoginFormu() {
    ["prijava-korisnicko-ime", "prijava-lozinka",
     "reg-ime", "reg-prezime", "reg-korisnicko-ime", "reg-email",
     "reg-lozinka", "reg-datum", "reg-adresa", "reg-zanimanje"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    ["gr-prijava-ime", "gr-prijava-lozinka", "gr-prijava-opsta",
     "gr-reg-ime", "gr-reg-prezime", "gr-reg-korisnicko", "gr-reg-email",
     "gr-reg-lozinka", "gr-reg-datum", "gr-reg-adresa", "gr-reg-opsta",
     "uspeh-prijava", "uspeh-registracija"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });
}

///prijava korisnika

async function prijaviKorisnika() {
    const korisnickoIme = document.getElementById("prijava-korisnicko-ime").value.trim();
    const lozinka = document.getElementById("prijava-lozinka").value;
    let ok = true;

    document.getElementById("gr-prijava-ime").textContent = "";
    document.getElementById("gr-prijava-lozinka").textContent = "";
    document.getElementById("gr-prijava-opsta").textContent = "";

    if (!korisnickoIme) {
        document.getElementById("gr-prijava-ime").textContent = "Корисничко име је обавезно";
        ok = false;
    }
    if (!lozinka) {
        document.getElementById("gr-prijava-lozinka").textContent = "Лозинка је обавезна";
        ok = false;
    }
    if (!ok) return;

    try {
        const odg = await fetch(`${firebaseUrlLogin}/korisnici.json`);
        const sviKorisnici = await odg.json() || {};

        const pronadjen = Object.entries(sviKorisnici).find(
            ([id, k]) => k.korisnickoIme === korisnickoIme && k.lozinka === lozinka
        );

        if (!pronadjen) {
            document.getElementById("gr-prijava-opsta").textContent = "❌ Погрешно корисничко име или лозинка.";
            return;
        }

        const [id, korisnik] = pronadjen;
        localStorage.setItem("prijavljeniKorisnikId", id);
        localStorage.setItem("prijavljeniKorisnik", JSON.stringify(korisnik));

        document.getElementById("uspeh-prijava").textContent = `✅ Добродошли, ${korisnik.ime}!`;
        azurirajDugmePrijave(korisnik);
        window.location.href = "profil.html";
        setTimeout(() => zatvoriLoginModal(), 1200);

    } catch (e) {
        document.getElementById("gr-prijava-opsta").textContent = "❌ Грешка при повезивању са базом.";
    }
}

// ========================
//  Registracijaaaaa
// ========================

async function registrujKorisnika() {
    const ime = document.getElementById("reg-ime").value.trim();
    const prezime = document.getElementById("reg-prezime").value.trim();
    const korisnickoIme = document.getElementById("reg-korisnicko-ime").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const lozinka = document.getElementById("reg-lozinka").value;
    const datum = document.getElementById("reg-datum").value;
    const adresa = document.getElementById("reg-adresa").value.trim();
    const zanimanje = document.getElementById("reg-zanimanje").value.trim();

    ["gr-reg-ime","gr-reg-prezime","gr-reg-korisnicko","gr-reg-email",
     "gr-reg-lozinka","gr-reg-datum","gr-reg-adresa","gr-reg-opsta"].forEach(id => {
        document.getElementById(id).textContent = "";
    });

    let ok = true;
    if (!ime)           { document.getElementById("gr-reg-ime").textContent = "Обавезно поље"; ok = false; }
    if (!prezime)       { document.getElementById("gr-reg-prezime").textContent = "Обавезно поље"; ok = false; }
    if (!korisnickoIme) { document.getElementById("gr-reg-korisnicko").textContent = "Обавезно поље"; ok = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("gr-reg-email").textContent = "Унесите исправан email"; ok = false;
    }
    if (!lozinka || lozinka.length < 4) {
        document.getElementById("gr-reg-lozinka").textContent = "Минимум 4 карактера"; ok = false;
    }
    if (!datum)         { document.getElementById("gr-reg-datum").textContent = "Обавезно поље"; ok = false; }
    if (!adresa)        { document.getElementById("gr-reg-adresa").textContent = "Обавезно поље"; ok = false; }
    if (!ok) return;

    try {
        // provera da korisnicko ime vec ne postoji u bazi
        const odgSvi = await fetch(`${firebaseUrlLogin}/korisnici.json`);
        const sviKorisnici = await odgSvi.json() || {};

        const postoji = Object.values(sviKorisnici).some(
            k => k.korisnickoIme === korisnickoIme
        );

        if (postoji) {
            document.getElementById("gr-reg-korisnicko").textContent = "Ово корисничко име је већ заузето";
            return;
        }

        const noviKorisnik = {
            ime: ime,
            prezime: prezime,
            korisnickoIme: korisnickoIme,
            email: email,
            lozinka: lozinka,
            datumRodjenja: datum,
            adresa: adresa,
            zanimanje: zanimanje
        };

        const odg = await fetch(`${firebaseUrlLogin}/korisnici.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(noviKorisnik)
        });

        if (odg.ok) {
            const odgovorBaze = await odg.json();
            const noviId = odgovorBaze.name;

            localStorage.setItem("prijavljeniKorisnikId", noviId);
            localStorage.setItem("prijavljeniKorisnik", JSON.stringify(noviKorisnik));

            document.getElementById("uspeh-registracija").textContent = `✅ Регистрација успешна. Добродошли, ${ime}!`;
            azurirajDugmePrijave(noviKorisnik);

            setTimeout(() => {
                zatvoriLoginModal();
                window.location.href = "profil.html";
            }, 1200);
        } else {
            document.getElementById("gr-reg-opsta").textContent = "❌ Грешка при упису у базу.";
        }
    } catch (e) {
        console.error("Грешка при регистрацији:", e);
        document.getElementById("gr-reg-opsta").textContent = "❌ Грешка при повезивању са базом.";
    }
}

// ========================
//  dugme prijave i odjave
// ========================

// Pravi padajuci meni (Profil / Odjavi se) pored dugmeta na koje je vezan
function napraviKorisnickiMeni(btn, korisnik) {
    // ako vec postoji meni pored ovog dugmeta, ne pravimo duplikat
    let meni = btn.parentElement.querySelector(".korisnicki-meni");
    if (meni) {
        meni.remove();
    }

    meni = document.createElement("div");
    meni.className = "korisnicki-meni";
    meni.style.display = "none";
    meni.innerHTML = `
        <a href="profil.html" class="korisnicki-meni-stavka">👤 Профил</a>
        <button type="button" class="korisnicki-meni-stavka korisnicki-meni-odjava">🚪 Одјави се</button>
    `;

    // omotac da dugme i meni budu pozicionirani zajedno
    if (!btn.parentElement.classList.contains("korisnicki-meni-omotac")) {
        const omotac = document.createElement("div");
        omotac.className = "korisnicki-meni-omotac";
        btn.parentElement.insertBefore(omotac, btn);
        omotac.appendChild(btn);
        omotac.appendChild(meni);
    } else {
        btn.parentElement.appendChild(meni);
    }

    meni.querySelector(".korisnicki-meni-odjava").addEventListener("click", (e) => {
        e.stopPropagation();
        odjavaKorisnika();
    });

    return meni;
}

function ukloniKorisnickiMeni(btn) {
    const omotac = btn.parentElement;
    const meni = omotac.querySelector && omotac.querySelector(".korisnicki-meni");
    if (meni) meni.remove();
}

function azurirajDugmePrijave(korisnik) {
    document.querySelectorAll(".login-btn").forEach(btn => {
        if (btn.textContent.trim() === "Пријава" || btn.dataset.loginBtn === "true") {
            btn.dataset.loginBtn = "true";

            if (korisnik) {
                btn.textContent = `👤 ${korisnik.ime}`;
                btn.onclick = null;
                btn.removeEventListener("click", otvoriLoginModal);

                const meni = napraviKorisnickiMeni(btn, korisnik);

                // klik na dugme otvara/zatvara meni (umesto login modala)
                btn.addEventListener("click", function noviKlik(e) {
                    e.stopPropagation();
                    meni.style.display = meni.style.display === "none" ? "block" : "none";
                });
            } else {
                btn.textContent = "Пријава";
                ukloniKorisnickiMeni(btn);
                btn.addEventListener("click", otvoriLoginModal);
            }
        }
    });
}

function odjavaKorisnika() {
    localStorage.removeItem("prijavljeniKorisnikId");
    localStorage.removeItem("prijavljeniKorisnik");
    window.location.href = "katalog knjiga.html";
}



document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login-modal").addEventListener("click", function(e) {
        if (e.target === this) zatvoriLoginModal();
    });

    // zatvara padajuci korisnicki meni kad se klikne bilo gde drugo na stranici
    document.addEventListener("click", () => {
        document.querySelectorAll(".korisnicki-meni").forEach(meni => {
            meni.style.display = "none";
        });
    });

    const sacuvan = localStorage.getItem("prijavljeniKorisnik");
    if (sacuvan) {
        // korisnik je prijavljen — azurirajDugmePrijave ce sama postaviti
        // ispravan klik listener (otvaranje padajuceg menija)
        azurirajDugmePrijave(JSON.parse(sacuvan));
    } else {
        // niko nije prijavljen — dugme otvara login modal
        document.querySelectorAll(".login-btn").forEach(btn => {
            if (btn.textContent.trim() === "Пријава") {
                btn.dataset.loginBtn = "true";
                btn.addEventListener("click", otvoriLoginModal);
            }
        });
    }
});