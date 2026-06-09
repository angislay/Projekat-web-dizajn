let firebaseUrl="https://web-projekat-602fa-default-rtdb.firebaseio.com";
let autori={};
let knjige={};
let autor={};
let prosjek=0;
let br=0;
let br_slike=0;

const slika_con=document.getElementById("slika");
async function preuzmi_autora(){
    const parametri=new URLSearchParams(window.location.search);
    let autor_id=parametri.get("id");
    const odg =await fetch(firebaseUrl+"/autori/"+autor_id+".json");
    autor =await odg.json() || {};
    const odg2=await fetch(firebaseUrl+'/knjige.json?orderBy="idAutora"&equalTo="'+autor_id+'"');
    knjige=await odg2.json() || {};
    const odg3=await fetch(firebaseUrl+'/ocene.json')
    let sve_ocene=await odg3.json() || {};
    
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
    /* console.log(odg2.status);
console.log(knjige);
    console.log(typeof minus); */
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
    prosjek_con.innerHTML=`Просечна оцена: ${prosjek} `
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
async function oceni(ocenaVrednost) {
    const parametri = new URLSearchParams(window.location.search);
    let autor_id = parametri.get("id");
    
    // 1. Визуелно бојење звезда у интерфејсу
    const sveZvezde = document.querySelectorAll('.zvijezde .fa-star');
    
    sveZvezde.forEach(zvezda => {
        let vrednostZvezde = parseInt(zvezda.getAttribute('data-value'));
        
        if (vrednostZvezde <= ocenaVrednost) {
            zvezda.classList.add('popunjena_zvijezda');
        } else {
            zvezda.classList.remove('popunjena_zvijezda');
        }
    });
/* 
    // 2. Спремање новог објекта оцене у Firebase
    let novaOcena = {
        datum: new Date().toISOString().split('T')[0], // Уписује данашњи датум у формату ГГГГ-ММ-ДД
        idAutora: autor_id,
        idKorisnika: "kor001", 
        vrednost: ocenaVrednost
    };

    try {
        const odg = await fetch(firebaseUrl + '/ocene.json', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaOcena)
        });

        if (odg.ok) {
            alert("Успешно сте оценили аутора оценом " + ocenaVrednost);
            preuzmi_autora(); 
        }
    } catch (greska) {
        console.error("Грешка при упису оцене:", greska);
    } */
}
document.addEventListener("DOMContentLoaded",preuzmi_autora);