interface CategoryChipsProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

const BASE = 'rounded-full border-[1.5px] px-3.5 py-1.5 text-[15px] transition-colors duration-150';
const ON = 'border-ink bg-ink font-semibold text-paper';
const OFF = 'border-line text-ink-dim hover:border-ink-faint hover:text-ink';

export default function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  return (
    <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2.5">
      <button
        type="button"
        aria-pressed={selected === null}
        onClick={() => onSelect(null)}
        className={`${BASE} ${selected === null ? ON : OFF}`}
      >
        Todo
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={selected === category}
          onClick={() => onSelect(selected === category ? null : category)}
          className={`${BASE} ${selected === category ? ON : OFF}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
