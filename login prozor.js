

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

    document.getElementById("uspeh-registracija").textContent = "✅ Регистрација валидирана. Упис у базу се ради на финалној одбрани.";
}

// ========================
//  dugme prijave i odjave
// ========================

function azurirajDugmePrijave(korisnik) {
    document.querySelectorAll(".login-btn").forEach(btn => {
        if (btn.textContent === "Пријава" || btn.dataset.loginBtn === "true") {
            btn.textContent = korisnik ? `👤 ${korisnik.ime}` : "Пријава";
            btn.dataset.loginBtn = "true";
        }
    });
}

function odjavaKorisnika() {
    localStorage.removeItem("prijavljeniKorisnikId");
    localStorage.removeItem("prijavljeniKorisnik");
    document.querySelectorAll(".login-btn[data-login-btn='true']").forEach(btn => {
        btn.textContent = "Пријава";
    });
}



document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login-modal").addEventListener("click", function(e) {
        if (e.target === this) zatvoriLoginModal();
    });

    document.querySelectorAll(".login-btn").forEach(btn => {
        if (btn.textContent.trim() === "Пријава") {
            btn.dataset.loginBtn = "true";
            btn.addEventListener("click", otvoriLoginModal);
        }
    });

    const sacuvan = localStorage.getItem("prijavljeniKorisnik");
    if (sacuvan) {
        azurirajDugmePrijave(JSON.parse(sacuvan));
    }
});