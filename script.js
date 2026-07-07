const CURRENCIES_URL = "https://api.frankfurter.dev/v1/currencies";
const LATEST_URL = "https://api.frankfurter.dev/v1/latest";

const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const amountInput = document.getElementById("Amount");
const convertBtn = document.getElementById("convertBtn");
const resultDiv = document.getElementById("result");

async function loadCurrencies() {
  try {
    const res = await fetch(CURRENCIES_URL);
    if (!res.ok) throw new Error("Could not load currency list");
    const currencies = await res.json(); 

    const options = Object.entries(currencies)
      .map(([code, name]) => `<option value="${code}">${code} — ${name}</option>`)
      .join("");

    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;

    
    fromSelect.value = "USD";
    toSelect.value = "INR";
  } catch (err) {
    fromSelect.innerHTML = `<option value="">Failed to load</option>`;
    toSelect.innerHTML = `<option value="">Failed to load</option>`;
    showResult(`Error: ${err.message}`, true);
  }
}


async function convertCurrency() {
  const from = fromSelect.value;
  const to = toSelect.value;
  const amount = amountInput.value;

  if (!from || !to) {
    showResult("Pick both currencies first.", true);
    return;
  }
  if (!amount || Number(amount) <= 0) {
    showResult("Enter an amount greater than 0.", true);
    return;
  }
  if (from === to) {
    showResult(`${amount} ${from} = ${amount} ${to}`);
    return;
  }

  showResult("Converting…");

  try {
    const url = `${LATEST_URL}?amount=${amount}&from=${from}&to=${to}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Exchange rate lookup failed");
    const data = await res.json();

    const converted = data.rates[to];
    const rate = converted / amount;

    showResult(
      `${amount} ${from} = ${converted.toFixed(2)} ${to} ` +
      `(1 ${from} = ${rate.toFixed(4)} ${to})`
    );
  } catch (err) {
    showResult(`Error: ${err.message}`, true);
  }
}

function showResult(message, isError = false) {
  resultDiv.textContent = message;
  resultDiv.classList.toggle("result--error", isError);
  resultDiv.classList.add("result--visible");
}

convertBtn.addEventListener("click", convertCurrency);
window.addEventListener("DOMContentLoaded", loadCurrencies);