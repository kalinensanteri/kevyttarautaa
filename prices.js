// Authoritative prices (EUR cents). Based on wholesale ("Tukku normaali", non-promotional)
// ingredient cost from the updated raaka-ainekustannukset sheet, doubled — 2x cost = 50% margin.

export const SIMPLEMAN_PRICES = {
  simpleman1: 714, // Simpleman 1 — Chicken/Rice/Broccoli/Eggs/Honey-Lime
  simpleman2: 960, // Simpleman 2 — Beef/Sweet Potato/Broccoli/Eggs/Guacamole
};

export const CUSTOM_PRICES = {
  protein: {
    "Chicken 70g": 126,
    "Chicken 140g": 254,
    "Chicken 210g": 380,
    "Beef 70g": 280,
    "Beef 140g": 560,
    "Beef 210g": 840,
  },
  carb: {
    "Rice 100g": 62,
    "Rice 200g": 124,
    "Rice 300g": 186,
    "Sweet Potato 100g": 28,
    "Sweet Potato 200g": 56,
    "Sweet Potato 300g": 84,
  },
  addons: {
    "Eggs 1": 48,
    "Eggs 2": 98,
    "Eggs 3": 146,
    "Eggs 4": 194,
    "Eggs 5": 242,
    "Eggs 6": 292,
    "Eggs 7": 340,
    "Eggs 8": 388,
    "Eggs 9": 436,
    "Eggs 10": 486,
    "Broccoli 100g": 98,
    "Broccoli 150g": 146,
    "Broccoli 200g": 196,
  },
  sauce: {
    "Honey-Lime Sauce": 202,
    "Guacamole": 178,
  },
};

// Computes the authoritative total (cents) for a custom build from item keys only —
// never trust a price sent by the client.
export function computeCustomTotal(selections) {
  let total = 0;

  if (selections.protein && CUSTOM_PRICES.protein[selections.protein] != null) {
    total += CUSTOM_PRICES.protein[selections.protein];
  }
  if (selections.carb && CUSTOM_PRICES.carb[selections.carb] != null) {
    total += CUSTOM_PRICES.carb[selections.carb];
  }
  if (selections.sauce && CUSTOM_PRICES.sauce[selections.sauce] != null) {
    total += CUSTOM_PRICES.sauce[selections.sauce];
  }
  if (Array.isArray(selections.addons)) {
    selections.addons.forEach((addon) => {
      if (CUSTOM_PRICES.addons[addon] != null) {
        total += CUSTOM_PRICES.addons[addon];
      }
    });
  }

  return total;
}
