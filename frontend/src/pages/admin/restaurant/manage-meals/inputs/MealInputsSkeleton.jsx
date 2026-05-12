import { ChoiceSkeleton } from '@/components/ui/Form/Choice';
import { InputSkeleton } from '@/components/ui/Form/Input';
import { LabelSkeleton } from '@/components/ui/Form/Label';
import { TextareaSkeleton } from '@/components/ui/Form/Textarea';
import React from 'react';

const MealInputsSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </div>
      ))}
      <div className="space-y-2">
        <LabelSkeleton />
        <TextareaSkeleton rows={3} />
      </div>
      <div className="space-y-2">
        <ChoiceSkeleton isCheckbox />
      </div>
    </div>
  );
};

export default MealInputsSkeleton;
