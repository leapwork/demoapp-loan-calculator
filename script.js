const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const mortgageMinimumDownPayment = 0.05;
const autoMaximumVehiclePrice = 80000;
let currentProduct = "mortgage";
let mortgageTouched = false;

const productStart = document.querySelector("#products");
const calculatorShell = document.querySelector("#calculator");
const productCards = [...document.querySelectorAll("[data-product-card]")];
const backToProducts = document.querySelector("#backToProducts");
const prequalifyModal = document.querySelector("#prequalifyModal");
const closePrequalifyModal = document.querySelector("#closePrequalifyModal");
const confirmPrequalifyModal = document.querySelector("#confirmPrequalifyModal");
const prequalifyTitle = document.querySelector("#prequalifyTitle");
const prequalifyMessage = document.querySelector("#prequalifyMessage");
const panels = {
  mortgage: document.querySelector("#mortgage-panel"),
  auto: document.querySelector("#auto-panel"),
};

const mortgage = {
  fields: {
    homePrice: document.querySelector("#homePrice"),
    downPayment: document.querySelector("#downPayment"),
    creditScore: document.querySelector("#mortgageCreditScore"),
    interestRate: document.querySelector("#interestRate"),
    propertyTax: document.querySelector("#propertyTax"),
    insurance: document.querySelector("#insurance"),
    term: [...document.querySelectorAll("input[name='term']")],
  },
  output: {
    monthlyPayment: document.querySelector("#monthlyPayment"),
    principalInterest: document.querySelector("#principalInterest"),
    monthlyTax: document.querySelector("#monthlyTax"),
    monthlyInsurance: document.querySelector("#monthlyInsurance"),
    loanAmount: document.querySelector("#loanAmount"),
    downPercent: document.querySelector("#downPercent"),
    downNotice: document.querySelector("#downNotice"),
    downPaymentHelp: document.querySelector("#mortgageDownPaymentHelp"),
    principalBar: document.querySelector("#principalBar"),
    taxBar: document.querySelector("#taxBar"),
    insuranceBar: document.querySelector("#insuranceBar"),
    results: document.querySelector("#mortgageResults"),
    apply: document.querySelector("#mortgageApply"),
    estimateNote: document.querySelector("#mortgageEstimateNote"),
    rateNote: document.querySelector("#mortgageRateNote"),
  },
};

const auto = {
  fields: {
    vehiclePrice: document.querySelector("#vehiclePrice"),
    vehiclePriceSlider: document.querySelector("#vehiclePriceSlider"),
    downPayment: document.querySelector("#autoDownPayment"),
    tradeInValue: document.querySelector("#tradeInValue"),
    creditScore: document.querySelector("#creditScore"),
    term: document.querySelector("#autoTerm"),
  },
  output: {
    monthlyPayment: document.querySelector("#autoMonthlyPayment"),
    apr: document.querySelector("#autoApr"),
    vehicleBudget: document.querySelector("#autoVehicleBudget"),
    displayDownPayment: document.querySelector("#autoDisplayDownPayment"),
    tradeInValue: document.querySelector("#autoTradeInValue"),
    taxTitle: document.querySelector("#autoTaxTitle"),
    totalAmount: document.querySelector("#autoTotalAmount"),
    monthlyPaymentSummary: document.querySelector("#autoMonthlyPaymentSummary"),
    notice: document.querySelector("#autoNotice"),
    results: document.querySelector("#autoResults"),
    apply: document.querySelector("#autoApply"),
    estimateNote: document.querySelector("#autoEstimateNote"),
  },
};

function valueOf(input) {
  return Number.parseFloat(input.value) || 0;
}

function hasValue(input) {
  return input.value.trim() !== "";
}

function selectedValue(inputs, fallback) {
  return Number(inputs.find((input) => input.checked)?.value || fallback);
}

function monthlyLoanPayment(loanAmount, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12;

  if (loanAmount <= 0) return 0;
  if (monthlyRate === 0) return loanAmount / months;

  const factor = (1 + monthlyRate) ** months;
  return loanAmount * ((monthlyRate * factor) / (factor - 1));
}

function setWidths(parts) {
  const total = parts.reduce((sum, part) => sum + part.value, 0) || 1;
  parts.forEach((part) => {
    part.element.style.width = `${(part.value / total) * 100}%`;
  });
}

function clearCustomValidity(inputs) {
  inputs.forEach((input) => input.setCustomValidity(""));
}

function resetWidths(parts) {
  parts.forEach((part) => {
    part.style.width = "0%";
  });
}

