import { Route } from "react-router";
import { lazy } from "react";
import LayoutWrapper from "./LayoutWrapper";

const ApplicationDatesPage = lazy(() => import("../../pages/admin/application-dates"));
const EducationalCertificatesPage = lazy(() => import("../../pages/admin/educational-certificates"));
const UniversitiesPage = lazy(() => import("../../pages/admin/universities/UniversitiesPage"));
const EducationalDepartmentsPage = lazy(() => import("../../pages/admin/administrative-divisions-of-egypt/educational-departments"));
const EgyptPage = lazy(() => import("../../pages/admin/administrative-divisions-of-egypt/egypt"));
const GovernoratesPage = lazy(() => import("../../pages/admin/administrative-divisions-of-egypt/governorates"));
const PoliceStationsPage = lazy(() => import("../../pages/admin/administrative-divisions-of-egypt/police-stations"));
const CitiesPage = lazy(() => import("../../pages/admin/administrative-divisions-of-egypt/cities"));
const CollegesPage = lazy(() => import("../../pages/admin/universities/colleges"));
const DepartmentsPage = lazy(() => import("../../pages/admin/universities/departments"));
const BuildingsPage = lazy(() => import("../../pages/admin/dorm/Buildings"));
const RoomsPage = lazy(() => import("../../pages/admin/dorm/Rooms"));
const ExportApplicationsDataPage = lazy(() => import("../../pages/admin/student-applications/export-applications-data"));
const TrackApplicationsPage = lazy(() => import("../../pages/admin/student-applications/track-applications"));
const TrackApplicationPage = lazy(() => import("../../pages/admin/student-applications/track-application"));
const AdminAccountPage = lazy(() => import("../../pages/admin/me"));
const ComingSoonScreen = lazy(() => import("../../components/screens/ComingSoonScreen"));
const AccountsPage = lazy(() => import("../../pages/admin/accounts/view-accounts"));
const EditAccountPage = lazy(() => import("../../pages/admin/accounts/edit-account"));
const AddAccountPage = lazy(() => import("../../pages/admin/accounts/add-account"));
const ManageMealsPage = lazy(() => import("../../pages/admin/restaurant/manage-meals"));
const ManagementMealBookingPage = lazy(() => import("../../pages/admin/restaurant/manage-reservations"));
const ManageMealsSchedulePage = lazy(() => import("../../pages/admin/restaurant/manage-meals-schedule"));
const SettingsPage = lazy(() => import("../../pages/admin/settings"));
const ManageAcceptancePage = lazy(() => import("../../pages/admin/student-applications/manage-acceptance"));
const ManageAccommodationOverviewPage = lazy(() => import("../../pages/admin/manage-accommodation/overview"));
const ManageSystemLogsPage = lazy(() => import("../../pages/admin/system-logs"));
const StudentAttendancePage = lazy(() => import("../../pages/admin/manage-accommodation/student-attendance"));
const ManageResidentsPage = lazy(() => import("../../pages/admin/manage-accommodation/residents"));
const AttendanceStatisticsPage = lazy(() => import("../../pages/admin/manage-accommodation/manage-attendance"));
const AttendanceCheckInPage = lazy(() => import("../../pages/admin/manage-accommodation/attendance-check-in"));

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
