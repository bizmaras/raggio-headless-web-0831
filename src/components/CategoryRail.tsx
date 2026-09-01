'use client';

const CATEGORIES = [
  { label: 'Deals & Specials', searchId: 'promotions', dotColor: 'bg-red-500' },
  { label: 'Pizza', searchId: 'pizza', dotColor: 'bg-orange-500' },
  { label: 'Gourmet Pizza', searchId: 'gourmet', dotColor: 'bg-amber-500' },
  { label: 'Sicilian Pizza', searchId: 'sicilian', dotColor: 'bg-yellow-500' },
  { label: 'Chicken Wings', searchId: 'wing', dotColor: 'bg-lime-500' },
  { label: 'Cheesesteaks', searchId: 'cheesesteak', dotColor: 'bg-green-500' },
  { label: 'Fresh Burgers', searchId: 'burger', dotColor: 'bg-emerald-500' },
  { label: 'Appetizers', searchId: 'appetizer', dotColor: 'bg-teal-500' },
  { label: 'Fresh Salads', searchId: 'salad', dotColor: 'bg-cyan-500' },
  { label: 'Pasta', searchId: 'pasta', dotColor: 'bg-sky-500' },
  { label: 'Complete Dinners', searchId: 'dinner', dotColor: 'bg-blue-500' },
  { label: 'Seafood', searchId: 'seafood', dotColor: 'bg-indigo-500' },
  { label: 'Quesadillas', searchId: 'quesadilla', dotColor: 'bg-violet-500' },
  { label: 'Latin Food', searchId: 'latin', dotColor: 'bg-purple-500' },
  { label: 'Subs & Grinders', searchId: 'subs', dotColor: 'bg-fuchsia-500' },
  { label: 'Strombolis & Calzones', searchId: 'stromboli', dotColor: 'bg-pink-500' },
  { label: 'Breakfast', searchId: 'breakfast', dotColor: 'bg-rose-500' },
  { label: 'Hot Sandwiches', searchId: 'sandwiches', dotColor: 'bg-red-400' },
  { label: 'Desserts', searchId: 'dessert', dotColor: 'bg-orange-400' },
  { label: 'Soups', searchId: 'soup', dotColor: 'bg-amber-400' },
  { label: 'Drinks', searchId: 'drink', dotColor: 'bg-yellow-400' },
  { label: 'Side Orders', searchId: 'side', dotColor: 'bg-lime-400' },
  { label: 'Catering', searchId: 'catering', dotColor: 'bg-purple-600' }
];

export default function CategoryRail() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, searchId: string) => {
    // ÇÖZÜM: Deals (promotions) butonuna tıklandığında JS müdahalesini iptal et.
    // Tıpkı Header'daki hardal butonu gibi doğal HTML linki olarak çalışsın.
    if (searchId === 'promotions') {
      return;
    }

    e.preventDefault();

    let targetElement = document.getElementById(searchId);

    if (!targetElement) {
      const elements = Array.from(document.querySelectorAll('section, div, h1, h2, h3'));
      targetElement = elements.find(el => {
        const elId = el.id ? el.id.toLowerCase() : '';
        return elId.includes(searchId);
      }) as HTMLElement | null;
    }

    if (targetElement) {
      const topPosition = targetElement.getBoundingClientRect().top + window.scrollY - 180;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[72px] z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border py-4">
      <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 px-4 md:px-6 max-w-7xl mx-auto no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSpecial = cat.label === 'Deals & Specials';

          return (
            <a
              key={cat.label}
              href={`#${cat.searchId}`}
              onClick={(e) => handleScroll(e, cat.searchId)}
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