const TOTAL_STEPS = 4;
let currentStep = 1;

const selections = {
  base: null,
  addons: [],
  sauce: null,
};

// kcal / protein(g) / carbs(g) / fat(g) per listed portion
const MACROS = {
  base: {
    "Rice & Chicken": { kcal: 378, protein: 49, carbs: 28, fat: 6 },
    "Beef & Sweet Potato": { kcal: 590, protein: 62, carbs: 42, fat: 18 },
  },
  addons: {
    "Eggs": { kcal: 144, protein: 13, carbs: 1, fat: 10 },
    "Parmiggiano Block": { kcal: 129, protein: 11, carbs: 1, fat: 9 },
    "Dates": { kcal: 111, protein: 1, carbs: 30, fat: 0 },
    "Broccoli": { kcal: 35, protein: 2, carbs: 7, fat: 0 },
  },
  sauce: {
    "Honey-Lime": { kcal: 50, protein: 0, carbs: 14, fat: 0 },
    "Guac": { kcal: 45, protein: 1, carbs: 3, fat: 4 },
  },
};

const screens = document.querySelectorAll(".screen");
const stepEls = document.querySelectorAll(".steps li");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const summaryEl = document.getElementById("summary");
const macroKcalEl = document.getElementById("macroKcal");
const macroProteinEl = document.getElementById("macroProtein");
const macroCarbsEl = document.getElementById("macroCarbs");
const macroFatEl = document.getElementById("macroFat");
const macroValueEls = [macroKcalEl, macroProteinEl, macroCarbsEl, macroFatEl];

function updateMacros() {
  const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

  const add = (entry) => {
    if (!entry) return;
    totals.kcal += entry.kcal;
    totals.protein += entry.protein;
    totals.carbs += entry.carbs;
    totals.fat += entry.fat;
  };

  add(MACROS.base[selections.base]);
  selections.addons.forEach((name) => add(MACROS.addons[name]));
  add(MACROS.sauce[selections.sauce]);

  macroKcalEl.textContent = Math.round(totals.kcal);
  macroProteinEl.textContent = `${Math.round(totals.protein)}g`;
  macroCarbsEl.textContent = `${Math.round(totals.carbs)}g`;
  macroFatEl.textContent = `${Math.round(totals.fat)}g`;

  macroValueEls.forEach((el) => {
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  });
}

document.querySelectorAll(".options").forEach((group) => {
  const key = group.dataset.group;
  const mode = group.dataset.mode;

  group.querySelectorAll(".option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value;

      if (mode === "single") {
        selections[key] = value;
        group.querySelectorAll(".option").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      } else {
        const list = selections[key];
        const i = list.indexOf(value);
        if (i === -1) {
          list.push(value);
          btn.classList.add("selected");
        } else {
          list.splice(i, 1);
          btn.classList.remove("selected");
        }
      }

      updateNextState();
      updateMacros();
    });
  });
});

function canAdvance() {
  if (currentStep === 1) return !!selections.base;
  if (currentStep === 2) return true; // add-ons optional
  if (currentStep === 3) return !!selections.sauce;
  return true;
}

function updateNextState() {
  nextBtn.disabled = !canAdvance();
}

function renderSummary() {
  const addonsText = selections.addons.length ? selections.addons.join(", ") : "None";
  summaryEl.innerHTML = `
    <li>
      <span class="summary-label">Base</span>
      <span class="summary-value">${selections.base}</span>
    </li>
    <li>
      <span class="summary-label">Add-ons</span>
      <span class="summary-value">${addonsText}</span>
    </li>
    <li>
      <span class="summary-label">Sauce</span>
      <span class="summary-value">${selections.sauce}</span>
    </li>
  `;
}

function goToStep(step) {
  currentStep = step;

  screens.forEach((s) => s.classList.toggle("active", Number(s.dataset.screen) === step));

  stepEls.forEach((el) => {
    const n = Number(el.dataset.step);
    el.classList.toggle("active", n === step);
    el.classList.toggle("done", n < step);
  });

  backBtn.disabled = step === 1;

  if (step === TOTAL_STEPS) {
    renderSummary();
    nextBtn.textContent = "Place order";
  } else {
    nextBtn.textContent = "Next";
  }

  updateNextState();
}

nextBtn.addEventListener("click", () => {
  if (!canAdvance()) return;

  if (currentStep === TOTAL_STEPS) {
    placeOrder();
    return;
  }

  goToStep(currentStep + 1);
});

backBtn.addEventListener("click", () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

function placeOrder() {
  nextBtn.disabled = true;
  nextBtn.textContent = "Order placed";
}

goToStep(1);
updateMacros();

const SOON_COPY = {
  days: {
    title: "Automate a day or two",
    text: "Planning out a couple days of meals is coming soon. For now, you can order a meal at a time.",
  },
  stack: {
    title: "Automate my whole meal stack",
    text: "Recurring, set-and-forget meal plans are coming soon. For now, you can order a meal at a time.",
  },
};

const views = document.querySelectorAll(".view");
const viewLanding = document.getElementById("viewLanding");
const viewSoon = document.getElementById("viewSoon");
const viewBuilder = document.getElementById("viewBuilder");
const soonTitle = document.getElementById("soonTitle");
const soonText = document.getElementById("soonText");
const soonBack = document.getElementById("soonBack");
const builderBack = document.getElementById("builderBack");

function showView(view) {
  views.forEach((v) => v.classList.toggle("active", v === view));
}

document.querySelectorAll(".landing-card").forEach((card) => {
  card.addEventListener("click", () => {
    const target = card.dataset.target;

    if (target === "order") {
      showView(viewBuilder);
      return;
    }

    const copy = SOON_COPY[target];
    soonTitle.textContent = copy.title;
    soonText.textContent = copy.text;
    showView(viewSoon);
  });
});

soonBack.addEventListener("click", () => showView(viewLanding));
builderBack.addEventListener("click", () => {
  selections.base = null;
  selections.addons = [];
  selections.sauce = null;
  document.querySelectorAll(".option.selected").forEach((el) => el.classList.remove("selected"));
  goToStep(1);
  updateMacros();
  showView(viewLanding);
});
