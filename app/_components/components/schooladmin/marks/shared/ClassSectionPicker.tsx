import { Check, Loader2, Search } from "lucide-react";

export function ClassSectionPicker({
  selectMode,
  selectedKeys,
  classSearch,
  onClassSearchChange,
  allVisibleSelected,
  onSelectAllVisible,
  classesLoading,
  filteredOptions,
  onToggleKey,
}: {
  selectMode: "class" | "section";
  selectedKeys: Set<string>;
  classSearch: string;
  onClassSearchChange: (v: string) => void;
  allVisibleSelected: boolean;
  onSelectAllVisible: () => void;
  classesLoading: boolean;
  filteredOptions: { key: string; label: string; hint: string | null }[];
  onToggleKey: (key: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <label className="text-xs font-medium text-fg-muted">
          {selectMode === "class" ? "CLASSES" : "SECTIONS"}{" "}
          <span className="text-primary">({selectedKeys.size} selected)</span>
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              value={classSearch}
              onChange={(e) => onClassSearchChange(e.target.value)}
              placeholder={selectMode === "class" ? "Search class…" : "Search section…"}
              className="w-full pl-9 pr-3 py-2 bg-well border border-line rounded-xl text-sm text-fg outline-none focus:border-primary/50"
            />
          </div>
          <button
            type="button"
            onClick={onSelectAllVisible}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-line bg-elev-1 hover:bg-elev-3 text-fg whitespace-nowrap"
          >
            {allVisibleSelected ? "Clear visible" : "Select all visible"}
          </button>
        </div>
      </div>

      {classesLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-64 overflow-y-auto no-scrollbar p-1">
          {filteredOptions.map((o) => {
            const on = selectedKeys.has(o.key);
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => onToggleKey(o.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm border transition ${
                  on
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-well border-line text-fg-muted hover:border-line-strong"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border shrink-0 ${
                    on ? "bg-primary border-primary text-on-primary" : "border-line-strong"
                  }`}
                >
                  {on ? <Check size={12} strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{o.label}</span>
                  {o.hint ? (
                    <span className="block text-[10px] text-fg-subtle truncate">{o.hint}</span>
                  ) : null}
                </span>
              </button>
            );
          })}
          {filteredOptions.length === 0 && (
            <p className="col-span-full text-sm text-fg-subtle py-4 text-center">
              No classes found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
