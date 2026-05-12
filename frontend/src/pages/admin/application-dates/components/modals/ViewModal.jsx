import { useTranslation } from 'react-i18next';
import CopyText from '@/components/ui/CopyText';
import { CalendarClock } from 'lucide-react';
import { DetailsCard, DetailRow, Popup } from '@/components/ui/Popup';
import { translateDate, translateNumber, translateTime } from '@/i18n/utils';
import { Button } from '@/components/ui/Button';
import { useModalStoreV2 } from '@/store/use.modal.store';
import { useEffect, useMemo, useState } from 'react';
import { formatToDateOnly, formatToDatetimeLocal, formatToTimeOnly } from '@/utils/format-date-and-time.utils';
import { useApplicationDate } from '@/hooks/api/application-dates.hooks';
import NormalSpinner from '@/components/ui/NormalSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getPeriodDetails, getPeriodStatus } from '@/utils/application-dates.utils';

const ViewModal = () => {
  const { openModal, isOpen, getModalData, closeModal } = useModalStoreV2();
  const modalData = getModalData("view");
  const { t } = useTranslation();

  /* ---------------- Data State ---------------- */
  const [applicationDate, setApplicationDate] = useState(null);
  const [periodText, setPeriodText] = useState('');
  const [periodStatus, setPeriodStatus] = useState(null);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useApplicationDate(modalData?.id);

  useEffect(() => {
    if (!data?.data?.data) return;

    const row = data.data.data;

    const newApplicationDate = {
      id: row.id,
      name: row.name,
      startAt: formatToDatetimeLocal(row.startAt),
      endAt: formatToDatetimeLocal(row.endAt),
      university: t(`universities.${row.university}`),
      studentType: t(`fields:student_type.options.${row.studentType}`),
    };

    setApplicationDate(newApplicationDate);

    const details = getPeriodDetails(newApplicationDate);
    const periodStatus = getPeriodStatus(newApplicationDate);

    setPeriodStatus(periodStatus);
    setPeriodText(details || '');
  }, [data, t]);


  const columns = useMemo(
    () => [
      t("application-dates:table.columns.id"),
      t("application-dates:table.columns.who_can_apply"),
      t("application-dates:table.columns.university"),
      t("application-dates:table.columns.student_type"),
      t("application-dates:table.columns.start_date"),
      t("application-dates:table.columns.end_date"),
      t("application-dates:table.columns.status"),
    ],
    [t]
  );

  return (
    <Popup
      isOpen={isOpen("view")} 
      closeModal={() => closeModal("view")}
      title={t("application-dates:modals.view.title")}
      description={t("application-dates:modals.view.description")}
    >
      {!applicationDate || isLoading ? (
        <div className='flex items-center justify-center p-5 bg-gray-100'>
          <NormalSpinner />
        </div>
      ) : (
        <div className='space-y-3'>
          <DetailsCard
            icon={<CalendarClock size={80} className="text-(--primary-dark)" />}
            title={columns[1]}
            subtitle={applicationDate.name || ""}
            className='space-y-5'
          >
            <div className='space-y-5'>
              <CopyText styled text={periodText}>
                {periodText}
              </CopyText>

              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[0]} value={translateNumber(applicationDate.id)} />
                <DetailRow label={columns[2]} value={applicationDate.university} />
                <DetailRow label={columns[3]} value={applicationDate.studentType} />
                <DetailRow 
                  label={columns[6]} 
                  value={
                    <StatusBadge variant={periodStatus.variant} size="small">
                      {periodStatus.label}
                    </StatusBadge>
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-2 border-b-2 pb-3 border-gray-300">
                <DetailRow label={columns[4]} value={translateDate(formatToDateOnly(applicationDate.startAt)) + " - " + translateTime(formatToTimeOnly(applicationDate.startAt))} />
                <DetailRow label={columns[5]} value={translateDate(formatToDateOnly(applicationDate.endAt)) + " - " + translateTime(formatToTimeOnly(applicationDate.endAt))} />
              </div>
            </div>
          </DetailsCard>

          <div className='flex gap-2'>
            <Button 
              variant="info"
              size="md"
              fullWidth
              onClick={() => {
                closeModal("view");
                openModal("edit", { id: applicationDate.id });
              }}
              type="button"
            >
              {t("buttons:edit")}
            </Button>
            <Button 
              variant="danger"
              size="md"
              fullWidth
              onClick={() => {
                closeModal("view");
                openModal("delete", { id: applicationDate.id });
              }}
              type="button"
            >
              {t("buttons:delete")}
            </Button>
            <Button 
              variant="cancel"
              size="md"
              fullWidth
              onClick={() => closeModal("view")}
              type="button"
            >
              {t("buttons:cancel")}
            </Button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default ViewModal;
