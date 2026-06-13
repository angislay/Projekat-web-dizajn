let firebaseUrl="https://web-projekat-602fa-default-rtdb.firebaseio.com";
let prijavljeniKorisnikId = null;
let prijavljeniKorisnik = null;
let ocjene=[]
let autori={}
let knjige = {};
let recenzije = [];
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
        const odgKnjige = await fetch(firebaseUrl + "/knjige.json");
knjige = await odgKnjige.json() || {};

const odgRecenzije = await fetch(firebaseUrl + "/recenzije.json");
const sveRecenzije = await odgRecenzije.json() || {};

recenzije = [];
for (let kljuc in sveRecenzije) {
    let rec = sveRecenzije[kljuc];
    if (rec.idKorisnika === prijavljeniKorisnikId) {
        recenzije.push(rec);
    }
}
recenzije.sort((a, b) => new Date(b.datum) - new Date(a.datum));
        upisi_podatke()    
        upisi_ocjene()
        upisi_recenzije()
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
function upisi_recenzije() {
    const div = document.querySelector(".recenzije.tab");

    if (recenzije.length === 0) {
        div.innerHTML = `<div style="padding:1rem; font-style:italic; opacity:0.7;">Нисте написали ниједну рецензију.</div>`;
        return;
    }

    let html = "";
    recenzije.forEach(rec => {
        const knjiga = knjige[rec.idKnjige];
        const naslov = knjiga ? knjiga.naziv : rec.idKnjige;
        const datum = new Date(rec.datum).toLocaleDateString("sr-Latn", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });

        html += `
            <div class="recenzija">
                <h3><a href="knjiga detaljno.html?id=${rec.idKnjige}">${naslov}</a></h3>
                <p>${rec.tekst}</p>
                <p class="meta">📅 ${datum}</p>
            </div>`;
    });

    div.innerHTML = html;
}