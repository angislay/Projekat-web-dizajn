let firebaseUrl="https://web-projekat-602fa-default-rtdb.firebaseio.com";
let autori={};
let knjige={};
let autor={};
let br_slike=0;

const slika_con=document.getElementById("slika");
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
    console.log(typeof minus);
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
