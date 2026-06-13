let firebaseUrl="https://web-projekat-602fa-default-rtdb.firebaseio.com";
let prijavljeniKorisnikId = null;
let prijavljeniKorisnik = null;
let ocjene=[]
let autori={}
// 3. Провера да ли је корисник уопште улогован
if (prijavljeniKorisnik) {
    console.log("Улогован је корисник:", prijavljeniKorisnik.ime);
    console.log("Његов ID је:", prijavljeniKorisnikId);
    
    // Овде пишеш код који користи његове податке (нпр. приказ имена на екрану)
} else {
    console.log("Ниједан корисник није улогован.");
    console.log("корисник:", prijavljeniKorisnik);
    console.log("ID је:", prijavljeniKorisnikId);
    // Овде можеш нпр. да га преусмериш на почетну страницу ако је ова страница закључана
}
function prikaziTab(tab) {
    document.querySelectorAll('.tab').forEach(el => {
        el.classList.remove('aktivan');
    });

    document.querySelector('.' + tab).classList.add('aktivan');
}
async function preuzmi_podatke() {
    prijavljeniKorisnikId = localStorage.getItem("prijavljeniKorisnikId");
    prijavljeniKorisnik = JSON.parse(localStorage.getItem("prijavljeniKorisnik"));
    if (prijavljeniKorisnikId){
            
        const odg1=await fetch(firebaseUrl+"/autori.json");
        autori=await odg1.json() || {};
        const odg=await fetch(firebaseUrl+'/ocene.json');
        let sve_ocjene=await odg.json() || {};
        ocjene=[]
        for(let kljuc in sve_ocjene){
            let ocj=sve_ocjene[kljuc]
            if(ocj.idKorisnika==prijavljeniKorisnikId){
                ocjene.push(ocj);
            }
        }   
        console.log(ocjene)
        upisi_podatke()    
        upisi_ocjene()
    }
}
function upisi_podatke(){
    const username = document.getElementById("username");
    const ime = document.getElementById("ime");
    const prezime = document.getElementById("prezime");
    const email = document.getElementById("email");
    const datum = document.getElementById("datum");
    const adresa = document.getElementById("adresa");
     
    username.innerHTML = `<b>Корисничко име:</b> <i>${prijavljeniKorisnik.korisnickoIme}</i>`;
    ime.innerHTML = `<b>Име:</b> <i>${prijavljeniKorisnik.ime}</i>`;
    prezime.innerHTML = `<b>Презиме:</b> <i>${prijavljeniKorisnik.prezime}</i>`;
    email.innerHTML = `<b>Eмаил:</b> <i>${prijavljeniKorisnik.email}</i>`;
    datum.innerHTML = `<b>Датум рођења:</b> <i>${prijavljeniKorisnik.datumRodjenja}</i>`;
    adresa.innerHTML = `<b>Адреса:</b> <i>${prijavljeniKorisnik.adresa}</i>`;
}
function upisi_ocjene(){
    const div=document.querySelector(".ocjene.tab")
    text=""
    if(ocjene.length==0){
        text=`<div class="ocjena">Нисте оценили никога</div>`;
    }
    else{
        ocjene.forEach(ocj=>{
            let autor=autori[ocj.idAutora];
            text+=`<div class="ocjena">
                    <a href="autor.html?id=${ocj.idAutora}"><strong>${autor.ime} ${autor.prezime}</strong></a>
                    <div class="zvijezde">`
            for(let i=1;i<=5;i++){
                if(i<=ocj.vrednost){
                    text+=`<span class="fa fa-star popunjena_zvijezda"></span>`; 
                }
                else{
                    text+=`<span class="fa fa-star "></span>`;
                }
            }
            text+=`</div></div>`
        });
    }
    div.innerHTML=text;
}
document.addEventListener("DOMContentLoaded",preuzmi_podatke);
window.addEventListener("storage", function(e) {
    if (e.key === "prijavljeniKorisnikId") {
        location.reload(); // Освежава страницу чим се промени ID корисника
    }
});