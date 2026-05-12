import { ButtonSkeleton } from '@/components/ui/Button'
import { InputSkeleton } from '@/components/ui/Form/Input'
import { LabelSkeleton } from '@/components/ui/Form/Label'

const ChangeUserInfoSectionSkeleton = ({ length = 6 }) => {

  return (
    <div className='bg-white rounded-2xl shadow-md p-5 md:p-8 transition'>
      {/* Heading */}
      <div className="space-y-3">
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
      </div>

      <div className='space-y-10 mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
          {Array.from({ length }).map((_, index) => (
            <div key={index} className="space-y-2">
              <LabelSkeleton />
              <InputSkeleton />
            </div>
          ))}
        </div>

        <div className='flex flex-wrap justify-between gap-5'>
          <ButtonSkeleton />

          <div className='flex flex-wrap space-x-3'>
            <ButtonSkeleton />
            <ButtonSkeleton />
          </div>
        </div>
      </div>

    </div>
  )
}

export default ChangeUserInfoSectionSkeleton