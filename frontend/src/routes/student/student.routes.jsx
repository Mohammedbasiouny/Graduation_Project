import { Route } from "react-router";
import LayoutWrapper from "./LayoutWrapper";
import ApplicationFormsPage from "../../pages/student/application/application-forms";
import PortalPage from "../../pages/student/portal";
import ChooseNationalityPage from "../../pages/student/application/choose-nationality";
import TrackApplicationPage from "@/pages/student/application/track-application";
import ApplicationDatesPage from "@/pages/student/application/application-dates";
import StudentAccountPage from "@/pages/student/me";
import AttendancePage from "@/pages/student/attendance";

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
