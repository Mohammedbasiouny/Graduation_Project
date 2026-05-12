import { Button } from '@/components/ui/Button'
import Field from '@/components/ui/Form/Field'
import { Input } from '@/components/ui/Form/Input'
import { Label } from '@/components/ui/Form/Label'
import { Textarea } from '@/components/ui/Form/Textarea'
import Heading from '@/components/ui/Heading'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { validationSchema } from './validation'
import DescriptionText from '@/components/ui/Form/DescriptionText'
import Inputs from './Inputs'

const ContactUs = () => {
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <section 
      id="contact-us"
      className='w-full px-4 sm:px-6 py-16 bg-linear-to-b from-white to-gray-50'
    >
      <form
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full flex flex-col items-center gap-8"
      >
        <Heading
          title={t("home:contact_us.heading.title")}
          subtitle={t("home:contact_us.heading.subtitle")}
        />
        
        <Inputs register={register} errors={errors} />

        <div>
          <Button 
            size="lg" 
            variant={"secondary"} 
          >
            {t("buttons:send")}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default ContactUs
