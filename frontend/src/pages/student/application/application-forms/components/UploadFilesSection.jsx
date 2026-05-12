import DescriptionText from '@/components/ui/Form/DescriptionText'
import Field from '@/components/ui/Form/Field'
import FileUpload from '@/components/ui/Form/FileUpload'
import { Label } from '@/components/ui/Form/Label'
import { useTranslation } from 'react-i18next'
import ViewDocumentsBtn from './ViewDocumentsBtn'
import { Alert } from '@/components/ui/Alert'
import Heading from '@/components/ui/Heading'

const UploadFilesSection = ({ register, errors, fields = [] }) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-5'>
      <Heading 
        size='sm' 
        align="normal"
        title={t("application-steps:forms.upload_files.heading.title")}
        subtitle={t("application-steps:forms.upload_files.heading.subtitle")}
      />

      <ViewDocumentsBtn />

      <div className="w-fit">
        <Alert
          dismissible={false}
          type="info"
          title={t("application-steps:forms.upload_files.info_note.title")}
          collapsible
          defaultCollapsed
        >
          <p
            className={`
              whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
            `}
          >
            {t("application-steps:forms.upload_files.info_note.description")}
          </p>
        </Alert>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {fields.map((field) => (
          <Field key={field.name} className="space-y-2">
            <Label text={t(`fields:${field.translationKey}.label`)} required />
            
            <FileUpload
              {...register(field.name)}
              error={errors?.[field.name]?.message}
              maxFiles={field.maxFiles}
              multiple={field.multiple}
            />

            <DescriptionText
              description={t(`fields:${field.translationKey}.description`)}
            />
          </Field>
        ))}
      </div>
    </div>
  )
}

export default UploadFilesSection