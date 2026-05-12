import React from 'react'
import { useManageFormsData } from '../hooks'
import ApplicationDetails from '@/pages/common/application-details'

const TrackApplicationPage = () => {
  const data = useManageFormsData()

  return (
    <ApplicationDetails data={data} />
  )
}

export default TrackApplicationPage
