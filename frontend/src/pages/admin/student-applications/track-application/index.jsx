import React from 'react'
import ApplicationDetails from '@/pages/common/application-details'
import { useParams } from 'react-router';
import { useManageStudentApplicationData } from './hook';

const TrackApplicationPage = () => {
  const { id } = useParams();
  const data = useManageStudentApplicationData(id)

  return (
    <ApplicationDetails data={data} />
  )
}

export default TrackApplicationPage
