'use client';

const categories = [
  'Pizza', 'Gourmet Pizza', 'Sicilian Pizza', 'Chicken Wings',
  'Cheesesteaks', 'Fresh Burgers', 'Appetizers', 'Fresh Salads',
  'Pasta', 'Complete Dinners', 'Seafood', 'Quesadillas',
  'Latin Food', 'Subs & Grinders', 'Strombolis & Calzones',
  'Breakfast', 'Hot Sandwiches', 'Desserts', 'Soups', 'Drinks', 'Side Orders'
];

export default function CategoryRail() {
  return (
    <nav className="sticky top-[72px] z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-2.5">

        {/* Featured Specials Shortcut */}
        <a
          href="#promotions"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ember/20 border border-ember text-ember-bright hover:bg-ember hover:text-white text-xs md:text-sm font-bold transition-all duration-200 shadow-md"
        >
          🔥 Deals &amp; Specials
        </a>

        {categories.map((category) => {
          const targetId = category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
          return (
            <a
              key={category}
              href={`#${targetId}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-panel border border-panel-border text-stone hover:text-cream hover:border-gold-deep text-xs md:text-sm font-medium transition-all duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-ember inline-block flex-shrink-0" />
              {category}
            </a>
          );
        })}

        <a
          href="#catering"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-panel-2 border border-gold text-gold-bright hover:bg-gold hover:text-[#1c1408] text-xs md:text-sm font-bold transition-all duration-200"
        >
          🍽️ Catering
        </a>
      </div>
    </nav>
  );
}