function setEstimateAvailable(output, isAvailable) {
  output.results.classList.toggle("is-disabled", !isAvailable);
  output.apply.disabled = !isAvailable;
  output.estimateNote.hidden = isAvailable;
}

function setMortgageEmptyState(message) {
  const output = mortgage.output;
  setEstimateAvailable(output, false);
  output.monthlyPayment.textContent = "$0";
  output.principalInterest.textContent = "$0";
  output.monthlyTax.textContent = "$0";
  output.monthlyInsurance.textContent = "$0";
  output.loanAmount.textContent = "$0";
  output.downPercent.textContent = "0%";
  output.downNotice.textContent = message;
  output.rateNote.textContent = "6.25% interest rate based on your details";
  resetWidths([output.principalBar, output.taxBar, output.insuranceBar]);
}

function setAutoEmptyState(message) {
  const output = auto.output;
  setEstimateAvailable(output, false);
  output.monthlyPayment.textContent = "$0";
  output.apr.textContent = "0.00% (Estimate based on your credit rating)*";
  output.vehicleBudget.textContent = "$0";
  output.displayDownPayment.textContent = "$0";
  output.tradeInValue.textContent = "$0";
  output.taxTitle.textContent = "$0";
  output.totalAmount.textContent = "$0";
  output.monthlyPaymentSummary.textContent = "$0";
  output.notice.textContent = message;
}

function mortgageRateFor(creditScore, downPaymentRatio) {
  const baseRates = {
    excellent: 6.25,
    good: 6.65,
    average: 7.15,
    belowAverage: 7.75,
  };

  const baseRate = baseRates[creditScore] || baseRates.good;

  if (downPaymentRatio >= 0.2) return baseRate;
  if (downPaymentRatio >= 0.1) return baseRate + 0.15;
  return baseRate + 0.35;
}

function updateMortgageRate() {
  const fields = mortgage.fields;
  const homePrice = Math.max(valueOf(fields.homePrice), 0);
  const downPayment = Math.max(valueOf(fields.downPayment), 0);
  const downPaymentRatio = homePrice > 0 ? Math.min(downPayment, homePrice) / homePrice : 0.2;
  const rate = mortgageRateFor(fields.creditScore.value, downPaymentRatio);
  fields.interestRate.value = `${rate.toFixed(2)}%`;
  mortgage.output.rateNote.textContent = `${rate.toFixed(2)}% interest rate based on your details`;
  return rate;
}

function calculateMortgage() {
  const fields = mortgage.fields;
  const output = mortgage.output;
  clearCustomValidity([fields.homePrice, fields.downPayment]);
  const rate = updateMortgageRate();
  output.downPaymentHelp.hidden = true;

  if (!hasValue(fields.homePrice) || !hasValue(fields.downPayment)) {
    setMortgageEmptyState("");
    return;
  }

  const homePrice = Math.max(valueOf(fields.homePrice), 0);
  const downPayment = Math.min(Math.max(valueOf(fields.downPayment), 0), homePrice);
  const minimumDownPayment = homePrice * mortgageMinimumDownPayment;

  if (downPayment < minimumDownPayment) {
    const message = `Minimum down payment is ${currency.format(minimumDownPayment)} for this home price.`;
    fields.downPayment.setCustomValidity(message);
    setMortgageEmptyState("");
    return;
  }

  const years = selectedValue(fields.term, 30);
  const loanAmount = Math.max(homePrice - downPayment, 0);
  const principalInterest = monthlyLoanPayment(loanAmount, rate, years * 12);
  const monthlyTax = Math.max(valueOf(fields.propertyTax), 0) / 12;
  const monthlyInsurance = Math.max(valueOf(fields.insurance), 0) / 12;
  const total = principalInterest + monthlyTax + monthlyInsurance;
  const downPaymentRatio = homePrice > 0 ? downPayment / homePrice : 0;

  output.monthlyPayment.textContent = currency.format(total);
  output.principalInterest.textContent = currency.format(principalInterest);
  output.monthlyTax.textContent = currency.format(monthlyTax);
  output.monthlyInsurance.textContent = currency.format(monthlyInsurance);
  output.loanAmount.textContent = currency.format(loanAmount);
  output.downPercent.textContent = percent.format(downPaymentRatio);
  output.downNotice.textContent =
    downPaymentRatio > 0 && downPaymentRatio < 0.2
      ? "A down payment below 20% may require private mortgage insurance."
      : "";
  setEstimateAvailable(output, true);

  setWidths([
    { element: output.principalBar, value: principalInterest },
    { element: output.taxBar, value: monthlyTax },
    { element: output.insuranceBar, value: monthlyInsurance },
  ]);
}

