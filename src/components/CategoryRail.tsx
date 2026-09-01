'use client';

// Categorized items with their respective target IDs and dot colors
const CATEGORIES = [
  { label: 'Deals & Specials', target: 'deals-and-specials', dotColor: 'bg-red-500' },
  { label: 'Pizza', target: 'pizza', dotColor: 'bg-orange-500' },
  { label: 'Gourmet Pizza', target: 'gourmet-pizza', dotColor: 'bg-amber-500' },
  { label: 'Sicilian Pizza', target: 'sicilian-pizza', dotColor: 'bg-yellow-500' },
  { label: 'Chicken Wings', target: 'chicken-wings', dotColor: 'bg-lime-500' },
  { label: 'Cheesesteaks', target: 'cheesesteaks', dotColor: 'bg-green-500' },
  { label: 'Fresh Burgers', target: 'fresh-burgers', dotColor: 'bg-emerald-500' },
  { label: 'Appetizers', target: 'appetizers', dotColor: 'bg-teal-500' },
  { label: 'Fresh Salads', target: 'fresh-salads', dotColor: 'bg-cyan-500' },
  { label: 'Pasta', target: 'pasta', dotColor: 'bg-sky-500' },
  { label: 'Complete Dinners', target: 'complete-dinners', dotColor: 'bg-blue-500' },
  { label: 'Seafood', target: 'seafood', dotColor: 'bg-indigo-500' },
  { label: 'Quesadillas', target: 'quesadillas', dotColor: 'bg-violet-500' },
  { label: 'Latin Food', target: 'latin-food', dotColor: 'bg-purple-500' },
  { label: 'Subs & Grinders', target: 'subs', dotColor: 'bg-fuchsia-500' },
  { label: 'Strombolis & Calzones', target: 'stromboli', dotColor: 'bg-pink-500' },
  { label: 'Breakfast', target: 'breakfast', dotColor: 'bg-rose-500' },
  { label: 'Hot Sandwiches', target: 'hot-sandwiches', dotColor: 'bg-red-400' },
  { label: 'Desserts', target: 'desserts', dotColor: 'bg-orange-400' },
  { label: 'Soups', target: 'soups', dotColor: 'bg-amber-400' },
  { label: 'Drinks', target: 'drinks', dotColor: 'bg-yellow-400' },
  { label: 'Side Orders', target: 'side-orders', dotColor: 'bg-lime-400' },
  { label: 'Catering', target: 'catering', dotColor: 'bg-purple-600' }
];

export default function CategoryRail() {
  return (
    <div className="sticky top-[72px] z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border py-4">
      <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 px-4 md:px-6 max-w-7xl mx-auto no-scrollbar">
        {CATEGORIES.map((cat) => {
          // Add special styling for Deals & Specials to match the provided image
          const isSpecial = cat.label === 'Deals & Specials';

          return (
            <a
              key={cat.label}
              href={`#${cat.target}`}
              className={`flex-none flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-sm font-medium whitespace-nowrap ${isSpecial
                  ? 'border-gold bg-panel text-cream hover:bg-gold/10'
                  : 'border-panel-border bg-panel text-stone hover:text-cream hover:border-gold'
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${cat.dotColor}`}></span>
              {cat.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}