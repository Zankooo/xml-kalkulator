<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import './Form.css';

// Spremenljivke, v katere shranimo DOM elemente
let fileInput;
let dropzone;
let fileInfo;
let fileCountSpan;
let fileList;
let progressContainer;
let progressBar;
let progressText;
let statusMessage;
let form;
let submitBtn;

// Tu shranjujemo funkcije za odjavo (removeEventListener),
// da jih lahko ob unmountu komponente vse lepo počistimo
const cleanupListeners = [];

// Helper za dodajanje event listenerjev + avtomatski zapis
// remove funkcije v cleanupListeners
function addListener(el, event, handler) {
    if (!el) return;
    el.addEventListener(event, handler);
    cleanupListeners.push(() => el.removeEventListener(event, handler));
}

// Posodobi prikaz informacij o izbranih datotekah
function updateFileInfo() {
    if (!fileInput || !fileInfo || !fileList || !fileCountSpan) return;

    const files = fileInput.files;

    // Če ni nobene izbrane datoteke, skrij info in izbriši seznam
    if (!files || files.length === 0) {
        fileInfo.classList.add('hidden');
        fileList.innerHTML = '';
        fileCountSpan.textContent = '';
        return;
    }

    // Pokaži blok z informacijami
    fileInfo.classList.remove('hidden');
    fileList.innerHTML = '';

    // Napiši, koliko datotek je izbranih
    const count = files.length;
    fileCountSpan.textContent = count === 1
        ? 'Izbrana je 1 datoteka'
        : `Izbranih je ${count} datotek`;

    // Prikažemo največ 6 imen datotek
    const maxShown = 6;
    for (let i = 0; i < files.length && i < maxShown; i++) {
        const li = document.createElement('li');
        li.textContent = files[i].name;
        fileList.appendChild(li);
    }

    // Če jih je več kot 6, prikažemo "+ X dodatnih datotek"
    if (files.length > maxShown) {
        const li = document.createElement('li');
        li.textContent = `+ ${files.length - maxShown} dodatnih datotek`;
        li.classList.add('file-more');
        fileList.appendChild(li);
    }
}

