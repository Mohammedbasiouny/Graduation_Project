import { Popup } from '@/components/ui/Popup';
import { useModalStoreV2 } from '@/store/use.modal.store';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { translateNumber } from '@/i18n/utils';

const UploadedModalPopup = ({ documents = {} }) => {
  const { t } = useTranslation();
  const { isOpen, closeModal } = useModalStoreV2();

  // Filter only documents that exist
  const entries = Object.entries(documents).filter(
    ([, value]) =>
      value &&
      (typeof value === 'string' || (Array.isArray(value) && value.length > 0))
  );

  return (
    <Popup
      isOpen={isOpen('view-uploaded-documents')}
      closeModal={() => closeModal('view-uploaded-documents')}
      title={t('application-steps:forms.upload_files.view_documents_heading.title')}
      description={t('application-steps:forms.upload_files.view_documents_heading.subtitle')}
    >
      {entries.length === 0 ? (
        <p className="text-xl text-center text-gray-900">
          {t('application-steps:messages.no_documents_uploaded')}
        </p>
      ) : (
        <div className="space-y-6">
          {entries.map(([key, value]) => {
            if (Array.isArray(value)) {
              return (
                <div key={key} className="space-y-2">
                  <h4 className="text-gray-700 font-semibold">
                    {t(`application-steps:documents.${key}`)}
                  </h4>
                  <div className="space-y-1">
                    {value.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-50"
                      >
                        <span>{t("application-steps:buttons.click_to_view")} ({translateNumber(index + 1)})</span>
                        <ExternalLink size={18} className="ml-2 text-gray-500" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            // Single string document
            return (
              <a
                key={key}
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-50"
              >
                <span>{t(`application-steps:documents.${key}`)}</span>
                <ExternalLink size={18} className="ml-2 text-gray-500" />
              </a>
            );
          })}
        </div>
      )}

      <div className="mt-5">
        <Button
          variant="cancel"
          size="md"
          fullWidth
          type="button"
          onClick={() => closeModal('view-uploaded-documents')}
        >
          {t('buttons:close')}
        </Button>
      </div>
    </Popup>
  );
};

export default UploadedModalPopup;