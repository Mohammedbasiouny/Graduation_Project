import Heading from "@/components/ui/Heading";
import hu_logo from "@/assets/logos/HU_for_light_screen.png";
import hnu_logo from "@/assets/logos/HNU_for_light_screen.png";
import hitu_logo from "@/assets/logos/HITU_for_light_screen.png";
import UniversityCard from "@/components/ui/UniversityCard";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router";

const UniversitiesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-md flex flex-col items-center space-y-5 border border-(--gray-lightest) p-6">
      {/* Page Header */}
      <Heading
        title={t("manage-universities:main_heading.title")}
        subtitle={t("manage-universities:main_heading.subtitle")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to={"hu/colleges"} className="w-full">
          <UniversityCard
            title={t("universities.hu")}
            className="cursor-pointer"
            image={hu_logo}
          />
        </Link>

        <Link to={"hnu/colleges"} className="w-full">
          <UniversityCard
            title={t("universities.hnu")}
            className="cursor-pointer"
            image={hnu_logo}
          />
        </Link>

        <Link to={"hitu/colleges"} className="w-full md:col-span-2">
          <UniversityCard
            title={t("universities.hitu")}
            image={hitu_logo}
            className="md:col-span-2 cursor-pointer"
          />
        </Link>
      </div>
    </div>
  )
}

export default UniversitiesPage
