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
const autoMinimumDownPayment = 0.1;
let currentProduct = "mortgage";
let mortgageTouched = false;
let autoTouched = false;

const productStart = document.querySelector("#products");
const calculatorShell = document.querySelector("#calculator");
const productCards = [...document.querySelectorAll("[data-product-card]")];
const backToProducts = document.querySelector("#backToProducts");
const panels = {
  mortgage: document.querySelector("#mortgage-panel"),
  auto: document.querySelector("#auto-panel"),
};

const mortgage = {
  fields: {
    homePrice: document.querySelector("#homePrice"),
    downPayment: document.querySelector("#downPayment"),
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
  },
};

const auto = {
  fields: {
    vehiclePrice: document.querySelector("#vehiclePrice"),
    downPayment: document.querySelector("#autoDownPayment"),
    interestRate: document.querySelector("#autoInterestRate"),
    salesTax: document.querySelector("#salesTax"),
    fees: document.querySelector("#autoFees"),
    term: [...document.querySelectorAll("input[name='autoTerm']")],
  },
  output: {
    monthlyPayment: document.querySelector("#autoMonthlyPayment"),
    amountFinanced: document.querySelector("#autoAmountFinanced"),
    totalInterest: document.querySelector("#autoTotalInterest"),
    taxesFees: document.querySelector("#autoTaxesFees"),
    totalPaid: document.querySelector("#autoTotalPaid"),
    downPercent: document.querySelector("#autoDownPercent"),
    notice: document.querySelector("#autoNotice"),
    principalBar: document.querySelector("#autoPrincipalBar"),
    interestBar: document.querySelector("#autoInterestBar"),
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
  resetWidths([output.principalBar, output.taxBar, output.insuranceBar]);
}

function setAutoEmptyState(message) {
  const output = auto.output;
  setEstimateAvailable(output, false);
  output.monthlyPayment.textContent = "$0";
  output.amountFinanced.textContent = "$0";
  output.totalInterest.textContent = "$0";
  output.taxesFees.textContent = "$0";
  output.totalPaid.textContent = "$0";
  output.downPercent.textContent = "0%";
  output.notice.textContent = message;
  resetWidths([output.principalBar, output.interestBar]);
}

function calculateMortgage() {
  const fields = mortgage.fields;
  const output = mortgage.output;
  clearCustomValidity([fields.homePrice, fields.downPayment]);
  output.downPaymentHelp.hidden = true;
  const missingRequired = !hasValue(fields.homePrice) || !hasValue(fields.downPayment);

  if (missingRequired) {
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

  const rate = Math.max(valueOf(fields.interestRate), 0);
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

function calculateAuto() {
  const fields = auto.fields;
  const output = auto.output;
  clearCustomValidity([fields.vehiclePrice, fields.downPayment]);
  const missingRequired = !hasValue(fields.vehiclePrice) || !hasValue(fields.downPayment);

  if (missingRequired) {
    setAutoEmptyState("");
    return;
  }

  const vehiclePrice = Math.max(valueOf(fields.vehiclePrice), 0);
  const downPayment = Math.min(Math.max(valueOf(fields.downPayment), 0), vehiclePrice);
  const minimumDownPayment = vehiclePrice * autoMinimumDownPayment;

  if (vehiclePrice < 7500) {
    fields.vehiclePrice.setCustomValidity("Enter a vehicle price of at least $7,500.");
    setAutoEmptyState("Enter a vehicle price of at least $7,500.");
    return;
  }

  if (downPayment < minimumDownPayment) {
    const message = `Minimum down payment is ${currency.format(minimumDownPayment)} for this vehicle price.`;
    fields.downPayment.setCustomValidity(message);
    setAutoEmptyState(message);
    return;
  }

  const rate = Math.max(valueOf(fields.interestRate), 0);
  const term = selectedValue(fields.term, 60);
  const taxesFees = vehiclePrice * (Math.max(valueOf(fields.salesTax), 0) / 100) + Math.max(valueOf(fields.fees), 0);
  const amountFinanced = Math.max(vehiclePrice + taxesFees - downPayment, 0);
  const monthlyPayment = monthlyLoanPayment(amountFinanced, rate, term);
  const totalPaid = monthlyPayment * term + downPayment;
  const totalInterest = Math.max(monthlyPayment * term - amountFinanced, 0);
  const downPaymentRatio = vehiclePrice > 0 ? downPayment / vehiclePrice : 0;

  output.monthlyPayment.textContent = currency.format(monthlyPayment);
  output.amountFinanced.textContent = currency.format(amountFinanced);
  output.totalInterest.textContent = currency.format(totalInterest);
  output.taxesFees.textContent = currency.format(taxesFees);
  output.totalPaid.textContent = currency.format(totalPaid);
  output.downPercent.textContent = percent.format(downPaymentRatio);
  output.notice.textContent =
    term > 60 ? "Longer terms can lower the payment but usually increase total interest." : "";
  setEstimateAvailable(output, true);

  setWidths([
    { element: output.principalBar, value: amountFinanced },
    { element: output.interestBar, value: totalInterest },
  ]);
}

function activeProduct() {
  return currentProduct;
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

[mortgage.fields.homePrice, mortgage.fields.downPayment, mortgage.fields.interestRate, mortgage.fields.propertyTax, mortgage.fields.insurance].forEach(
  (input) => input.addEventListener("input", () => {
    mortgageTouched = true;
    calculateMortgage();
  }),
);

mortgage.fields.term.forEach((input) => input.addEventListener("change", calculateMortgage));

mortgage.fields.downPayment.addEventListener("blur", normalizeMortgageDownPayment);

[auto.fields.vehiclePrice, auto.fields.downPayment, auto.fields.interestRate, auto.fields.salesTax, auto.fields.fees].forEach(
  (input) => input.addEventListener("input", () => {
    autoTouched = true;
    calculateAuto();
  }),
);

auto.fields.term.forEach((input) => input.addEventListener("change", calculateAuto));

productCards.forEach((card) =>
  card.addEventListener("click", () => {
    showProduct(card.dataset.productCard);
  }),
);

backToProducts.addEventListener("click", showStart);

document.querySelectorAll(".apply-now").forEach((button) => {
  button.addEventListener("click", () => {
    if (currentProduct === "mortgage") {
      mortgageTouched = true;
      calculateMortgage();
    } else {
      autoTouched = true;
      calculateAuto();
    }

    button.closest(".workspace")?.querySelector("form")?.reportValidity();
  });
});

calculateMortgage();
calculateAuto();
showStart();
