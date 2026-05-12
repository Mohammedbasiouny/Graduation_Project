import React, { useEffect } from 'react'
import Heading from '@/components/ui/Heading'
import { useAuthStore } from '@/store/use-auth.store';
import { useLayoutStore } from '@/store/use-layout.store';
import ScrollToSection from '@/components/ui/ScrollToSection';
import { useTranslation } from 'react-i18next';
import { AboutSection, AdmissionSteps, ApplicationResult, HeroSection, StudentServices } from './sections';
import ContactUs from './sections/ContactUs';
import { useLocation } from 'react-router';
import VerifiedEmailPopup from './modals/VerifiedEmailPopup';

const HomePage = () => {
  const { t } = useTranslation();
  const { setShowBreadcrumbs } = useLayoutStore();
  const location = useLocation();

  const user = useAuthStore();

  useEffect(() => {
    setShowBreadcrumbs(false)
  }, [setShowBreadcrumbs])

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");

    // small delay so sections render first
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, [location.hash]);

  return (
    <div className='min-h-screen flex flex-col items-center'>
      <HeroSection />

      <ApplicationResult />

      <AdmissionSteps />

      <AboutSection />

      <StudentServices />

      <ContactUs />

      <ScrollToSection
        targetId="application-result"
        text={t("home:application_result_section.scroll_btn")}
      />

      <VerifiedEmailPopup />
    </div>
  )
}

export default HomePage
