import BehavioralSocialAspects from "./behavioral-socialaspects"
import ChronicDiseases from "./chronic-diseases"
import MoodPsychologicalAssessment from "./mood-psychological-assessment"
import SpecialNeeds from "./special-needs"
import Treatments from "./treatments"

const Inputs = ({ register, errors, control, watch }) => {

  return (
    <div className='space-y-5'>
      <ChronicDiseases register={register} errors={errors} control={control} watch={watch} />
      
      <hr className='w-full h-0.5 bg-(--gray-light)' />
      <BehavioralSocialAspects errors={errors} control={control} />
      
      <hr className='w-full h-0.5 bg-(--gray-light)' />
      <MoodPsychologicalAssessment errors={errors} control={control} />
      
      <hr className='w-full h-0.5 bg-(--gray-light)' />
      <Treatments register={register} errors={errors} control={control} watch={watch} />

      <hr className='w-full h-0.5 bg-(--gray-light)' />
      <SpecialNeeds register={register} errors={errors} control={control} watch={watch} />
    </div>
  )
}

export default Inputs