// Koda znotraj onMounted se izvede, ko je Vue komponenta na DOM-u
onMounted(() => {
    // Pobrskamo po DOM-u in najdemo vse elemente po id-jih
    fileInput = document.getElementById('xml_files');
    dropzone = document.getElementById('dropzone');
    fileInfo = document.getElementById('fileInfo');
    fileCountSpan = document.getElementById('fileCount');
    fileList = document.getElementById('fileList');
    progressContainer = document.getElementById('progressContainer');
    progressBar = document.getElementById('progressBar');
    progressText = document.getElementById('progressText');
    statusMessage = document.getElementById('statusMessage');
    form = document.getElementById('uploadForm');
    submitBtn = document.getElementById('submitBtn');

    // Če ključni elementi ne obstajajo, opozorimo in ne nastavimo eventov
    if (!fileInput || !dropzone || !form) {
        console.warn('Manjkajo elementi obrazca za nalaganje.');
        return;
    }

    // Klik na dropzone odpre file dialog
    addListener(dropzone, 'click', () => {
        fileInput.click();
    });

    // Ko datoteke vlečemo nad dropzone, dodamo stil "drag-over"
    addListener(dropzone, 'dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drag-over');
    });

    // Ko miško odmaknemo, odstranimo "drag-over" stil
    addListener(dropzone, 'dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-over');
    });

    // Ko datoteke spustimo na dropzone
    addListener(dropzone, 'drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-over');

        // Iz vsega, kar je uporabnik spustil, obdržimo samo .xml datoteke
        const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
            file.name.toLowerCase().endsWith('.xml')
        );

        if (!statusMessage) return;

        // Če ni nobene .xml datoteke, vrnemo error sporočilo
        if (droppedFiles.length === 0) {
            statusMessage.textContent = 'Prosimo, spustite samo .xml datoteke.';
            statusMessage.className = 'status-message status-error';
            return;
        }

        // Ustvarimo nov DataTransfer, da lahko nastavim fileInput.files
        const dataTransfer = new DataTransfer();
        droppedFiles.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;

        // Po uspešnem dropu počistimo status in posodobimo info
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
        updateFileInfo();
    });

    // Ko uporabnik izbere datoteke preko file dialoga
    addListener(fileInput, 'change', () => {
        if (!statusMessage) return;

        // Validacija za .xml tudi pri kliku – odstranimo vse, ki niso .xml
        const validFiles = Array.from(fileInput.files).filter(file =>
            file.name.toLowerCase().endsWith('.xml')
        );

        if (validFiles.length !== fileInput.files.length) {
            // Nekatere datoteke niso bile .xml → prikažemo opozorilo
            statusMessage.textContent = 'Nekatere datoteke niso .xml in so bile odstranjene.';
            statusMessage.className = 'status-message status-error';

            const dt = new DataTransfer();
            validFiles.forEach(f => dt.items.add(f));
            fileInput.files = dt.files;
        } else {
            // Vse ok, počistimo error
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
        }

        updateFileInfo();
    });

    // Pošiljanje obrazca – XHR upload + progress bar
    addListener(form, 'submit', (e) => {
        e.preventDefault(); // preprečimo klasični submit

        if (!statusMessage || !progressContainer || !progressBar || !progressText || !submitBtn) return;

        const files = fileInput.files;
        // Če ni datotek, opozorimo in prekličemo
        if (!files || files.length === 0) {
            statusMessage.textContent = 'Najprej izberite vsaj eno XML datoteko.';
            statusMessage.className = 'status-message status-error';
            return;
        }

        // Onemogočimo gumb in spremenimo stil, da uporabnik ne klikne večkrat
        submitBtn.disabled = true;
        submitBtn.classList.add('button-disabled');
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';

        // Pokažemo progress bar, resetiramo na 0%
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = '0%';

        // Napolnimo FormData z izbranimi datotekami
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('xml_files', files[i]);
        }

        // Ustvarimo XMLHttpRequest za pošiljanje na backend
        const xhr = new XMLHttpRequest();
        xhr.open('POST', form.action, true);
        xhr.responseType = 'blob'; // pričakujemo binarni odgovor (Excel)

        // Dogodek se sproži med nalaganjem → posodobimo progress bar
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                progressBar.style.width = percent + '%';
                progressText.textContent = percent + '%';
            }
        });

        // Ko je zahteva končana
        xhr.addEventListener('load', () => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('button-disabled');

            if (xhr.status >= 200 && xhr.status < 300) {
                // Uspeh – nastavimo progress na 100%
                progressBar.style.width = '100%';
                progressText.textContent = '100%';

                // Prejet blob (Excel) prenesemo kot datoteko porocilo.xlsx
                const blob = xhr.response;
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'porocilo.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                statusMessage.textContent = 'Excel datoteka je uspešno ustvarjena.';
                statusMessage.className = 'status-message status-success';
            } else {
                // Napaka na strežniku (status ni 2xx)
                statusMessage.textContent = 'Pri obdelavi je prišlo do napake. Poskusite znova.';
                statusMessage.className = 'status-message status-error';
            }
        });

        // Napaka pri povezavi (npr. ni interneta)
        xhr.addEventListener('error', () => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('button-disabled');
            statusMessage.textContent = 'Napaka pri povezavi s strežnikom.';
            statusMessage.className = 'status-message status-error';
        });

        // Pošljemo zahtevo s FormData
        xhr.send(formData);
    });
});

// Ko se Vue komponenta odstrani iz DOM-a,
// zaženemo vse funkcije, ki odstranijo event listenerje
onBeforeUnmount(() => {
    cleanupListeners.forEach(off => off());
});


</script>




<template>
    <div class="form-page" id="prva">
        <form id="uploadForm" method="POST" action="/process" enctype="multipart/form-data">
            <div>
                <h1>Nalaganje XML poročil</h1>
                <p>Izberite več XML datotek za izračun skupne vsote <strong>TotalFeeCalc</strong>.</p>
            </div>
            <div id="dropzone" class="dropzone">
                <div class="dropzone-inner">
                    <div class="dropzone-icon">📂</div>
                    <div class="dropzone-text-main">Povlecite XML datoteke sem</div>
                    <div class="dropzone-text-sub">ali kliknite za izbiro iz računalnika</div>
                    <div class="dropzone-hint">Podprte so samo .xml datoteke</div>
                </div>
            </div>

            <input type="file" id="xml_files" name="xml_files" multiple accept=".xml">

            <div id="fileInfo" class="file-info hidden">
                <div class="file-info-header">
                    <span id="fileCount"></span>
                </div>
                <ul id="fileList" class="file-list"></ul>
            </div>

            <div id="progressContainer" class="progress-container hidden">
                <div class="progress-bar-wrapper">
                    <div id="progressBar" class="progress-bar"></div>
                </div>
                <div id="progressText" class="progress-text">0%</div>
            </div>

            <div id="statusMessage" class="status-message"></div>

            <button type="submit" id="submitBtn">
                Izračunaj vsoto in prenesi Excel
            </button>
        </form>
    </div>

</template>
