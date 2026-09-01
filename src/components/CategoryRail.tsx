\'use client';

const CATEGORIES = [
  'Deals & Specials', 'Pizza', 'Gourmet Pizza', 'Sicilian Pizza', 'Chicken Wings',
  'Cheesesteaks', 'Fresh Burgers', 'Appetizers', 'Fresh Salads', 'Pasta',
  'Complete Dinners', 'Seafood', 'Quesadillas', 'Latin Food', 'Subs & Grinders',
  'Strombolis & Calzones', 'Breakfast', 'Hot Sandwiches', 'Desserts', 'Soups',
  'Drinks', 'Side Orders', 'Catering'
];

export default function CategoryRail() {
  return (
    <div className="sticky top-[72px] z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border py-4">
      <div className="flex flex-wrap justify-center gap-2 px-4 md:px-6 max-w-7xl mx-auto">
        {CATEGORIES.map((category) => {
          // Normal bağlantı linkini oluştur
          let targetId = category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

          // ÇÖZÜM: Çalışmayan butonların gideceği yerleri CSV dosyasındaki isimlere manuel olarak yönlendiriyoruz!
          if (category === 'Subs & Grinders') targetId = 'subs';
          if (category === 'Strombolis & Calzones') targetId = 'stromboli';
          if (category === 'Side Orders') targetId = 'sides';
          if (category === 'Chicken Wings') targetId = 'wings';
          if (category === 'Fresh Salads') targetId = 'salad';
          if (category === 'Cheesesteaks') targetId = 'steaks';

          return (
            <a
              key={category}
              href={`#${targetId}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-panel-border bg-panel text-stone hover:text-cream hover:border-gold transition-all duration-300 text-sm font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {category}
            </a>
          );
        })}
      </div>
    </div>
  );
}