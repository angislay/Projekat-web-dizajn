/* import {loginPrikaziTab} from '../login prozor.js';
 */let firebaseUrl="https://web-projekat-602fa-default-rtdb.firebaseio.com";
let autori={};
let knjige={};
let autor={};
let autor_id=null;
let sve_ocene={};
let prosjek=0;
let br=0;
let br_slike=0;
let ocjena=null;
let ocjena_id=null;
let prijavljeniKorisnikId = null;
let prijavljeniKorisnik = null;

const slika_con=document.getElementById("slika");
async function preuzmi_autora(){
    prijavljeniKorisnikId = localStorage.getItem("prijavljeniKorisnikId");
    prijavljeniKorisnik = JSON.parse(localStorage.getItem("prijavljeniKorisnik"));
    if (prijavljeniKorisnik) {
    console.log("Улогован је корисник:", prijavljeniKorisnik.ime);
    console.log("Његов ID је:", prijavljeniKorisnikId);
    
    // Овде пишеш код који користи његове податке (нпр. приказ имена на екрану)
    }    
    const parametri=new URLSearchParams(window.location.search);
    autor_id=parametri.get("id");
    const odg =await fetch(firebaseUrl+"/autori/"+autor_id+".json");
    autor =await odg.json() || {};
    const odg2=await fetch(firebaseUrl+'/knjige.json?orderBy="idAutora"&equalTo="'+autor_id+'"');
    knjige=await odg2.json() || {};
    const odg3=await fetch(firebaseUrl+'/ocene.json')
    sve_ocene=await odg3.json() || {};
    
    /* console.log(odg2.status);
console.log(knjige);
    console.log(typeof minus); */
    rac_prosjek();
    prikazi_autora();
}
function prikazi_autora(){
    const ime_con=document.getElementById("ime");
    ime_con.innerHTML=`Име: ${autor.ime}`;
    const prezime_con=document.getElementById("prezime");
    prezime_con.innerHTML=`Презиме: ${autor.prezime}`;
    const datum_con=document.getElementById("datum");
    datum_con.innerHTML=`Датум рођенја: ${autor.datumRodjenja}`;
    const status_con=document.getElementById("status");
    status_con.innerHTML=`Статус: ${autor.status}`;
    const nagrade_con=document.getElementById("nagrade");
    nagrade_con.innerHTML=`Број освојених награда: ${autor.brojOsvojenihNagrada}`;
    const primjerci_con=document.getElementById("primjerci");
    primjerci_con.innerHTML=`Број продатих примјеара: ${autor.brojProdatihPrimeraka}`;
    const kontakt_con=document.getElementById("kontakt");
    kontakt_con.innerHTML=`Контакт: ${autor.kontaktTelefonMenadzera}`;
    const prosjek_con=document.getElementById("prosjek")
    prosjek_con.innerHTML=`Просечна оцена: ${prosjek}`
    let slike=autor.slike||[];
    console.log(autor.slike);
    ucitaj_sliku();
    const bio_con=document.getElementById("bio");
    bio_con.innerHTML=`${autor.biografija}`;
    const knjige_con=document.getElementById("lista");
        console.log(knjige_con);

    knjige_con.innerHTML='';
    for(let knjiga_id in knjige){
        let knjiga=knjige[knjiga_id];
        knjige_con.innerHTML+=`
                    <a href="knjiga detaljno.html?${knjiga}">
                    ${knjiga.naziv}<br>`;

    }
    pronadji_ocjenu();
    
}
function pronadji_ocjenu(){
    if(!prijavljeniKorisnik){
        loginPrikaziTab("registracija");
        console.log("nema korisnika");
    }else{
        console.log("ima korisnik");
        for(let ocje in sve_ocene){
            let ocj=sve_ocene[ocje];
            if(ocj.idAutora==autor_id && ocj.idKorisnika==prijavljeniKorisnikId){
                ocjena=ocj;
                ocjena_id=ocje;
                break;
            }
        }
        if(ocjena){
            console.log("našli ocjenu");
            oboj_zvjezde(ocjena.vrednost);
        }
    }
}
function oboj_zvjezde(vrednost){
        const sveZvezde = document.querySelectorAll('.zvijezde .fa-star');
    sveZvezde.forEach(zvezda => {
        let vrednostZvezde = parseInt(zvezda.getAttribute('data-value'));
        if (vrednostZvezde <= vrednost) {
            zvezda.classList.add('popunjena_zvijezda');
        } else {
            zvezda.classList.remove('popunjena_zvijezda');
        }
    });
}

function rac_prosjek(){
    
    prosjek=0
    br=0
    for(let kljuc in sve_ocene){
        let tren_ocjena=sve_ocene[kljuc];

        if(tren_ocjena && tren_ocjena.idAutora === autor_id){
            prosjek=prosjek+tren_ocjena.vrednost;
            br++;
        }
    }
    if (br > 0) {
        prosjek = (prosjek / br).toFixed(1);
    } else {
        prosjek = 0;
    }

    console.log(prosjek);
}
function ucitaj_sliku(){
    slika_con.innerHTML=`
                <button onclick="minus()"><</button>
                <img src="${autor.slike[br_slike]}" alt="Нема доступне слике">
                <button onclick="plus()">></button>`;

}
function minus(){
    if(br_slike==0){
        br_slike=autor.slike.length -1;
    }else{
        br_slike=br_slike-1;
    }
    console.log("oduzet, br slike"+br_slike);
    ucitaj_sliku();
}
function plus(){
    br_slike=(br_slike+1)%autor.slike.length;
    console.log("dodat, br slike"+br_slike);
    ucitaj_sliku();
}
async function oceni(ocenaVrednost) {
    if(!prijavljeniKorisnik){
        loginPrikaziTab("prijava");
    }else{
    let metoda="POST";
    let url = firebaseUrl + "/ocene";
    console.log("postavi "+ocenaVrednost);
    
    oboj_zvjezde(ocenaVrednost);

    let nova_ocjena={
        datum:new Date().toISOString().split('T')[0],
        idAutora: autor_id, // Koji autor dobija ocenu
        idKorisnika: prijavljeniKorisnikId,  // Ko daje ocenu
        vrednost: ocenaVrednost
    };
    if (ocjena_id) {
        url += `/${ocjena_id}.json`;
        metoda = 'PUT'; 
    } else {
        url += '.json'; // Ako nema ID-ja, radimo standardni POST
    }
    try {
        const odg = await fetch(url, {
            method: metoda, 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nova_ocjena) // Pretvaramo JS objekat u tekst
        });

        if (odg.ok) {
            // Ponovo pokrećemo preuzimanje podataka sa servera
            // Ovo će automatski povući novu ocenu i osvežiti prosečnu ocenu na ekranu
            preuzmi_autora(); 
        } else {
            console.error("Greška sa odgovorom servera:", odg.statusText);
        }
    } catch (greska) {
        console.error("Грешка при упису оцене:", greska);
    }
    }
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


document.addEventListener("DOMContentLoaded",preuzmi_autora);