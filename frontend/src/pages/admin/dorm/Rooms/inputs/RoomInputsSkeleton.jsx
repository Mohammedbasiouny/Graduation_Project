import { ChoiceSkeleton } from '@/components/ui/Form/Choice';
import { InputSkeleton } from '@/components/ui/Form/Input';
import { LabelSkeleton } from '@/components/ui/Form/Label';
import { TextareaSkeleton } from '@/components/ui/Form/Textarea';

const RoomInputsSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </div>
      ))}
      <div className="space-y-2">
        <LabelSkeleton />
        <TextareaSkeleton rows={4} />
      </div>
      <div className="space-y-2">
        <ChoiceSkeleton isCheckbox />
      </div>
    </div>
  );
};

export default RoomInputsSkeleton;
