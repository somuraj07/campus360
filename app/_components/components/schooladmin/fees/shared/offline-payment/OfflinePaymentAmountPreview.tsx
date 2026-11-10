export function OfflinePaymentAmountPreview({
  amount,
  setAmount,
  numericAmount,
  remainingFee,
  preview,
  headOptions,
}: {
  amount: string;
  setAmount: (v: string) => void;
  numericAmount: number;
  remainingFee: number;
  preview: { items: Array<{ key: string; dueBefore: number; dec: number; dueAfter: number }> } | null;
  headOptions: Array<{ key: string; label: string }>;
}) {
  return (
    <div>
      <label className="block text-xs text-fg-muted mb-1">Amount (₹)</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-11 w-full rounded-lg border px-3.5 border-line-strong bg-surface text-sm text-fg placeholder:text-fg-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        placeholder="0.00"
      />
      {numericAmount > 0 && numericAmount > remainingFee + 0.01 ? (
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
          Max allowed: ₹{remainingFee.toFixed(0).toLocaleString()}
        </p>
      ) : null}
      {preview ? (
        <div className="mt-3 rounded-xl border border-line bg-elev-1 p-4">
          <p className="text-sm font-semibold">Decrease Preview</p>
          <p className="text-xs text-fg-muted mt-0.5">
            Amount: ₹{numericAmount.toFixed(0).toLocaleString()}
          </p>
          <div className="mt-3 space-y-2">
            {preview.items.map((it) => {
              const label = headOptions.find((h) => h.key === it.key)?.label ?? it.key;
              return (
                <div key={it.key} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-fg truncate">{label}</span>
                  <div className="text-right">
                    <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                      -₹{it.dec.toFixed(0).toLocaleString()}
                    </div>
                    <div className="text-xs text-fg-subtle mt-0.5">
                      Due after: ₹{it.dueAfter.toFixed(0).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
