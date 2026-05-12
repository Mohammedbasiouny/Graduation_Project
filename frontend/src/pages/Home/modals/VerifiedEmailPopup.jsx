import { Button } from '@/components/ui/Button'
import { Popup } from '@/components/ui/Popup'
import useURLSearchParams from '@/hooks/use-URL-search-params.hook'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const VerifiedEmailPopup = () => {
  const { t } = useTranslation()
  const { getParam } = useURLSearchParams();

  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const status = getParam('email_change');
    const new_email = getParam('email');
    if (!status) return;
    setMessage(t(`account:modals.verified_email.${status}`));
    setIsOpen(true);
    setEmail(new_email);
  }, [])

  return (
    <Popup
      isOpen={isOpen}
      title={t('account:modals.verified_email.title')}
    >
      <p className='text-base text-center text-gray-700 mb-4'>
        {message}
      </p>
      <p className='text-base text-blue-700 mb-4 text-center'>
        {email}
      </p>
      <div className="flex justify-end gap-2 mt-3">
        <Button 
          onClick={() => setIsOpen(false)}
          variant="cancel"
          size="md"
          fullWidth
        >
          {t("buttons:close")}
        </Button>
      </div>
    </Popup>
  )
}

export default VerifiedEmailPopup
