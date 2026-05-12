import { InputSkeleton } from '@/components/ui/Form/Input';
import { LabelSkeleton } from '@/components/ui/Form/Label';
import { TextareaSkeleton } from '@/components/ui/Form/Textarea';
import React from 'react';

const MealScheduleInputsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </div>
      ))}
      <div className="space-y-2">
        <LabelSkeleton />
        <TextareaSkeleton rows={3} />
      </div>
    </>
  );
};

export default MealScheduleInputsSkeleton;
