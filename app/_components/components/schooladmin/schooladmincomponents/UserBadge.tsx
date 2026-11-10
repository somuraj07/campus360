"use client";

interface UserBadgeProps {
  name: string;
  email: string;
  imageUrl?: string | null;
}

export default function UserBadge({ name, email, imageUrl }: UserBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-10 h-10 rounded-full object-cover border-2 border-line"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
          {name?.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <div className="text-sm font-medium text-fg">{name}</div>
        <div className="text-xs text-fg-subtle">{email}</div>
      </div>
    </div>
  );
}
