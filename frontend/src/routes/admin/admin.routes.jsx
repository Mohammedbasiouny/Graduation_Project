import { Route } from "react-router";
import LayoutWrapper from "./LayoutWrapper";
import ApplicationDatesPage from "@/pages/admin/application-dates";
import EducationalCertificatesPage from "@/pages/admin/educational-certificates";
import UniversitiesPage from "@/pages/admin/universities/UniversitiesPage";
import EducationalDepartmentsPage from "@/pages/admin/administrative-divisions-of-egypt/educational-departments";
import EgyptPage from "@/pages/admin/administrative-divisions-of-egypt/egypt";
import GovernoratesPage from "@/pages/admin/administrative-divisions-of-egypt/governorates";
import PoliceStationsPage from "@/pages/admin/administrative-divisions-of-egypt/police-stations";
import CitiesPage from "@/pages/admin/administrative-divisions-of-egypt/cities";
import CollegesPage from "@/pages/admin/universities/colleges";
import DepartmentsPage from "@/pages/admin/universities/departments";
import BuildingsPage from "@/pages/admin/dorm/Buildings";
import RoomsPage from "@/pages/admin/dorm/Rooms";
import ExportApplicationsDataPage from "@/pages/admin/student-applications/export-applications-data";
import TrackApplicationsPage from "@/pages/admin/student-applications/track-applications";
import TrackApplicationPage from "@/pages/admin/student-applications/track-application";
import AdminAccountPage from "@/pages/admin/me";
import ComingSoonScreen from "@/components/screens/ComingSoonScreen";
import AccountsPage from "@/pages/admin/accounts/view-accounts";
import EditAccountPage from "@/pages/admin/accounts/edit-account";
import AddAccountPage from "@/pages/admin/accounts/add-account";
import ManageMealsPage from "@/pages/admin/restaurant/manage-meals";
import ManagementMealBookingPage from "@/pages/admin/restaurant/manage-reservations";
import ManageMealsSchedulePage from "@/pages/admin/restaurant/manage-meals-schedule";
import SettingsPage from "@/pages/admin/settings";
import ManageAcceptancePage from "@/pages/admin/student-applications/manage-acceptance";
import ManageAccommodationOverviewPage from "@/pages/admin/manage-accommodation/overview";
import ManageSystemLogsPage from "@/pages/admin/system-logs";
import StudentAttendancePage from "@/pages/admin/manage-accommodation/student-attendance";
import ManageResidentsPage from "@/pages/admin/manage-accommodation/residents";
import AttendanceStatisticsPage from "@/pages/admin/manage-accommodation/manage-attendance";
import AttendanceCheckInPage from "@/pages/admin/manage-accommodation/attendance-check-in";

const adminRouteConfig = [
  //! Dashboard
  { path: "", element: <ComingSoonScreen /> },
  { path: "dashboard", element: <ComingSoonScreen /> },

  //! Accounts
  { path: "me", element: <AdminAccountPage /> },

  { path: "accounts", element: <AccountsPage /> },
  { path: "accounts/add-account", element: <AddAccountPage /> },
  { path: "accounts/:role/:id", element: <EditAccountPage /> },

  //! Residents
  { path: "residents", element: <ManageAccommodationOverviewPage /> },
  { path: "residents/overview", element: <ManageAccommodationOverviewPage /> },
  { path: "residents/view-all", element: <ManageResidentsPage /> },
  { path: "residents/:id/attendance", element: <StudentAttendancePage /> },
  { path: "residents/attendance", element: <AttendanceStatisticsPage /> },
  { path: "residents/attendance-statistics", element: <AttendanceStatisticsPage /> },
  { path: "residents/attendance/check-in", element: <AttendanceCheckInPage /> },

  { path: "notifications", element: <ComingSoonScreen /> },
  
  //! Applications
  { path: "applications", element: <TrackApplicationsPage /> },
  { path: "applications/:id", element: <TrackApplicationPage /> },
  { path: "applications/manage-acceptance", element: <ManageAcceptancePage /> },
  { path: "applications/export-data", element: <ExportApplicationsDataPage /> },

  //! Dorm
  { path: "dorm", element: <BuildingsPage /> },
  { path: "dorm/:id/rooms", element: <RoomsPage /> },
  { path: "dorm/rooms", element: <RoomsPage /> },

  //! Restaurant
  { path: "restaurant", element: <ManagementMealBookingPage /> },
  { path: "restaurant/manage-reservations", element: <ManagementMealBookingPage /> },
  { path: "restaurant/manage-meals", element: <ManageMealsPage /> },
  { path: "restaurant/manage-meals-schedule", element: <ManageMealsSchedulePage /> },

  //! Application Dates
  { path: "application-dates", element: <ApplicationDatesPage /> },

  //! Universities
  { path: "universities", element: <UniversitiesPage /> },
  { path: "universities/:uni", element: <CollegesPage /> },
  { path: "universities/colleges", element: <CollegesPage /> },
  { path: "universities/:uni/colleges", element: <CollegesPage /> },
  { path: "universities/departments", element: <DepartmentsPage /> },
  { path: "universities/:uni/colleges/:collegeID/departments", element: <DepartmentsPage /> },
  { path: "universities/colleges/:collegeID/departments", element: <DepartmentsPage /> },
  { path: "universities/:uni/:collegeID/departments", element: <DepartmentsPage /> },

  //! Educational certificates
  { path: "educational-certificates", element: <EducationalCertificatesPage /> },
  { path: "feedbacks", element: <ComingSoonScreen /> },
  { path: "system-logs", element: <ManageSystemLogsPage /> },
  { path: "archive", element: <ComingSoonScreen /> },

  //! Administrative divisions of Egypt
  { path: "egypt", element: <EgyptPage /> },

  { path: "egypt/governorates", element: <GovernoratesPage /> },

  { path: "egypt/educational-departments", element: <EducationalDepartmentsPage /> },
  { path: "egypt/governorates/:gov/educational-departments", element: <EducationalDepartmentsPage /> },

  { path: "egypt/police-stations", element: <PoliceStationsPage /> },
  { path: "egypt/governorates/:gov/police-stations", element: <PoliceStationsPage /> },
  
  { path: "egypt/cities", element: <CitiesPage /> },
  { path: "egypt/governorates/:gov/cities", element: <CitiesPage /> },
  { path: "egypt/police-stations/:police/cities", element: <CitiesPage /> },
  { path: "egypt/governorates/:gov/police-stations/:police/cities", element: <CitiesPage /> },

  { path: "settings", element: <SettingsPage /> },
];

const AdminRoutes = (
  <Route path="admin" element={<LayoutWrapper />}>
    {adminRouteConfig.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}
  </Route>
);

export default AdminRoutes;
