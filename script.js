function renderCsokik() {
    let csokiHTML = "";
    let csokiLista = document.getElementById("csoki-lista");
    let xhr = new XMLHttpRequest();
    console.log(xhr);
  
    xhr.open('GET', 'http://localhost:3000/csokik', true);

    xhr.onload = function() {

        if (xhr.status === 200) {
            console.log(xhr.responseText);
            let csokik = JSON.parse(xhr.responseText); 
            console.log(csokik);
            csokik.forEach(function(csoki) {
                console.log(csoki.id);
                console.log(csoki.nev);
                csokiHTML += `
                    <div class="col">
                        <div class="${csoki.raktaron ? "bg-success" : "bg-danger"} m-2 p-2">
                            <h2>${csoki.nev}</h2>
                            <p>A termék ára: ${csoki.ara} Ft</p>
                            <button class="btn btn-danger" onclick="torles(${csoki.id})">Törlés</button>
                            <button class="btn btn-primary" onclick="modositas(${csoki.id})">Módosítás</button>
                        </div>
                    </div>
                `;
            });

            csokiLista.innerHTML = csokiHTML;
        } else {
            console.error('Hiba történt az adatok betöltésekor:', xhr.status, xhr.statusText);
           
        }
    };

    xhr.send();
}

document.getElementById('ujtermek').onclick = function () {
    let newFormHTML = `
        <h4>Áru hozzáadása:</h4>
        <form id="uj-csoki" class="p-5">
            <label class="w-100">
                <h5>Termék neve:</h5>
                <input class="form-control" type="text" name="nev">
            </label>
            <label class="w-100">
                <h5>Termék ára:</h5>
                <input class="form-control" type="number" name="ara">
            </label>
            <label>
                <h5>Van raktáron?</h5> 
                <input type="checkbox" name="raktaron">
            </label>
            <br>
            <button class="btn btn-success" type="submit">Küldés</button>
        </form>
    `;

    let ujElem = document.getElementById('uj');
    ujElem.innerHTML = newFormHTML;
    document.getElementById('ujtermek').style.display = 'none';

    let ujCsokiForm = document.getElementById("uj-csoki");
    ujCsokiForm.onsubmit = function (event) {
        event.preventDefault();
        let nev = event.target.elements.nev.value;
        let ara = event.target.elements.ara.value;
        let raktaron = event.target.elements.raktaron.checked;

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/csokik', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = function() {
            if (xhr.status === 201) {
                renderCsokik();
                ujElem.innerHTML = '';
                document.getElementById('ujtermek').style.display = 'block';
            } else {
                console.error('Hiba történt az adatok létrehozása során:', xhr.status, xhr.statusText);
            }
        };

        xhr.send(JSON.stringify({
            nev: nev,
            ara: ara,
            raktaron: raktaron
        }));
    };
};

function torles(id) {
    console.log("Törlendő elem id:", id)
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'http://localhost:3000/csokik/' + id, true);

    xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 204) {
            renderCsokik();
            console.log(xhr.status);
        } else {
            console.error('Hiba történt a törlés során:', xhr.status, xhr.statusText);
        }
    };

    xhr.send();
}

function modositas(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/csokik/' + id, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            let csoki = JSON.parse(xhr.responseText);
            let modositasFormHTML = `
                <h4>Termék módosítása:</h4>
                <form id="modositas-csoki" class="p-5">
                    <label class="w-100">
                        <h5>Termék neve:</h5>
                        <input class="form-control" type="text" name="nev" value="${csoki.nev}">
                    </label>
                    <label class="w-100">
                        <h5>Termék ára:</h5>
                        <input class="form-control" type="number" name="ara" value="${csoki.ara}">
                    </label>
                    <label>
                        <h5>Van raktáron?</h5> 
                        <input type="checkbox" name="raktaron" ${csoki.raktaron ? 'checked' : ''}>
                    </label>
                    <br>
                    <button class="btn btn-primary" type="submit">Mentés</button>
                </form>
            `;

            let szerkesztesElem = document.getElementById('szerkesztes');
            szerkesztesElem.innerHTML = modositasFormHTML;
            document.getElementById('ujtermek').style.display = 'none';

            let modositasCsokiForm = document.getElementById("modositas-csoki");
            modositasCsokiForm.onsubmit = function (event) {
                event.preventDefault();
                let nev = event.target.elements.nev.value;
                let ara = event.target.elements.ara.value;
                let raktaron = event.target.elements.raktaron.checked;

                let xhr = new XMLHttpRequest();
                xhr.open('PUT', 'http://localhost:3000/csokik/' + id, true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        renderCsokik();
                        szerkesztesElem.innerHTML = '';
                        document.getElementById('ujtermek').style.display = 'block';
                    } else {
                        console.error('Hiba történt az adatok módosítása során:', xhr.status, xhr.statusText);
                    }
                };

                xhr.send(JSON.stringify({
                    nev: nev,
                    ara: ara,
                    raktaron: raktaron
                }));
            }
        } else {
            console.error('Hiba történt a módosítás során:', xhr.status, xhr.statusText);
        }
    };

    xhr.send();
}

window.onload = renderCsokik;