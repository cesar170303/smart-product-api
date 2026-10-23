interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <div
      role="search"
      className="group/search relative rounded-[10px] shadow-[4px_4px_0_var(--color-violet-deep)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-expo)] motion-reduce:transition-none focus-within:shadow-none motion-safe:focus-within:translate-x-1 motion-safe:focus-within:translate-y-1"
    >
      <label htmlFor="search" className="sr-only">
        Buscar productos
      </label>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-violet-soft"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="8.5" cy="8.5" r="5.5" />
        <path d="m13 13 4 4" />
      </svg>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Busca una bici, un iPhone, una lámpara…"
        autoComplete="off"
        spellCheck={false}
        className="h-12 w-full rounded-[10px] border-[1.5px] border-ink-faint/60 bg-sheet pr-4 pl-12 text-base text-ink transition-colors duration-150 focus:border-violet focus:outline-none focus-visible:outline-none"
      />
    </div>
  );
}
