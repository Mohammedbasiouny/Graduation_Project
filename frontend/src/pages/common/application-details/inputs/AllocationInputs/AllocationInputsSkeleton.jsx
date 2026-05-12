import { InputSkeleton } from '@/components/ui/Form/Input';
import { LabelSkeleton } from '@/components/ui/Form/Label';
import { TextareaSkeleton } from '@/components/ui/Form/Textarea';
import React from 'react';

const AllocationInputsSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </div>
      ))}
      <div className="space-y-2">
        <LabelSkeleton />
        <TextareaSkeleton rows={3} />
      </div>
    </div>
  );
};

export default AllocationInputsSkeleton;
