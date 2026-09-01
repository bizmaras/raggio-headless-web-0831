'use client';

const CATEGORIES = [
  { label: 'Deals & Specials', target: 'deals-and-specials' },
  { label: 'Pizza', target: 'pizza' },
  { label: 'Gourmet Pizza', target: 'gourmet-pizza' },
  { label: 'Sicilian Pizza', target: 'sicilian-pizza' },
  { label: 'Chicken Wings', target: 'chicken-wings' },
  { label: 'Cheesesteaks', target: 'cheesesteaks' },
  { label: 'Fresh Burgers', target: 'fresh-burgers' },
  { label: 'Appetizers', target: 'appetizers' },
  { label: 'Fresh Salads', target: 'fresh-salads' },
  { label: 'Pasta', target: 'pasta' },
  { label: 'Complete Dinners', target: 'complete-dinners' },
  { label: 'Seafood', target: 'seafood' },
  { label: 'Quesadillas', target: 'quesadillas' },
  { label: 'Latin Food', target: 'latin-food' },
  { label: 'Subs & Grinders', target: 'subs' },
  { label: 'Strombolis & Calzones', target: 'stromboli' },
  { label: 'Breakfast', target: 'breakfast' },
  { label: 'Hot Sandwiches', target: 'hot-sandwiches' },
  { label: 'Desserts', target: 'desserts' },
  { label: 'Soups', target: 'soups' },
  { label: 'Drinks', target: 'drinks' },
  { label: 'Side Orders', target: 'side-orders' },
  { label: 'Catering', target: 'catering' }
];

export default function CategoryRail() {
  return (
    <div className="sticky top-[72px] z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border py-4">
      <div className="flex flex-wrap justify-center gap-2 px-4 md:px-6 max-w-7xl mx-auto">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.label}
            href={`#${cat.target}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-panel-border bg-panel text-stone hover:text-cream hover:border-gold transition-all duration-300 text-sm font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {cat.label}
          </a>
        ))}
      </div>
    </div>
  );
}