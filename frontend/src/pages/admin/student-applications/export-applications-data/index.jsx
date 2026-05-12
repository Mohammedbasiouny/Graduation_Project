import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Heading from "@/components/ui/Heading";
import { Alert } from "@/components/ui/Alert";
import { FileCog } from "lucide-react";
import {
  getAcadmicFieldsByType,
  getDocumentsFields,
  getPersonalFieldsByType,
  getPreUniEduFieldsByType,
  getResidenceFieldsByType,
} from "./sections/utils";
import SidePanel from "./sections/SidePanel";
import Tabs from "@/components/ui/Tabs";
import PersonalSection from "./sections/PersonalSection";
import ResidenceSection from "./sections/ResidenceSection";
import HousingSection from "./sections/HousingSection";
import GuardianSection from "./sections/GuardianSection";
import EducationSection from "./sections/EducationSection";
import DocumentsSection from "./sections/DocumentsSection";
import { manageStudentsService } from "@/services/manage-students.service";
import { showToast } from "@/utils/toast.util";

const ExportApplicationsDataPage = () => {
  const { t } = useTranslation();

  /** --- Active Tab --- */
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);

  /** --- Filters State --- */
  const [filters, setFilters] = useState({
    nationalityType: "all",
    guardianNationalityType: "all",
    residenceType: "all",
    studentType: "all",
    preUniEduType: "all",
    genderType: "all",
    religionType: "all",
  });

  /** --- Selected Fields --- */
  const [selectedFields, setSelectedFields] = useState([]);

  /** --- Checkbox Handler --- */
  const handleCheckboxChange = useCallback((fieldKey) => (e) => {
    setSelectedFields((prev) =>
      e.target.checked ? [...prev, fieldKey] : prev.filter((key) => key !== fieldKey)
    );
  }, []);

  /** --- Compute allowed fields dynamically --- */
  const allowedKeys = useMemo(() => {
    const personalFields = t("manage-students-files:fields.personal_info", { returnObjects: true });
    const guardianFields = t("manage-students-files:fields.guardian_info", { returnObjects: true });
    const residenceFields = t("manage-students-files:fields.residence_info", { returnObjects: true });
    const academicFields = t("manage-students-files:fields.academic_info", { returnObjects: true });
    const preUniEduFields = t("manage-students-files:fields.pre_uni_edu_info", { returnObjects: true });
    const housingFields = t("manage-students-files:fields.housing_info.common", { returnObjects: true });
    const documentsFields = t("manage-students-files:fields.documents.common", { returnObjects: true });

    let keys = [
      ...Object.keys(getPersonalFieldsByType(personalFields, filters.nationalityType)),
      ...Object.keys(getResidenceFieldsByType(residenceFields, filters.residenceType)),
      ...Object.keys(getAcadmicFieldsByType(academicFields, filters.studentType)),
      ...(filters.studentType !== "old"
        ? Object.keys(getPreUniEduFieldsByType(preUniEduFields, filters.preUniEduType))
        : []),
      ...Object.keys(housingFields),
      ...Object.keys(getDocumentsFields({ 
          nationality: filters.nationalityType, 
          residenceOutside: filters.residenceType, 
          studentStatus: filters.studentType, 
          guardianType: filters.guardianNationalityType, 
          section: documentsFields 
        })),
    ];

    return keys;
  }, [
    filters.nationalityType,
    filters.residenceType,
    filters.studentType,
    filters.preUniEduType,
    filters.guardianNationalityType,
    t,
  ]);

  /** --- Sync selected fields with allowed keys --- */
  useEffect(() => {
    setSelectedFields((prev) => prev.filter((key) => allowedKeys.includes(key)));
  }, [allowedKeys]);

  /** --- Tabs Definition --- */
  const tabs = useMemo(() => [
    { text: t("manage-students-files:fields.personal_info.title"), key: "personal" },
    { text: t("manage-students-files:fields.residence_info.title"), key: "residence" },
    { text: t("manage-students-files:fields.education_info.title"), key: "education" },
    { text: t("manage-students-files:fields.guardian_info.title"), key: "guardian" },
    { text: t("manage-students-files:fields.housing_info.title"), key: "housing" },
    { text: t("manage-students-files:fields.documents.title"), key: "documents" },
  ], [t]);

  const handleExportBtnClick = async () => {
    if (!selectedFields.length) {
      showToast("error", t("manage-students-files:messages.no_fields_selected"))
      return;
    };

    setIsLoading(true); // ✅ start loading

    const finalFilters = buildFilters(filters)

    try {
      const response = await manageStudentsService.exportZip(
        { fields: selectedFields, filters: finalFilters },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/zip"
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "students-files.zip");

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      const res = error?.response
      if (res?.status === 500) {
        showToast("error", t("messages:unexpected_error"))
      }
    } finally {
      setIsLoading(false); // ✅ stop loading
    }
  };

  const buildFilters = (filters) => {
    const mapped = {
      isEgyptian:
        filters.nationalityType === "egyptian"
          ? true
          : filters.nationalityType === "non-egyptian"
          ? false
          : undefined,

      gender: filters.genderType !== "all" ? filters.genderType : undefined,

      religion: filters.religionType !== "all" ? filters.religionType : undefined,

      is_new:
        filters.studentType === "new"
          ? true
          : filters.studentType === "old"
          ? false
          : undefined,
    };

    // remove undefined values
    return Object.fromEntries(
      Object.entries(mapped).filter(([_, value]) => value !== undefined)
    );
  };

  return (
    <div className="w-full space-y-10 bg-white rounded-2xl shadow-md border border-(--gray-lightest) p-6">
      <Heading
        title={t("manage-students-files:heading.title")}
        subtitle={t("manage-students-files:heading.subtitle")}
      />

      <Alert
        icon={FileCog}
        type="info"
        title={t("manage-students-files:notes.info_note.title")}
        collapsible
        defaultCollapsed
        dismissible={false}
      >
        <p className="whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed">
          {t("manage-students-files:notes.info_note.description")}
        </p>
      </Alert>

      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0 space-y-6">
          {/* Tabs */}
          <Tabs
            tabs={tabs.map((tab) => ({
              ...tab,
              selected: activeTab === tab.key,
              onClick: () => setActiveTab(tab.key),
            }))}
          />

          <div className="bg-gray-50/40 rounded-xl p-3 sm:p-4 lg:p-6">
            {activeTab === "personal" && (
              <PersonalSection
                nationalityType={filters.nationalityType}
                setNationalityType={(val) => setFilters((f) => ({ ...f, nationalityType: val }))}
                genderType={filters.genderType}
                setGenderType={(val) => setFilters((f) => ({ ...f, genderType: val }))}
                religionType={filters.religionType}
                setReligionType={(val) => setFilters((f) => ({ ...f, religionType: val }))}
                selectedFields={selectedFields}
                onCheckboxChange={handleCheckboxChange}
              />
            )}

            {activeTab === "residence" && (
              <ResidenceSection
                residenceType={filters.residenceType}
                setResidenceType={(val) => setFilters((f) => ({ ...f, residenceType: val }))}
                selectedFields={selectedFields}
                onCheckboxChange={handleCheckboxChange}
              />
            )}

            {activeTab === "education" && (
              <EducationSection
                studentType={filters.studentType}
                setStudentType={(val) => setFilters((f) => ({ ...f, studentType: val }))}
                preUniEduType={filters.preUniEduType}
                setPreUniEduType={(val) => setFilters((f) => ({ ...f, preUniEduType: val }))}
                selectedFields={selectedFields}
                onCheckboxChange={handleCheckboxChange}
              />
            )}

            {activeTab === "guardian" && (
              <GuardianSection
                guardianNationalityType={filters.guardianNationalityType}
                setGuardianNationalityType={(val) => setFilters((f) => ({ ...f, guardianNationalityType: val }))}
                selectedFields={selectedFields}
                onCheckboxChange={handleCheckboxChange}
              />
            )}

            {activeTab === "housing" && (
              <HousingSection
                selectedFields={selectedFields}
                onCheckboxChange={handleCheckboxChange}
              />
            )}

            {activeTab === "documents" && (
              <DocumentsSection
                nationality={filters.nationalityType}
                residenceOutside={filters.residenceType}
                studentStatus={filters.studentType}
                guardianType={filters.guardianNationalityType}
                selectedFields={selectedFields}
                onCheckboxChange={handleCheckboxChange}
              />
            )}
          </div>
        </div>

        <div className="w-full xl:w-96">
          <SidePanel
            selectedFields={selectedFields}
            setSelectedFields={setSelectedFields}
            onExport={handleExportBtnClick}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ExportApplicationsDataPage;