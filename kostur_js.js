const nav_padajuci_meni=document.querySelector(".nav_padajuci_meni");
const hamburger_dugme=document.querySelector(".hamburger_dugme");
let resizeTimer;
let autori=[];
let knjige=[];
let korisnici=[];
let ocjene=[];
let recenzije=[];
async function preuzimanjePodatakaBaza() {
    try{
        const odg = await fetch('./data2026.json');
        const podaci=await odg.json();

        autori=podaci.autori || [];//niz autora ili prazan niz
        knjige=podaci.knjige || [];//jer ako u data.json ne postoji ovaj niz
        korisnici=podaci.korisnici || [];//dobice vrijednost undefined
        recenzije=podaci.recenzije || [];//to poslije pravi probleme u kodu
        ocjene=podaci.ocjene || [];//gdje se očekuje niz, a ne jedna vrijednost
    }catch(error){
        console.error("Problem sa povezivanjem sa bazom");
    }
}
//poziva preuzimanje podataka kad se pređe sa stranice na stranicu?
document.addEventListener('DOMContentLoaded',preuzimanjePodatakaBaza());
function prikaziTab(tab) {
    document.querySelectorAll('.tab').forEach(el => {
        el.classList.remove('aktivan');
    });

    document.querySelector('.' + tab).classList.add('aktivan');
}
function popUp(){
    let pop_up_prozor= document.querySelector('.izmjena');
    if(pop_up_prozor.style.opacity==='none' || pop_up_prozor.style.display===''){
        pop_up_prozor.style.display='flex';
    }
    else{
        pop_up_prozor.style.display='none';
    }
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