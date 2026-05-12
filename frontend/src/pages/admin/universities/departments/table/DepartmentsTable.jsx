import { DepartmentCard, DepartmentCardSkeleton } from '@/components/ui/cards/DepartementCard';
import ActionButtons from './ActionButtons';
import { EmptyData } from '@/components/ui/Table';


const DepartmentsTable = ({ rows, isLoading }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <DepartmentCardSkeleton key={index} />
        ))
      ) : (
        rows.length == 0 ? (
          <div className='my-10 col-span-1 md:col-span-2 lg:col-span-3'>
            <EmptyData />
          </div>
        ) : (
          rows.map((department) => (
            <DepartmentCard 
              key={department.id}
              department={department}
            >
              <ActionButtons row={{ id: department.id }} />
            </DepartmentCard>
          ))
        )
      )}

    </div>
  )
}

export default DepartmentsTable
