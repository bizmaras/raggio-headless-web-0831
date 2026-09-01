'use client';

const CATEGORIES = [
  { label: 'Deals & Specials', searchId: 'promotions' },
  { label: 'Pizza', searchId: 'pizza' },
  { label: 'Gourmet Pizza', searchId: 'gourmet' },
  { label: 'Sicilian Pizza', searchId: 'sicilian' },
  { label: 'Chicken Wings', searchId: 'wing' },
  { label: 'Cheesesteaks', searchId: 'cheesesteak' },
  { label: 'Fresh Burgers', searchId: 'burger' },
  { label: 'Appetizers', searchId: 'appetizer' },
  { label: 'Fresh Salads', searchId: 'salad' },
  { label: 'Pasta', searchId: 'pasta' },
  { label: 'Complete Dinners', searchId: 'dinner' },
  { label: 'Seafood', searchId: 'seafood' },
  { label: 'Quesadillas', searchId: 'quesadilla' },
  { label: 'Latin Food', searchId: 'latin' },
  { label: 'Subs & Grinders', searchId: 'subs' },
  { label: 'Strombolis & Calzones', searchId: 'stromboli' },
  { label: 'Breakfast', searchId: 'breakfast' },
  { label: 'Hot Sandwiches', searchId: 'sandwiches' },
  { label: 'Desserts', searchId: 'dessert' },
  { label: 'Soups', searchId: 'soup' },
  { label: 'Drinks', searchId: 'drink' },
  { label: 'Side Orders', searchId: 'side' },
  { label: 'Catering', searchId: 'catering' }
];

export default function CategoryRail() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, searchId: string) => {
    // Deals (promotions) butonuna tıklandığında JS müdahalesini iptal et.
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
              {/* Tüm butonlarda standart kırmızı nokta kullanıldı */}
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {cat.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}