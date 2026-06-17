let firebaseUrl="https://web-projekat-602fa-default-rtdb.firebaseio.com";
let autori={};
async function preuzmi_autore() {
    const odg=await fetch(firebaseUrl+"/autori.json");
    autori=await odg.json() || {};
    listaj_autore(autori);
}
function listaj_autore(niz, pojam = "") {
    const container = document.getElementById("ispis");
    container.innerHTML = "";
    
    // Чистимо појам од размака и пребацујемо у мала слова ради лакше претраге
    let trazeniTekst = pojam.trim().toLowerCase();

    for (let id in niz) {
        let autor = niz[id];
        let originalnoIme = `${autor.ime} ${autor.prezime}`;
        let prikazImena = originalnoIme;

        // Ако корисник куца нешто у претрагу, правимо маркирање
        if (trazeniTekst !== "") {
            let tekstZaPretragu = originalnoIme.toLowerCase();
            let pozicija = tekstZaPretragu.indexOf(trazeniTekst);

            // Ако је текст пронађен унутар имена и презимена
            if (pozicija !== -1) {
                // Сечемо део ПРЕ поготка
                let deoPre = originalnoIme.substring(0, pozicija);
                // Сечемо ТАЧАН погодак (задржавамо оригинална велика и мала слова из базе)
                let deoPogodak = originalnoIme.substring(pozicija, pozicija + trazeniTekst.length);
                // Сечемо део ПОСЛЕ поготка
                let deoPosle = originalnoIme.substring(pozicija + trazeniTekst.length);

                // Спајамо све назад и умотавамо погођени део у <mark> таг
                prikazImena = deoPre + "<mark>" + deoPogodak + "</mark>" + deoPosle;
            }
        }

        container.innerHTML += `
            <div class="ocjena">
                <a href="autor.html?id=${id}"><strong>${prikazImena}</strong></a>
                <div class="zvijezde">
                    <label for="">Просјечна оцјена корисника: </label>
                    <span class="fa fa-star popunjena_zvijezda"></span> 
                    <span class="fa fa-star popunjena_zvijezda"></span> 
                    <span class="fa fa-star popunjena_zvijezda"></span> 
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                </div>
            </div>`;
    }
}
function pretrazi(){
    pronadjeni_autori={};
    let unos=document.getElementById("unos").value.toLowerCase();
    let selekcija=document.getElementById("selekcija").value;
    for(id in autori){
        let autor=autori[id];
        let text1=(autor.ime+" "+autor.prezime).toLowerCase();
        let text2=(autor.prezime+" "+autor.ime).toLowerCase();
        
        let prov1=text1.includes(unos) || text2.includes(unos);
        let prov2=(selekcija==="svi")||(selekcija===autor.status);
        if(prov1 &&prov2){
            pronadjeni_autori[id]=autor;
        }
        
        
    }
    listaj_autore(pronadjeni_autori, unos);
}
document.addEventListener("DOMContentLoaded",preuzmi_autore);
