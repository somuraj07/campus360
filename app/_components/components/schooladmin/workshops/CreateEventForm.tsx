"use client";

import { X, SquarePen } from "lucide-react";
import SuccessPopup from "./SuccessPopup";
import { useCreateEventFormState } from "./shared";
import { EventBasicDetailsFields } from "./shared";
import { EventScheduleMediaFields } from "./shared";
import type { CreateEventFormProps } from "./shared";

export default function CreateEventForm({
  onCancel,
  onCreated,
  initialEvent,
  className,
}: CreateEventFormProps) {
  const {
    title,
    setTitle,
    date,
    setDate,
    time,
    setTime,
    location,
    setLocation,
    type,
    setType,
    difficulty,
    setDifficulty,
    mode,
    setMode,
    description,
    setDescription,
    additionalInfo,
    setAdditionalInfo,
    maxSeats,
    setMaxSeats,
    amount,
    setAmount,
    classId,
    setClassId,
    studentIds,
    setStudentIds,
    classStudents,
    photoFile,
    setPhotoFile,
    photoDataUrl,
    setPhotoDataUrl,
    photoUploading,
    setPhotoUploading,
    submitting,
    error,
    showSuccess,
    setShowSuccess,
    successTitle,
    fileInputRef,
    isEditing,
    classes,
    handlePublish,
  } = useCreateEventFormState({ onCancel, onCreated, initialEvent });

  return (
    <section className={`border border-primary/30 rounded-2xl p-4 sm:p-5 shadow-card relative overflow-hidden animate-fadeIn ${className ?? "bg-surface"} `}>
      <SuccessPopup
        open={showSuccess}
        title={successTitle}
        description="Your event is now available in the list."
        onClose={() => {
          setShowSuccess(false);
          onCancel?.();
        }}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl text-primary flex items-center justify-center">
            <SquarePen size={20} />
          </span>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-fg">
              {isEditing ? "Edit Event" : "Create New Event"}
            </h3>
            <p className="text-xs sm:text-sm text-fg-subtle">
              {isEditing
                ? "Update event details, schedule, and media"
                : "Add event details, schedule, and media"}
            </p>
          </div>
        </div>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-fg-muted hover:text-fg cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
        <EventBasicDetailsFields
          title={title}
          setTitle={setTitle}
          classId={classId}
          setClassId={setClassId}
          classes={classes}
          classStudents={classStudents}
          studentIds={studentIds}
          setStudentIds={setStudentIds}
          type={type}
          setType={setType}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          description={description}
          setDescription={setDescription}
          additionalInfo={additionalInfo}
          setAdditionalInfo={setAdditionalInfo}
        />

        <EventScheduleMediaFields
          amount={amount}
          setAmount={setAmount}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          location={location}
          setLocation={setLocation}
          mode={mode}
          setMode={setMode}
          maxSeats={maxSeats}
          setMaxSeats={setMaxSeats}
          fileInputRef={fileInputRef}
          photoUploading={photoUploading}
          setPhotoUploading={setPhotoUploading}
          photoFile={photoFile}
          setPhotoFile={setPhotoFile}
          photoDataUrl={photoDataUrl}
          setPhotoDataUrl={setPhotoDataUrl}
          error={error}
          onCancel={onCancel}
          onPublish={handlePublish}
          submitting={submitting}
          isEditing={isEditing}
        />
      </div>
    </section>
  );
}
