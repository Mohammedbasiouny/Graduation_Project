import { Sidebar, SidebarDropdown, SidebarItem, SidebarSeparator } from '../../ui/Sidebar'
import { CalendarClock, CookingPot, FileBadge, Files, Pyramid, GraduationCap, Home, LayoutDashboard, Logs, MessageCircle, PersonStanding, Users, LibraryBig, Map, Shield, MapPin, Building2, Beef, ClipboardClock, Utensils, Settings, Send, Archive } from 'lucide-react'
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/use-auth.store';

const AdminSidebar = () => {
  const { t } = useTranslation();
  const { name } = useAuthStore((state) => state.user);

  return (
    <Sidebar title={t("sidebar:welcome")} subtitle={name}>
      <SidebarItem to={"/"} icon={<Home />} name={t("sidebar:home")} />
      
      <SidebarItem to={"/admin/dashboard"} icon={<LayoutDashboard />} name={t("sidebar:dashboard")} />

      <SidebarSeparator text={t("sidebar:manage_dorm")} />

      <SidebarItem to={"/admin/residents"} icon={<PersonStanding />} name={t("sidebar:residents")} />

      <SidebarItem to={"/admin/applications"} icon={<Files />} name={t("sidebar:applications")} />
      
      <SidebarItem to={"/admin/application-dates"} icon={<CalendarClock />} name={t("sidebar:dates")} />

      <SidebarItem to={"/admin/dorm"} icon={<Building2 />} name={t("sidebar:dorm")} />

      <SidebarDropdown icon={<CookingPot />} name={t("sidebar:restaurant")} defaultCollapsed={true}>
        <SidebarItem to={"/admin/restaurant/manage-meals"} icon={<Beef />} name={t("sidebar:manage_meals")} />
        <SidebarItem to={"/admin/restaurant/manage-meals-schedule"} icon={<ClipboardClock />} name={t("sidebar:manage_meals_schedule")} />
      </SidebarDropdown>


      <SidebarSeparator text={t("sidebar:manage_users_section")} />
      <SidebarItem to={"/admin/accounts"} icon={<Users />} name={t("sidebar:accounts")} />
      <SidebarItem to={"/admin/notifications"} icon={<Send />} name={t("sidebar:notifications")} />

      <SidebarSeparator text={t("sidebar:application_data_section")} />

      <SidebarItem to={"/admin/universities"} icon={<GraduationCap />} name={t("sidebar:universities")} />

      <SidebarItem to={"/admin/educational-certificates"} icon={<FileBadge />} name={t("sidebar:educational_certificates")} />

      <SidebarDropdown icon={<Pyramid />} name={t("sidebar:egypt")} defaultCollapsed={true}>
        <SidebarItem to={"/admin/egypt"} icon={<LibraryBig />} name={t("sidebar:statistics")} />
        <SidebarItem to={"/admin/egypt/governorates"} icon={<MapPin />} name={t("sidebar:governorates")} />
        <SidebarItem to={"/admin/egypt/educational-departments"} icon={<GraduationCap />} name={t("sidebar:educational_departments")} />
        <SidebarItem to={"/admin/egypt/police-stations"} icon={<Shield />} name={t("sidebar:police_stations")} />
        <SidebarItem to={"/admin/egypt/cities"} icon={<Map />} name={t("sidebar:cities")} />
      </SidebarDropdown>

      <SidebarSeparator text={t("sidebar:application_status_section")} />

      <SidebarItem to={"/admin/feedbacks"} icon={<MessageCircle />} name={t("sidebar:messages")} />

      <SidebarItem to={"/admin/system-logs"} icon={<Logs />} name={t("sidebar:logs")} />

      <SidebarItem to={"/admin/archive"} icon={<Archive />} name={t("sidebar:archive")} />

      <SidebarItem to={"/admin/settings"} icon={<Settings />} name={t("sidebar:settings")} />
    </Sidebar>
  )
}

export default AdminSidebar
