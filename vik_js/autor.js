let firebaseUrl="https://web-projekat-602fa-default-rtdb.firebaseio.com";
let autori={};
let knjige={};
let autor={};
async function preuzmi_autora(){
    const parametri=new URLSearchParams(window.location.search);
    let autor_id=parametri.get("id");
    const odg =await fetch(firebaseUrl+"/autori/"+autor_id+".json");
    autor =await odg.json() || {};
    const odg2=await fetch(firebaseUrl+'/knjige.json?orderBy="idAutora"&equalTo="'+autor_id+'"');
    knjige=await odg2.json() || {};
    console.log(odg2.status);
console.log(knjige);
    prikazi_autora();
}
function prikazi_autora(){
    const ime_con=document.getElementById("ime");
    ime_con.innerHTML=`${autor.ime}`;
    const prezime_con=document.getElementById("prezime");
    prezime_con.innerHTML=`${autor.prezime}`;
    const datum_con=document.getElementById("datum");
    datum_con.innerHTML=`${autor.datumRodjenja}`;
    const status_con=document.getElementById("status");
    status_con.innerHTML=`${autor.status}`;
    const nagrade_con=document.getElementById("nagrade");
    nagrade_con.innerHTML=`${autor.brojOsvojenihNagrada}`;
    const primjerci_con=document.getElementById("primjerci");
    primjerci_con.innerHTML=`${autor.brojProdatihPrimeraka}`;
    const kontakt_con=document.getElementById("kontakt");
    kontakt_con.innerHTML=`${autor.kontaktTelefonMenadzera}`;

    const slika_con=document.getElementById("slika");
    let slike=autor.slike||[];
    slika_con.innerHTML=`
                <button id="minus"><</button>
                <img src="${slike[0]}" alt="Нема доступне слике">
                <button id="plus">></button>`;

    const bio_con=document.getElementById("bio");
    bio_con.innerHTML=`${autor.biografija}`;
    const knjige_con=document.getElementById("knjige");
    knjige_con.innerHTML='';
    for(let knjiga_id in knjige){
        let knjiga=knjige[knjiga_id];
        knjige_con.innerHTML+=`
                    <a href="knjiga detaljno.html?${knjiga}">
                    ${knjiga.naziv}<br>`;

    }
    
}
document.addEventListener("DOMContentLoaded",preuzmi_autora);
