const glass = "bg-elev-1 border border-line shadow-card";

export default function BestQualities() {
  const q = [
    { l: "Leadership", v: "92%" },
    { l: "Creativity", v: "88%" },
    { l: "Discipline", v: "95%" },
    { l: "Teamwork", v: "90%" },
  ];

  return (
    <div className={`${glass} rounded-2xl p-5`}>
      <h3 className="font-semibold mb-4">Best Qualities</h3>
      <div className="grid grid-cols-2 gap-3">
        {q.map((x) => (
          <div key={x.l} className="bg-elev-2 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-primary">{x.v}</div>
            <div className="text-xs text-fg-subtle">{x.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
