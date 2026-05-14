import { Route } from "react-router";
import { lazy } from "react";
import LayoutWrapper from "./LayoutWrapper";

const ApplicationFormsPage = lazy(() => import("../../pages/student/application/application-forms"));
const PortalPage = lazy(() => import("../../pages/student/portal"));
const ChooseNationalityPage = lazy(() => import("../../pages/student/application/choose-nationality"));
const TrackApplicationPage = lazy(() => import("../../pages/student/application/track-application"));
const ApplicationDatesPage = lazy(() => import("../../pages/student/application/application-dates"));
const StudentAccountPage = lazy(() => import("../../pages/student/me"));
const AttendancePage = lazy(() => import("../../pages/student/attendance"));

const studentRouteConfig = [
  //! Portal
  { path: "", element: <PortalPage /> },
  { path: "portal", element: <PortalPage /> },
  
  { path: "me", element: <StudentAccountPage /> },

  { path: "application-dates", element: <ApplicationDatesPage /> },

  { path: "choose-nationality", element: <ChooseNationalityPage /> },
  
  { path: ":nationality/application", element: <ApplicationFormsPage /> },
  { path: ":nationality", element: <ApplicationFormsPage /> },

  { path: "track-application", element: <TrackApplicationPage /> },

  { path: "attendance", element: <AttendancePage /> },
];

const StudentRoutes = (
  <Route path="student" element={<LayoutWrapper />}>
    {studentRouteConfig.map(({ path, element }) => (
      <Route key={path} path={path} element={element}  />
    ))}
  </Route>
);

export default StudentRoutes;
