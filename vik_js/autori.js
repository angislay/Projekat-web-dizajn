let firebaseUrl="https://web-projekat-602fa-default-rtdb.firebaseio.com";
let autori={};
async function preuzmi_autore() {
    const odg=await fetch(firebaseUrl+"/autori.json");
    autori=await odg.json() || {};
    listaj_autore();
}
function listaj_autore(){
    const container=document.getElementById("ispis");
    container.innerHTML="";
    for(let id in autori){
        let autor=autori[id];
        container.innerHTML+=`
                    <div class="ocjena">
                    <a href="autor.html?id=${id}"><strong>${autor.ime} ${autor.prezime}</strong></a>
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

document.addEventListener("DOMContentLoaded",preuzmi_autore);
