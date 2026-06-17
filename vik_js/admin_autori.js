let firebaseUrl="https://web-projekat-602fa-default-rtdb.firebaseio.com";
let autori={};
let trenutni_autor_id = null;
const prozor=document.querySelector(".izmjena");


async function preuzmi_autore(){
    const odg=await fetch(firebaseUrl+"/autori.json");
    autori=await odg.json() || {};
    listaj_autore();
}
function pop_up(autor_id){
    if(autor_id && autori[autor_id]){
        let autor=autori[autor_id];
        trenutni_autor_id = autor_id;
        document.getElementById("unos_ime").value=autor.ime;
        document.getElementById("unos_prezime").value=autor.prezime;
        document.getElementById("unos_status").value=autor.status;
        document.getElementById("unos_datum").value=autor.datumRodjenja;
        document.getElementById("unos_nagrade").value=autor.brojOsvojenihNagrada;
        document.getElementById("unos_primjerci").value=autor.brojProdatihPrimeraka;
        document.getElementById("unos_kontakt").value=autor.kontaktTelefonMenadzera;
        document.getElementById("unos_bio").value=autor.biografija;
        let tekst_slika="";
        for(let i=0;i<autor.slike.length;i++){
            tekst_slika+=autor.slike[i];
            if(i<autor.slike.length-1){
                tekst_slika+=", ";
            }
        }
        console.log(autor.slike);
        console.log(tekst_slika);
        document.getElementById("unos_slike").value=tekst_slika;
            
    }

    prozor.classList.toggle("open");
}
function listaj_autore(){
    let lista=document.getElementById("lista");
    lista.innerHTML="";
    for(let autor_id in autori){
        let autor=autori[autor_id];
        lista.innerHTML+=`
            <div class="element">
                <a href="autor.html?id=${autor_id}"><strong>${autor.ime} ${autor.prezime}</strong></a>
                
                <div class="dugmad">
                    <button onclick="pop_up('${autor_id}')">Измени</button>
                    <button id="brisanje">Обриши</button>
                </div>
            </div>`;
    }
}
function forma_novi_autor() {
    trenutni_autor_id = null;   
    document.getElementById("unos_ime").value = "";
    document.getElementById("unos_prezime").value = "";
    document.getElementById("unos_status").value = "";
    document.getElementById("unos_datum").value = "";
    document.getElementById("unos_nagrade").value = "";
    document.getElementById("unos_primjerci").value = "";
    document.getElementById("unos_kontakt").value = "";
    document.getElementById("unos_bio").value = "";
    document.getElementById("unos_slike").value = "";

    const poruke = document.querySelectorAll(".poruka span");
    poruke.forEach(span => span.innerHTML = "");

    prozor.querySelector("h3").innerHTML = "Додавање новог аутора:";

    prozor.classList.add("open");
}
document.querySelector(".izmjena").addEventListener("submit",async function(e){
    e.preventDefault();/* sprecava refresovanje stranice */

    let tacan_unos=true;
    const pravila = [
        {
            input_id: "unos_ime",
            span_id: "poruka_ime",
            regex: /.*\S.*/,
            poruka_greske: "Име мора почети великим словом и садржати само слова."
        },
        {
            input_id: "unos_prezime",
            span_id: "poruka_prezime",
            regex: /.*\S.*/,
            poruka_greske: "Презиме мора почети великим словом и садржати само слова."
        },
        {
            input_id: "unos_status",
            span_id: "poruka_status",
            regex: /.*\S.*/,
            poruka_greske: "Статус мора бити текстуални (нпр. Активан, Преминуо)."
        },
        {
            input_id: "unos_datum",
            span_id: "poruka_datum",
            regex: /^\d{4}.\d{2}.\d{2}$/,
            poruka_greske: "Изаберите исправан датум рођења."
        },
        {
            input_id: "unos_nagrade",
            span_id: "poruka_nagrade",
            regex: /^\d+$/,
            poruka_greske: "Унесите исправан број награда (0 или више)."
        },
        {
            input_id: "unos_primjerci",
            span_id: "poruka_primjerci",
            regex: /^\d+$/,
            poruka_greske: "Унесите исправан број продатих примерака."
        },
        {
            input_id: "unos_kontakt",
            span_id: "poruka_kontakt",
            regex: /^\+381\s*([0-9]\s*\-*){6,9}$/, // Тражи само бројеве, дужине тачно 9 или 10 цифара
            poruka_greske: "Контакт мора садржати тачно између 9 и 10 цифара (само бројеви)."
        },
        {
            input_id: "unos_bio",
            span_id: "poruka_bio",
            regex: /.*\S.*/, // Проверава да поље није празно
            poruka_greske: "Биографија не смије бити празна."
        },
        {
            input_id: "unos_slike",
            span_id: "poruka_slike",
            regex: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i,
            poruka_greske: "Унесите исправне URL адресе слика раздвојене зарезом."
        }
    ];
    pravila.forEach(objekat=>{
        
        const unos_polje=document.getElementById(objekat.input_id)
        const poruka_polje=document.getElementById(objekat.span_id)

        const tekst=unos_polje.value.trim()
        if (objekat.input_id === "unos_ime") {
            console.log("Вредност у пољу ИМЕ:", JSON.stringify(tekst));
            console.log("Резултат теста за ИМЕ:", objekat.regex.test(tekst));
        }
        if(!objekat.regex.test(tekst)){
            poruka_polje.innerHTML=objekat.poruka_greske;
            tacan_unos=false;
        }else{
            poruka_polje.innerHTML="";

        }
    });
    if(tacan_unos){
        let slikeTekst = document.getElementById("unos_slike").value;
        let dijelovi=slikeTekst.split(",");
        let slikeNiz = [];

        for (let i = 0; i < dijelovi.length; i++) {
            let url = dijelovi[i].trim();
            
            if (url !== "") {
                slikeNiz.push(url);
            }
        }
        let izmenjeniAutor = {
            ime: document.getElementById("unos_ime").value.trim(),
            prezime: document.getElementById("unos_prezime").value.trim(),
            status: document.getElementById("unos_status").value.trim(),
            datumRodjenja: document.getElementById("unos_datum").value,
            brojOsvojenihNagrada: parseInt(document.getElementById("unos_nagrade").value),
            brojProdatihPrimeraka: parseInt(document.getElementById("unos_primjerci").value),
            kontaktTelefonMenadzera: document.getElementById("unos_kontakt").value.trim(),
            biografija: document.getElementById("unos_bio").value.trim(),
            slike: slikeNiz
        };
        let urlPutanja="";
        if (trenutni_autor_id === null) {
            let maxBroj = 0;
            
            for (let stari_id in autori) {
                let brojSufiks = stari_id.replace("aut", ""); 
                let broj = parseInt(brojSufiks);
                
                if (broj > maxBroj) {
                    maxBroj = broj;
                }
            }
            let noviBroj = maxBroj + 1; 
            
            // Форматирамо број тако да увек има три цифре (нпр. 7 постаје "007")
            let noviSufiks = String(noviBroj).padStart(3, '0'); 
            let novi_id = "aut" + noviSufiks;
            
            console.log("Генерисани нови кључ је:", novi_id);
            urlPutanja = `${firebaseUrl}/autori/${novi_id}.json`;
        }else {
            
            urlPutanja = `${firebaseUrl}/autori/${trenutni_autor_id}.json`;
        }

        try {
            // Сада за СВЕ користимо PUT, јер PUT уписује податке тачно на путању коју му задамо
            const odg = await fetch(urlPutanja, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(izmenjeniAutor)
            });
            
            if (odg.ok) {
                prozor.classList.remove("open"); // Затварамо поп-уп прозор
                preuzmi_autore(); // Освежавамо листу аутора на страници
            } else {
                console.log("Greska u upisu novih pod");
            }
        } catch (greska) {
            console.log("Problem povezivanja sa bazom");
        }

    }

});

document.addEventListener("DOMContentLoaded",preuzmi_autore);