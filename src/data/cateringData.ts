export interface CateringItem {
  id: string;
  name: string;
  description: string;
  category: string;
  halfTrayPrice: string;
  fullTrayPrice: string;
  servesHalf: string;
  servesFull: string;
}

export const CATERING_ITEMS: CateringItem[] = [
  // CATERING SUB
  {
    id: 'sub-tray',
    name: 'Sub Tray',
    description: 'Assortment of fresh subs prepared for group events.',
    category: 'Subs',
    halfTrayPrice: '$50.00',
    fullTrayPrice: '$90.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'wrap-tray',
    name: 'Wrap Tray',
    description: 'Assortment of fresh wraps perfect for any gathering.',
    category: 'Subs',
    halfTrayPrice: '$50.00',
    fullTrayPrice: '$90.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },

  // CATERING APPS
  {
    id: 'cinnamon-bites',
    name: 'Cinnamon Bites',
    description: 'Sweet and delicious cinnamon bites.',
    category: 'Appetizers',
    halfTrayPrice: '$45.00',
    fullTrayPrice: '$90.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'jalapeno-poppers',
    name: 'Jalapeno Poppers',
    description: 'Served with Ranch Dressing.',
    category: 'Appetizers',
    halfTrayPrice: '$80.00',
    fullTrayPrice: '$170.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'onion-rings',
    name: 'Onion Rings',
    description: 'Served with Texas Sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$34.99',
    fullTrayPrice: '$84.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'mac-cheese-bites',
    name: 'Mac & Cheese Bites',
    description: 'Served with Marinara Sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$34.99',
    fullTrayPrice: '$84.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'mozzarella-sticks',
    name: 'Mozzarella Sticks',
    description: 'Served with Marinara Sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$110.00',
    fullTrayPrice: '$220.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'buffalo-mozzarella-sticks',
    name: 'Buffalo Mozzarella Sticks',
    description: 'Spicy buffalo-style mozzarella sticks.',
    category: 'Appetizers',
    halfTrayPrice: '$120.00',
    fullTrayPrice: '$230.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'garlic-knots',
    name: 'Garlic Knots',
    description: 'Served with Marinara Sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$60.00',
    fullTrayPrice: '$90.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'bread-sticks',
    name: 'Bread Sticks',
    description: 'Served with Marinara Sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$60.00',
    fullTrayPrice: '$110.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'buffalo-tenders',
    name: 'Buffalo Tenders',
    description: 'Crispy chicken tenders tossed in buffalo sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$80.00',
    fullTrayPrice: '$180.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'mozzarella-bread',
    name: 'Mozzarella Bread',
    description: 'Served with Marinara Sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$34.99',
    fullTrayPrice: '$84.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'broccoli-bites',
    name: 'Broccoli Bites',
    description: 'Served with Ranch Dressing.',
    category: 'Appetizers',
    halfTrayPrice: '$80.00',
    fullTrayPrice: '$120.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'fried-mushrooms',
    name: 'Fried Mushrooms',
    description: 'Served with Ranch Dressing.',
    category: 'Appetizers',
    halfTrayPrice: '$60.00',
    fullTrayPrice: '$120.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'buffalo-calamari',
    name: 'Buffalo Calamari',
    description: 'Served with Ranch Dressing.',
    category: 'Appetizers',
    halfTrayPrice: '$120.00',
    fullTrayPrice: '$235.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'fried-calamari',
    name: 'Fried Calamari',
    description: 'Served with Texas Sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$120.00',
    fullTrayPrice: '$210.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'jumbo-shrimp',
    name: 'Jumbo Shrimp',
    description: 'Served with Cocktail Sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$80.00',
    fullTrayPrice: '$200.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'plain-shrimp-basket',
    name: 'Plain Shrimp Basket',
    description: 'Served with Cocktail Sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$80.00',
    fullTrayPrice: '$180.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'buffalo-shrimp-basket',
    name: 'Buffalo Shrimp Basket',
    description: 'Crispy shrimp tossed in buffalo sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$80.00',
    fullTrayPrice: '$190.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'sampler-platter',
    name: 'Sampler Platter',
    description: 'Served with Honey Mustard, Ranch Dressing and Marinara Sauce.',
    category: 'Appetizers',
    halfTrayPrice: '$59.99',
    fullTrayPrice: '$120.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },

  // CATERING WINGS
  {
    id: 'traditional-wings',
    name: 'Traditional Wings',
    description: 'Classic bone-in wings.',
    category: 'Wings',
    halfTrayPrice: '$59.99',
    fullTrayPrice: '$134.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'breaded-wings',
    name: 'Breaded Wings',
    description: 'Crispy breaded bone-in wings.',
    category: 'Wings',
    halfTrayPrice: '$59.99',
    fullTrayPrice: '$134.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'boneless-wings',
    name: 'Boneless Wings',
    description: 'Tender boneless chicken wings.',
    category: 'Wings',
    halfTrayPrice: '$59.99',
    fullTrayPrice: '$134.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'chicken-tenders',
    name: 'Chicken Tenders',
    description: 'Crispy golden chicken tenders.',
    category: 'Wings',
    halfTrayPrice: '$59.99',
    fullTrayPrice: '$134.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },

  // CATERING FRIES
  {
    id: 'french-fries',
    name: 'French Fries',
    description: 'Served with Ketchup.',
    category: 'Fries',
    halfTrayPrice: '$45.00',
    fullTrayPrice: '$84.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'cheese-fries',
    name: 'Cheese Fries',
    description: 'Served with Ketchup.',
    category: 'Fries',
    halfTrayPrice: '$34.99',
    fullTrayPrice: '$84.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'old-bay-fries',
    name: 'Old Bay Fries',
    description: 'Served with Ketchup.',
    category: 'Fries',
    halfTrayPrice: '$34.99',
    fullTrayPrice: '$84.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'steak-fries',
    name: 'Steak Fries',
    description: 'Served with Ketchup.',
    category: 'Fries',
    halfTrayPrice: '$34.99',
    fullTrayPrice: '$84.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'cheese-steak-fries',
    name: 'Cheese Steak Fries',
    description: 'Served with Ketchup.',
    category: 'Fries',
    halfTrayPrice: '$60.00',
    fullTrayPrice: '$110.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'chicken-fries',
    name: 'Chicken Fries',
    description: 'Served with Ranch Dressing.',
    category: 'Fries',
    halfTrayPrice: '$60.00',
    fullTrayPrice: '$100.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'mega-fries',
    name: 'Mega Fries',
    description: 'Served with Ranch Dressing.',
    category: 'Fries',
    halfTrayPrice: '$34.99',
    fullTrayPrice: '$84.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'buffalo-chx-fries',
    name: 'Buffalo Chx Fries',
    description: 'Served with Buffalo Sauce and Ranch Dressing.',
    category: 'Fries',
    halfTrayPrice: '$60.00',
    fullTrayPrice: '$100.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'pizza-fries',
    name: 'Pizza Fries',
    description: 'Served with Marinara Sauce.',
    category: 'Fries',
    halfTrayPrice: '$34.99',
    fullTrayPrice: '$84.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'phillys-fries',
    name: "Philly's Fries",
    description: 'Served with Ranch Dressing.',
    category: 'Fries',
    halfTrayPrice: '$34.99',
    fullTrayPrice: '$84.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'curly-fries',
    name: 'Curly Fries',
    description: 'Served with Ketchup.',
    category: 'Fries',
    halfTrayPrice: '$45.00',
    fullTrayPrice: '$84.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },

  // CATERING SALAD
  {
    id: 'garden-salad',
    name: 'Garden Salad',
    description: 'Fresh mixed greens and assorted vegetables.',
    category: 'Salads',
    halfTrayPrice: '$40.00',
    fullTrayPrice: '$80.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'chicken-salad',
    name: 'Chicken Salad',
    description: 'Fresh salad topped with chicken.',
    category: 'Salads',
    halfTrayPrice: '$49.99',
    fullTrayPrice: '$99.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'buff-grlld-chx-salad',
    name: 'Buff Grlld Chx Salad',
    description: 'Salad topped with buffalo grilled chicken.',
    category: 'Salads',
    halfTrayPrice: '$49.99',
    fullTrayPrice: '$99.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'caesar-salad',
    name: 'Caesar Salad',
    description: 'Classic Caesar salad.',
    category: 'Salads',
    halfTrayPrice: '$40.00',
    fullTrayPrice: '$80.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'chx-caesar-salad',
    name: 'Chx Caesar Salad',
    description: 'Served with Caesar dressing.',
    category: 'Salads',
    halfTrayPrice: '$49.99',
    fullTrayPrice: '$99.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'shrimp-salad',
    name: 'Shrimp Salad',
    description: 'Fresh salad topped with shrimp.',
    category: 'Salads',
    halfTrayPrice: '$85.00',
    fullTrayPrice: '$200.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'chef-salad',
    name: 'Chef Salad',
    description: 'Classic chef salad with assorted meats and cheeses.',
    category: 'Salads',
    halfTrayPrice: '$49.99',
    fullTrayPrice: '$99.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'greek-salad',
    name: 'Greek Salad',
    description: 'Fresh salad with feta and olives.',
    category: 'Salads',
    halfTrayPrice: '$49.99',
    fullTrayPrice: '$99.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'greek-grlld-chx-salad',
    name: 'Greek Grlld Chx Salad',
    description: 'Greek salad topped with grilled chicken.',
    category: 'Salads',
    halfTrayPrice: '$49.99',
    fullTrayPrice: '$99.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'salmon-salad',
    name: 'Salmon Salad',
    description: 'Fresh salad topped with salmon.',
    category: 'Salads',
    halfTrayPrice: '$85.00',
    fullTrayPrice: '$190.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'steak-salad',
    name: 'Steak Salad',
    description: 'Fresh salad topped with steak.',
    category: 'Salads',
    halfTrayPrice: '$59.99',
    fullTrayPrice: '$119.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'tuna-salad',
    name: 'Tuna Salad',
    description: 'Fresh salad topped with tuna.',
    category: 'Salads',
    halfTrayPrice: '$49.99',
    fullTrayPrice: '$99.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'antipasto-salad',
    name: 'Antipasto Salad',
    description: 'Classic Italian antipasto salad.',
    category: 'Salads',
    halfTrayPrice: '$49.99',
    fullTrayPrice: '$99.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },

  // CATERING PASTA
  {
    id: 'cyo-pasta',
    name: 'CYO Pasta',
    description: 'Create Your Own Pasta.',
    category: 'Pasta',
    halfTrayPrice: '$49.95',
    fullTrayPrice: '$89.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'seafood-pasta',
    name: 'Seafood Pasta',
    description: 'Pasta tossed with fresh seafood.',
    category: 'Pasta',
    halfTrayPrice: '$80.00',
    fullTrayPrice: '$200.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'penne-primavera',
    name: 'Penne Primavera',
    description: 'Penne pasta with fresh mixed vegetables.',
    category: 'Pasta',
    halfTrayPrice: '$49.95',
    fullTrayPrice: '$89.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'shrimp-scallop-scampi',
    name: 'Shrimp & Scallop Scampi',
    description: 'Shrimp and scallops in scampi sauce over pasta.',
    category: 'Pasta',
    halfTrayPrice: '$85.00',
    fullTrayPrice: '$190.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'chicken-marsala',
    name: 'Chicken Marsala',
    description: 'Classic chicken marsala served over pasta.',
    category: 'Pasta',
    halfTrayPrice: '$49.95',
    fullTrayPrice: '$89.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'chicken-parmigiana',
    name: 'Chicken Parmigiana',
    description: 'Breaded chicken cutlets topped with tomato sauce and mozzarella.',
    category: 'Pasta',
    halfTrayPrice: '$49.95',
    fullTrayPrice: '$89.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'shrimp-parmigiana',
    name: 'Shrimp Parmigiana',
    description: 'Breaded shrimp topped with tomato sauce and mozzarella.',
    category: 'Pasta',
    halfTrayPrice: '$80.00',
    fullTrayPrice: '$160.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'lasagna',
    name: 'Lasagna',
    description: 'Classic baked layered pasta.',
    category: 'Pasta',
    halfTrayPrice: '$49.95',
    fullTrayPrice: '$89.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'lobster-ravioli',
    name: 'Lobster Ravioli',
    description: 'Ravioli stuffed with lobster meat.',
    category: 'Pasta',
    halfTrayPrice: '$80.00',
    fullTrayPrice: '$120.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'baked-ravioli',
    name: 'Baked Ravioli',
    description: 'Cheese ravioli baked with marinara and mozzarella.',
    category: 'Pasta',
    halfTrayPrice: '$49.95',
    fullTrayPrice: '$89.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'stuffed-shells',
    name: 'Stuffed Shells',
    description: 'Jumbo shells stuffed with ricotta and baked with cheese.',
    category: 'Pasta',
    halfTrayPrice: '$49.95',
    fullTrayPrice: '$89.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'baked-ziti',
    name: 'Baked Ziti',
    description: 'Ziti pasta baked with marinara, ricotta, and mozzarella.',
    category: 'Pasta',
    halfTrayPrice: '$49.95',
    fullTrayPrice: '$89.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'spaghetti-meat-sauce',
    name: 'Spaghetti Meat Sauce',
    description: 'Spaghetti served with hearty meat sauce.',
    category: 'Pasta',
    halfTrayPrice: '$49.95',
    fullTrayPrice: '$89.99',
    servesHalf: '8-10',
    servesFull: '15-20'
  },

  // CATERING LATIN
  {
    id: 'tacos',
    name: 'Tacos',
    description: 'Assorted tacos prepared fresh.',
    category: 'Latin',
    halfTrayPrice: '$60.00',
    fullTrayPrice: '$140.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'burritos',
    name: 'Burritos',
    description: 'Assorted burritos prepared fresh.',
    category: 'Latin',
    halfTrayPrice: '$80.00',
    fullTrayPrice: '$160.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'papusas',
    name: 'Papusas',
    description: 'Traditional Salvadoran stuffed flatbreads.',
    category: 'Latin',
    halfTrayPrice: '$80.00',
    fullTrayPrice: '$180.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'empanadas',
    name: 'Empanadas',
    description: 'Crispy pastry turnovers filled with savory ingredients.',
    category: 'Latin',
    halfTrayPrice: '$100.00',
    fullTrayPrice: '$200.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'carne-asada',
    name: 'Carne Asada',
    description: 'Grilled and sliced beef.',
    category: 'Latin',
    halfTrayPrice: '$100.00',
    fullTrayPrice: '$200.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'pollo-ranchero',
    name: 'Pollo Ranchero',
    description: 'Chicken prepared in a traditional ranchero sauce.',
    category: 'Latin',
    halfTrayPrice: '$85.00',
    fullTrayPrice: '$200.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'pollo-rostizado',
    name: 'Pollo Rostizado',
    description: 'Roasted chicken.',
    category: 'Latin',
    halfTrayPrice: '$85.00',
    fullTrayPrice: '$200.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'nachos',
    name: 'Nachos',
    description: 'Crispy tortilla chips with assorted toppings.',
    category: 'Latin',
    halfTrayPrice: '$60.00',
    fullTrayPrice: '$90.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'fajitas',
    name: 'Fajitas',
    description: 'Sizzling fajita mix for group catering.',
    category: 'Latin',
    halfTrayPrice: '$60.00',
    fullTrayPrice: '$140.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  },
  {
    id: 'quesadillas',
    name: 'Quesadillas',
    description: 'Assorted grilled tortillas filled with melted cheese and fillings.',
    category: 'Latin',
    halfTrayPrice: '$85.00',
    fullTrayPrice: '$180.00',
    servesHalf: '8-10',
    servesFull: '15-20'
  }
];