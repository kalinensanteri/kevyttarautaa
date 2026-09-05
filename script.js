let currentOrderType = null; // "simpleman1" | "simpleman2" | "custom"

document.getElementById("yesBtn").addEventListener("click", () => {
  document.getElementById("page1").classList.add("hidden");
  document.getElementById("page2").classList.remove("hidden");
});

document.querySelectorAll(".simpleman-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentOrderType = btn.dataset.type;
    document.getElementById("page2").classList.add("hidden");
    document.getElementById("page3").classList.remove("hidden");
  });
});

document.getElementById("createOwnBtn").addEventListener("click", () => {
  document.getElementById("page2").classList.add("hidden");
  document.getElementById("page4").classList.remove("hidden");
});

document.getElementById("createOwnNextBtn").addEventListener("click", () => {
  currentOrderType = "custom";
  document.getElementById("page4").classList.add("hidden");
  document.getElementById("page3").classList.remove("hidden");
});

document.querySelectorAll(".options").forEach((group) => {
  const mode = group.dataset.mode;

  group.querySelectorAll(".option").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (mode === "single") {
        group.querySelectorAll(".option").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      } else {
        btn.classList.toggle("selected");
      }
      updateMacroTotal();
    });
  });
});

function updateMacroTotal() {
  const totalKcalEl = document.getElementById("totalKcal");
  if (!totalKcalEl) return;

  const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

  document.querySelectorAll("#page4 .option.selected").forEach((el) => {
    totals.kcal += Number(el.dataset.kcal || 0);
    totals.protein += Number(el.dataset.protein || 0);
    totals.carbs += Number(el.dataset.carbs || 0);
    totals.fat += Number(el.dataset.fat || 0);
  });

  totalKcalEl.textContent = totals.kcal;
  document.getElementById("totalProtein").textContent = totals.protein;
  document.getElementById("totalCarbs").textContent = totals.carbs;
  document.getElementById("totalFat").textContent = totals.fat;
}

function getSelectedValue(group) {
  const el = document.querySelector(`.options[data-group="${group}"] .option.selected`);
  return el ? el.dataset.value : null;
}

function getSelectedValues(group) {
  return Array.from(document.querySelectorAll(`.options[data-group="${group}"] .option.selected`)).map(
    (el) => el.dataset.value
  );
}

document.getElementById("payBtn").addEventListener("click", async () => {
  const payBtn = document.getElementById("payBtn");
  payBtn.disabled = true;
  payBtn.textContent = "Redirecting...";

  const selections =
    currentOrderType === "custom"
      ? {
          protein: getSelectedValue("protein"),
          carb: getSelectedValue("carb"),
          addons: getSelectedValues("addons"),
          sauce: getSelectedValue("sauce"),
        }
      : undefined;

  try {
    const res = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: currentOrderType, selections }),
    });
    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Something went wrong.");
      payBtn.disabled = false;
      payBtn.textContent = "Pay";
    }
  } catch (err) {
    alert("Could not reach payment server.");
    payBtn.disabled = false;
    payBtn.textContent = "Pay";
  }
});
