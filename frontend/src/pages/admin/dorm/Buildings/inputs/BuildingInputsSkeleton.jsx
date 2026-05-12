import { ChoiceSkeleton } from '@/components/ui/Form/Choice';
import { InputSkeleton } from '@/components/ui/Form/Input';
import { LabelSkeleton } from '@/components/ui/Form/Label';

const BuildingInputsSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </div>
      ))}
      <div className="space-y-2">
        <ChoiceSkeleton isCheckbox />
      </div>
    </div>
  );
};

export default BuildingInputsSkeleton;
