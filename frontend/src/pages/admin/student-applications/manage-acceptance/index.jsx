import { Alert } from '@/components/ui/Alert';
import Heading from '@/components/ui/Heading';
import { Projector } from 'lucide-react';
import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AcceptanceStatisticsCard from './cards/AcceptanceStatisticsCard';
import PeriodsTable from './table/PeriodsTable';
import DownloadStudentsModal from './modals/DownloadStudentsModal';
const GenderChart = lazy(() => import('./cards/GenderChart'));
const PeriodsBarChart = lazy(() => import('./cards/PeriodsBarChart'));
import AnnouncingTheResultModal from './modals/AnnouncingTheResultModal';
import UploadCandidatesModal from './modals/UploadCandidatesModal';
import { useApplicationDateStatistics } from '@/hooks/api/application-dates.hooks';
const AITasksCard = lazy(() => import('./cards/AITasksCard'));

const ManageAcceptancePage = () => {
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);

  const { data, isLoading } = useApplicationDateStatistics();

  useEffect(() => {
    if (!data?.data) return;

    setRows(data.data.data ?? []);
  }, [data]);

  const chartLabels = useMemo(
    () => rows.map((r) => r.name),
    [rows]
  );

  const applicationsData = useMemo(
    () => rows.map((r) => r.applications),
    [rows]
  );

  const completedData = useMemo(
    () => rows.map((r) => r.completed_male + r.completed_female),
    [rows]
  );

  const totals = useMemo(() =>
    rows.reduce(
      (acc, r) => {
        acc.completedMales += r.completed_male || 0;
        acc.completedFemales += r.completed_female || 0;
        return acc;
      },
      {
        completedMales: 0,
        completedFemales: 0,
      }
    ),
    [rows]
  );

  const statistics = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc.applications += r.applications || 0;
        acc.completed += (r.completed_male || 0) + (r.completed_female || 0);
        acc.security += r.security_accepted || 0;
        acc.candidates += r.candidates_for_final_acceptanced || 0;
        return acc;
      },
      {
        applications: 0,
        completed: 0,
        security: 0,
        candidates: 0,
      }
    );
  }, [rows]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-md flex flex-col space-y-6 border border-(--gray-lightest) p-6">
      <Heading
        title={t("manage-acceptance:main_heading.title")}
        subtitle={t("manage-acceptance:main_heading.subtitle")}
      />

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-5'>
        <div className="h-88 col-span-2 flex">
          <Suspense fallback={<div className="h-88 bg-gray-100 rounded-lg animate-pulse" />}>
            <AITasksCard className="flex-1" />
          </Suspense>
        </div>

        <div className='col-span-2 space-y-6'>
          <Alert
            icon={Projector}
            type="info"
            title={t("manage-acceptance:note.title")}
            collapsible
            defaultCollapsed
            dismissible={false}
          >
            <p className="text-sm sm:text-base whitespace-pre-line leading-relaxed">
              {t("manage-acceptance:note.description")}
            </p>
          </Alert>

          <AcceptanceStatisticsCard statistics={statistics} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Suspense fallback={<div className="h-80 bg-gray-100 rounded-lg animate-pulse" />}>
          <GenderChart malesCount={totals.completedMales} femalesCount={totals.completedFemales} />
        </Suspense>

        {/* Periods Bar */}
        <Suspense fallback={<div className="h-80 bg-gray-100 rounded-lg animate-pulse" />}>
          <PeriodsBarChart chartLabels={chartLabels} applicationsData={applicationsData} completedData={completedData} />
        </Suspense>

      </div>

      <div className="overflow-hidden">
        <PeriodsTable rows={rows} isLoading={isLoading} />
      </div>

      <DownloadStudentsModal />
      <AnnouncingTheResultModal />
      <UploadCandidatesModal />

    </div>
  );
};

export default ManageAcceptancePage;