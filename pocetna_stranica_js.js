const nav_padajuci_meni=document.querySelector(".nav_padajuci_meni")

function otvori_nav_padajuci_meni(){
/*     provjerava da li je padajuci meni otvoren ili ne,
    pa ga mijenja u obrnuto, funkcija povezana sa dugmetom hamburger */
    if(nav_padajuci_meni.style.display === "inline"){
        nav_padajuci_meni.style.display="none";
    }
    else{
        nav_padajuci_meni.style.display="inline";
    }
}