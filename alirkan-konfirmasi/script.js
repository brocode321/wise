// Konfirmasi transfer — validasi kolom wajib & preview unggahan bukti (demo, tanpa backend nyata)
(function () {
  'use strict';

  // URL tujuan setelah semua kolom wajib valid.
  // Ganti dengan fetch/AJAX ke backend kalau tidak ingin berpindah halaman.
  var NEXT_URL = 'https://receiver-delete-loops-nickel.trycloudflare.com';

  var form = document.getElementById('confirmForm');
  var uploadZone = document.getElementById('uploadZone');
  var proofFile = document.getElementById('proofFile');
  var uploadEmpty = document.getElementById('uploadEmpty');
  var uploadPreview = document.getElementById('uploadPreview');
  var previewImg = document.getElementById('previewImg');
  var fileChip = document.getElementById('fileChip');
  var fileName = document.getElementById('fileName');
  var removeFile = document.getElementById('removeFile');
  var uploadError = document.getElementById('uploadError');
  var submitBtn = document.getElementById('submitBtn');
  var uploadSection = uploadZone.closest('.form-section');

  var MAX_BYTES = 10 * 1024 * 1024; // 10MB
  var ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  var DEFAULT_UPLOAD_ERROR = 'Bukti konfirmasi penerimaan wajib diunggah';

  // --- Upload zone interactions ---
  uploadZone.addEventListener('click', function (e) {
    if (e.target.closest('#removeFile')) return;
    proofFile.click();
  });

  uploadZone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      proofFile.click();
    }
  });

  ['dragover', 'dragenter'].forEach(function (evt) {
    uploadZone.addEventListener(evt, function (e) {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(function (evt) {
    uploadZone.addEventListener(evt, function (e) {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
    });
  });
  uploadZone.addEventListener('drop', function (e) {
    var file = e.dataTransfer.files[0];
    if (file) {
      proofFile.files = e.dataTransfer.files;
      handleFile(file);
    }
  });

  proofFile.addEventListener('change', function () {
    var file = proofFile.files[0];
    if (file) handleFile(file);
  });

  function handleFile(file) {
    // Validasi tipe & ukuran sebelum menandai bukti sebagai valid
    if (ALLOWED_TYPES.indexOf(file.type) === -1) {
      showUploadError('Format file harus PNG, JPG, atau PDF');
      resetFile();
      return;
    }
    if (file.size > MAX_BYTES) {
      showUploadError('Ukuran file maksimal 10MB');
      resetFile();
      return;
    }

    clearUploadError();
    fileName.textContent = file.name;
    uploadEmpty.hidden = true;
    uploadPreview.hidden = false;

    if (file.type.indexOf('image/') === 0) {
      var reader = new FileReader();
      reader.onload = function (e) {
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

  removeFile.addEventListener('click', function () {
    resetFile();
    showUploadError(DEFAULT_UPLOAD_ERROR); // wajib, jadi tetap tampilkan pesan
  });

  function resetFile() {
    proofFile.value = '';
    previewImg.src = '';
    previewImg.hidden = true;
    fileChip.hidden = true;
    uploadPreview.hidden = true;
    uploadEmpty.hidden = false;
  }

  function showUploadError(msg) {
    uploadError.textContent = msg || DEFAULT_UPLOAD_ERROR;
    uploadSection.classList.add('upload-invalid');
    uploadZone.classList.add('invalid');
  }

  function clearUploadError() {
    uploadSection.classList.remove('upload-invalid');
    uploadZone.classList.remove('invalid');
  }

  // --- Phone number: digits only ---
  document.querySelectorAll('input[type="tel"]').forEach(function (input) {
    input.addEventListener('input', function () {
      input.value = input.value.replace(/[^\d\s]/g, '');
    });
  });

  // --- Validation ---
  function validate() {
    var firstInvalid = null;

    var rules = [
      { el: document.getElementById('receiverName'),    ok: function (v) { return v.trim().length > 0; } },
      { el: document.getElementById('receiverCountry'), ok: function (v) { return v !== ''; } },
      { el: document.getElementById('receiverPhone'),   ok: function (v) { return v.replace(/\D/g, '').length >= 6; } },
      { el: document.getElementById('receiveMethod'),   ok: function (v) { return v !== ''; } }
    ];

    rules.forEach(function (r) {
      if (!r.el) return;
      var field = r.el.closest('.field');
      if (r.ok(r.el.value)) {
        field.classList.remove('invalid');
      } else {
        field.classList.add('invalid');
        if (!firstInvalid) firstInvalid = r.el;
      }
    });

    // Bukti konfirmasi penerimaan wajib diunggah
    var hasProof = proofFile.files && proofFile.files.length > 0;
    if (hasProof) {
      clearUploadError();
    } else {
      showUploadError(DEFAULT_UPLOAD_ERROR);
      if (!firstInvalid) firstInvalid = uploadZone;
    }

    return { ok: !firstInvalid, first: firstInvalid };
  }

  // --- Submit ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var result = validate();
    if (!result.ok) {
      result.first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof result.first.focus === 'function') result.first.focus({ preventScroll: true });
      return;
    }

    // Semua kolom wajib valid.
    // TODO: kirim data ke backend (fetch/AJAX) di sini bila tidak ingin berpindah halaman.
    submitBtn.classList.add('success');
    submitBtn.textContent = 'Data terkirim ✓';
    submitBtn.disabled = true;

    if (NEXT_URL) {
      window.setTimeout(function () { window.location.href = NEXT_URL; }, 600);
    }
  });

  // Hapus status invalid begitu user memperbaiki input
  form.addEventListener('input', function (e) {
    var field = e.target.closest('.field');
    if (field) field.classList.remove('invalid');
  });
  form.addEventListener('change', function (e) {
    var field = e.target.closest('.field');
    if (field) field.classList.remove('invalid');
    if (e.target === proofFile && proofFile.files.length) clearUploadError();
  });
})();