function seedMortgageDownPayment() {
  const fields = mortgage.fields;
  const output = mortgage.output;
  const homePrice = Math.max(valueOf(fields.homePrice), 0);

  if (!hasValue(fields.homePrice) || homePrice <= 0 || hasValue(fields.downPayment)) {
    return;
  }

  const minimumDownPayment = Math.round(homePrice * mortgageMinimumDownPayment);
  fields.downPayment.value = String(minimumDownPayment);
  output.downPaymentHelp.textContent = `Minimum down payment is ${currency.format(minimumDownPayment)} for this home price.`;
  output.downPaymentHelp.hidden = false;
}
function normalizeMortgageDownPayment() {
  const fields = mortgage.fields;
  const output = mortgage.output;
  const homePrice = Math.max(valueOf(fields.homePrice), 0);

  if (!hasValue(fields.homePrice) || homePrice <= 0) {
    output.downPaymentHelp.hidden = true;
    return;
  }

  const minimumDownPayment = homePrice * mortgageMinimumDownPayment;
  const enteredDownPayment = hasValue(fields.downPayment) ? valueOf(fields.downPayment) : Number.NaN;

  if (!Number.isFinite(enteredDownPayment) || enteredDownPayment < minimumDownPayment) {
    fields.downPayment.value = String(Math.round(minimumDownPayment));
    mortgageTouched = true;
    calculateMortgage();
    output.downPaymentHelp.textContent = `Minimum down payment is ${currency.format(minimumDownPayment)} for this home price.`;
    output.downPaymentHelp.hidden = false;
  }
}

function formatApr(rate) {
  return `${rate.toFixed(2)}% (Estimate based on your credit rating)*`;
}

function formatSignedCurrency(value) {
  const rounded = currency.format(Math.abs(value));
  return value < 0 ? `-${rounded}` : rounded;
}

function getAutoTaxTitle(price) {
  if (price <= 9999) return 950;
  if (price <= 14999) return 1150;
  if (price <= 19999) return 1550;
  if (price <= 29999) return 1800;
  if (price <= 34999) return 2000;
  if (price <= 39999) return 2300;
  if (price <= 44999) return 2500;
  if (price <= 49999) return 2800;
  if (price <= 54999) return 3050;
  if (price <= 59999) return 3450;
  return 3650;
}

function updateVehiclePriceSliderFill() {
  const slider = auto.fields.vehiclePriceSlider;
  const min = Number(slider.min) || 0;
  const max = Number(slider.max) || 100;
  const value = Number(slider.value) || 0;
  const progress = ((value - min) / (max - min)) * 100;
  slider.style.setProperty("--slider-progress", `${Math.max(0, Math.min(progress, 100))}%`);
}
function syncVehiclePriceSliderFromInput() {
  const rawPrice = valueOf(auto.fields.vehiclePrice);
  const clampedPrice = Math.min(Math.max(rawPrice, 0), autoMaximumVehiclePrice);
  auto.fields.vehiclePriceSlider.value = String(clampedPrice);
  updateVehiclePriceSliderFill();
}

function syncVehiclePriceInputFromSlider() {
  auto.fields.vehiclePrice.value = auto.fields.vehiclePriceSlider.value;
  updateVehiclePriceSliderFill();
}

function normalizeAutoVehiclePrice() {
  if (!hasValue(auto.fields.vehiclePrice)) {
    return;
  }

  const normalizedPrice = Math.min(Math.max(valueOf(auto.fields.vehiclePrice), 0), autoMaximumVehiclePrice);
  auto.fields.vehiclePrice.value = String(normalizedPrice);
  auto.fields.vehiclePriceSlider.value = String(normalizedPrice);
  updateVehiclePriceSliderFill();
  calculateAuto();
}

function calculateAuto() {
  const fields = auto.fields;
  const output = auto.output;
  clearCustomValidity([fields.vehiclePrice, fields.downPayment, fields.tradeInValue]);

  if (!hasValue(fields.vehiclePrice) || !hasValue(fields.downPayment)) {
    setAutoEmptyState("");
    return;
  }

  const vehiclePrice = Math.max(valueOf(fields.vehiclePrice), 0);
  const downPayment = Math.max(valueOf(fields.downPayment), 0);
  const tradeInValue = Math.max(valueOf(fields.tradeInValue), 0);

  if (vehiclePrice <= 0) {
    setAutoEmptyState("");
    return;
  }

  if (vehiclePrice > autoMaximumVehiclePrice) {
    fields.vehiclePrice.setCustomValidity("Maximum vehicle price is $80,000.");
    setAutoEmptyState("");
    return;
  }

  const apr = Math.max(valueOf(fields.creditScore), 0);
  const termMonths = Math.max(valueOf(fields.term), 36);
  const taxTitle = getAutoTaxTitle(vehiclePrice);
  const totalAmount = Math.max(vehiclePrice - downPayment - tradeInValue + taxTitle, 0);
  const monthlyPayment = monthlyLoanPayment(totalAmount, apr, termMonths);

  output.monthlyPayment.textContent = currency.format(monthlyPayment);
  output.apr.textContent = formatApr(apr);
  output.vehicleBudget.textContent = currency.format(vehiclePrice);
  output.displayDownPayment.textContent = formatSignedCurrency(-downPayment);
  output.tradeInValue.textContent = formatSignedCurrency(-tradeInValue);
  output.taxTitle.textContent = currency.format(taxTitle);
  output.totalAmount.textContent = currency.format(totalAmount);
  output.monthlyPaymentSummary.textContent = currency.format(monthlyPayment);
  output.notice.textContent = "";
  setEstimateAvailable(output, true);
}

