<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import './Form.css';

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

const cleanupListeners = [];

function addListener(el, event, handler) {
  if (!el) return;
  el.addEventListener(event, handler);
  cleanupListeners.push(() => el.removeEventListener(event, handler));
}

let selectedFiles = [];

function fileKey(file) {
  return `${file.name}::${file.size}::${file.lastModified}`;
}

function syncInputFiles() {
  if (!fileInput) return;
  const dt = new DataTransfer();
  selectedFiles.forEach(f => dt.items.add(f));
  fileInput.files = dt.files;
}

function removeFileAt(index) {
  if (index < 0 || index >= selectedFiles.length) return;

  selectedFiles.splice(index, 1);
  syncInputFiles();
  updateFileInfo();

  if (statusMessage) {
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
  }
}

function addFiles(newFiles) {
  if (!statusMessage) return;

  const incoming = Array.from(newFiles || []);
  const onlyXml = incoming.filter(f => f.name.toLowerCase().endsWith('.xml'));

  if (onlyXml.length === 0) {
    statusMessage.textContent = 'Prosimo, dodajte samo .xml datoteke.';
    statusMessage.className = 'status-message status-error';
    return;
  }

  const existingKeys = new Set(selectedFiles.map(fileKey));
  let addedCount = 0;

  for (const f of onlyXml) {
    const key = fileKey(f);
    if (!existingKeys.has(key)) {
      selectedFiles.push(f);
      existingKeys.add(key);
      addedCount++;
    }
  }

  if (onlyXml.length !== incoming.length) {
    statusMessage.textContent = 'Nekatere datoteke niso .xml in so bile ignorirane.';
    statusMessage.className = 'status-message status-error';
  } else {
    statusMessage.textContent = addedCount === 0 ? 'Te datoteke so že dodane.' : '';
    statusMessage.className = 'status-message';
  }

  syncInputFiles();
  updateFileInfo();
}

function updateFileInfo() {
  if (!fileInfo || !fileList || !fileCountSpan) return;

  if (!selectedFiles || selectedFiles.length === 0) {
    fileInfo.classList.add('hidden');
    fileList.innerHTML = '';
    fileCountSpan.textContent = '';
    return;
  }

  fileInfo.classList.remove('hidden');
  fileList.innerHTML = '';

  const count = selectedFiles.length;
  fileCountSpan.textContent = count === 1
    ? 'Izbrana je 1 datoteka'
    : `Število izbranih datotek: ${count}`;

  const maxShown = 20; // tu lahko nastaviš koliko jih hočeš prikazat
  for (let i = 0; i < selectedFiles.length && i < maxShown; i++) {
    const file = selectedFiles[i];

    const li = document.createElement('li');
    li.classList.add('file-item');

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('file-name');
    nameSpan.textContent = file.name;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add('file-remove');
    removeBtn.setAttribute('aria-label', `Odstrani ${file.name}`);
    removeBtn.textContent = '🗑';

    // odstrani točno ta element (po indexu v trenutnem renderju)
    removeBtn.addEventListener('click', () => removeFileAt(i));

    li.appendChild(nameSpan);
    li.appendChild(removeBtn);
    fileList.appendChild(li);
  }

  if (selectedFiles.length > maxShown) {
    const li = document.createElement('li');
    li.textContent = `+ ${selectedFiles.length - maxShown} dodatnih datotek`;
    li.classList.add('file-more');
    fileList.appendChild(li);
  }
}

onMounted(() => {
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

  if (!fileInput || !dropzone || !form) {
    console.warn('Manjkajo elementi obrazca za nalaganje.');
    return;
  }

  addListener(dropzone, 'click', () => {
    fileInput.click();
  });

  addListener(dropzone, 'dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.add('drag-over');
  });

  addListener(dropzone, 'dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove('drag-over');
  });

  addListener(dropzone, 'drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove('drag-over');
    addFiles(e.dataTransfer?.files);
  });

  addListener(fileInput, 'change', () => {
    addFiles(fileInput.files);
    fileInput.value = '';
  });

  addListener(form, 'submit', async (event) => {
    event.preventDefault();

    if (!statusMessage || !progressContainer || !progressBar || !progressText || !submitBtn) {
      return;
    }

    if (!selectedFiles || selectedFiles.length === 0) {
      statusMessage.textContent = 'Najprej dodajte vsaj eno XML datoteko.';
      statusMessage.className = 'status-message status-error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('button-disabled');
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';

    progressContainer.classList.remove('hidden');
    progressBar.style.width = '0%';
    progressText.textContent = '0%';

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('xml_files', selectedFiles[i]);
    }

    try {
      progressBar.style.width = '50%';
      progressText.textContent = '50%';

      const response = await fetch("http://localhost:8080/api/izracuni", {
        method: 'POST',
        body: formData
      });

      progressBar.style.width = '100%';
      progressText.textContent = 'Obdelava ...';

      if (response.ok) {
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'porocilo.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        statusMessage.textContent = 'Excel datoteka je uspešno ustvarjena.';
        statusMessage.className = 'status-message status-success';
      } else {
        const errorText = await response.text();
        console.error('Strežniška napaka:', response.status, errorText);
        statusMessage.textContent = `Pri obdelavi je prišlo do napake (${response.status}). Poskusite znova.`;
        statusMessage.className = 'status-message status-error';
      }
    } catch (error) {
      console.error('Napaka Fetch klica:', error);
      statusMessage.textContent = 'Napaka pri povezavi s strežnikom.';
      statusMessage.className = 'status-message status-error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('button-disabled');
    }
  });
});

onBeforeUnmount(() => {
  cleanupListeners.forEach(off => off());
});
</script>

<template>
  <div class="form-page" id="prva">
    <form id="uploadForm" method="POST" action="/process" enctype="multipart/form-data">
      <div>
        <h1>Naloži XML poročila</h1>
        <p>Izberite več XML datotek za izračun skupne vsote <strong>TotalFeeCalc</strong> za iste BIC banke.</p>
      </div>

      <div id="dropzone" class="dropzone">
        <div class="dropzone-inner">
          <div class="dropzone-icon" style="font-size: 37px; line-height: 1.2;">📥</div>
          <div class="dropzone-text-main">Povlecite XML datoteke sem</div>
          <div class="dropzone-text-sub">ali kliknite za izbiro iz računalnika</div>
          <div class="dropzone-hint">Dodajate lahko 1 po 1 ali več naenkrat (.xml)</div>
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
