"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (cat: string | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
          selected === null
            ? "bg-primary text-primary-foreground red-glow"
            : "glass text-muted-foreground hover:text-foreground"
        }`}
      >
        Todas
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            selected === cat
              ? "bg-[#00f5ff]/15 text-[#00f5ff] border border-[#00f5ff]/30"
              : "glass text-muted-foreground hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