function openPrequalifyModal(product) {
  if (product === "mortgage") {
    prequalifyTitle.textContent = "We will reach out with a proposal";
    prequalifyMessage.textContent = "A mortgage specialist will review your request and reach out with a proposal based on the home details you entered.";
  } else {
    prequalifyTitle.textContent = "We will reach out with a proposal";
    prequalifyMessage.textContent = "An auto lending specialist will review your request and reach out with a proposal based on the vehicle details you entered.";
  }

  prequalifyModal.hidden = false;
  closePrequalifyModal.focus();
}

function closePrequalifyDialog() {
  prequalifyModal.hidden = true;
}
function showProduct(product) {
  currentProduct = product;
  productStart.hidden = true;
  calculatorShell.hidden = false;

  Object.entries(panels).forEach(([key, panel]) => {
    panel.hidden = key !== product;
    panel.classList.toggle("is-active", key === product);
  });
}

function showStart() {
  productStart.hidden = false;
  calculatorShell.hidden = true;

  Object.values(panels).forEach((panel) => {
    panel.hidden = true;
    panel.classList.remove("is-active");
  });
}

[
  mortgage.fields.homePrice,
  mortgage.fields.downPayment,
  mortgage.fields.propertyTax,
  mortgage.fields.insurance,
].forEach((input) =>
  input.addEventListener("input", () => {
    mortgageTouched = true;
    calculateMortgage();
  }),
);

mortgage.fields.creditScore.addEventListener("change", calculateMortgage);
mortgage.fields.homePrice.addEventListener("blur", () => {
  seedMortgageDownPayment();
  calculateMortgage();
});
mortgage.fields.term.forEach((input) => input.addEventListener("change", calculateMortgage));
mortgage.fields.downPayment.addEventListener("blur", normalizeMortgageDownPayment);

auto.fields.vehiclePrice.addEventListener("input", () => {
  syncVehiclePriceSliderFromInput();
  calculateAuto();
});

auto.fields.vehiclePrice.addEventListener("blur", normalizeAutoVehiclePrice);

auto.fields.vehiclePriceSlider.addEventListener("input", () => {
  syncVehiclePriceInputFromSlider();
  calculateAuto();
});

[auto.fields.downPayment, auto.fields.tradeInValue].forEach((input) =>
  input.addEventListener("input", calculateAuto),
);

[auto.fields.creditScore, auto.fields.term].forEach((input) =>
  input.addEventListener("change", calculateAuto),
);

productCards.forEach((card) =>
  card.addEventListener("click", () => {
    showProduct(card.dataset.productCard);
  }),
);

backToProducts.addEventListener("click", showStart);

document.querySelectorAll(".apply-now").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.id === "mortgageApply") {
      mortgageTouched = true;
      calculateMortgage();
      if (!mortgage.output.apply.disabled) {
        openPrequalifyModal("mortgage");
      }
      return;
    }

    if (button.id === "autoApply") {
      calculateAuto();
      if (!auto.output.apply.disabled) {
        openPrequalifyModal("auto");
      }
      return;
    }

    if (button.id === "confirmPrequalifyModal") {
      closePrequalifyDialog();
    }
  });
});

closePrequalifyModal.addEventListener("click", closePrequalifyDialog);
confirmPrequalifyModal.addEventListener("click", closePrequalifyDialog);
prequalifyModal.addEventListener("click", (event) => {
  if (event.target === prequalifyModal) {
    closePrequalifyDialog();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !prequalifyModal.hidden) {
    closePrequalifyDialog();
  }
});

updateMortgageRate();
calculateMortgage();
syncVehiclePriceSliderFromInput();
updateVehiclePriceSliderFill();
calculateAuto();
showStart();






