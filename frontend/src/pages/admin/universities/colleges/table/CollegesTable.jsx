import { Button } from '@/components/ui/Button';
import ActionButtons from './ActionButtons';
import { EmptyData } from '@/components/ui/Table';
import { CollegeCard, CollegeCardSkeleton } from '@/components/ui/cards/CollegeCard';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';


const CollegesTable = ({ rows, isLoading = true }) => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <CollegeCardSkeleton key={index} />
        ))
      ) : (
        rows.length == 0 ? (
          <div className='my-10 col-span-1 md:col-span-2 lg:col-span-3'>
            <EmptyData />
          </div>
        ) : (
          rows.map((college) => (
            <CollegeCard 
              key={college.id}
              college={college}
            >
              <div className="w-full flex flex-wrap justify-center xl:justify-between gap-3">
                <Button 
                  variant="success" 
                  size="xs"
                  onClick={ () => openModal("add-department", { college: { collegeID: college.id, collegeName: college.name, university: college.university } })
                  }
                >
                  {t(`manage-colleges:cards.college_details.add_department_buttons`)}
                </Button>
                <ActionButtons row={{ id: college.id }} />
              </div>
              <Link
                to={`${college.id}/departments`}
                className="text-blue-600 hover:underline underline text-sm sm:text-base md:text-base lg:text-base font-semibold cursor-pointer"
              >
                {t(`manage-colleges:cards.college_details.departments_link`)}
              </Link>
            </CollegeCard>
          ))
        )
      )}

    </div>
  )
}

export default CollegesTable
