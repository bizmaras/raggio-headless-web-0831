'use client';

// Eğer dosyada önceden tanımlı kendi kategorileriniz varsa, sadece aşağıdaki map fonksiyonu içindeki 'targetId' kısmını kendi kodunuza uyarlayabilirsiniz.
// Kodu tamamen değiştiriyorsanız bu güncel ve düzeltilmiş halini doğrudan kullanabilirsiniz.

const CATEGORIES = [
  'Deals & Specials', 'Pizza', 'Gourmet Pizza', 'Sicilian Pizza', 'Chicken Wings',
  'Cheesesteaks', 'Fresh Burgers', 'Appetizers', 'Fresh Salads', 'Pasta',
  'Complete Dinners', 'Seafood', 'Quesadillas', 'Latin Food', 'Subs & Grinders',
  'Strombolis & Calzones', 'Breakfast', 'Hot Sandwiches', 'Desserts', 'Soups',
  'Drinks', 'Side Orders', 'Catering'
];

export default function CategoryRail() {
  return (
    <div className="sticky top-[72px] z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border py-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 px-6 max-w-7xl mx-auto w-max">
        {CATEGORIES.map((category) => {

          // ÇÖZÜM BURADA: Boşlukları tireye, '&' işaretlerini 'and' kelimesine çeviriyoruz.
          const targetId = category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

          return (
            <a
              key={category}
              href={`#${targetId}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-panel-border bg-panel text-stone hover:text-cream hover:border-gold transition-all duration-300 whitespace-nowrap text-sm font-medium"
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