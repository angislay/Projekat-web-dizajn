let resizeTimer;

function padajuci_meni(){
    const padajuci_meni=document.querySelector(".padajuci_meni");
    padajuci_meni.classList.toggle("open");
}
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
function dodjela_indeksa_padajuci_meni(){
    let meni = document.querySelectorAll(".padajuci_meni li");

    for(let i=0;i<meni.length;i++){
        meni[i].style.setProperty("--i", i+1);
    }
}
dodjela_indeksa_padajuci_meni();