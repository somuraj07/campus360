import type { RefObject } from "react";
import { Image as ImageIcon, Loader2, Save, Trash2 } from "lucide-react";
import SearchInput from "../../../common/SearchInput";
import EventSelectField from "../EventSelectField";
import { uploadImage } from "../../../../utils/upload";
import { modeOptions } from "./createEventFormOptions";

export function EventScheduleMediaFields({
  amount,
  setAmount,
  date,
  setDate,
  time,
  setTime,
  location,
  setLocation,
  mode,
  setMode,
  maxSeats,
  setMaxSeats,
  fileInputRef,
  photoUploading,
  setPhotoUploading,
  photoFile,
  setPhotoFile,
  photoDataUrl,
  setPhotoDataUrl,
  error,
  onCancel,
  onPublish,
  submitting,
  isEditing,
}: {
  amount: string;
  setAmount: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  time: string;
  setTime: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  mode: string;
  setMode: (v: string) => void;
  maxSeats: string;
  setMaxSeats: (v: string) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  photoUploading: boolean;
  setPhotoUploading: (v: boolean) => void;
  photoFile: File | null;
  setPhotoFile: (v: File | null) => void;
  photoDataUrl: string | null;
  setPhotoDataUrl: (v: string | null) => void;
  error: string | null;
  onCancel?: () => void;
  onPublish: () => void;
  submitting: boolean;
  isEditing: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="text-xs font-bold text-fg-subtle uppercase tracking-wider">
        Schedule & Media
      </div>

      <SearchInput
        label="Amount (₹) - 0 for free"
        placeholder="0"
        value={amount}
        onChange={setAmount}
        variant="glass"
        type="number"
        inputClassName="[&::-webkit-inner-spin-button]:appearance-none"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SearchInput
          label="Date"
          placeholder="YYYY-MM-DD"
          value={date}
          onChange={setDate}
          variant="glass"
          type="date"
          inputClassName="[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-90"
        />
        <SearchInput
          label="Time"
          placeholder="HH:MM"
          value={time}
          onChange={setTime}
          variant="glass"
          type="time"
          inputClassName="[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-90"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SearchInput
          label="Location"
          placeholder="Location"
          value={location}
          onChange={setLocation}
          variant="glass"
        />
        <EventSelectField
          label="Mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          options={modeOptions}
          placeholder="Select mode"
        />
        <div>
          <label className="block text-xs sm:text-sm mb-1 text-fg-muted">
            Max Seats (optional)
          </label>
          <input
            type="number"
            min={1}
            placeholder="Unlimited if empty"
            value={maxSeats}
            onChange={(e) => setMaxSeats(e.target.value.replace(/\D/g, ""))}
            className="w-full rounded-xl bg-well border border-line-strong text-sm text-fg placeholder:text-fg-faint px-4 py-3 focus:outline-none focus:ring-0 focus:border-primary/60"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm mb-2 text-fg-muted">
          Event Media
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0] ?? null;
            if (!file) {
              setPhotoFile(null);
              setPhotoDataUrl(null);
              e.target.value = "";
              return;
            }
            setPhotoFile(file);
            setPhotoUploading(true);
            try {
              const url = await uploadImage(file, "events");
              setPhotoDataUrl(url);
            } catch (err) {
              alert(err instanceof Error ? err.message : "Failed to upload image");
              setPhotoFile(null);
            } finally {
              setPhotoUploading(false);
            }
            e.target.value = "";
          }}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {photoDataUrl ? (
            <div className="relative h-32 sm:h-36 rounded-2xl border border-line bg-well overflow-hidden">
              <img
                src={photoDataUrl}
                alt="Event"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoDataUrl(null);
                }}
                className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs text-fg hover:text-fg transition cursor-pointer"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>
          ) : null}

          <button
            type="button"
            disabled={photoUploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-32 sm:h-36 rounded-2xl border border-dashed border-line-strong bg-well text-fg-subtle flex flex-col items-center justify-center gap-2 hover:border-primary/60 hover:text-fg-muted transition cursor-pointer disabled:opacity-60"
          >
            {photoUploading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <ImageIcon size={22} />
            )}
            <span className="text-sm">
              {photoUploading ? "Uploading…" : photoFile ? "Photo selected" : "Add photo (high quality)"}
            </span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-5 py-2.5 border border-line-strong bg-elev-1 text-fg-muted hover:text-fg hover:border-line-strong hover:bg-elev-3 transition cursor-pointer text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary shadow-card  hover:bg-primary-hover transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {submitting
            ? isEditing
              ? "Updating..."
              : "Publishing..."
            : isEditing
              ? "Update Event"
              : "Publish Event"}
        </button>
      </div>
    </div>
  );
}
