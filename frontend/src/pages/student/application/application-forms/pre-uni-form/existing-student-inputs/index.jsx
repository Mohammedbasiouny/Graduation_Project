import React from 'react'
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { Button } from '@/components/ui/Button'
import { useTranslation } from 'react-i18next';

const ExistingStudentInputs = () => {
  const { t } = useTranslation();
  const { setParam } = useURLSearchParams();
  return (
    <div className='space-y-5'>
      <div className='w-full flex flex-wrap justify-center gap-5 mt-5'>
        <Button 
          size="lg" 
          variant="cancel" 
          type="button"
          onClick={() => setParam("step", "residence")}
        >
          {t("application-steps:buttons.previous")}
        </Button>
        
        <Button 
          size="lg" 
          variant={"secondary"} 
          type="button"
          onClick={() => setParam("step", "academic")}
        >
          {t("application-steps:buttons.next")}
        </Button>
      </div>
    </div>
  )
}

export default ExistingStudentInputs
