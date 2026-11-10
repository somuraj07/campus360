'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Upload } from 'lucide-react';

interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  teacher: {
    name: string;
  };
  dueDate: string | null;
  assignedDate: string | null;
  hasSubmitted?: boolean;
  submission?: {
    id: string;
    fileUrl: string | null;
    submittedAt: string;
  } | null;
}

interface HomeworkCardProps {
  homework: Homework;
  onUpload: (homeworkId: string) => void;
  isUploading?: boolean;
}

export default function HomeworkCard({
  homework,
  onUpload,
  isUploading = false,
}: HomeworkCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Not set';
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Not set';
    }
  };

  const getStatus = () => {
    if (homework.hasSubmitted) {
      return 'Submitted';
    }
    if (homework.dueDate) {
      const due = new Date(homework.dueDate);
      const now = new Date();
      if (now > due) {
        return 'Late';
      }
    }
    return 'Pending';
  };

  const status = getStatus();
  const statusColor =
    status === 'Pending'
      ? 'border-orange-400 text-orange-700 dark:text-orange-300'
      : status === 'Submitted'
      ? 'border-primary text-primary'
      : 'border-red-400 text-red-700 dark:text-red-300';

  return (
    <div className="somu rounded-2xl p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-primary">{homework.subject}</p>
          <h3 className="text-lg font-semibold">{homework.title}</h3>
          <p className="text-sm text-fg-muted">
            {homework.teacher.name} • Due: {formatDate(homework.dueDate)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className={`px-4 py-1 rounded-full text-xs border ${statusColor}`}>
            {status}
          </span>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-6 space-y-4 border-t border-line-strong pt-4">
          <p className="text-sm text-fg-muted">
            {homework.description}
          </p>

          {homework.submission?.fileUrl && (
            <div className="text-sm text-fg-muted">
              <p>Submitted on: {formatDate(homework.submission.submittedAt)}</p>
              {homework.submission.fileUrl && (
                <a
                  href={homework.submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View submitted file
                </a>
              )}
            </div>
          )}

          {!homework.hasSubmitted && (
            <button
              onClick={() => onUpload(homework.id)}
              disabled={isUploading}
              className="w-full flex justify-center items-center gap-2 py-3 rounded-xl border border-primary text-primary hover:bg-primary/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={18} />
              {isUploading ? 'Uploading...' : 'Upload Submission'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
