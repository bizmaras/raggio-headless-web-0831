'use client';

interface CategoryRailProps {
  categories: string[];
}

export default function CategoryRail({ categories = [] }: CategoryRailProps) {
  // Ensure Catering is always at the end
  const displayCategories = categories.includes('Catering')
    ? categories
    : [...categories, 'Catering'];

  // Automatically assign colors based on category keywords
  const getDotColor = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('special')) return 'bg-red-500';
    if (lower.includes('pizza')) return 'bg-orange-500';
    if (lower.includes('wing')) return 'bg-lime-500';
    if (lower.includes('steak')) return 'bg-green-500';
    if (lower.includes('burger')) return 'bg-emerald-500';
    if (lower.includes('salad')) return 'bg-cyan-500';
    if (lower.includes('pasta')) return 'bg-sky-500';
    if (lower.includes('sub') || lower.includes('grinder')) return 'bg-fuchsia-500';
    if (lower.includes('stromboli') || lower.includes('calzone')) return 'bg-pink-500';
    if (lower.includes('side')) return 'bg-lime-400';
    if (lower.includes('catering')) return 'bg-purple-600';
    if (lower.includes('appetizer')) return 'bg-teal-500';
    if (lower.includes('drink')) return 'bg-yellow-400';
    return 'bg-blue-500';
  };

  return (
    <div className="sticky top-[72px] z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border py-4">
      <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 px-4 md:px-6 max-w-7xl mx-auto no-scrollbar">
        {displayCategories.map((category) => {
          // This generates the EXACT same ID as page.tsx because it uses the real CSV string
          const targetId = category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
          const isSpecial = category.toLowerCase().includes('special');
          const dotColor = getDotColor(category);

          return (
            <a
              key={category}
              href={`#${targetId}`}
              className={`flex-none flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-sm font-medium whitespace-nowrap ${isSpecial
                  ? 'border-gold bg-panel text-cream hover:bg-gold/10'
                  : 'border-panel-border bg-panel text-stone hover:text-cream hover:border-gold'
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
              {category}
            </a>
          );
        })}
      </div>
    </div>
  );
}