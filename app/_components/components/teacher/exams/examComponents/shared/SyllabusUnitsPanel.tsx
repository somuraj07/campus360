import { CheckCircle2, Plus, Trash2 } from "lucide-react";

type Unit = { id: number; unitId?: string; name: string; status: string; completion: number };

export function SyllabusUnitsPanel({
  units,
  onUnitsChange,
  onAddUnit,
  onRemoveUnit,
}: {
  units: Unit[];
  onUnitsChange: (units: Unit[]) => void;
  onAddUnit: () => void;
  onRemoveUnit: (id: number) => void;
}) {
  return (
    <div className="lg:col-span-8 bg-elev-1 border-b border-line rounded-[1rem] flex flex-col overflow-hidden shadow-card">
      {/* Header Section */}
      <div className="p-6 border-b border-line flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-fg flex items-center gap-2"><CheckCircle2 className="text-primary" />Syllabus & Coverage</h2>
        </div>
        <button
          type="button"
          onClick={onAddUnit}
          className="px-3 py-1.5 bg-elev-1 hover:bg-elev-3 border border-line text-xs font-bold
          rounded-lg transition-all text-primary hover:text-fg flex items-center gap-1.5"
        >
          <Plus /> Add Unit
        </button>
      </div>

      {/* Units Content */}
      <div className="lg:col-span-2 rounded-2xl flex flex-col h-full overflow-hidden">
        {units.length === 0 ? (
          <p className="text-fg-subtle text-sm py-6 text-center">No syllabus units yet.</p>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {units.map((unit, idx) => (
                <div
                  key={unit.id}
                  className="bg-elev-1 border border-line-subtle rounded-xl p-4 animate-fadeIn"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* Number Badge */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-elev-1 text-fg-muted text-xs font-bold shrink-0 border border-line">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-4 lg:mb-2 gap-4">
                        <div>
                          <input
                            value={unit.name}
                            onChange={(e) => {
                              const newUnits = [...units];
                              newUnits[idx].name = e.target.value;
                              onUnitsChange(newUnits);
                            }}
                            placeholder="Unit / Topic Name"
                            className="w-full bg-transparent border-none p-0 text-fg font-medium
                             focus:outline-none placeholder:text-fg-faint focus:placeholder:text-fg-faint transition-all"
                          />
                          <div className="h-px bg-elev-2 w-full mt-2"></div>
                        </div>

                        {/* Fixed Remove Button: propagation stop ensures it clicks while scrolling */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveUnit(unit.id);
                          }}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-fg-subtle hover:text-red-700 dark:hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-5"/>
                        </button>
                      </div>

                      <div className="flex flex-col xl:flex-row items-start xl:items-center gap-6 xl:gap-8">
                        {/* Status Selection */}
                        <div className="shrink-0 z-10 w-full lg:w-auto">
                          <label className="block text-[10px] font-bold text-fg-subtle mb-2 uppercase tracking-wider">Status</label>
                          <div className="flex p-1 rounded-xl border border-line-subtle bg-well lg:bg-transparent inline-flex">
                            {["Pending", "Partial", "Completed"].map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => {
                                  const newUnits = [...units];
                                  newUnits[idx].status = status;
                                  if (status === "Completed") newUnits[idx].completion = 100;
                                  if (status === "Pending") newUnits[idx].completion = 0;
                                  onUnitsChange(newUnits);
                                }}
                                className={`px-3 lg:px-4 py-2 rounded-lg text-[10px] lg:text-[11px]  transition-all whitespace-nowrap ${
                                  unit.status === status
                                    ? status === "Completed" ? "bg-primary text-on-primary shadow-card" : status === "Partial" ? "bg-yellow-400 text-black" : "bg-red-500 text-white"
                                    : "text-fg-faint hover:text-fg-muted hover:bg-elev-2"
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Progress Slider */}
                        <div className="flex-1 w-full mt-2 lg:mt-0">
                          <div className="flex justify-between items-center mb-2 px-1">
                            <label className="block text-[10px] font-bold text-fg-subtle mb-2 uppercase tracking-wider">Completion %</label>
                            <span className="text-sm text-primary">{unit.completion}%</span>
                          </div>
                          <div className="relative h-6 flex items-center group">
                            <div className="h-2 w-full bg-elev-1 rounded-full relative">
                              <div
                                className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(180,255,57,0.5)] transition-all duration-300"
                                style={{ width: `${unit.completion}%` }}
                              />
                              <div
                                className="absolute top-1/2 h-4 w-4 bg-primary border-[3px] border-line rounded-full shadow-pop -translate-y-1/2 -translate-x-1/2 z-20"
                                style={{ left: `${unit.completion}%` }}
                              />
                            </div>
                            <input
                              type="range"
                              min="0" max="100" step="5"
                              value={unit.completion}
                              onChange={(e) => {
                                const newUnits = [...units];
                                const val = parseInt(e.target.value);
                                newUnits[idx].completion = val;
                                if (val === 100) newUnits[idx].status = "Completed";
                                else if (val > 0) newUnits[idx].status = "Partial";
                                else newUnits[idx].status = "Pending";
                                onUnitsChange(newUnits);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile-only Scroll Indicator Symbol */}
            <div className="flex lg:hidden justify-center items-center gap-1.5 mt-2">
              <div className="w-8 h-1 bg-primary/40 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-primary rounded-full animate-pulse"></div>
              </div>
              <span className="text-[8px] font-bold text-fg-faint uppercase tracking-widest">Swipe</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
