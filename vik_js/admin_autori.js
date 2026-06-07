let firebaseUrl="https://web-projekat-602fa-default-rtdb.firebaseio.com";
let autori={};



async function preuzmi_autore(){
    const odg=await fetch(firebaseUrl+"/autori.json");
    autori=await odg.json() || {};
    listaj_autore();
}
function pop_up(autor_id){
    const dugme=document.querySelector(".izmjena");

    if(autor_id && autori[autor_id]){
        let autor=autori[autor_id];
        document.getElementById("unos_ime").value=autor.ime;
        document.getElementById("unos_prezime").value=autor.prezime;
        document.getElementById("unos_status").value=autor.status;
        document.getElementById("unos_datum").value=autor.ime;
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

    dugme.classList.toggle("open");
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
document.addEventListener("DOMContentLoaded",preuzmi_autore);
