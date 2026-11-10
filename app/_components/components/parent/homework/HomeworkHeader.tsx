'use client';

import { SaPageHeader } from '../../common/ui';

interface HomeworkHeaderProps {
  studentName: string;
}

export default function HomeworkHeader({ studentName }: HomeworkHeaderProps) {
  return (
    <SaPageHeader
      eyebrow="Your child"
      title="Homework & Assignments"
      description={`Track and submit ${studentName}'s homework`}
    />
  );
}
