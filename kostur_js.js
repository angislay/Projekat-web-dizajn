const nav_padajuci_meni=document.querySelector(".nav_padajuci_meni");
const hamburger_dugme=document.querySelector(".hamburger_dugme");
let resizeTimer;

function prikaziTab(tab) {
    document.querySelectorAll('.tab').forEach(el => {
        el.classList.remove('aktivan');
    });

    document.querySelector('.' + tab).classList.add('aktivan');
}

// pocetni tab
prikaziTab('recenzije');
window.addEventListener("resize",()=>{
    /* pretvara sve elemente od body u elemente koji imaju
    .resize klasu iznad njih, ovime se sprecava prikazivanje
    tranzicija koje treba da se dese samo prilikom klika */
    document.body.classList.add("resize");
    /* svaki put kada se pokrene ovaj event listener tajmer
    se resetuje */
    clearTimeout(resizeTimer);
    /* ako prođe 150ms bez ponovnog poziva, izvrsava se kod iz 
    zagrade */
    resizeTimer=setTimeout(()=>{
        document.body.classList.remove("resize");
    },150);
    /* ova funkcija se momentalno primjenjuje na sve elemente od
    body, samo u css treba napraviti .resize .element{} 
    kako bi imala efekta */
});

hamburger_dugme.addEventListener("click",()=>{
    nav_padajuci_meni.classList.toggle("open");
});

/* 
function otvori_nav_padajuci_meni(){
/*     provjerava da li je padajuci meni otvoren ili ne,
    pa ga mijenja u obrnuto, funkcija povezana sa dugmetom hamburger */
 /*    if(nav_padajuci_meni.style.display === "inline"){
        nav_padajuci_meni.style.display="none";
    }
    else{
        nav_padajuci_meni.style.display="inline";
    }
} */ 