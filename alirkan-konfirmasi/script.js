// Konfirmasi transfer — validasi & preview unggahan bukti (demo, tanpa backend nyata)
(function () {
  const form = document.getElementById('confirmForm');
  const uploadZone = document.getElementById('uploadZone');
  const proofFile = document.getElementById('proofFile');
  const uploadEmpty = document.getElementById('uploadEmpty');
  const uploadPreview = document.getElementById('uploadPreview');
  const previewImg = document.getElementById('previewImg');
  const fileChip = document.getElementById('fileChip');
  const fileName = document.getElementById('fileName');
  const removeFile = document.getElementById('removeFile');
  const uploadSection = uploadZone.closest('.form-section');

  // --- Upload zone interactions ---
  uploadZone.addEventListener('click', (e) => {
    if (e.target.closest('#removeFile')) return;
    proofFile.click();
  });

  ['dragover', 'dragenter'].forEach((evt) => {
    uploadZone.addEventListener(evt, (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach((evt) => {
    uploadZone.addEventListener(evt, (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
    });
  });
  uploadZone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) {
      proofFile.files = e.dataTransfer.files;
      handleFile(file);
    }
  });

  proofFile.addEventListener('change', () => {
    const file = proofFile.files[0];
    if (file) handleFile(file);
  });

  function handleFile(file) {
    fileName.textContent = file.name;
    uploadEmpty.hidden = true;
    uploadPreview.hidden = false;
    uploadSection.classList.remove('upload-invalid');

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewImg.hidden = false;
        fileChip.hidden = true;
      };
      reader.readAsDataURL(file);
    } else {
      previewImg.hidden = true;
      fileChip.hidden = false;
    }
  }

  removeFile.addEventListener('click', () => {
    proofFile.value = '';
    previewImg.src = '';
    previewImg.hidden = true;
    fileChip.hidden = true;
    uploadPreview.hidden = true;
    uploadEmpty.hidden = false;
  });

  // --- Phone number: digits only ---
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^\d\s]/g, '');
    });
  });

  // --- Validation & submit ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('.field').forEach((field) => {
      const input = field.querySelector('input, select, textarea');
      if (!input || !input.hasAttribute('required')) return;
      const filled = input.value && input.value.trim().length > 0;
      field.classList.toggle('invalid', !filled);
      if (!filled) valid = false;
    });

    if (!proofFile.files || proofFile.files.length === 0) {
      uploadSection.classList.add('upload-invalid');
      uploadZone.classList.add('invalid');
      valid = false;
    } else {
      uploadSection.classList.remove('upload-invalid');
      uploadZone.classList.remove('invalid');
    }

    if (!valid) {
      const firstInvalid = form.querySelector('.invalid, .upload-invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.textContent = 'Terkirim ✓';
    submitBtn.classList.add('success');
    submitBtn.disabled = true;

    // Demo: data siap dikirim ke server di sini (fetch/AJAX) sesuai kebutuhan backend.
  });

  // Clear invalid state as user fixes fields
  form.addEventListener('input', (e) => {
    const field = e.target.closest('.field');
    if (field) field.classList.remove('invalid');
  });
  form.addEventListener('change', (e) => {
    const field = e.target.closest('.field');
    if (field) field.classList.remove('invalid');
  });
})();
