import React, { use, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '@/components/ui/Heading';
import NotesSection from './components/alerts/NotesSection';
import EgyptOverview from './components/overview/EgyptOverview';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router';
import { useStatisticsAboutEgypt } from '@/hooks/api/governorates.hooks';

const EgyptPage = () => {
  const { t } = useTranslation();

  const [statistics, setStatistics] = useState({
    governorates: 0,
    cities: 0,
    police_stations: 0,
    educational_departments: 0,
  });

  const { data, isLoading } = useStatisticsAboutEgypt();
  
  useEffect(() => {
    if (!data?.data) return;
    
    setStatistics({
      governorates: data.data.data.governorates,
      cities: data.data.data.cities,
      police_stations: data.data.data.police_stations,
      educational_departments: data.data.data.educational_departments,
    });
  }, [data]);

  return (
    <div className='w-full bg-white rounded-2xl shadow-md flex flex-col items-center space-y-5 border border-(--gray-lightest) p-6'>

      <Heading
        title={t("egypt:main_heading.title")}
        subtitle={t("egypt:main_heading.subtitle")}
      />

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'>
        <EgyptOverview statistics={statistics} />
      </div>

      <NotesSection />

      <Link to={"governorates"}>
        <Button
          size='lg'
        >
          {t("egypt:buttons.governorates_button")}
        </Button>
      </Link>
    </div>
  )
}

export default EgyptPage
