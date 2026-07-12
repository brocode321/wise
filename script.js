// Simple simulated FX calculator — demo purposes only, not live rates.
(function () {
  const RATE = 16240; // IDR per 1 USD (demo)
  const FEE_RATE = 0.00575; // ~0.575% demo fee

  const amountFrom = document.getElementById('amountFrom');
  const amountTo = document.getElementById('amountTo');
  const swapBtn = document.getElementById('swapBtn');
  const currencyFrom = document.getElementById('currencyFrom');
  const currencyTo = document.getElementById('currencyTo');
  const rateDisplay = document.getElementById('rateDisplay');
  const feeDisplay = document.querySelector('.calc-meta-row:nth-child(2) .mono');
  const tabs = document.querySelectorAll('.calc-tab');
  const labelFrom = document.getElementById('labelFrom');
  const labelTo = document.getElementById('labelTo');

  let direction = 'toUSD'; // toUSD = IDR -> USD, toIDR = USD -> IDR
  let mode = 'kirim'; // 'kirim' = kamu tentukan jumlah kirim, 'terima' = kamu tentukan jumlah diterima

  const LABELS = {
    kirim: { from: 'Kamu kirim', to: 'Penerima dapat' },
    terima: { from: 'Pengirim memberi', to: 'Kamu dapat' }
  };

  function applyModeLabels() {
    const set = LABELS[mode];
    labelFrom.textContent = set.from;
    labelTo.textContent = set.to;
  }

  function parseNumber(str) {
    return parseFloat(str.replace(/\./g, '').replace(/,/g, '.')) || 0;
  }

  function formatIDR(num) {
    return Math.round(num).toLocaleString('id-ID');
  }

  function formatUSD(num) {
    return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function recalc() {
    const raw = parseNumber(amountFrom.value);
    if (direction === 'toUSD') {
      const fee = raw * FEE_RATE;
      const net = Math.max(raw - fee, 0);
      const result = net / RATE;
      amountTo.value = formatUSD(result);
      feeDisplay.textContent = 'Rp ' + formatIDR(fee);
      rateDisplay.textContent = '1 USD = ' + formatIDR(RATE) + ' IDR';
    } else {
      const idrValue = raw * RATE;
      const fee = idrValue * FEE_RATE;
      const net = Math.max(idrValue - fee, 0);
      amountTo.value = formatIDR(net);
      feeDisplay.textContent = '$' + formatUSD(fee / RATE);
      rateDisplay.textContent = '1 USD = ' + formatIDR(RATE) + ' IDR';
    }
  }

  amountFrom.addEventListener('input', () => {
    // keep only digits, commas, dots while typing
    recalc();
  });

  amountFrom.addEventListener('blur', () => {
    const raw = parseNumber(amountFrom.value);
    amountFrom.value = direction === 'toUSD' ? formatIDR(raw) : formatUSD(raw);
    recalc();
  });

  swapBtn.addEventListener('click', () => {
    direction = direction === 'toUSD' ? 'toIDR' : 'toUSD';

    const fromFlag = currencyFrom.querySelector('.flag').textContent;
    const toFlag = currencyTo.querySelector('.flag').textContent;
    const fromCode = currencyFrom.childNodes[1].textContent.trim();
    const toCode = currencyTo.childNodes[1].textContent.trim();

    currencyFrom.querySelector('.flag').textContent = toFlag;
    currencyTo.querySelector('.flag').textContent = fromFlag;
    currencyFrom.childNodes[1].textContent = ' ' + toCode + ' ';
    currencyTo.childNodes[1].textContent = ' ' + fromCode + ' ';

    const tmpLabel = labelFrom.textContent;
    labelFrom.textContent = labelTo.textContent;
    labelTo.textContent = tmpLabel;

    amountFrom.value = direction === 'toUSD' ? '15.000.000' : '1.000,00';
    recalc();
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      mode = tab.dataset.mode;
      applyModeLabels();
    });
  });

  applyModeLabels();
  recalc();
})();
