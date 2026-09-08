export interface SizeVariant {
  id: string; // 'sm' | 'med' | 'lrg' | 'xl'
  label: string; // 'SM' | 'MED' | 'LRG' | 'XL'
  fullName: {
    en: string;
    es: string;
  };
  inches?: string;
  price: number;
}

/**
 * Returns the size variants for a menu item based on its category and name.
 * If the item does not have size variants (e.g. burger, salad, wings, slice of pizza),
 * it returns null.
 */
export function getSizeVariants(
  category: string,
  productName: string,
  basePrice: number
): SizeVariant[] | null {
  const normCat = (category || "").trim().toLowerCase();
  const normName = (productName || "").trim().toLowerCase();

  // Exclude single slices, combos, or taco/pita items that don't have standard sizes
  if (
    normName.includes("slice") ||
    normName.includes("taco") ||
    normName.includes("on pita")
  ) {
    return null;
  }

  // 1. Classic Pizza (Plain Cheese, White Cheese)
  if (normCat === "pizza") {
    const isWhite = normName.includes("white");
    const offset = isWhite ? 1.0 : 0.0;
    return [
      {
        id: "sm",
        label: "SM",
        inches: '12"',
        fullName: { en: 'Small (12")', es: 'Pequeña (12")' },
        price: 11.99 + offset,
      },
      {
        id: "med",
        label: "MED",
        inches: '14"',
        fullName: { en: 'Medium (14")', es: 'Mediana (14")' },
        price: 13.99 + offset,
      },
      {
        id: "lrg",
        label: "LRG",
        inches: '16"',
        fullName: { en: 'Large (16")', es: 'Grande (16")' },
        price: 15.99 + offset,
      },
      {
        id: "xl",
        label: "XL",
        inches: '18"',
        fullName: { en: 'Extra Large (18")', es: 'Extra Grande (18")' },
        price: 17.99 + offset,
      },
    ];
  }

  // 2. Gourmet Pizza
  if (normCat === "gourmet pizza") {
    // Special gourmet items with unique base price
    if (normName.includes("shrimp alfredo")) {
      return [
        {
          id: "sm",
          label: "SM",
          inches: '12"',
          fullName: { en: 'Small (12")', es: 'Pequeña (12")' },
          price: 18.99,
        },
        {
          id: "med",
          label: "MED",
          inches: '14"',
          fullName: { en: 'Medium (14")', es: 'Mediana (14")' },
          price: 21.99,
        },
        {
          id: "lrg",
          label: "LRG",
          inches: '16"',
          fullName: { en: 'Large (16")', es: 'Grande (16")' },
          price: 23.99,
        },
        {
          id: "xl",
          label: "XL",
          inches: '18"',
          fullName: { en: 'Extra Large (18")', es: 'Extra Grande (18")' },
          price: 25.99,
        },
      ];
    }

    // Standard Gourmet Pizzas (Works, White Special, BBQ Chicken, Buffalo, Greek, etc.)
    return [
      {
        id: "sm",
        label: "SM",
        inches: '12"',
        fullName: { en: 'Small (12")', es: 'Pequeña (12")' },
        price: 15.99,
      },
      {
        id: "med",
        label: "MED",
        inches: '14"',
        fullName: { en: 'Medium (14")', es: 'Mediana (14")' },
        price: 17.99,
      },
      {
        id: "lrg",
        label: "LRG",
        inches: '16"',
        fullName: { en: 'Large (16")', es: 'Grande (16")' },
        price: 20.99,
      },
      {
        id: "xl",
        label: "XL",
        inches: '18"',
        fullName: { en: 'Extra Large (18")', es: 'Extra Grande (18")' },
        price: 25.99,
      },
    ];
  }

  // 3. Subs + Grinders, Cheesesteaks, Hot Sandwiches (SM / LRG / XL)
  if (
    normCat === "subs + grinders" ||
    normCat === "cheesesteaks" ||
    normCat === "hot sandwiches"
  ) {
    const lrgPrice = basePrice > 0 ? basePrice : 12.99;
    const smPrice = Math.max(8.99, lrgPrice - 3.0);
    const xlPrice = lrgPrice + 3.0;

    return [
      {
        id: "sm",
        label: "SM",
        inches: '10"',
        fullName: { en: 'Small (10")', es: 'Pequeño (10")' },
        price: parseFloat(smPrice.toFixed(2)),
      },
      {
        id: "lrg",
        label: "LRG",
        inches: '12"',
        fullName: { en: 'Large (12")', es: 'Grande (12")' },
        price: parseFloat(lrgPrice.toFixed(2)),
      },
      {
        id: "xl",
        label: "XL",
        fullName: { en: "Extra Large (XL)", es: "Extra Grande (XL)" },
        price: parseFloat(xlPrice.toFixed(2)),
      },
    ];
  }

  // 4. Strombolis + Calzones (MD / LG)
  if (
    normCat === "strombolis + calzones" ||
    normCat.includes("stromboli") ||
    normCat.includes("calzone")
  ) {
    const isSpecial = normName.includes("philly special");
    const mdPrice = isSpecial ? 15.99 : 14.99;
    const lgPrice = isSpecial ? 18.99 : 17.99;

    return [
      {
        id: "med",
        label: "MD",
        inches: '14"',
        fullName: { en: 'Medium (14")', es: 'Mediano (14")' },
        price: mdPrice,
      },
      {
        id: "lrg",
        label: "LG",
        inches: '16"',
        fullName: { en: 'Large (16")', es: 'Grande (16")' },
        price: lgPrice,
      },
    ];
  }

  return null;
}
